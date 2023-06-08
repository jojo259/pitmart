<script>
	export let data;
	import MinecraftInventory from "$lib/components/minecraft/MinecraftInventory.svelte";
	import Window from "$lib/components/page/Window.svelte";
	import CenteredDiv from "$lib/components/page/CenteredDiv.svelte";
	import PlayerCard from "$lib/components/page/PlayerCard.svelte";
</script>
{#if data.success == true}
	<CenteredDiv>
		<div>
			<Window title="Player">
				<PlayerCard player={data.player} />
			</Window>
		</div>
		<div>
			<Window title="Inventory">
				<MinecraftInventory width=9 height=3 contents={data.player.inventories.inventoryMain.slice(9)} />
				<MinecraftInventory width=9 height=1 contents={data.player.inventories.inventoryMain.slice(0, 9)} /> <!-- the hotbar is in the wrong place for some reason so this is the hotbar. -->
			</Window>
			<Window title="Ender Chest">
				<MinecraftInventory width=9 height={Math.ceil(data.player.inventories.inventoryEnderChest.length / 9)} contents={data.player.inventories.inventoryEnderChest} />
			</Window>
		</div>
	</CenteredDiv>
{:else}
	no player found
{/if}

<style>
	div {
		display: inline-block;
	}
</style>
