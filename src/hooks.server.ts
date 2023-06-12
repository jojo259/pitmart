import { startDiscordBot } from "./discordbot/bot";
import { runDiscordBot } from '$env/static/private';
import { collections } from "$lib/modules/database";
import type { User } from "$lib/types";

export const handle = (async ({ event, resolve }) => {
	if (runDiscordBot == "true") {
		startDiscordBot();
	}
	const requestStartTime = Date.now();

	const cookies = parseCookie(event.request.headers.get("cookie") || "");

	let user: (User | null) = null;

	if (cookies.discord_access_token) {
		console.log("getting user discord data by access token");
		let userDiscordData: any;
		const request = await fetch(`https://discord.com/api/users/@me`, {
			headers: {'Authorization': `Bearer ${cookies.discord_access_token}`}
		});
		const response = await request.json();
		if (response.id) {
			userDiscordData = { ...response };

			let toUpdate: User = {
				discordId: response.id,
				username: response.username,
				displayName: response.global_name,
				avatarId: response.avatar,
			}

			if (collections.users) {
				await collections.users.updateOne({ "discordId": response.id }, {$set: toUpdate}, {upsert: true});
			}

			if (collections.users) {
				let userDoc: any = await collections.users.findOne({discordId: userDiscordData.id});
				if (userDoc) {
					delete userDoc._id;
				}
				user = userDoc as User;
				console.log("user doc found");
			}
			else {
				console.log("user collection does not exist");
			}
		}
		else {
			console.log(`discord oauth failure: ${response}`);
		}
	}
	else {
		console.log("user logged out");
	}

	const response = await resolve({ ...event, locals: { user } });

	console.log(
		new Date(requestStartTime),
		event.request.method,
		event.url.pathname,
		`(${Date.now() - requestStartTime}ms)`,
		response.status
	);
	return response;
});

const parseCookie = (str: string): Record<string, string> => {
	if (str.length == 0) {
		return {};
	}
	return str
		.split(';')
		.map((v) => v.split('='))
		.reduce((acc: Record<string, string>, v: string[]) => {
			acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
			return acc;
		}, {});
};
