<script lang="ts">
	export let data: any;
	import Header from "$lib/components/Header.svelte";
	import "../../global.css";
</script>

<Header user={data}/>

<slot />
