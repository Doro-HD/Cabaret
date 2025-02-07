import { generateSessionToken, createSession, setSessionTokenCookie } from "$lib/server/auth/index";
import { github } from "$lib/server/auth/oauthProviders/github";

import type { RequestEvent } from "@sveltejs/kit";
import type { OAuth2Tokens } from "arctic";
import { createUserViaGithub, findUserByGithubId } from "$lib/server/db/schemas/user/userHandler";

export async function GET(event: RequestEvent): Promise<Response> {
	const code = event.url.searchParams.get("code");
	const state = event.url.searchParams.get("state");
	const storedState = event.cookies.get("github_oauth_state") ?? null;
	if (code === null || state === null || storedState === null) {
		return new Response(null, {
			status: 400
		});
	}
	if (state !== storedState) {
		return new Response(null, {
			status: 400
		});
	}

	let tokens: OAuth2Tokens;
	try {
		tokens = await github.validateAuthorizationCode(code);
	} catch {
		// Invalid code or client credentials
		return new Response(null, {
			status: 400
		});
	}
	const githubUserResponse = await fetch("https://api.github.com/user", {
		headers: {
			Authorization: `Bearer ${tokens.accessToken()}`
		}
	});
	const githubUser = await githubUserResponse.json();
	const githubUserId = githubUser.id;
	const githubUsername = githubUser.login;

	// TODO: Replace this with your own DB query.
	const existingUserResult = await findUserByGithubId(githubUserId);
    if (!existingUserResult.success) {
        return new Response(null, {
            status: 500
        });
    }

	if (existingUserResult.user) {
		const sessionToken = generateSessionToken();
		const sessionResult = await createSession(sessionToken, existingUserResult.user.id);
		if (!sessionResult.success) {
			return new Response(null, {
				status: 500
			});
		}
		setSessionTokenCookie(event.cookies, sessionToken, sessionResult.session.expiresAt);

		return new Response(null, {
			status: 302,
			headers: {
				Location: "/"
			}
		});
	}

	const userResult = await createUserViaGithub(githubUserId, githubUsername);
    if (!userResult.success) {
        return new Response(null, {
            status: 500
        });
    }

	const sessionToken = generateSessionToken();
	const sessionResult = await createSession(sessionToken, userResult.user.id);
	if (!sessionResult.success) {
		return new Response(null, {
			status: 500
		});
	}
	setSessionTokenCookie(event.cookies, sessionToken, sessionResult.session.expiresAt);

	return new Response(null, {
		status: 302,
		headers: {
			Location: "/"
		}
	});
}