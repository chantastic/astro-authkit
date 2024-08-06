import type {APIRoute} from 'astro';

export const GET: APIRoute = async () => {
	return new Response('Signing out…');
};

export const prerender = false;
