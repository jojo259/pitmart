import { json } from "@sveltejs/kit";
import { collections } from "$lib/modules/database";
import type { User } from "$lib/types";

export async function GET({url, cookies, locals}) {
	if (!collections.users) {
		console.log("users collection not defined");
		return json({success: false});
	}

	if (!("user" in locals)) {
		console.log("user not authenticated");
		return json({success: false});
	}

	let localsUser: any = locals.user;
	if (!localsUser) {
		console.log("user not authenticated");
		return json({success: false});
	}

	let doc: any = await collections.users.findOne({"discordId": localsUser.discordId});

	if (doc) {
		delete doc._id; // mongodb object id messes with stringification
	}

	return json({success: true, user: doc});
}
