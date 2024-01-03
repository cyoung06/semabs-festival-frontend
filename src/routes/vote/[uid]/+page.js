import { error } from '@sveltejs/kit';
import { getUsers, addUser } from '$lib/api';

/** @type {import('./$types').PageLoad} */
export async function load({ params }) {
    let users = await getUsers();
    if (!users.includes(params.uid)) {
        await addUser(params.uid);
    }

    try {
        return {
            users: await getUsers(),
            uid: params.uid
        }
    } catch (e) {
        console.log(e);
        throw error(404, 'Not found');
    }
}