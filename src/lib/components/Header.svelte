<script lang="ts">
	import CenteredDiv from "$lib/components/page/CenteredDiv.svelte";

	export let user: any;

	import { goto } from "$app/navigation";

	let tag = "";

	function handleSubmit(event: Event) {
		event.preventDefault();
		goto(`/player/${tag}`);
	}

	let logoutVisible = false;

	function onMouseEnter() {
		logoutVisible = true;
	}

	function onMouseLeave() {
		logoutVisible = false;
	}
</script>

<div style:text-align="right" style:vertical-align="middle" on:mouseenter={onMouseEnter} on:mouseleave={onMouseLeave}>
	{#if user.username}
		{#if logoutVisible}
			<a href="/api/discord/logout">Log out</a>
		{:else}
			<span style:vertical-align="middle">Logged in as {user.username}</span>
		{/if}
		<img style:vertical-align="middle" width=32px src="https://cdn.discordapp.com/avatars/{user.id}/{user.avatar}.png">
	{:else}
		<a href="/api/discord/auth">Log in with Discord</a>
	{/if}
</div>

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
		top:40px;
		left: 53%;
		transform:rotate(30deg);
		transition: all .5s ease;
	}

	h2:hover {
		font-size: 96px;
		top:-24px;
		left: 48%;
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
