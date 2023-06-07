export interface Player {
	uuid: string;
	username: string;
	usernameLower: string;
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
