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
	meta: number;
	count: number;
	name: string;
	lore: string[];
	color: string;
}

export type Rank = "NON" | "VIP" | "VIP_PLUS" | "MVP" | "MVP_PLUS" | "SUPERSTAR" | "HELPER" | "MODERATOR" | "ADMIN" | "OWNER" | "YOUTUBER";
