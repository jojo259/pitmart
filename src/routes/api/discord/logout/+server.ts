export async function GET({url, cookies}) {
	console.log('redirect to / with cleared cookies');

	cookies.set("jwt", "null", {
		path: "/",
		maxAge: 0
	});

	return new Response("redirect", {
		status: 302,
		headers: { Location: "/reload" }
	});
}