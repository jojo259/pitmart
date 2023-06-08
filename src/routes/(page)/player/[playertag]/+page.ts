export async function load({ params, fetch }) {
	let player = await fetch(`/api/player/${params.playertag}`);
	$: player = await player.json();
	return player;
}
