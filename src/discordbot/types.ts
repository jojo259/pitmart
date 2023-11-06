import { Message } from "discord.js";

export interface Command {
	name: string;
	aliases: string[];
	execute: (message: Message, args?: string[]) => void;
}
