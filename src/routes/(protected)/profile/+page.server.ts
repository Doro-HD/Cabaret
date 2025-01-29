import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from '../../(auth)/sign-in/$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.session) {
		redirect(307, '/sign-in');
	}
};
