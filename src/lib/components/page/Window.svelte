<script>
	export let title;
</script>

<div>
	{title}
	<slot />
</div>

<style>
	div {
		border: 2px solid #202020;
		background-color: #2e2e2e;
		width: max-content;
		padding: 8px;
		margin: 8px;
	}
</style>
