import { redirect } from "@sveltejs/kit";

export function load({ url }) {
	throw redirect(302, `/player/${url.searchParams.get("tag")}`);
}
