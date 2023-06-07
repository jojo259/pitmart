<script>
	import MinecraftText from "./MinecraftText.svelte";
	import minecraftItems from "minecraft-items";

	export let item;
	export let show = false;
	let itemLinesChars = [];
	if (item.name && item.lore) {
		let itemLines = [item.name].concat(item.lore);
		itemLinesChars = itemLines.map((line) => line.split(""));
	} else {
		itemLinesChars = Array(minecraftItems.get(item.id).name);
	}

	let textColor = "#fff";
	let nextCharSetsColor = false;
	function setTextColor(char) {
		if (nextCharSetsColor) {
			textColor = minecraftColorCodes[char];
			nextCharSetsColor = false;
		}
		if (char.charAt(0) == "§") {
			nextCharSetsColor = true;
		}
		return textColor;
	}

	function getTextChar(text) {
		if (nextCharSetsColor) {
			return "";
		}
		return text.replace("§", "");
	}

	const minecraftColorCodes = {
		"4": "#AA0000",
		"c": "#FF5555",
		"6": "#FFAA00",
		"e": "#FFFF55",
		"2": "#00AA00",
		"a": "#55FF55",
		"b": "#55FFFF",
		"3": "#00AAAA",
		"1": "#0000AA",
		"9": "#5555FF",
		"d": "#FF55FF",
		"5": "#AA00AA",
		"f": "#FFFFFF",
		"7": "#AAAAAA",
		"8": "#555555",
		"0": "#000000"
	};
</script>

<div class={show ? "visible" : "hidden"}>
	{#each itemLinesChars as chars, i}
		{#each chars as char, o}
			<MinecraftText text={getTextChar(char)} color={setTextColor(char)} />
		{/each}
		<br />
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
