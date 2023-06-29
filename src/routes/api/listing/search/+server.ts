import { json } from "@sveltejs/kit";
import type { Player } from "$lib/types";
import { apiGetPlayer } from "$lib/serverutil";
import { collections } from "$lib/modules/database";
import type { Listing } from "$lib/types";

export async function GET({url}) {
	if (!collections.listings) {
		console.log("listings collection not defined");
		return json({success: false, message: "database not initialized"});
	}

	let dbQueryAnds: any = [];

	/*

		QUERY PARAMS FORMAT:
			query parameter key: the document field to check
			query parameter value: operation char followed by the operation value
			operation char potential values:
				s: string, checks for equality
				e: number, checks for equality
				g: number, checks for greater than
				l: number, checks for less than
			operation value: the value that is checked against
			enchants are a special case where if the query parameter key starts with "enchant." then:
				the query's enchant is the remaining part of the query parameter key
				it searches for the specified enchant with the specified operation and level
			examples:
				item.id=e346 checks for item.id being equal to 346
				item.lives=g5 checks for item.lives being greater than 5
				item.maxLives=l10 checks for item.maxLives being less than 10
				currency=svile checks for the listing's currency being equal to the string "vile"
				enchant.combo_xp=e2 checks for combo_xp enchant at level 2

	*/

	for (const [key, value] of url.searchParams.entries()) {
		console.log(`${key}: ${value}`);
		let operation = "$eq";
		let operationChar = value.charAt(0);
		let operationVal: string | number = value.slice(1);
		if (["e", "s"].includes(operationChar)) {
			operation = "$eq";
		}
		else if (operationChar == "g") {
			operation = "$gt";
		}
		else if (operationChar == "l") {
			operation = "$lt";
		}
		else {
			console.log(`listing search param unknown last char: ${operationChar}`);
			return json({success: false, message: "unknown query param operation char"});
		}
		if (["e", "g", "l"].includes(operationChar)) {
			operationVal = parseInt(operationVal);
		}
		if (key.startsWith("enchant.")) {
			let enchantKey = key.slice(8);
			dbQueryAnds.push({
				"item.enchants": {
					$elemMatch: {
						key: enchantKey,
						level: {
							[operation]: operationVal
						}
					}
				}
			});
			continue;
		}
		dbQueryAnds.push({[key]: {[operation]: operationVal}})
	}

	let dbQuery = {};
	if (dbQueryAnds.length > 0) {
		dbQuery = {$and: dbQueryAnds};
	}

	console.log(`db query: ${JSON.stringify(dbQuery)}`)

	let listingDocs: any = await collections.listings.find(dbQuery).toArray();
	if (!listingDocs) {
		return json({success: true, listings: []});
	}

	let listings: Listing[] = listingDocs;

	return json({success: true, listings: listings});
}
