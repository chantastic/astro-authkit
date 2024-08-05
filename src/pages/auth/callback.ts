import type {APIRoute} from 'astro';

export const GET: APIRoute = async ({request}) => {
	const code = new URL(request.url).searchParams.get('code');

	if (!code) {
		return new Response('No code found in the URL', {
			status: 400,
		});
	}

	return new Response(
		`Auth callback reached with code: ${code}`
	);
};

export const prerender = false;
