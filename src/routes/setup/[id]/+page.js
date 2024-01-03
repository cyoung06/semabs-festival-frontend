import { error } from '@sveltejs/kit';
import { getMedia } from '$lib/api';

/** @type {import('./$types').PageLoad} */
export async function load({ params }) {
    try {
        return {
            media: await getMedia(params.id)
        }
    } catch (e) {
        console.log(e);
        throw error(404, 'Not found');
    }
}