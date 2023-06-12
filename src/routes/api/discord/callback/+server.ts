import { discordClientId, discordClientSecret, hostDomain, jwtSecret } from "$env/static/private";
import { collections } from "$lib/modules/database";
import type { User } from "$lib/types";
import jsonwebtoken from 'jsonwebtoken';

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

	let identifyReq = await fetch(`https://discord.com/api/users/@me`, {
		headers: {'Authorization': `Bearer ${response.access_token}`}
	});
	let identifyResp = await identifyReq.json();

	if (identifyResp.id) {
		let user: User = {
			discordId: identifyResp.id,
			username: identifyResp.username,
			displayName: identifyResp.global_name,
			avatarId: identifyResp.avatar,
			discordAccessToken: response.access_token,
			discordRefreshToken: response.refresh_token,
		}

		if (collections.users) {
			await collections.users.updateOne({ "discordId": user.discordId }, {$set: user}, {upsert: true});
		
			let jwtToken = jsonwebtoken.sign({
				exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7),
				discordId: identifyResp.id,
			}, jwtSecret);

			cookies.set("jwt", jwtToken, {
				path: "/",
				httpOnly: true,
				secure: true,
				sameSite: "strict",
				maxAge: 60 * 60 * 24 * 7
			});

			return new Response("redirect", {
				status: 302,
				headers: { Location: "/reload" }
			});
		}
		else {
			console.log("user collection does not exist");
		}
	}
	else {
		console.log(`discord oauth failure: ${identifyResp}`);
	}

	return new Response(null, {
		status: 500
	});
}
