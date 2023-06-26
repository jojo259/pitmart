<script>
	import MinecraftItemCard from "./MinecraftItemCard.svelte";
	import minecraftItems from "minecraft-items";
	import { goto } from '$app/navigation';
	import { clickCreateListingString } from "$lib/constants";

	import imgLeatherHelm from "$lib/assets/items/298.png";
	import imgLeatherChestplate from "$lib/assets/items/299.png";
	import imgLeatherLeggings from "$lib/assets/items/300.png";
	import imgLeatherBoots from "$lib/assets/items/301.png";

	export let item = null;
	export let listable = false;

	let leatherItems = {
		298: imgLeatherHelm,
		299: imgLeatherChestplate,
		300: imgLeatherLeggings,
		301: imgLeatherBoots
	};

	$: {
		if (listable && item.lore) {
			item.lore.push(clickCreateListingString);
		}
	}

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
				let itemIdStr = item.id.toString();
				if (item.dataVal) {
					itemIdStr += ":" + item.dataVal;
				}
				let itemData = minecraftItems.get(itemIdStr);
				if (!itemData) {
					console.error(`no item data found for id ${item.id} with data value ${item.dataVal}`);
					itemData = minecraftItems.get("373");
				}
				imgSrc = "data:image/png;base64, " + itemData.icon;
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

	function handleClick() {
		if (listable) {
			goto(`/createlisting?tag=${"jojoq"}&itemjson=${encodeURIComponent(JSON.stringify(item))}`);
		}
	}
</script>

<div on:mouseenter={onMouseEnter} on:mouseleave={onMouseLeave} on:click={handleClick}>
	{#if item != null}
		<img src={imgSrc} alt="item" draggable="false" style:background-color={itemColor} style:filter={item.count < 1 ? "saturate(0)" : ""} />
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
		font-family: Minecraft;
	}

	div:hover {
		outline: 2px solid #444;
		user-select: none;
	}
</style>
