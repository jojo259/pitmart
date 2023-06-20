<script>
	export let title;
</script>

<div>
	{#if title != ""}
		<span class="box-title">{title}</span>
	{/if}
	<slot />
</div>

<style>
	div {
		display: block;
		border: 2px solid #202020;
		background-color: #2e2e2e;
		width: 100%;
		padding: 8px;
		margin: 8px;
		text-align: left;
	}

	div {
        display: block;
        background-color: #252525;
        padding: 16px;
        margin: 5px;
        text-align: left;
        border-radius: 15px;
    }

	span {
		display: block;
	}
</style>
