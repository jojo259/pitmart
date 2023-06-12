import { json } from "@sveltejs/kit";
import { collections } from "$lib/modules/database"
import { hypixelApiKey } from '$env/static/private';
import { callPlayerApi, resolveUser } from "$lib/serverutil";

export async function POST({request, url, cookies}) {
	if (!collections.users) {
		return json({success: false})
	}

	let body = await request.json();
	let tag = body.tag;

	if (!body.tag) {
		console.log("tag not defined");
		return json({success: false})
	}

	let jwtStr = cookies.get("jwt");

	if (!jwtStr) {
		console.log("jwt cookie not defined");
		return json({success: false})
	}

	let user = await resolveUser(jwtStr);

	if (!user) {
		console.log("user not logged in");
		return json({success: false})
	}

	let apiData = await callPlayerApi(tag);

	let playerUuid = apiData.player?.uuid;

	if (!playerUuid) {
		console.log("hypixel player not found");
		return json({success: false})
	}

	playerUuid = playerUuid.replace("-", ""); // just in case

	let hypixelDiscordTag = apiData.player?.socialMedia?.links?.DISCORD;
	if (!hypixelDiscordTag) {
		console.log("hypixel has no discord tag");
		return json({success: false})
	}

	if (![user.username, user.discordId].includes(hypixelDiscordTag)) {
		console.log(`hypixel discord tag "${hypixelDiscordTag}" does not match username "${user.username}" or id "${user.discordId}"`);
		return json({success: false})
	}

	collections.users.updateOne({discordId: user.discordId}, {$addToSet: {verifiedHypixelUuids: playerUuid}}, {upsert: true})

	console.log(`successfully verified hypixel uuid ${playerUuid}`)

	return json({success: true})
}
