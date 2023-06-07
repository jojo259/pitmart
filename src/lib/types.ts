export interface Player {
	uuid: string;
	username: string;
	usernameLower: string;
	inventories: {
		inventoryMain: Item[];
	};
}

export interface Item {
	id: number;
	count: number;
	name: string;
	lore: string[];
	color: string;
}
