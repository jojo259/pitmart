import { discordClientId, discordClientSecret, hostDomain } from "$env/static/private";

export async function GET({url, cookies}) {

	const returnCode = url.searchParams.get("code");

	if (!returnCode) {
		console.error("no return code");
		return new Response(null, {
			status: 500
		});
	}

	const options = {
		method: 'POST',
		body: new URLSearchParams()
	};

	options.body.append("client_id", discordClientId);
	options.body.append("client_secret", discordClientSecret);
	options.body.append("code", returnCode);
	options.body.append("grant_type", "authorization_code");
	options.body.append("redirect_uri", hostDomain + "/api/discord/callback");

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
		secure: true,
		sameSite: "strict",
		maxAge: 60 * 60 * 24 * 7 // because i did not figure out refreshing yet...
	});
	cookies.set("discord_refresh_token", response.refresh_token, {
		path: "/",
		httpOnly: true,
		secure: true,
		sameSite: "strict",
		maxAge: 60 * 60 * 24 * 7
	});

	return new Response("redirect", {
		status: 302,
		headers: { Location: "/" }
	});
}
