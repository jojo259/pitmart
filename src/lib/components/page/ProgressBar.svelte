<script lang="ts">
	export let barColor: string;
	export let percentage: number;
</script>

<progress value={percentage} max=100 title="{percentage}%" style:accent-color={barColor}></progress>

<style>
	progress {
		height: 16px;
		margin: 0px;
		padding: 0px;
	}
</style>
