import { startDiscordBot } from "./discordbot/bot";
import { runDiscordBot } from '$env/static/private';

export const handle = (async ({ event, resolve }) => {
	if (runDiscordBot == "true") {
		startDiscordBot();
	}
	const requestStartTime = Date.now();
	const response = await resolve(event);
	console.log(
		new Date(requestStartTime),
		event.request.method,
		event.url.pathname,
		`(${Date.now() - requestStartTime}ms)`,
		response.status
	);
	return response;
});
