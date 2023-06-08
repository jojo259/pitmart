<script>
	export let data;
	import MinecraftInventory from "$lib/components/minecraft/MinecraftInventory.svelte";
	import Window from "$lib/components/page/Window.svelte";
	import WindowToggleable from "$lib/components/page/WindowToggleable.svelte";
	import CenteredDiv from "$lib/components/page/CenteredDiv.svelte";
	import PlayerCard from "$lib/components/page/PlayerCard.svelte";
</script>
<CenteredDiv>
	{#if data.success == true}
		<div>
			<Window title="Player">
				<PlayerCard player={data.player} />
			</Window>
		</div>
		<div style:width=580px>
			<WindowToggleable title="Inventory">
				<div>
					<MinecraftInventory width=9 contents={data.player.inventories.inventoryMain.slice(9)} />
					<MinecraftInventory width=9 contents={data.player.inventories.inventoryMain.slice(0, 9)} /> <!-- the hotbar is in the wrong place for some reason so this is the hotbar. -->
				</div>
				<div>
					<MinecraftInventory width=1 contents={data.player.inventories.inventoryArmor.reverse()} />
				</div>
			</WindowToggleable>
			<WindowToggleable title="Ender Chest & Mystic Well items">
				<div>
					<MinecraftInventory width=9 contents={data.player.inventories.inventoryEnderChest} />
				</div>
				<div>
					<MinecraftInventory width=1 contents={data.player.inventories.inventoryMysticWellItem} />
					<MinecraftInventory width=1 contents={data.player.inventories.inventoryMysticWellPants} />
				</div>
			</WindowToggleable>
			<WindowToggleable title="Stash">
				<MinecraftInventory width=9 contents={data.player.inventories.inventoryStash} />
			</WindowToggleable>
			<WindowToggleable title="Spire Stash">
				<MinecraftInventory width=9 contents={data.player.inventories.inventorySpireStash} />
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
	}
</style>
