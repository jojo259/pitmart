<script lang="ts">
	import { afterUpdate, onMount } from 'svelte';
	import { encode } from 'html-entities';

	export let text: string;
	export let useMinecraftFont = true;

	let textHtml = "";
	let isBold = false;
	let me: HTMLElement;

	function processText() {
		if (text.length == 0) {
			setHtml("<br>");
			return;
		}
		textHtml = "<span style='color:#FFF${useMinecraftFont ? '; font-family: Minecraft': ''}'>";
		let nextCharSetsColor = false;
		encode(text).split("").forEach((char: string) => {
			if (nextCharSetsColor) {
				nextCharSetsColor = false;
				if (char in minecraftColorCodes) {
					textHtml += (isBold ? "</span>" : "") + `</span><span style="color:${minecraftColorCodes[char]}${useMinecraftFont ? '; font-family: Minecraft': ''}">`;
					isBold = false;
				} else if (char == "l") {
					textHtml += `<span style="font-weight: bold${useMinecraftFont ? '; font-family: Minecraft': ''}">`;
					isBold = true;
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
		"4": "#A00",
		"c": "#F55",
		"6": "#FA0",
		"e": "#FF5",
		"2": "#0A0",
		"a": "#5F5",
		"b": "#5FF",
		"3": "#0AA",
		"1": "#00A",
		"9": "#55F",
		"d": "#F5F",
		"5": "#A0A",
		"f": "#FFF",
		"7": "#AAA",
		"8": "#555",
		"0": "#000"
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