import { error } from '@sveltejs/kit';
import { getAllQuestion } from '$lib/api';

/** @type {import('./$types').PageLoad} */
export async function load({ params }) {
    try {
        return {
            dump: await getAllQuestion(),
            id: params.id
        }
    } catch (e) {
        console.log(e);
        throw error(404, 'Not found');
    }
}