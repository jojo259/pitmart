<script>
	export let href = "";
	export let enabled = false;
</script>

{#if enabled}
	<a href={href}>
		<slot />
	</a>
{:else}
	<slot />
{/if}
