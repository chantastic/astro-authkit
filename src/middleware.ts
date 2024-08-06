import type {APIContext, MiddlewareNext} from 'astro';
import {defineMiddleware} from 'astro:middleware';

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

	const response = await next();
	return response;
}
