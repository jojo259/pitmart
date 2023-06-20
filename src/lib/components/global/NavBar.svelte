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
			<a class="left-side-elem pitmart-logo" href="/"><span class="pitmart-logo-1">Pit</span><span class="pitmart-logo-2">Mart</span><span class="pitmart-logo-3">.net</span></a><span class="listings-button">Listings</span>
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

	.listings-button {
        background: linear-gradient(42deg, rgba(18,14,82,1) 0%, rgba(60,112,123,1) 100%); 
        margin-left: 20px;
        border-radius: 5px;
        transition-duration: 0.2s;
        cursor: pointer;
        padding: 8px 18px;
        box-shadow: 0px 0px #ad55a940;
        font-size: 18px;
        filter: saturate(0.3);
        font-weight: bold;
    }

	.listings-button:hover {
		filter: saturate(1);
		box-shadow: 4px 4px #aaa;
	}
</style>
