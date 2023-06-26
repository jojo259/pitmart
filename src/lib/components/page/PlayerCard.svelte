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
	let playerName: string;
	let cardLines: string[];

	$: playerPromise = (async function getPlayer(playerUUID: string): Promise<Player | null> {
		let req = await fetch(`/api/player/${playerUUID}`);
		let resp = await req.json();
		if ("player" in resp) {
			let player: Player = resp.player;

			prestigeColor = pitMaster.Pit.Prestiges[player.prestige].ColorCode;
			levelColor = pitMaster.Pit.Levels[Math.floor(player.level / 10)].ColorCode;

			supporterStr = player.supporter ? " §e✫" : "";

			playerName = player.prefix + " " + player.username + supporterStr;
		
			cardLines = [
				"Level: " + prestigeColor + "[" + "§e" + romanize(player.prestige) + prestigeColor + (player.prestige > 0 ? "-" : "") + levelColor + player.level + prestigeColor + "]",
				"Kills: §c" + (player.kills).toLocaleString(),
				"Gold: §6" + player.gold.toLocaleString() + "g",
				"Renown: " + "§3" + player.renown.toLocaleString(),
				"Playtime: §f" + player.playtimeHours.toLocaleString() + " hours",
			];

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
					<div style:display="block">
						<div style:display="inline-block">
							<img src="https://crafatar.com/avatars/{player.uuid}?overlay" alt="player avatar" width=48px>
						</div>
						<div style:display="inline-block">
							<MinecraftText text={playerName} />
						</div>
					</div>
					<div style:display="inline-block">
						{#each cardLines as line, i}
							<p>
								<MinecraftText text={"§7" + line} />
							</p>
						{/each}
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
	div {
		display: inline-block;
		margin: 0px;
		vertical-align: middle;
		text-decoration: none;
	}

	.username {
		padding-left: 12px;
		font-size: 24px;
	}

	p {
		margin: 0px;
	}

	img {
		margin: 0px;
		margin-right: 16px;
	}
</style>
