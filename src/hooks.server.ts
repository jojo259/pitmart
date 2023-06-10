import { startDiscordBot } from "./discordbot/bot";
import { runDiscordBot } from '$env/static/private';

export const handle = (async ({ event, resolve }) => {
	if (runDiscordBot == "true") {
		startDiscordBot();
	}
	const response = await resolve(event);
	return response;
});
