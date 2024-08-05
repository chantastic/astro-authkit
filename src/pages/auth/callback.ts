import type {APIRoute} from 'astro';

export const GET: APIRoute = async () => {
	return new Response(`Auth callback reached.`);
};

export const prerender = false;
