import { json } from "@sveltejs/kit";
import * as nbt from "prismarine-nbt";
import { collections } from "$lib/modules/database";
import type { Player, Item, Rank } from "$lib/types";
import * as mongoDb from "mongodb";
import { hypixelApiKey } from '$env/static/private';
import * as pitMaster from "$lib/assets/pitmaster.json";

export async function GET(req) {
	let tag = req.params.playertag;

	let player: Player | null = await apiGetPlayer(tag);

	if (!player) {
		return json({success: false})
	}

	return json({success: true, player: player});
}

async function apiGetPlayer(tag: string): Promise<Player | null> {
	if (collections.players) {
		if (tag.length <= 16) {
			let doc = await collections.players.findOne({ "player.usernameLower": tag.toLowerCase() });
			if (doc) {
				tag = doc.player.uuid.toString();
			}
		}
	}

	let urlPart = `&uuid=${tag}`;
	if (tag.length < 32) {
		urlPart = `&name=${tag}`;
		console.log(`getting player by name: ${tag}`);
	}
	else {
		console.log(`getting player by uuid: ${tag}`);
	}

	let apiData: any = await fetch(`https://api.hypixel.net/player?key=${hypixelApiKey}${urlPart}`);
	apiData = await apiData.json();

	let pitData = apiData.player?.stats?.Pit?.profile;
	let pitStats = apiData.player?.stats?.Pit?.pit_stats_ptl;
	let pitPackages = apiData.player?.stats?.Pit?.packages;

	if (!pitData) {
		return null;
	}

	let prestigeAndLevel = calcPrestigeAndLevel(pitData.xp);

	let rank: Rank = apiData.player.newPackageRank || apiData.player.packageRank || 'NON'; // credit pitpanda
	if (apiData.player.monthlyPackageRank == 'SUPERSTAR') rank = 'SUPERSTAR';
	const staff = apiData.player.rank;
	if (staff && staff != 'NORMAL') rank = staff;

	let supporter = false;
	if (pitPackages) {
		if (pitPackages.includes("supporter")) {
			supporter = true;
		}
	}

	let prestigeCurrentGold = (pitData[`cash_during_prestige_${prestigeAndLevel.prestige}`]) | 0;
	let prestigeGoldLeft = pitMaster.Pit.Prestiges[prestigeAndLevel.prestige].GoldReq - prestigeCurrentGold;
	let prestigeGoldReqProportion = +(prestigeCurrentGold / pitMaster.Pit.Prestiges[prestigeAndLevel.prestige].GoldReq).toFixed(4);

	let passivesList = Object.keys(pitMaster.Pit.Upgrades);
	let playerPassives: { [key: string]: number } = {};
	passivesList.forEach((passiveKey) => {
		playerPassives[passiveKey] = 0;
	});
	for (let i = 999; i > 0; i--) {
		let unlocksString = `unlocks_${i}`;
		if (unlocksString in pitData) {
			pitData[unlocksString].forEach((unlock: Unlock) => {
				let currentTier = 0;
				if (unlock.key in playerPassives) {
					currentTier = playerPassives[unlock.key];
					if (unlock.tier + 1 > currentTier) {
						playerPassives[unlock.key] = unlock.tier + 1; // tier starts at 0 for level 1
					}
				}
			});
			break;
		}
	}

	let playerPerks: string[] = [];
	for (let i = 0; i < 999; i++) {
		let perkString = `selected_perk_${i}`;
		if (perkString in pitData) {
			playerPerks.push(pitData[perkString]);
		}
		else {
			break;
		}
	}

	let playerKillstreaks: string[] = [];
	for (let i = 0; i < 999; i++) {
		let killstreakString = `selected_killstreak_${i}`;
		if (killstreakString in pitData) {
			playerKillstreaks.push(pitData[killstreakString]);
		}
		else {
			break;
		}
	}

	let plusColor: string | null = apiData.player.rankPlusColor;
	let rankColor: string | null = apiData.player.monthlyRankColor;
	let playerPrefix = pitMaster.Extra.RankPrefixes[rank]//.replace("@", pitMaster.Extra.ColorCodes[plus] || "§c");
	if (plusColor && (plusColor as keyof typeof pitMaster.Extra.ColorCodes) in pitMaster.Extra.ColorCodes) {
		playerPrefix = playerPrefix.replace("$", pitMaster.Extra.ColorCodes[plusColor as keyof typeof pitMaster.Extra.ColorCodes] || "§c");
	}
	else {
		playerPrefix = playerPrefix.replace("$", "");
	}
	if (rankColor && (rankColor as keyof typeof pitMaster.Extra.ColorCodes) in pitMaster.Extra.ColorCodes) {
		playerPrefix = playerPrefix.replace("@", pitMaster.Extra.ColorCodes[rankColor as keyof typeof pitMaster.Extra.ColorCodes] || "§c");
	}
	else {
		playerPrefix = playerPrefix.replace("@", "");
	}

	let player: Player = {
		uuid: apiData.player.uuid,
		username: apiData.player.displayname,
		usernameLower: apiData.player.displayname.toLowerCase(),
		prefix: playerPrefix,
		supporter: supporter,
		prestige: prestigeAndLevel.prestige | 0,
		level: prestigeAndLevel.level | 0,
		prestigeXpLeft: prestigeAndLevel.prestigeXpLeft,
		prestigeXpReqProportion: prestigeAndLevel.currentPrestigeProportion,
		prestigeGoldLeft: prestigeGoldLeft,
		prestigeGoldReqProportion: prestigeGoldReqProportion,
		rank: rank,
		gold: Math.floor(pitData.cash) | 0,
		renown: pitData.renown | 0,
		playtimeHours: Math.ceil(pitStats.playtime_minutes / 60) | 0,
		hatColor: "#" + pitData.hat_color?.toString(16),
		lastLogin: new Date(apiData.player.lastLogin || 0),
		lastLogout: new Date(apiData.player.lastLogout || 0),
		pitLastSave: new Date(pitData.last_save || 0),
		upgrades: {
			passives: playerPassives,
			perks: playerPerks,
			killstreaks: playerKillstreaks,
		},
		inventories: {
			inventoryMain: await parseInventory(pitData.inv_contents?.data),
			inventoryEnderChest: await parseInventory(pitData.inv_enderchest?.data),
			inventoryStash: await parseInventory(pitData.item_stash?.data),
			inventorySpireStash: await parseInventory(pitData.spire_stash_inv?.data),
			inventoryArmor: await parseInventory(pitData.inv_armor?.data),
			inventoryMysticWellItem: await parseInventory(pitData.mystic_well_item?.data),
			inventoryMysticWellPants: await parseInventory(pitData.mystic_well_pants?.data),
		}
	};

	if (collections.players) {
		collections.players.updateOne({ "player.uuid": player.uuid }, {$set: {player: player}}, {
			upsert: true
		});
	}

	return player;
}

