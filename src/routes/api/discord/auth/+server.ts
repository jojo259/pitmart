import { discordClientId, hostDomain } from '$env/static/private';
import { json } from "@sveltejs/kit";

let callbackUrl = hostDomain + "/api/discord/callback";

const discordEndpoint = `https://discord.com/api/oauth2/authorize?client_id=${discordClientId}&redirect_uri=${encodeURIComponent(hostDomain)}%2Fapi%2Fdiscord%2Fcallback&response_type=code&scope=identify%20guilds`;

export async function GET() {
	return new Response(null, {
		headers: { Location: discordEndpoint },
		status: 302
	});
}
