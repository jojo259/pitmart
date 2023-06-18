<script>
	import MinecraftText from "./MinecraftText.svelte";
	import minecraftItems from "minecraft-items";

	export let item;
	export let show = false;
	export let useAbsolutePosition = true;
	$: itemLines = [];

	$: {
		if (item.name && item.lore) {
			itemLines = [item.name].concat(item.lore);
		} else {
			itemLines = Array(minecraftItems.get(item.id).name);
		}
	}
</script>

<div class={show ? "visible" : "hidden"} class:position-absolute={useAbsolutePosition}>
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
		line-height: 18px;
		pointer-events: none;
		overflow: hidden;
		text-align: left;
	}

	.position-absolute {
		position: absolute;
		top: 52px;
		left: 0px;
		z-index: 2;
	}

	.visible {
		visibility: visible;
	}

	.hidden {
		visibility: hidden;
	}
</style>
