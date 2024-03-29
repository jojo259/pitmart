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
		renown: { [key: string]: number };
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
	nonce: number | null;
	tier: number | null;
	lives: number | null;
	maxLives: number | null;
	color: string | null;
	enchants: Enchant[] | null;
}

export interface ItemInstance {
	ownerUuid: string;
	seenOnApiAt: Date;
	seenOnlineAt: Date;
	item: Item;
}

export interface Enchant {
	key: string;
	level: number;
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

export interface Listing {
	discordId: string;
	owner: string;
	pricePer: number;
	currency: Currency;
	message: string;
	buying: boolean;
	ownershipVerified: boolean;
	item: Item;
}

export enum Currency {
	Gold = "Gold",
	PantsBundle = "PB",
	Vile = "Vile",
	SewerRubbish = "Sewer rubbish",
}

export type Rank = "NON" | "VIP" | "VIP_PLUS" | "MVP" | "MVP_PLUS" | "SUPERSTAR" | "HELPER" | "MODERATOR" | "ADMIN" | "OWNER" | "YOUTUBER";
