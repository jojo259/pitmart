<script lang="ts">
	import Window from "$lib/components/page/Window.svelte";
	import type { Player, Item } from "$lib/types";
	import MinecraftInventory from "$lib/components/minecraft/MinecraftInventory.svelte";
	import * as pitMaster from "$lib/assets/pitmaster.json";
	import { romanize } from "$lib/util";
	import CenteredDiv from "$lib/components/page/CenteredDiv.svelte";

	export let player: Player;

	let perksData: PerksData = pitMaster.Pit.Perks;
	let perksFakeInventory: (Item | null)[] = [];
	$: {
		perksFakeInventory = [];
		player.upgrades.perks.forEach((perkKey: string) => {
			if (perkKey) {
				const perkData = perksData[perkKey];
				if (perkData) {
					const itemData = perkData.Item;
					if (itemData) {
						let perkItem = {
							id: perkData.Item.Id,
							dataVal: typeof itemData.Meta === 'number' ? itemData.Meta : null,
							count: 1,
							name: perkData.Name,
							lore: perkData.Description,
							color: typeof itemData.Meta === 'string' ? itemData.Meta : null,
						} as Item
						perksFakeInventory.push(perkItem);
					}
					else {
						console.error(`no perk item data for ${perkKey}`);
					}
				}
				else {
					console.error(`no perk data for ${perkKey}`);
				}
			}
			else{
				perksFakeInventory.push(null);
			}
		});
	}

	let killstreaksData: KillstreaksData = pitMaster.Pit.Killstreaks;
	let killstreaksFakeInventory: (Item | null)[] = [];
	$: {
		killstreaksFakeInventory = [];
		player.upgrades.killstreaks.forEach((killstreakKey: string) => {
			if (killstreakKey) {
				const killstreakData = killstreaksData[killstreakKey];
				if (killstreakData) {
					const itemData = killstreakData.Item;
					if (itemData) {
						let killstreakItem = {
							id: killstreakData.Item.Id,
							dataVal: typeof itemData.Meta === 'number' ? itemData.Meta : null,
							count: 1,
							name: killstreakData.Name,
							lore: killstreakData.Description,
							color: typeof itemData.Meta === 'string' ? itemData.Meta : null,
						} as Item;
						killstreaksFakeInventory.push(killstreakItem);
					}
					else {
						console.error(`no killstreak item data for ${killstreakKey}`);
					}
				}
				else {
					console.error(`no killstreak data for ${killstreakKey}`);
				}
			}
			else{
				killstreaksFakeInventory.push(null);
			}
		});
	}

	let passivesData: PassivesData = pitMaster.Pit.Upgrades;
	let passivesFakeInventory: Item[] = [];
	$: {
		passivesFakeInventory = [];
		for (let [playerPassiveKey, playerPassiveLevel] of Object.entries(player.upgrades.passives)) {
			const passiveData = passivesData[playerPassiveKey];
			if (passiveData) {
				const itemData = passiveData.Item;
				if (itemData) {
					let passiveItem = {
						id: itemData.Id,
						dataVal: typeof itemData.Meta === 'number' ? itemData.Meta : null,
						count: playerPassiveLevel,
						name: passiveData.Name ? passiveData.Name : null,
						lore: passiveData.Description ? passiveData.Description : null,
						color: typeof itemData.Meta === 'string' ? itemData.Meta : null,
					} as Item;

					if (playerPassiveLevel > 0) {
						passiveItem.name = `${playerPassiveLevel > 1 ? '§9' : '§0'}${passiveItem.name} ${romanize(playerPassiveLevel)}`;
					} else {
						passiveItem.name = "§c" + passiveItem.name;
					}

					if (passiveItem.lore) {
						passiveItem.lore = passiveItem.lore.map(line => line.replace('$', Math.max(playerPassiveLevel, 1).toString()));
					}

					passivesFakeInventory.push(passiveItem);
				}
				else {
					console.error(`no passives item data for ${playerPassiveKey}`);
				}
			}
			else {
				console.error(`no passive data for ${playerPassiveKey}`);
			}
		}
	}

	let renownUpgradesData: RenownUpgradesData = pitMaster.Pit.RenownUpgrades;
	let renownUpgradesFakeInventory: Item[] = [];
	$: {
		renownUpgradesFakeInventory = [];
		for (let [playerRenownUpgradesKey, playerRenownUpgradesLevel] of Object.entries(player.upgrades.renown)) {
			const renownUpgradeData = renownUpgradesData[playerRenownUpgradesKey];
			if (renownUpgradeData) {
				const itemData = renownUpgradeData.Item;
				if (itemData) {
					let renownUpgradeItem = {
						id: itemData.Id,
						dataVal: typeof itemData.Meta === 'number' ? itemData.Meta : null,
						count: playerRenownUpgradesLevel,
						name: renownUpgradeData.Name ? renownUpgradeData.Name : null,
						lore: renownUpgradeData.Description ? renownUpgradeData.Description : null,
						color: typeof itemData.Meta === 'string' ? itemData.Meta : null,
					} as Item;

					if (renownUpgradeItem.lore) {
						if (renownUpgradeData.Extra?.Formatting == "Reveal" && renownUpgradeData.Extra.IgnoreIndex) {
							renownUpgradeItem.lore = renownUpgradeItem.lore.slice(0, playerRenownUpgradesLevel + renownUpgradeData.Extra.IgnoreIndex);
						}
						else if (renownUpgradeData.Extra?.Formatting == "Seperated") {
							renownUpgradeItem.lore = (renownUpgradeData.Description[Math.max(0, playerRenownUpgradesLevel - 1)] as string[]);
						}
						else if (renownUpgradeData.Extra?.Formatting == "ApiReference") {
							// this is used for 2 renown perks:
							// fancy hat and assistant to the streaker
							// for fancy hat it just writes the player's hat color in the lore
							// for assistant to the streaker it displays promotion in the lore if it is unlocked
							// but promotion was removed so it doesn't matter
							// and that was never actually implemented in pitpanda anyway
							// so i will simply:
							if (playerRenownUpgradesKey == "fancy_hat") {
								renownUpgradeItem.lore = renownUpgradeItem.lore.map(line => typeof line == "string" ? line.replace('$', player.hatColor.replace("#", "")) : "error");
								renownUpgradeItem.color = player.hatColor.replace("#", "");
							}
						}
						else {
							renownUpgradeItem.lore = renownUpgradeItem.lore.map(line => typeof line == "string" ? line.replace('$', Math.max(playerRenownUpgradesLevel, 1).toString()) : "error");
						}
					}

					renownUpgradesFakeInventory.push(renownUpgradeItem);
				}
				else {
					console.error(`no renownUpgrades item data for ${playerRenownUpgradesKey}`);
				}
			}
			else {
				console.error(`no renownUpgrade data for ${playerRenownUpgradesKey}`);
			}
		}
	}

	interface PassivesData {
		[key: string]: {
			Name: string;
			Description: string[];
			Levels: string[];
			Item: {
				Id: number;
				Meta: number | string;
			};
		};
	}

	interface PerksData {
		[key: string]: {
			Name: string;
			Description: string[];
			Cost: number;
			Item: {
				Id: number;
				Meta: number | string;
			};
		};
	}

	interface KillstreaksData {
		[key: string]: {
			Name: string;
			Description: string[];
			Cost: number;
			Item: {
				Id: number;
				Meta: number | string;
			};
		};
	}

	interface RenownUpgradesData {
		[key: string]: {
			Name: string;
			Extra?: {
				Formatting?: string;
				IgnoreIndex?: number;
			}
			Description: string[] | string[][];
			Levels?: string[];
			Costs: number[];
			Item: {
				Id: number;
				Meta: number | string;
			};
			Category: string;
		};
	}
</script>

<Window title="Upgrades">
	<CenteredDiv>
		<span>Perks</span>
	</CenteredDiv>
	<CenteredDiv>
		<MinecraftInventory width={perksFakeInventory.length} contents={perksFakeInventory}/>
	</CenteredDiv>
	<CenteredDiv>
		<span>Killstreaks</span>
	</CenteredDiv>
	<CenteredDiv>
		<MinecraftInventory width={killstreaksFakeInventory.length} contents={killstreaksFakeInventory}/>
	</CenteredDiv>
	<CenteredDiv>
		<span>Passives</span>
	</CenteredDiv>
	<CenteredDiv>
		<MinecraftInventory width={7} contents={passivesFakeInventory}/>
	</CenteredDiv>
	<CenteredDiv>
		<span>Renown</span>
	</CenteredDiv>
	<CenteredDiv>
		<MinecraftInventory width={7} contents={renownUpgradesFakeInventory}/>
	</CenteredDiv>
</Window>

<style>

</style>
