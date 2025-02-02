import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { authenticateUser, type User } from '$lib/users/auth';

export const prerender = false;

export const load: PageServerLoad = async ({ locals }) => {
  if (locals.user) {
    throw redirect(302, '/private');
  }
};

export const actions: Actions = {
  default: async ({ request, cookies }) => {
    const data = await request.formData();
    const username = data.get('username');
    const pin = data.get('pin');
    if (typeof username !== 'string' || typeof pin !== 'string') {
      return fail(400, { error: 'Invalid input' });
    }
    const user: User | undefined = authenticateUser(username, pin);
    if (!user) {
      return fail(400, { error: 'Invalid credentials' });
    }
    cookies.set('session', JSON.stringify(user), { path: '/', httpOnly: true });
    throw redirect(302, '/private');
  }
};
