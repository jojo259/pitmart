import { startDiscordBot } from "./discordbot/bot";
import { runDiscordBot } from '$env/static/private';
import type { User } from "$lib/types";
import { resolveUser } from "$lib/serverutil";

export const handle = (async ({ event, resolve }) => {
	if (runDiscordBot == "true") {
		startDiscordBot();
	}
	const requestStartTime = Date.now();

	let user: (User | null) = null;

	const cookies = parseCookies(event.request.headers.get("cookie") || "");

	if (cookies.jwt) {
		user = await resolveUser(cookies.jwt);
	}
	else {
		console.log("no cookies found");
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

const parseCookies = (str: string): Record<string, string> => {
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
