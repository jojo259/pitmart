import type { Command } from '../types';

const pingCommand: Command = {
	name: 'ping',
	aliases: ['p', 'pong'],
	execute: async (message, args) => {
		await message.reply('Pong!');
	},
};

export default pingCommand;
