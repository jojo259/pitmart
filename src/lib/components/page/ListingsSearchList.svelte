<script lang="ts">
	import ListingComponent from "$lib/components/page/Listing.svelte";
	import type { Listing } from "$lib/types";

	export let queryParams = "";

	$: listingsPromise = (async function getListings(): Promise<Listing[] | null> {
		let req = await fetch(`/api/listing/search?${queryParams}`);
		let resp = await req.json();
		if ("listings" in resp) {
			let listings: Listing[] = resp.listings;
			return listings;
		}
		return null;
	})();
</script>

{#await listingsPromise}
	listings {queryParams}
{:then listings}
	{#if listings}
		{#each listings as listing}
			<div>
				<ListingComponent listing={listing} />
			</div>
		{/each}
	{/if}
{:catch error}
	{error}
{/await}

<style>
</style>
