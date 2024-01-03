import { error } from '@sveltejs/kit';
import { getMedias } from '$lib/api';

/** @type {import('./$types').PageLoad} */
export async function load({ params }) {
    try {
        return {
            media: await getMedias()
        }
    } catch (e) {
        console.log(e);
        throw error(404, 'Not found');
    }
}