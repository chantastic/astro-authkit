import {defineMiddleware} from 'astro:middleware';

export const onRequest = defineMiddleware((context, next) => {
	const {pathname} = new URL(context.request.url);

	if (pathname.startsWith('/dashboard')) {
		console.log(`Middleware running for ${pathname}.`);
	}

	return next();
});
