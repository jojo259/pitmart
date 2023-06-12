<script lang="ts">
	export let user: any;

	let logoutVisible = false;

	function onMouseEnter() {
		logoutVisible = true;
	}

	function onMouseLeave() {
		logoutVisible = false;
	}
</script>

<header>
	<div class="container" style:padding="0px" style:padding-left="32px" style:padding-right="10px" style:margin-top="0px" on:mouseenter={onMouseEnter} on:mouseleave={onMouseLeave}>
		<div class="left-side">
			<a class="left-side-elem" href="/">PitMart</a>
		</div>
		<div class="right-side">
			{#if user}
				<div class="right-side-elem">
					{#if logoutVisible}
						<div>
							<a href="/api/discord/logout">Log out</a>
						</div>
					{:else}
						<span>Logged in as {user.username}</span>
					{/if}
				</div>
				<a class="right-side-elem" style:margin-top="8px" href="/user">
					<img width=44px src="https://cdn.discordapp.com/avatars/{user.discordId}/{user.avatarId}.png">
				</a>
			{:else}
				<a class="right-side-elem" href="/api/discord/auth">Log in with Discord</a>
			{/if}
		</div>
	</div>
</header>

<style>
	header {
		height: 64px;
		background-color: #282828;
	}

	* {
		font-size: 24px;
	}

	.container {
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 100%;
		padding: 0 16px;
	}

	.left-side, .right-side {
		display: flex;
		align-items: center;
	}

	.left-side-elem {
		margin-right: 24px;
	}

	.right-side-elem {
		margin-left: 24px;
	}

	a {
		text-decoration: none;
	}
</style>
