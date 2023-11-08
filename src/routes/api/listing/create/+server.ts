import { json } from "@sveltejs/kit";
import { collections } from "$lib/modules/database";
import type { Player, Item, Listing } from "$lib/types";
import { Currency } from "$lib/types";
import * as mongoDb from "mongodb";
import { getSavedUuid, apiGetPlayer } from "$lib/serverutil";
import { sendDiscordMessage } from "$lib/modules/discordmessagesender";

export async function POST({request, locals}) {
	if (!collections.listings) {
		console.log("listings collection undefined");
		return json({success: false, message: "Database not initialized"});
	}

	if (!("user" in locals)) {
		console.log("user not authenticated");
		return json({success: false, message: "User not authenticated"});
	}

	let user: any = locals.user;
	if (!user) {
		console.log("user not authenticated");
		return json({success: false, message: "User not authenticated"});
	}

	let body = await request.json();
	let formFields = body.formFields;

	let listingVerified = false;
	let player = await apiGetPlayer(formFields.tag);

	if (!player) {
		console.log(`player not found from tag: ${formFields.tag}`);
		return json({success: false, message: "Player not found"});
	}

	if (!user.verifiedHypixelUuids.includes(player.uuid)) {
		console.log(`uuid is not verified to user: ${player.uuid}`);
		return json({success: false, message: "Player not verified to user"});
	}

	let allInventories = player.inventories.inventoryMain.concat(player.inventories.inventoryEnderChest, player.inventories.inventoryStash, player.inventories.inventorySpireStash, player.inventories.inventoryArmor, player.inventories.inventoryMysticWellItem, player.inventories.inventoryMysticWellPants);
	if (allInventories.map(item => JSON.stringify(item)).includes(JSON.stringify(body.listingItem))) { // technically this is not ok because JSON doesn't guarantee the order of keys
		listingVerified = true;
	}

	let listingPrice = convertToNumber(formFields.pricePer);

	if (listingPrice === null) {
		console.log(`price per failed to convert to number: ${formFields.pricePer}`);
		return json({success: false, message: "Price per is not a valid number"});
	}

	if (!Object.values(Currency).includes(formFields.currency)) {
		console.log(`invalid currency: ${formFields.currency}`);
		return json({success: false, message: "Price per is not a valid number"});
	}

	let listing: Listing = {
		discordId: user.discordId,
		owner: player.uuid,
		pricePer: listingPrice,
		currency: formFields.currency,
		message: formFields.message,
		buying: false,
		ownershipVerified: listingVerified,
		item: body.listingItem,
	};

	if (Object.values(listing).some(val => val === null || val === "")) {
		console.log("listing information values missing");
		return json({success: false, message: "Listing information missing values"});
	}

	console.log("inserting listing");

	await collections.listings.insertOne(listing);

	sendDiscordMessage("log-newlistings", "new listing from web:\n```json\n" + JSON.stringify(listing, null, 4) + "```");

	return json({success: true, message: "Successfully created listing"});
}

function convertToNumber(str: string): number | null {
	if (/^[0-9]*\.?[0-9]*$/.test(str)) {
		const num = parseFloat(str);
		return isNaN(num) ? null : num;
	}
	return null;
}
