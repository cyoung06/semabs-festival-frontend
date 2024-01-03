<script>
    import {addUser, getUsers} from '$lib/api'
    import UserUI from './UserUI.svelte';

    export let data;
    let selected, username = '';

    const createUser =async  () => {
        await addUser(username);
        data.users = await getUsers()
        data = data;
        selected = username;
        username = ''
    }

    let begin = undefined;
</script>

{#if begin === undefined}
    <div class="wrapper">
        <div class="form">
            Choose user
            <select bind:value={selected}>
                {#each data.users as user}
                    <option value={user}>{user}</option>
                {/each}
            </select>
            <button disabled={selected == undefined} on:click={() => begin = selected}>Join</button>
            <hr/>
            <input type="text" bind:value={username} placeholder="type username to create" />
            <button disabled={username == ''} on:click={createUser}>Create</button>
        </div>
    </div>
{:else}
    <UserUI username={begin}/>
{/if}

<style>
    .wrapper {
        background-color: black;
        width: 100%;
        height: 100%;
        color: white;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
    hr {
        margin-left: 0;
        margin-right: 0;
        align-self: stretch;
    }
    .form {
        display: flex;
        width: 20em;
        gap: 1em;
        background-color: gray;
        padding: 1em;
        border-radius: 1em;
        flex-direction: column;
    }
</style>