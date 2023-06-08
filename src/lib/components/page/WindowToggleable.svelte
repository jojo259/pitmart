<script>
	import Window from "./Window.svelte";
	import CenteredDiv from "./CenteredDiv.svelte";

	export let title;

	let visible = true;

	function toggleWindow() {
		visible = !visible;
	}
</script>

<CenteredDiv>
	<Window title="">
		<div on:click={toggleWindow} style:cursor=pointer>
			<span>{title}{visible ? "" : " (click to expand)"}</span>
		</div>
		<div class="{visible ? "visible" : "hidden"}">
			<slot />
		</div>
	</Window>
</CenteredDiv>

<style>
	span {
		user-select: none;
	}

	.visible {
		display: default;
	}

	.hidden {
		display: none;
	}
</style>
