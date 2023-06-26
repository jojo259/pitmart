import { json } from "@sveltejs/kit";
import type { Player } from "$lib/types";
import { apiGetPlayer } from "$lib/serverutil";
import { collections } from "$lib/modules/database";
import type { Listing } from "$lib/types";

export async function GET(req) {
	if (!collections.listings) {
		console.log("listings collection not defined");
		return json({success: false, message: "database not initialized"});
	}

	let listingDocs: any = await collections.listings.find({}).toArray();
	if (!listingDocs) {
		return json({success: false});
	}

	let listings: Listing[] = listingDocs;

	return json({success: true, listings: listings});
}
