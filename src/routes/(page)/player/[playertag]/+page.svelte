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
	let gamer: 3;
	let visibleInventory = "stash"; // yeah

	$: {
		player = data.player!;
		user = data.user!;
	}

	function changeVisibleInventory(inventoryChange: string): void {
		visibleInventory = inventoryChange;
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
		</div>
		<div style="margin: 24px;  flex: 2;">
			<Window title="">
				<p class="box-title"><span class="dim-8"><span class={visibleInventory == "inventory" ? "box-title-gray" : "dim-8 clickable"} on:click={() => changeVisibleInventory("inventory")}>Inventory</span> &ndash; <span class={visibleInventory == "enderchest" ? "box-title-gray" : "dim-8 clickable"} on:click={() => changeVisibleInventory("enderchest")}>Ender Chest</span> &ndash; <span class={visibleInventory == "stash" ? "box-title-gray" : "dim-8 clickable"} on:click={() => changeVisibleInventory("stash")}>Stash</span></p>
				<div>
					{#if visibleInventory == "inventory"}
					<div>
					<MinecraftInventory width={9} contents={player.inventories.inventoryMain.slice(9)} />
					<MinecraftInventory width={9} contents={player.inventories.inventoryMain.slice(0, 9)} /> <!-- the hotbar is in the wrong place for some reason so this is the hotbar. -->
					</div>
					<div>
						<MinecraftInventory width={1} contents={player.inventories.inventoryArmor.reverse()} />
					</div>
					{:else if visibleInventory == "enderchest"}
					<MinecraftInventory width={9} contents={player.inventories.inventoryEnderChest} />
					{:else if visibleInventory == "stash"}
					<div>
						<MinecraftInventory width={1} contents={player.inventories.inventoryMysticWellItem} />
						<MinecraftInventory width={1} contents={player.inventories.inventoryMysticWellPants} />
					</div>
					<div>
					<MinecraftInventory width={9} contents={player.inventories.inventoryStash} />
					<MinecraftInventory width={9} contents={player.inventories.inventorySpireStash} />
					</div>
					{/if}
				</div>
	
				<div>
					
				</div>
				
			</Window>
			<UpgradesCard player={player} />
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

	.clickable {
		cursor: pointer;
	}
</style>
