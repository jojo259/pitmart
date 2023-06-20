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
	<span class="dim-3">
		{playerOnline ? "Currently online." : "Offline."}<br>
		Last seen in Pit {relativeTimestamp(player.pitLastSave)}.<br>
		Last seen on Hypixel {relativeTimestamp(latestOnHypixel)}.
	</span>
	
</Window>

<style>

</style>
