console.log("bot init");

import 'dotenv/config' // used instead of default sveltekit setup because of issues with new discord clients being spawned on every hot reload meaning that this file needs to be able to run independently
import { Client, Events, GatewayIntentBits } from 'discord.js';

let client: Client | null;

export function startDiscordBot() {
	if (client != null) { // avoid creating multiple clients (generally not possible anyway)
		return;
	}

	console.log("discord bot starting");

	client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
	client.login(process.env.discordBotToken);

	client.on(Events.MessageCreate, (message) => {
		console.log(`discord message: ${message.content}`);
	});

	client.once(Events.ClientReady, c => {
		console.log(`discord bot ready. logged in as ${c.user.tag}`);
	});
}

if (process.argv.includes("--forcediscord")) { // hacky af
	startDiscordBot(); // needed for when the discord bot is ran independently
}
