<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	export let data: any;
	import Window from "$lib/components/page/Window.svelte";
	import WindowToggleable from "$lib/components/page/WindowToggleable.svelte";
	import CenteredDiv from "$lib/components/page/CenteredDiv.svelte";
	import PlayerCard from "$lib/components/page/PlayerCard.svelte";
	import type { User } from "$lib/types";
	
	let user: User;

	$: {
		user = data.user;
	}

	onMount(async () => {
		if (!user) {
			goto("/");
		}
	});

	let tag = "";

	async function handleSubmit(event: Event) {
		event.preventDefault();
		const verifyReq = await fetch("/api/user/verifyhypixel", {
			method: "POST",
			headers: {
				'Accept': 'application/json'
			},
			body: JSON.stringify({tag: tag})
		});
		const verifyResp = await verifyReq.json();
		if (verifyResp.success) {
			location.reload();
		}
	}
</script>

{#if user}
	<CenteredDiv>
		<div>
			<h1>{user.username} - {user.displayName}</h1>
			<h2>Verified UUIDs:</h2>
			{#if user.verifiedHypixelUuids}
				{#each user.verifiedHypixelUuids as uuid}
					<div style:display="inline-block" style:margin="16px">
						<PlayerCard uuid={uuid} />
					</div>
				{/each}
			{/if}
			<h2>Verify Hypixel account:</h2>
			<form on:submit={handleSubmit}>
				<label>
					<input bind:value={tag} type="text" id="tag" name="tag" placeholder="Username/UUID" />
				</label>
				<button type="submit">Verify</button>
			</form>
		</div>
	</CenteredDiv>
{/if}

<style>
	div {
		display: block;
	}

	h1 {
		font-size: 48px;
	}
</style>
