<script lang="ts">
	export let data: any;
	import MinecraftInventory from "$lib/components/minecraft/MinecraftInventory.svelte";
	import Window from "$lib/components/page/Window.svelte";
	import WindowToggleable from "$lib/components/page/WindowToggleable.svelte";
	import CenteredDiv from "$lib/components/page/CenteredDiv.svelte";
	import PlayerCard from "$lib/components/page/PlayerCard.svelte";
	import StatusCard from "$lib/components/page/StatusCard.svelte";
	import type { Player, User } from "$lib/types";
	import UpgradesCard from "$lib/components/page/UpgradesCard.svelte";
	import ListingsSearchList from "$lib/components/page/ListingsSearchList.svelte";
	
	let player: Player;
	let user: User;
	let playerVerifiedToCurrentUser = false;

	$: {
		player = data.player!;
		user = data.user!;
		playerVerifiedToCurrentUser = false;
		if (user && player && user.verifiedHypixelUuids.includes(player.uuid)) {
			playerVerifiedToCurrentUser = true;
		}
	}
</script>
<CenteredDiv>
	{#if data.success == true}
		<div style:width=max-content style:margin=16px>
			<PlayerCard uuid={player.uuid} />
			<div style:display="block">
				<ListingsSearchList queryParams="owner=s{player.uuid}" />
			</div>
			{#if playerVerifiedToCurrentUser}
				<Window title="">
					<span style:color="#ff0">Verified to YOU</span>
				</Window>
			{/if}
			<StatusCard player={player} />
			<UpgradesCard player={player} />
		</div>
		<div style:width=600px style:margin=16px>
			<WindowToggleable title="Inventory">
				<div>
					<MinecraftInventory width={9} listable={playerVerifiedToCurrentUser} contents={player.inventories.inventoryMain.slice(9)} />
					<MinecraftInventory width={9} listable={playerVerifiedToCurrentUser} contents={player.inventories.inventoryMain.slice(0, 9)} /> <!-- the hotbar is in the wrong place for some reason so this is the hotbar. -->
				</div>
				<div>
					<MinecraftInventory width={1} listable={playerVerifiedToCurrentUser} contents={player.inventories.inventoryArmor.reverse()} />
				</div>
			</WindowToggleable>
			<WindowToggleable title="Ender Chest & Mystic Well items">
				<div>
					<MinecraftInventory width={9} listable={playerVerifiedToCurrentUser} contents={player.inventories.inventoryEnderChest} />
				</div>
				<div>
					<MinecraftInventory width={1} listable={playerVerifiedToCurrentUser} contents={player.inventories.inventoryMysticWellItem} />
					<MinecraftInventory width={1} listable={playerVerifiedToCurrentUser} contents={player.inventories.inventoryMysticWellPants} />
				</div>
			</WindowToggleable>
			<WindowToggleable title="Stash">
				<MinecraftInventory width={9} listable={playerVerifiedToCurrentUser} contents={player.inventories.inventoryStash} />
			</WindowToggleable>
			<WindowToggleable title="Spire Stash">
				<MinecraftInventory width={9} listable={playerVerifiedToCurrentUser} contents={player.inventories.inventorySpireStash} />
			</WindowToggleable>
		</div>
	{:else}
		no player found / no pit data
	{/if}
</CenteredDiv>

<style>
	div {
		display: inline-block;
		vertical-align: top;
		flex-shrink: 0;
	}
</style>
