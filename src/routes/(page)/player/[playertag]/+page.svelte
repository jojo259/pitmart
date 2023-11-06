<script lang="ts">
	export let data: any;
	import MinecraftInventory from "$lib/components/minecraft/MinecraftInventory.svelte";
	import Window from "$lib/components/page/Window.svelte";
	import WindowToggleable from "$lib/components/page/WindowToggleable.svelte";
	import WindowInventoriesTabbed from "$lib/components/page/WindowInventoriesTabbed.svelte";
	import CenteredDiv from "$lib/components/page/CenteredDiv.svelte";
	import PlayerCard from "$lib/components/page/PlayerCard.svelte";
	import StatusCard from "$lib/components/page/StatusCard.svelte";
	import type { Player, User } from "$lib/types";
	import UpgradesCard from "$lib/components/page/UpgradesCard.svelte";
	
	let player: Player;
	let user: User;
	let visibleInventory = "inventory";
	let playerVerifiedToCurrentUser = false;

	$: {
		player = data.player!;
		user = data.user!;
		playerVerifiedToCurrentUser = false;
		if (user && user.verifiedHypixelUuids.includes(player.uuid)) {
			playerVerifiedToCurrentUser = true;
		}
	}

	function changeVisibleInventory(inventoryChange: string): void {
		visibleInventory = inventoryChange;
	}

</script>
<div style="display: flex; flex-direction: row;">
	{#if data.success == true}
		<div style="width: max-content; margin: 24px; flex: 1;">
			<PlayerCard uuid={player.uuid} />
			{#if playerVerifiedToCurrentUser}
				<Window title="">
					<div style="display: flex; align-items: center;" class="verified-user">
						<img src="/image/verified.svg" style="width: 20px" alt="Verified user"><span style:color="#7addb5">&nbsp;Verified to you.</span>
					</div>
				</Window>
			{/if}
			<StatusCard player={player} />
		</div>
		<div style="margin: 24px; flex: 2;">
			<Window title="">
				<p class="box-title"><span class="dim-8"><span class={visibleInventory == "inventory" ? "box-title-gray" : "dim-8 clickable"} on:click={() => changeVisibleInventory("inventory")}>Inventory</span> &ndash; <span class={visibleInventory == "enderchest" ? "box-title-gray" : "dim-8 clickable"} on:click={() => changeVisibleInventory("enderchest")}>Ender Chest</span> &ndash; <span class={visibleInventory == "stash" ? "box-title-gray" : "dim-8 clickable"} on:click={() => changeVisibleInventory("stash")}>Stash</span></p>
				<div>
					{#if visibleInventory == "inventory"}
						<div>
							<MinecraftInventory width={9} listable={playerVerifiedToCurrentUser} contents={player.inventories.inventoryMain.slice(9)} />
							<MinecraftInventory width={9} listable={playerVerifiedToCurrentUser} contents={player.inventories.inventoryMain.slice(0, 9)} /> <!-- the hotbar is in the wrong place for some reason so this is the hotbar. -->
						</div>
						<div>
							<MinecraftInventory width={1} listable={playerVerifiedToCurrentUser} contents={player.inventories.inventoryArmor.reverse()} />
						</div>
					{:else if visibleInventory == "enderchest"}
						<MinecraftInventory width={9} listable={playerVerifiedToCurrentUser} contents={player.inventories.inventoryEnderChest} />
					{:else if visibleInventory == "stash"}
						<div>
							<MinecraftInventory width={1} listable={playerVerifiedToCurrentUser} contents={player.inventories.inventoryMysticWellItem} />
							<MinecraftInventory width={1} listable={playerVerifiedToCurrentUser} contents={player.inventories.inventoryMysticWellPants} />
						</div>
						<div>
							<MinecraftInventory width={9} listable={playerVerifiedToCurrentUser} contents={player.inventories.inventoryStash} />
							<MinecraftInventory width={9} listable={playerVerifiedToCurrentUser} contents={player.inventories.inventorySpireStash} />
						</div>
					{/if}
				</div>
	
				<div>
					
				</div>
				
			</Window>
		<div style="margin: 24px;  flex: 2;">
			<WindowInventoriesTabbed inventories={{"Inventory": player.inventories.inventoryMain.slice(9).concat(player.inventories.inventoryMain.slice(0, 9)), "EnderChest": player.inventories.inventoryEnderChest, "Stash": player.inventories.inventoryStash, "SpireStash": player.inventories.inventorySpireStash}} /> <!-- main inventory is sliced to move the hotbar into the correct place then  -->
			<UpgradesCard player={player} />
		</div>
	{:else}
		No player found! / no Pit data! / Error! :(
	{/if}
</div>

<style>
	div:not(.verified-user) {
		display: inline-block;
		vertical-align: top;
		flex-shrink: 0;
	}

	.clickable {
		cursor: pointer;
	}
</style>
