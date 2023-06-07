<script>
	import CenteredDiv from "$lib/components/page/CenteredDiv.svelte";
</script>

<CenteredDiv>
	<div>
		<div>
			<h1>P<a href="/player/mcpqndq">i</a>tMart</h1>
		</div>
		<div>
			<span>Search player:</span>
			<form method="GET" action="/player/">
				<label>
					<input name="tag" type="tag" placeholder="Enter username or UUID" />
				</label>
			</form>
		</div>
	</div>
</CenteredDiv>

<style>
	h1 {
		font-size: 64px;
		margin: 8px;
	}

	form {
		margin: 8px;
	}

	a {
		text-decoration: none;
	}
</style>
