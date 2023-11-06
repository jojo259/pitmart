<script lang="ts">
	import Window from "$lib/components/page/Window.svelte";
	import MinecraftInventory from "$lib/components/minecraft/MinecraftInventory.svelte";
	import type { Item } from "$lib/types";

	export let inventories: { [key: string]: Item[] };

	let visibleInventoryTitle = Object.keys(inventories)[0];

	function inventoryTitleClicked(title: string) {
		visibleInventoryTitle = title;
		console.log(`new visible inventory title: ${visibleInventoryTitle}`);
	}
</script>

<Window title="">
	{#each Object.keys(inventories) as title}
		<div style:user-select="none" style:cursor="pointer" style:display="inline-block" on:click={() => inventoryTitleClicked(title)}>
			<span>{title}</span>
		</div>
	{/each}
	{#each Object.entries(inventories) as [title, contents]}
		<div class={visibleInventoryTitle == title ? "visible" : "hidden"}>
			<MinecraftInventory contents={contents} />
		</div>
	{/each}
</Window>

<style>
	span {
		margin-right: 32px;
	}

	.visible {
		display: block;
	}

	.hidden {
		display: none;
	}
</style>
