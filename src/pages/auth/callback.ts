import type {APIRoute} from 'astro';
import {WorkOS} from '@workos-inc/node';

export const GET: APIRoute = async ({request}) => {
	const code = new URL(request.url).searchParams.get('code');

	if (!code) {
		return new Response('No code found in the URL', {
			status: 400,
		});
	}

	const workos = new WorkOS(import.meta.env.WORKOS_API_KEY);

	const session =
		await workos.userManagement.authenticateWithCode({
			code,
			clientId: import.meta.env.WORKOS_CLIENT_ID,
		});

	return new Response(JSON.stringify(session, null, `\t`));
};

export const prerender = false;
