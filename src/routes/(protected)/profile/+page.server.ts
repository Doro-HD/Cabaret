import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.session) {
		redirect(303, '/sign-in');
	}

	redirect(303, '/profile/account');
};
