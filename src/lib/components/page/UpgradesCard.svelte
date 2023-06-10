<script lang="ts">
	import Window from "$lib/components/page/Window.svelte";
	import type { Player, Item } from "$lib/types";
	import MinecraftInventory from "$lib/components/minecraft/MinecraftInventory.svelte";
	import * as pitMaster from "$lib/assets/pitmaster.json";
	import { romanize } from "$lib/util";
	import CenteredDiv from "$lib/components/page/CenteredDiv.svelte";

	export let player: Player;

	let perksData: PerksData = pitMaster.Pit.Perks;
	let perksFakeInventory: Item[] = [];
	$: {
		perksFakeInventory = [];
		player.upgrades.perks.forEach((perkKey: string) => {
			const perkData = perksData[perkKey];
			const itemData = perkData.Item;
			let perkItem = {
				id: perkData.Item.Id,
				dataVal: typeof itemData.Meta === 'number' ? itemData.Meta : null,
				count: 1,
				name: perkData.Name,
				lore: perkData.Description,
				color: typeof itemData.Meta === 'string' ? itemData.Meta : null,
			} as Item
			perksFakeInventory.push(perkItem);
		});
	}

	let killstreaksData: KillstreaksData = pitMaster.Pit.Killstreaks;
	let killstreaksFakeInventory: (Item | null)[] = [];
	$: {
		killstreaksFakeInventory = [];
		player.upgrades.killstreaks.forEach((killstreakKey: string) => {
			if (killstreakKey) {
				const killstreakData = killstreaksData[killstreakKey];
				const itemData = killstreakData.Item;
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
			const itemData = passiveData.Item;

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
</script>

<Window title="Upgrades">
	<CenteredDiv>
		<span>Perks</span>
	</CenteredDiv>
	<CenteredDiv>
		<MinecraftInventory width={Math.max(3, perksFakeInventory.length)} contents={perksFakeInventory}/>
	</CenteredDiv>
	<CenteredDiv>
		<span>Killstreaks</span>
	</CenteredDiv>
	<CenteredDiv>
		<MinecraftInventory width={Math.max(3, killstreaksFakeInventory.length)} contents={killstreaksFakeInventory}/>
	</CenteredDiv>
	<CenteredDiv>
		<span>Passives</span>
	</CenteredDiv>
	<CenteredDiv>
		<MinecraftInventory width={7} contents={passivesFakeInventory}/>
	</CenteredDiv>
</Window>

<style>

</style>
