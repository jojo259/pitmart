export interface Player {
	uuid: string;
	username: string;
	usernameLower: string;
	supporter: boolean,
	prestige: number;
	level: number;
	rank: Rank;
	gold: number;
	renown: number;
	playtimeHours: number;
	hatColor: string;
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
	count: number;
	name: string;
	lore: string[];
	color: string;
}

type Rank = "NON" | "VIP" | "VIP_PLUS" | "MVP" | "MVP_PLUS" | "SUPERSTAR" | "HELPER" | "MODERATOR" | "ADMIN" | "OWNER" | "YOUTUBER";
