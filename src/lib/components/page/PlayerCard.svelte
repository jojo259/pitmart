<script lang="ts">
	import MinecraftText from "$lib/components/minecraft/MinecraftText.svelte";
	import type { Player } from "$lib/types";
	import * as pitMaster from "$lib/assets/pitmaster.json";
	import ProgressBar from "./ProgressBar.svelte";
	import { romanize } from "$lib/util";
	import Window from "$lib/components/page/Window.svelte";

	export let uuid: string;
	let prestigeColor: string;
	let levelColor: string;
	let supporterStr: string;
	let cardLines: string[];

	$: playerPromise = (async function getPlayer(playerUUID: string): Promise<Player | null> {
		let req = await fetch(`/api/player/${playerUUID}`);
		let resp = await req.json();
		if ("player" in resp) {
			let player: Player = resp.player;

			prestigeColor = pitMaster.Pit.Prestiges[player.prestige].ColorCode;
			levelColor = pitMaster.Pit.Levels[Math.floor(player.level / 10)].ColorCode;

			supporterStr = player.supporter ? " §e✫" : "";

			cardLines = [
				player.prefix + " " + player.username,
				"Level: " + prestigeColor + "[" + "§e" + romanize(player.prestige) + prestigeColor + (player.prestige > 0 ? "-" : "") + levelColor + player.level + prestigeColor + "]" + supporterStr,
				"Gold: §6" + player.gold.toLocaleString() + "g",
				"Renown: " + "§3" + player.renown,
				"Playtime: §f" + player.playtimeHours + " hours",
			];

			return player;
		}
		return null;
	})(uuid);
</script>

<Window title="">
	{#await playerPromise}
		{uuid}
	{:then player}
		{#if player}
				<div style:display="block">
					<div>
						<img src="https://crafatar.com/avatars/{player.uuid}" alt="player avatar" width=128px>
					</div>
					<div>
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
		{/if}
	{:catch error}
		error {uuid}
	{/await}
</Window>

<style>
	div {
		display: inline-block;
		margin: 4px;
		vertical-align: top;
	}

	p {
		color: #eee;
		margin: 0px;
		text-align: left;
	}
</style>
