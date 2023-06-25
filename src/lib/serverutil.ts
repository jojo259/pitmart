import { collections } from "$lib/modules/database";
import type { Player, Item, Rank, Enchant } from "$lib/types";
import { hypixelApiKey, jwtSecret } from '$env/static/private';
import type { User } from "$lib/types";
import jsonwebtoken from "jsonwebtoken";
import { fetchC } from "$lib/modules/fetcher";
import * as pitMaster from "$lib/assets/pitmaster.json";
import * as nbt from "prismarine-nbt";

export async function getSavedUuid(tag: string): Promise<string | null> {
	if (tag.length == 32 || tag.length == 36) {
		return tag; // already uuid
	}
	if (collections.players) {
		if (tag.length <= 16) {
			let playerDoc: any = await collections.players.findOne({ "usernameLower": tag.toLowerCase() });
			if (playerDoc) {
				let player = playerDoc as Player;
				return player.uuid.toString();
			}
		}
	}
	return null;
}

export async function callPlayerApi(tag: string): Promise<any> {
	let urlPart = `&name=${tag}`;
	let uuid: string | null = await getSavedUuid(tag);
	if (uuid) {
		urlPart = `&uuid=${uuid}`;
		console.log(`getting player by uuid: ${uuid}`);
	}
	else {
		console.log(`getting player by name: ${tag}`);
	}
	let apiData: any = await fetchC(`https://api.hypixel.net/player?key=${hypixelApiKey}${urlPart}`, 10);
	return apiData;
}

export async function resolveUser(jwtStr: string): Promise<User | null> {
	
	let decoded: any = jsonwebtoken.verify(jwtStr, jwtSecret);

	if (!decoded.discordId) {
		console.error("jwt token missing discord id");
		return null;
	}

	if (!collections.users) {
		console.error("user collection not defined");
		return null;
	}

	let userDoc: any = await collections.users.findOne({discordId: decoded.discordId});

	if (!userDoc) {
		return null;
	}

	delete userDoc._id;

	console.log("user doc found");

	let user: (User | null) = null;
	user = userDoc as User;

	return user;
}

export async function apiGetPlayer(tag: string): Promise<Player | null> {
	let apiData = await callPlayerApi(tag);

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

	let renownUpgradesList = Object.keys(pitMaster.Pit.RenownUpgrades);
	let playerRenownUpgrades: { [key: string]: number } = {};
	renownUpgradesList.forEach((renownUpgradeKey) => {
		playerRenownUpgrades[renownUpgradeKey] = 0;
	});
	if ("renown_unlocks" in pitData) {
		pitData.renown_unlocks.forEach((unlock: Unlock) => {
			let currentTier = 0;
			if (unlock.key in playerRenownUpgrades) {
				currentTier = playerRenownUpgrades[unlock.key];
				if (unlock.tier + 1 > currentTier) {
					playerRenownUpgrades[unlock.key] = unlock.tier + 1; // tier starts at 0 for level 1
				}
			}
		});
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
		playerPrefix = playerPrefix.replaceAll("$", pitMaster.Extra.ColorCodes[plusColor as keyof typeof pitMaster.Extra.ColorCodes] || "§c");
	}
	else {
		playerPrefix = playerPrefix.replaceAll("$", "");
	}
	if (rankColor && (rankColor as keyof typeof pitMaster.Extra.ColorCodes) in pitMaster.Extra.ColorCodes) {
		playerPrefix = playerPrefix.replaceAll("@", pitMaster.Extra.ColorCodes[rankColor as keyof typeof pitMaster.Extra.ColorCodes] || "§c");
	}
	else {
		playerPrefix = playerPrefix.replaceAll("@", "");
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
			renown: playerRenownUpgrades,
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
		collections.players.updateOne({ "uuid": player.uuid }, {$set: player}, {
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
							let itemEnchants = null;
							let foundEnchants = obj.tag?.value?.ExtraAttributes?.value?.CustomEnchants?.value?.value ?? null;
							if (foundEnchants) {
								itemEnchants = [];
								foundEnchants.forEach((enchantData: any) => {
									let enchant = {
										key: enchantData.Key?.value,
										level: enchantData.Level?.value,
									} as Enchant;
									itemEnchants.push(enchant);
								});
							}
							obj = {
								id: obj.id?.value ?? null,
								dataVal: obj.Damage?.value ?? null,
								count: obj.Count?.value ?? null,
								name: obj.tag?.value?.display?.value?.Name?.value ?? null,
								lore: obj.tag?.value?.display?.value?.Lore?.value?.value ?? null,
								nonce: obj.tag?.value?.ExtraAttributes?.value?.Nonce?.value ?? null,
								tier: obj.tag?.value?.ExtraAttributes?.value?.UpgradeTier?.value ?? null,
								lives: obj.tag?.value?.ExtraAttributes?.value?.Lives?.value ?? null,
								maxLives: obj.tag?.value?.ExtraAttributes?.value?.MaxLives?.value ?? null,
								color: obj.tag?.value?.display?.value?.color?.value?.toString(16) ?? null,
								enchants: itemEnchants
							} as Item;
							//console.log(JSON.stringify(obj))
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
