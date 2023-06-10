export async function load({ locals }) {
	if ("user" in locals) {
		return locals.user;
	}
}
