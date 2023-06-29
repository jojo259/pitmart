import { startDiscordBot } from "./discordbot/bot";
import { runDiscordBot, discordRequestsLogWebhookUrl, node_env } from '$env/static/private';
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

	let reqTime = Date.now() - requestStartTime;

	console.log(
		new Date(requestStartTime),
		event.request.method,
		event.url.pathname,
		`(${reqTime}ms)`,
		response.status
	);

	if (node_env == "production") {
		let logStr = `\`${event.request.method} ${response.status} ${reqTime}ms ${event.url.pathname}\``;

		fetch(discordRequestsLogWebhookUrl, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				content: logStr,
				allowed_mentions: {"parse": []},
			})}
		);
	}

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
