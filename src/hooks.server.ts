import { startDiscordBot } from "./discordbot/bot";
import { runDiscordBot } from '$env/static/private';

export const handle = (async ({ event, resolve }) => {
	if (runDiscordBot == "true") {
		startDiscordBot();
	}
	const requestStartTime = Date.now();

	const cookies = parseCookie(event.request.headers.get("cookie") || "");

	let user = false;

	if (cookies.discord_access_token) {
		console.log("getting user discord data by access token");
		const request = await fetch(`https://discord.com/api/users/@me`, {
			headers: {'Authorization': `Bearer ${cookies.discord_access_token}`}
		});
		const response = await request.json();
		if (response.id) {
			user = { ...response };
		}
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
