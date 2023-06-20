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
	
	let player: Player;
	let user: User;

	$: {
		player = data.player!;
		user = data.user!;
	}
</script>
<div style="display: flex; flex-direction: row;">
	{#if data.success == true}
		<div style="width: max-content; margin: 24px; flex: 1;">
			<PlayerCard uuid={player.uuid} />
			{#if user}
				{#if user.verifiedHypixelUuids.includes(player.uuid)}
					<Window title="">
						<div style="display: flex; align-items: center;" class="verified-user">
						<img src="/verified.svg" style="width: 20px" alt="Verified user"><span style:color="#7addb5">&nbsp;Verified to you.</span>
					</div>
					</Window>
				{/if}
			{/if}
			<StatusCard player={player} />
			<UpgradesCard player={player} />
		</div>
		<div style="margin: 24px;  flex: 2;">
			<WindowToggleable title="Inventory">
				<div>
					<MinecraftInventory width={9} contents={player.inventories.inventoryMain.slice(9)} />
					<MinecraftInventory width={9} contents={player.inventories.inventoryMain.slice(0, 9)} /> <!-- the hotbar is in the wrong place for some reason so this is the hotbar. -->
				</div>
				<div>
					<MinecraftInventory width={1} contents={player.inventories.inventoryArmor.reverse()} />
				</div>
			</WindowToggleable>
			<WindowToggleable title="Ender Chest & Mystic Well items">
				<div>
					<MinecraftInventory width={9} contents={player.inventories.inventoryEnderChest} />
				</div>
				<div>
					<MinecraftInventory width={1} contents={player.inventories.inventoryMysticWellItem} />
					<MinecraftInventory width={1} contents={player.inventories.inventoryMysticWellPants} />
				</div>
			</WindowToggleable>
			<WindowToggleable title="Stash">
				<MinecraftInventory width={9} contents={player.inventories.inventoryStash} />
			</WindowToggleable>
			<WindowToggleable title="Spire Stash">
				<MinecraftInventory width={9} contents={player.inventories.inventorySpireStash} />
			</WindowToggleable>
		</div>
	{:else}
		No player found / no Pit data! :(
	{/if}
</div>

<style>
	div:not(.verified-user) {
		display: inline-block;
		vertical-align: top;
		flex-shrink: 0;
	}
</style>
