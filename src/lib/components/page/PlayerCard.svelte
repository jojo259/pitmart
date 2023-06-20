<script lang="ts">
	import MinecraftText from "$lib/components/minecraft/MinecraftText.svelte";
	import type { Player } from "$lib/types";
	import * as pitMaster from "$lib/assets/pitmaster.json";
	import ProgressBar from "./ProgressBar.svelte";
	import { romanize } from "$lib/util";
	import Window from "$lib/components/page/Window.svelte";
	import ConditionalLink from "$lib/components/page/ConditionalLink.svelte";

	export let uuid: string;
	export let links = false;

	let prestigeColor: string;
	let levelColor: string;
	let supporterStr: string;
	let playerInfo: string;

	let killsFormatted: string;
	let goldFormatted: string;
	let renownFormatted: string;
	let playtimeFormatted: string; // jojo i KNOW that this code sucks. but when i tried an array of strings it just said it was undefined...???? how
	let levelFormatted: string; // used for making player level bold

	$: playerPromise = (async function getPlayer(playerUUID: string): Promise<Player | null> {
		let req = await fetch(`/api/player/${playerUUID}`);
		let resp = await req.json();
		if ("player" in resp) {
			let player: Player = resp.player;

			prestigeColor = pitMaster.Pit.Prestiges[player.prestige].ColorCode;
			levelColor = pitMaster.Pit.Levels[Math.floor(player.level / 10)].ColorCode;

			supporterStr = player.supporter ? " §e✫ " : "";
	

			playerInfo = prestigeColor + "[" + "§e" + romanize(player.prestige) + prestigeColor + (player.prestige > 0 ? "-" : "") + levelColor + (player.level != 0 ? "§l" + player.level : player.level) + prestigeColor + "] " + supporterStr + player.prefix + " " + player.username;
			killsFormatted = (10592).toLocaleString();
			goldFormatted = player.gold.toLocaleString() + "g";
			renownFormatted = (player.renown).toLocaleString();
			playtimeFormatted = player.playtimeHours.toLocaleString() + " hours";

			return player;
		}
		return null;
	})(uuid);
</script>

<ConditionalLink enabled={links} href="/player/{uuid}">
	<Window title="">
		{#await playerPromise}
			{uuid}
		{:then player}
			{#if player}
				<div style:display="block">
					<div class="header-image">
						<img src="https://crafatar.com/avatars/{player.uuid}?overlay" alt="player avatar" width=35px>
						<span class="username"><MinecraftText text={playerInfo} />
					</span>
					</div>
					<div>
						<span style="color: #bebebe">
							Kills: <span class="player-kills">{killsFormatted}</span><br>
							Gold: <span class="player-gold">{goldFormatted}</span><br>
							Renown: <span class="player-renown">{renownFormatted}</span><br>
							Playtime: <span class="player-playtime">{playtimeFormatted}</span><br>
						</span>
						<div style:display="block" style:margin-top="6px" style:margin-left="0px">
							<ProgressBar percentage={player.prestigeXpReqProportion * 100} barColor="#50caca" />
						</div>
						<div style:display="block" style:margin-top="6px" style:margin-left="0px">
							<ProgressBar percentage={player.prestigeGoldReqProportion * 100} barColor="#d9a334" />
						</div>
					</div>
				</div>
			{:else}
				nodata {uuid}
			{/if}
		{:catch error}
			error {error}
		{/await}
	</Window>
</ConditionalLink>

<style>
	div:not(.header-image) {
		display: inline-block;
		margin: 4px;
		vertical-align: top;
	}
</style>
