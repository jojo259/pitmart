import { startDiscordBot } from "./discordbot/bot";
import { runDiscordBot, jwtSecret } from '$env/static/private';
import { collections } from "$lib/modules/database";
import type { User } from "$lib/types";
import * as jwt from "jsonwebtoken";

export const handle = (async ({ event, resolve }) => {
	if (runDiscordBot == "true") {
		startDiscordBot();
	}
	const requestStartTime = Date.now();

	const cookies = parseCookie(event.request.headers.get("cookie") || "");

	let user: (User | null) = await resolveUser(cookies);

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

async function resolveUser(cookies: any): Promise<User | null> {
	if (!cookies.jwt) {
		console.log("no cookies found");
		return null;
	}
	let decoded: any = jwt.verify(cookies.jwt, jwtSecret);

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
