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

<header class="container-header">
	<div class="container" style:padding="0px" style:width="100%" style:padding-left="32px" style:padding-right="10px" style:margin-top="0px" on:mouseenter={onMouseEnter} on:mouseleave={onMouseLeave}>
		<div class="left-side">
			<a class="left-side-elem pitmart-logo" href="/"><span class="pitmart-logo-1">Pit</span><span class="pitmart-logo-2">Mart</span><span class="pitmart-logo-3">.net</span></a><span class="listings-button">Listings</span>
		</div>
		<div class="right-side">
			{#if user}
				<div class="right-side-elem">
					<span class="align-login-items">
						<div class="logged-in" id="logged-in">
							<b class="pitmart-gold">Logged in</b> – @{user.username}
						<br>
						<div class="logged-in-options dim-2">
							<a href="/user"><span class="dim-3">My profile</span></a> • <a href="api/discord/logout"><span class="dim-3">Log out</span></a>
						</div>
						</div>
						<a href="/user">
							<img class="right-side-elem profile-picture" src="https://cdn.discordapp.com/avatars/{user.discordId}/{user.avatarId}.png" alt="Your profile pic!">
						</a>
					</span>
				</div>
			{:else}
				<div class="right-side-elem">
					<span class="align-login-items">
						<div class="logged-in" id="logged-in">
							<b class="pitmart-gold">Log in with Discord</b>
						</div>
						<a href="/api/discord/auth">
							<img class="right-side-elem profile-picture" src="/who_are_you_lol.png" alt="Your profile pic!">
						</a>
					</span>
				</div>
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

	.right-side {
		text-align: right;
	}

	.align-login-items {
		display: flex;
		align-items: center;
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

	header {
		height: 80px;
		background: #0f0f0f;
		position: fixed;
		width: 100%;
		z-index: 2;
		box-sizing: border-box;
	}

	.container-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 24px;
	}

	.logged-in {
		font-size: 20px;
		margin-right: 12px;
	}

	.logged-in-options {
		font-size: 15px;
	}

	.profile-picture {
		width: 44px;
		border-radius: 22px;
	}

	.pitmart-gold {
		color: #90c2d3;
	}

	.pitmart-logo {
		font-size: 36px;
		font-weight: bold;
	}

	.pitmart-logo-1 {
		color: #59b7c0;
	}

	.pitmart-logo-2 {
		color: #6b86ac;
	}

	.pitmart-logo-3 {
		color: #314159;
	}
</style>
