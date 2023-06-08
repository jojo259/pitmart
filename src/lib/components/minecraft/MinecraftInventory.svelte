<script>
	import MinecraftItemSlot from "./MinecraftItemSlot.svelte";

	export let width = 9;
	export let contents;
</script>

<table>
	{#each Array.from({ length: Math.max(contents.length, width) }) as _, i}
		{#if i < contents.length}
			{#if contents && contents[i].id}
				<MinecraftItemSlot item={contents[i]} />
			{:else}
				<MinecraftItemSlot />
			{/if}
		{:else}
			<MinecraftItemSlot />
		{/if}
		{#if (i + 1) % width == 0}
			<br>
		{/if}
	{/each}
</table>

<style>
</style>
