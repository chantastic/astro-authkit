import type {APIRoute} from 'astro';

export const GET: APIRoute = async ({cookies, redirect}) => {
	const cookie = cookies.get('wos-session');

	if (!cookie?.value) {
		return redirect('/sign-in');
	}

	return new Response(`Signing out…`);
};

export const prerender = false;
