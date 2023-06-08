<script>
	import CenteredDiv from "$lib/components/page/CenteredDiv.svelte";

	import { goto } from "$app/navigation";

	let tag = "";

	function handleSubmit(event) {
		event.preventDefault();
		goto(`/player/${tag}`);
	}
</script>

<CenteredDiv>
	<div>
		<div>
			<h1>P<a href="/player/mcpqndq">i</a>tMart</h1>
		</div>
		<div>
			<span>Search player:</span>
			<form on:submit={handleSubmit}>
				<label>
					<input bind:value={tag} type="text" placeholder="Enter username or UUID" />
				</label>
				<button type="submit">Search</button>
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

	input {
		width: 256px;
		height: 32px;
		font-size: 16px;
		background-color: #999;
		outline: 2px #111 solid;
		border: none;
	}

	input:focus {
		outline: 1px #999 solid;
	}

	::placeholder {
		color: #333;
		opacity: 1;
		text-align: center;
	}
</style>
