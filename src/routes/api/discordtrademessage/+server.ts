import { ingestTradingMessage } from "$lib/modules/tradingmessageingestor.ts";
import { json } from "@sveltejs/kit";
import { discordTradeMessageKeys } from '$env/static/private';

export async function POST({request}) {
	let authorizationHeader = request.headers.get("Authorization");
	if (authorizationHeader) {
		if (!discordTradeMessageKeys.split(",").includes(authorizationHeader)) {
			return json({success: false, "message": "Authorization failed"});
		}
	}

	const body = await request.json();

	ingestTradingMessage(body.message, body.author_id)

	return json({success: true, "message": "Successfully received"});
}