async function parseInventory(inv: any): Promise<Item[]> {
	if (inv == null) {
		return [];
	}
	return new Promise(async (resolve, reject) => {
		try {
			const buffer = Buffer.from(inv, "base64");
			nbt.parse(buffer, (err, parsed: any) => {
				if (err) {
					reject(err);
				} else {
					if (parsed.value.i === undefined) {
						resolve([]);
					} else {
						const items: Item[] = parsed.value.i.value.value.map((obj: any) => {
							obj = {
								id: obj.id?.value ?? null,
								dataVal: obj.Damage?.value ?? null,
								count: obj.Count?.value ?? null,
								name: obj.tag?.value?.display?.value?.Name?.value ?? null,
								lore: obj.tag?.value?.display?.value?.Lore?.value?.value ?? null,
								color: obj.tag?.value?.display?.value?.color?.value?.toString(16) ?? null
							} as Item;
							return obj;
						});
						resolve(items);
					}
				}
			});
		} catch (error) {
			reject(error);
		}
	});
}

function calcPrestigeAndLevel(xp: number): {prestige: number, level: number, prestigeXpLeft: number, currentPrestigeProportion: number} {
	let playerPrestige = 0;

	for (let atPrestige = pitMaster.Pit.Prestiges.length - 1; atPrestige > 0; atPrestige--) {
		if (xp > pitMaster.Pit.Prestiges[atPrestige].SumXp) {
			playerPrestige = atPrestige + 1;
			break;
		}
	}

	let previousPrestigeSumXp = 0;
	if (playerPrestige > 0) {
		previousPrestigeSumXp = pitMaster.Pit.Prestiges[playerPrestige - 1].SumXp;
	}

	let prestigeXpLeft = pitMaster.Pit.Prestiges[playerPrestige].SumXp - xp;
	let currentPrestigeProportion = +(1 - prestigeXpLeft / (pitMaster.Pit.Prestiges[playerPrestige].SumXp - previousPrestigeSumXp)).toFixed(4);

	xp -= previousPrestigeSumXp;

	let playerLevel = 0;
	while (xp > 0 && playerLevel < 120) {
		playerLevel += 1;
		xp -= pitMaster.Pit.Levels[Math.floor(playerLevel / 10)].Xp * pitMaster.Pit.Prestiges[playerPrestige].Multiplier;
	}

	return {prestige: playerPrestige, level: playerLevel, prestigeXpLeft: prestigeXpLeft, currentPrestigeProportion: currentPrestigeProportion};
}

interface Unlock {
	key: string,
	tier: number,
	acquireDate: number
}
