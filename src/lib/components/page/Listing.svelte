<script lang="ts">
	import type { Listing } from "$lib/types";
	import MinecraftItemCard from "$lib/components/minecraft/MinecraftItemCard.svelte";
	import Window from "$lib/components/page/Window.svelte";

	export let listing: Listing;
</script>

<Window title={listing.message}>
	<MinecraftItemCard item={listing.item} show={true} useAbsolutePosition={false} />
	Price: {listing.pricePer} {listing.currency} {listing.verified ? "VERIFIED" : "unverified"}
</Window>

<style>

</style>
