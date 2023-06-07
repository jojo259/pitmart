<script>
	import MinecraftItemSlot from "./MinecraftItemSlot.svelte";

	export let width;
	export let height;
	export let contents;
</script>

<table>
	{#each Array.from({ length: height }) as _, i}
		{#each Array.from({ length: width }) as _, j}
			{#if contents && contents[i * width + j].id}
				<MinecraftItemSlot item={contents[i * width + j]} />
			{:else}
				<MinecraftItemSlot />
			{/if}
		{/each}
		<br />
	{/each}
</table>

<style>
</style>
