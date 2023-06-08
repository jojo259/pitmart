<script lang="ts">
	import MinecraftText from "$lib/components/minecraft/MinecraftText.svelte";
	import type { Player } from "$lib/types";
	import * as pitMaster from "$lib/assets/pitmaster.json";
	import ProgressBar from "./ProgressBar.svelte";

	export let player: Player;

	function romanize(num: number): string {
		let lookup: { [key: string]: number } = {"M":1000,"CM":900,"D":500,"CD":400,"C":100,"XC":90,"L":50,"XL":40,"X":10,"IX":9,"V":5,"IV":4,"I":1},roman = '',i;
		for ( i in lookup ) {
			while ( num >= lookup[i] ) {
				roman += i;
				num -= lookup[i];
			}
		}
		return roman;
	}

	$: player = player;

	$: prestigeColor = pitMaster.Pit.Prestiges[player.prestige].ColorCode;
	$: levelColor = pitMaster.Pit.Levels[Math.floor(player.level / 10)].ColorCode;

	$: rankPrefix = pitMaster.Extra.RankPrefixes[player.rank];
	$: supporterStr = player.supporter ? " §e✫" : "";

	$: playtimeHours = player.playtimeHours;

	$: cardLines = [
		rankPrefix + " " + player.username,
		"Level: " + prestigeColor + "[" + "§e" + romanize(player.prestige) + prestigeColor + (player.prestige > 0 ? "-" : "") + levelColor + player.level + prestigeColor + "]" + supporterStr,
		"Gold: §6" + player.gold.toLocaleString() + "g",
		"Renown: " + "§3" + player.renown,
		"Playtime: §f" + player.playtimeHours + " hours",
	];
</script>

<div style:display="block">
	<div>
		<img src="https://crafatar.com/avatars/{player.uuid}" alt="player avatar" width=128px style:outline="2px solid {player.hatColor}" />
	</div>
	<div>
		{#each cardLines as line, i}
			<p>
				<MinecraftText text={"§7" + line} />
			</p>
		{/each}
		<div style:display="block" style:margin="0px">
			<ProgressBar percentage={player.prestigeXpReqProportion * 100} barColor="#50caca" />
		</div>
		<div style:display="block" style:margin="0px">
			<ProgressBar percentage={player.prestigeGoldReqProportion * 100} barColor="#d9a334" />
		</div>
	</div>
</div>

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
