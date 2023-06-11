<script lang="ts">
	export let data: any;
	import Header from "$lib/components/global/Header.svelte";
	import "../../global.css";

	$: user = data.user;
</script>

<Header user={user}/>

<slot />
