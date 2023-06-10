<script>
	import { goto } from '$app/navigation';
	function forceReload() { // idk works
		goto("/");
		setTimeout(function(){location.reload();}, 200);
	}
	if (typeof window !== 'undefined') {
		forceReload()
	}
</script>

<main>
	<button on:click={forceReload}>CLICK THIS IF YOU DO NOT AUTOMATICALLY GET REDIRECTED</button>
</main>
