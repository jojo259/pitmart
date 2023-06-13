export interface Player {
	uuid: string;
	username: string;
	usernameLower: string;
	prefix: string;
	supporter: boolean,
	prestige: number;
	level: number;
	prestigeXpLeft: number;
	prestigeXpReqProportion: number;
	prestigeGoldLeft: number;
	prestigeGoldReqProportion: number;
	rank: Rank;
	gold: number;
	renown: number;
	playtimeHours: number;
	hatColor: string;
	lastLogin: Date;
	lastLogout: Date;
	pitLastSave: Date;
	upgrades: {
		passives: { [key: string]: number };
		perks: string[],
		killstreaks: string[],
	},
	inventories: {
		inventoryMain: Item[];
		inventoryEnderChest: Item[];
		inventoryStash: Item[];
		inventorySpireStash: Item[];
		inventoryArmor: Item[];
		inventoryMysticWellItem: Item[];
		inventoryMysticWellPants: Item[];
	};
}

export interface Item {
	id: number;
	dataVal: number | null;
	count: number;
	name: string | null;
	lore: string[] | null;
	color: string | null;
}

export interface User {
	discordId: string;
	username: string;
	displayName: string;
	discordAccessToken: string;
	discordRefreshToken: string;
	avatarId: string;
	verifiedHypixelUuids: string[];
}

export type Rank = "NON" | "VIP" | "VIP_PLUS" | "MVP" | "MVP_PLUS" | "SUPERSTAR" | "HELPER" | "MODERATOR" | "ADMIN" | "OWNER" | "YOUTUBER";
