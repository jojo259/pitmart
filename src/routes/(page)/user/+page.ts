import type { User } from "$lib/types";

export async function load({ fetch }) {
	let data: any = await fetch(`/api/user/data`);
	let user: User | null = null;
	$: {
		if (data.success) {
			user = await data.json().user;
		}
		else {
			console.log("failed to get user data for user page");
		}
	}
	return user;
}
