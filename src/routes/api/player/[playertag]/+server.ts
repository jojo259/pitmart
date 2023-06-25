import { json } from "@sveltejs/kit";
import type { Player } from "$lib/types";
import { apiGetPlayer } from "$lib/serverutil";

export async function GET(req) {
	let tag = req.params.playertag;

	let player: Player | null = await apiGetPlayer(tag);

	if (!player) {
		return json({success: false})
	}

	return json({success: true, player: player});
}
