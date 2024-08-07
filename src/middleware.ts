import type {APIContext, MiddlewareNext} from 'astro';
import {defineMiddleware} from 'astro:middleware';
import {WorkOS, type SessionCookieData} from '@workos-inc/node';

export const onRequest = defineMiddleware((context, next) => {
	const {pathname} = new URL(context.request.url);

	if (pathname.startsWith('/dashboard')) {
		return withAuth(context, next);
	}

	return next();
});

async function withAuth(
	context: APIContext,
	next: MiddlewareNext
) {
	console.log(`withAuth Middleware running.`);

	const cookie = context.cookies.get('wos-session');

	if (!cookie?.value) {
		return context.redirect('/sign-in');
	}

	const workos = new WorkOS(import.meta.env.WORKOS_API_KEY, {
		clientId: import.meta.env.WORKOS_CLIENT_ID,
	});

	const autenticationResponse =
		await workos.userManagement.authenticateWithSessionCookie({
			sessionData: cookie.value,
			cookiePassword: import.meta.env.WORKOS_COOKIE_PASSWORD,
		});

	if (
		!autenticationResponse.authenticated &&
		autenticationResponse.reason !== 'invalid_jwt'
	) {
		return context.redirect('/sign-in');
	}

	const refreshResponse =
		await workos.userManagement.refreshAndSealSessionData({
			sessionData: cookie.value,
			cookiePassword: import.meta.env.WORKOS_COOKIE_PASSWORD,
		});

	if (!refreshResponse.authenticated) {
		context.cookies.delete('wos-session', {
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
			secure: true,
		});
		return context.redirect('/sign-in');
	}

	context.cookies.set(
		'wos-session',
		String(refreshResponse.sealedSession),
		{
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
			secure: true,
		}
	);

	const {user} =
		((await workos.userManagement.getSessionFromCookie({
			sessionData: cookie.value,
			cookiePassword: import.meta.env.WORKOS_COOKIE_PASSWORD,
		})) ?? {firstName: 'Guest'}) as SessionCookieData;

	context.locals.user = user;

	const response = await next();
	return response;
}
