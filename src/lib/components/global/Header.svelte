<script lang="ts">
	import CenteredDiv from "$lib/components/page/CenteredDiv.svelte";
	import NavBar from "./NavBar.svelte";

	export let user: any;

	import { goto } from "$app/navigation";

	let tag = "";

	function handleSubmit(event: Event) {
		event.preventDefault();
		goto(`/player/${tag}`);
	}
</script>

<NavBar user={user} />

<CenteredDiv>
	<div>
		<div>
			<h1>P<a href="/player/mcpqndq">i</a>tMart</h1>
			<h2>BETA!</h2>
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
		margin: 64px;
	}

	h2 {
		font-size:48px;
		color:#ffc400;
		position:absolute;
		top:68px;
		left: 53%;
		transform:rotate(30deg);
		transition: all .5s ease;
	}

	h2:hover {
		font-size: 96px;
		top:16px;
		left: 49%;
		color: #f00;
	}

	h1, h2 {
		user-select: none;
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
