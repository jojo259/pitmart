console.log("bot init");

import 'dotenv/config' // used instead of default sveltekit setup because of issues with new discord clients being spawned on every hot reload meaning that this file needs to be able to run independently
import { Client, Events, GatewayIntentBits, Collection, ChannelType } from "discord.js";
import type { Command } from "./types";

import { ingestTradingMessage } from "../lib/modules/tradingmessageingestor.ts";

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
		if (message.author.bot) {
			return;
		}

		if (message.channel.type === ChannelType.GuildText && message.guild) {
			if (message.channel.name.includes("trade") || message.channel.name.includes("trading")) {
				console.log(`ingesting trading message in channel ${message.channel.name} in server ${message.guild.name}`);
				ingestTradingMessage(message.content, message.author.id);
				return;
			}
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

export async function sendMessage(channelName: string, message: string) {
	if (!client) {
		console.log("discord message not sent due to client not running");
		return;
	}

	let pitMartGuild = await client.guilds.fetch("1115317873972351036");

	if (!pitMartGuild) {
		return;
	}

	let pitMartChannels = await pitMartGuild.channels.fetch();

	if (!pitMartChannels) {
		return;
	}

	let channel = pitMartChannels.find(c => c !== null && c.name === channelName && c.type == ChannelType.GuildText);

	if (!channel) {
		return;
	}

	if (channel.type != ChannelType.GuildText) {
		return;
	}

	await channel.send({content: message, allowedMentions: {parse: []}});
}

if (process.argv.includes("--forcediscord")) { // hacky af
	startDiscordBot(); // needed for when the discord bot is ran independently
}
