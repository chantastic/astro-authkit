import type {APIRoute} from 'astro';
import {WorkOS} from '@workos-inc/node';

export const GET: APIRoute = async () => {
	const workos = new WorkOS(import.meta.env.WORKOS_API_KEY);

	const authorizationURL =
		workos.userManagement.getAuthorizationUrl({
			provider: 'authkit',
			redirectUri: 'http://localhost:4321/auth/callback',
			clientId: import.meta.env.WORKOS_CLIENT_ID,
		});

	return new Response(authorizationURL);
};

export const prerender = false;
