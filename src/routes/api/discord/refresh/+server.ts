/*
unused for now but works
*/

import { discordClientId, discordClientSecret } from "$env/static/private";

export async function GET({url, cookies}) {

	const discord_refresh_token = cookies.get("discord_refresh_token");
	if (!discord_refresh_token) {
		console.log("no discord refresh token found");
		return new Response(null, {
			status: 500
		});
	}

	const options = {
		method: "POST",
		body: new URLSearchParams(),
	};

	options.body.append("client_id", discordClientId);
	options.body.append("client_secret", discordClientSecret);
	options.body.append("refresh_token", discord_refresh_token);
	options.body.append("grant_type", "refresh_token");

	const request = await fetch(`https://discord.com/api/oauth2/token`, options);
	const response = await request.json();

	if (response.error) {
		console.log("discord api error");
		return new Response(null, {
			status: 500
		});
	}

	cookies.set("discord_access_token", response.access_token, {
		path: "/",
		httpOnly: true,
		sameSite: "strict",
		maxAge: 60 * 60 * 24 * 7
	});
	cookies.set("discord_refresh_token", response.refresh_token, {
		path: "/",
		httpOnly: true,
		sameSite: "strict",
		maxAge: 60 * 60 * 24 * 7
	});

	return new Response("redirect", {
		status: 302,
		headers: { Location: "/" }
	});
}
