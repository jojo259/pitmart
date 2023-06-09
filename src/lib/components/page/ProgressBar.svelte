<script lang="ts">
	export let barColor: string;
	export let percentage: number;

	let mult = 1.4;

	percentage = Math.min(percentage, 100);
</script>

<div title="{percentage}%" style:background-color="#333" style:width="{mult * 100}px" style:margin="0px">
	<div style:background-color={barColor} style:width="{percentage * mult}px" style:position="relative" style:top="-9px" style:left="-9px"></div> <!-- man i think this works -->
</div>

<style>
	div {
		margin: 8px;
		height: 6px;
		border: 1px solid #999;
		border-radius: 8px;
	}
</style>
