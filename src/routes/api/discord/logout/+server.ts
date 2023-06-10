export async function GET({url, cookies}) {
  console.log('redirect to / with cleared cookies');

	cookies.set("discord_refresh_token", "deleted", {
		path: "/",
		maxAge: 1
	});

	cookies.set("discord_access_token", "deleted", {
		path: "/",
		maxAge: 1
	});

	return new Response("redirect", {
		status: 302,
		headers: { Location: "/" }
	});
}