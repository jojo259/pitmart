<script lang="ts">
	import { afterUpdate, onMount } from 'svelte';

	export let text: string;

	let textHtml = "";
	let me: HTMLElement;

	function processText() {
		if (text.length == 0) {
			setHtml("<br>");
			return;
		}
		textHtml = "<span style='color:#FFF'>";
		let nextCharSetsColor = false;
		text.split("").forEach((char: string) => {
			if (nextCharSetsColor) {
				nextCharSetsColor = false;
				if (char in minecraftColorCodes) {
					textHtml += `</span><span style="color:${minecraftColorCodes[char]}">`;
				}
				return;
			}
			if (char == "§") {
				nextCharSetsColor = true;
				return;
			}
			textHtml += char;
		});
		textHtml += "</span>";
		setHtml(textHtml);
	}

	function setHtml(to: string) {
		if (me) {
			me.innerHTML = to;
		}
		else {
			console.error("failed to set MinecraftText innerHTML");
		}
	}

	const minecraftColorCodes: { [key: string]: string } = {
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

	onMount(async () => {
		processText();
	});

	afterUpdate(async () => {
		processText();
	});
</script>

<div bind:this={me}>abc</div>

<style>
	div {
		margin: 0px;
		text-align: left;
	}
</style>