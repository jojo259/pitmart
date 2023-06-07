import { json } from "@sveltejs/kit";
import * as nbt from "prismarine-nbt";
import { collections } from "$lib/modules/database";
import type { Player, Item } from "$lib/types";
import * as mongoDb from "mongodb";
import { hypixelApiKey } from '$env/static/private';

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
			let doc = await collections.players.findOne({ usernameLower: tag.toLowerCase() });
			if (doc) {
				tag = doc.uuid.toString();
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

	if (!pitData) {
		return null;
	}

	let player: Player = {
		uuid: apiData.player.uuid,
		username: apiData.player.displayname,
		usernameLower: apiData.player.displayname.toLowerCase(),
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
		collections.players.replaceOne({ uuid: player.uuid }, player as mongoDb.Document, {
			upsert: true
		});
	}

	return player;
}

async function parseInventory(inv: any): Promise<Item[]> { // what type should inv be idk
	if (inv == null) {
		return [];
	}
	const parsed = await parseNbt(Buffer.from(inv, "base64"));
	const items: Item[] = parsed.value.i.value.value.map((obj: any) => {
		obj = {
			id: obj.id?.value ?? null,
			count: obj.Count?.value ?? null,
			name: obj.tag?.value?.display?.value?.Name?.value ?? null,
			lore: obj.tag?.value?.display?.value?.Lore?.value?.value ?? null,
			color: obj.tag?.value?.display?.value?.color?.value?.toString(16) ?? null
		} as Item;
		return obj;
	});
	return items;
}

function parseNbt(buffer: Buffer): Promise<any> { // idk what type
	return new Promise((resolve, reject) => {
		nbt.parse(buffer, (err, data) => {
			if (err) {
				reject(err);
			} else {
				resolve(data);
			}
		});
	});
}
