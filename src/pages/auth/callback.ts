import type {APIRoute} from 'astro';
import {WorkOS} from '@workos-inc/node';

export const GET: APIRoute = async ({
	redirect,
	request,
	cookies,
}) => {
	const code = new URL(request.url).searchParams.get('code');

	if (!code) {
		return new Response('No code found in the URL', {
			status: 400,
		});
	}

	const workos = new WorkOS(import.meta.env.WORKOS_API_KEY);

	try {
		const session =
			await workos.userManagement.authenticateWithCode({
				code,
				clientId: import.meta.env.WORKOS_CLIENT_ID,
				session: {
					sealSession: true,
					cookiePassword: import.meta.env
						.WORKOS_COOKIE_PASSWORD,
				},
			});

		cookies.set('wos-session', String(session.sealedSession), {
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
			secure: true,
		});

		return new Response(String(session.sealedSession));
	} catch (error) {
		return redirect('/sign-in');
	}
};

export const prerender = false;
