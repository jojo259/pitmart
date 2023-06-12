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
</script>

{#if user}
	<CenteredDiv>
		<div>
			<h1>{user.username}</h1>
			<h2>Verified UUIDs</h2>
			{#if user.verifiedHypixelUuids}
				{#each user.verifiedHypixelUuids as uuid}
					<div>
						{uuid}
					</div>
				{/each}
			{/if}
		</div>
	</CenteredDiv>
{/if}

<style>
	div {
		display: block;
	}
</style>
