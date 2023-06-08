<script>
	import MinecraftItemCard from "./MinecraftItemCard.svelte";
	import minecraftItems from "minecraft-items";

	import imgLeatherHelm from "$lib/assets/items/298.png";
	import imgLeatherChestplate from "$lib/assets/items/299.png";
	import imgLeatherLeggings from "$lib/assets/items/300.png";
	import imgLeatherBoots from "$lib/assets/items/301.png";

	let leatherItems = {
		298: imgLeatherHelm,
		299: imgLeatherChestplate,
		300: imgLeatherLeggings,
		301: imgLeatherBoots
	};

	export let item = null;

	$: itemColor = "#fff";
	$: imgSrc = "";
	$: {
		imgSrc = "";
		itemColor = "#fff";
		if (item) {
			if (item.id >= 298 && item.id <= 301) {
				// leather item
				imgSrc = leatherItems[item.id];
			} else {
				imgSrc = "data:image/png;base64, " + minecraftItems.get(item.id).icon;
			}
			itemColor = "#" + item.color;
		}
		if (itemColor == "#null") {
			itemColor = "#333";
		}
	}

	$: itemCountStr = "";
	$: {
		itemCountStr = "";
		if (item) {
			if (item.count > 1) {
				itemCountStr = item.count;
			}
		}
	}

	let showItemCard = false;

	function onMouseEnter() {
		showItemCard = true;
	}

	function onMouseLeave() {
		showItemCard = false;
	}
</script>

<div on:mouseenter={onMouseEnter} on:mouseleave={onMouseLeave}>
	{#if item != null}
		<img src={imgSrc} alt="item" draggable="false" style:background-color={itemColor} />
		<MinecraftItemCard {item} show={showItemCard} />
		<span>{itemCountStr}</span>
	{/if}
</div>

<style>
	div {
		width: 48px;
		height: 48px;
		margin: 2px;
		padding: 0px;
		border-radius: 4px;
		display: inline-block;
		position: relative;
		background-color: #333;
	}

	img {
		position: absolute;
		top: 8px;
		left: 8px;
		user-select: none;
		pointer-events: none;
		margin: 0px;
	}

	span {
		color: #fff;
		position: absolute;
		top: 28px;
		left: 28px;
		cursor: default;
		user-select: none;
		margin: 0px;
	}

	div:hover {
		outline: 2px solid #444;
		user-select: none;
	}
</style>
