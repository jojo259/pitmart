<script>
	export let title;
</script>

<div>
	<span>{title}</span>
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

	span {
		display: block;
	}
</style>
