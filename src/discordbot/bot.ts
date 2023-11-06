console.log("bot init");

import 'dotenv/config' // used instead of default sveltekit setup because of issues with new discord clients being spawned on every hot reload meaning that this file needs to be able to run independently
import { Client, Events, GatewayIntentBits, Collection } from "discord.js";
import type { Command } from "./types";

import pingCommand from "./commands/ping.ts";

const commandList: Command[] = [
	pingCommand,
];

const commands = new Collection<string, Command>();

commandList.forEach(command => {
	commands.set(command.name, command);
	command.aliases.forEach(alias => {
		commands.set(alias, command);
	});
});

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

		if (message.author.bot) {
			return;
		}

		if (!(
			   (message.content.startsWith(".") && process.env.node_env == "production")
			|| (message.content.startsWith(",") && process.env.node_env == "development")
		)) {
			return;
		}

		const args = message.content.slice(1).trim().split(/ +/);
		const commandName = args.shift()?.toLowerCase();

		if (!commandName) return;

		const command = commands.get(commandName);

		if (!command) return;

		try {
			command.execute(message, args);
		} catch (error) {
			console.error(`discord command error: ${error}`);
			message.reply(`Error: ${error}`);
		}
	});

	client.once(Events.ClientReady, c => {
		console.log(`discord bot ready. logged in as ${c.user.tag}`);
	});
}

if (process.argv.includes("--forcediscord")) { // hacky af
	startDiscordBot(); // needed for when the discord bot is ran independently
}
