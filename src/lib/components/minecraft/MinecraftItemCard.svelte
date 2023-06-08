<script>
	import MinecraftText from "./MinecraftText.svelte";
	import minecraftItems from "minecraft-items";

	export let item;
	export let show = false;
	$: itemLines = [];

	$: {
		if (item.name && item.lore) {
			itemLines = [item.name].concat(item.lore);
		} else {
			itemLines = Array(minecraftItems.get(item.id).name);
		}
	}
</script>

<div class={show ? "visible" : "hidden"}>
	{#each itemLines as lineText, i}
		<MinecraftText text={lineText} />
	{/each}
</div>

<style>
	div {
		border: 3px solid blue;
		border-radius: 3px;
		margin: 0px;
		padding: 6px;
		width: max-content;
		background: #120211;
		color: gray;
		font-family: Minecraft;
		position: absolute;
		top: 52px;
		left: 0px;
		z-index: 2;
		line-height: 18px;
		pointer-events: none;
		overflow: hidden;
		text-align: left;
	}

	.visible {
		visibility: visible;
	}

	.hidden {
		visibility: hidden;
	}
</style>
