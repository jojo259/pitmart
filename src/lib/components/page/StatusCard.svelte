<script lang="ts">
	import Window from "$lib/components/page/Window.svelte";
	import MinecraftText from "$lib/components/minecraft/MinecraftText.svelte";
	import { relativeTimestamp } from "$lib/util";
	import type { Player } from "$lib/types";

	export let player: Player;

	$: playerOnline = false;
	$: latestOnHypixel = new Date(0);

	$: {
		playerOnline = player.lastLogin > player.lastLogout;
		latestOnHypixel = player.lastLogout;
		if (player.lastLogin > latestOnHypixel) { latestOnHypixel = player.lastLogin}
		if (player.pitLastSave > latestOnHypixel) { latestOnHypixel = player.pitLastSave}
	}
</script>

<Window title="Status">
	<MinecraftText text={playerOnline ? "§aONLINE" : "§cOffline"} />
	<MinecraftText text="Last seen in Pit {relativeTimestamp(player.pitLastSave)}" />
	<MinecraftText text="Last seen on Hypixel {relativeTimestamp(latestOnHypixel)}" />
</Window>

<style>

</style>
