import { sendMessage } from "../../discordbot/bot.ts";

export function sendDiscordMessage(channelName: string, message: string) {
	sendMessage(channelName, message);
}
