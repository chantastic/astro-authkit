import type {APIRoute} from 'astro';
import {WorkOS} from '@workos-inc/node';

export const GET: APIRoute = async ({cookies, redirect}) => {
	const cookie = cookies.get('wos-session');

	if (!cookie?.value) {
		return redirect('/sign-in');
	}

	const workos = new WorkOS(import.meta.env.WORKOS_API_KEY, {
		clientId: import.meta.env.WORKOS_CLIENT_ID,
	});

	const logoutUrl =
		await workos.userManagement.getLogoutUrlFromSessionCookie({
			sessionData: cookie.value,
			cookiePassword: import.meta.env.WORKOS_COOKIE_PASSWORD,
		});

	cookies.delete('wos-session', {
		path: '/',
		httpOnly: true,
		sameSite: 'lax',
		secure: true,
	});

	return redirect(logoutUrl);
};

export const prerender = false;
