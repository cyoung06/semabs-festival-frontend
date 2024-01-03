import { error } from '@sveltejs/kit';
import { getUsers } from '$lib/api';

/** @type {import('./$types').PageLoad} */
export async function load({ params }) {
    try {
        return {
            users: await getUsers()
        }
    } catch (e) {
        console.log(e);
        throw error(404, 'Not found');
    }
}