import { collections } from "$lib/modules/database";
import type { Player } from "$lib/types";
import { hypixelApiKey, jwtSecret } from '$env/static/private';
import type { User } from "$lib/types";
import jsonwebtoken from "jsonwebtoken";

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
	let apiData: any = await fetch(`https://api.hypixel.net/player?key=${hypixelApiKey}${urlPart}`);
	apiData = await apiData.json();
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
