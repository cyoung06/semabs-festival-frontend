
<script>
    import {voteFor} from '$lib/api';
    export let vote;
    export let username;

    const choose = async (idx) => {
        await voteFor(username, idx);
    }
</script>

<div class="list">
    {#each vote.options as option, idx}
        <div class="option" on:click={() => choose(idx)} class:selected={idx == vote.votes[username]}>{option}</div>
    {/each}
</div>

<style>
    .list {
        display: flex;
        flex-direction: column;
        gap: 1em;
        align-items: stretch;
        width: 300px;
        padding: 1em;
        overflow-y: auto;
        height: 300em;
    }
    @media (max-width < 300px) {
        .list {
            width: 100%
        }
    }
    .option {
        display: flex;
        background-color: #CCCCCC;
        padding: 1em;
        border-radius: 1em;
        justify-content: center;
        color: black;
        width: 100%;
        cursor: pointer;
        user-select: none;
        -webkit-user-select: none;
    }
    .option:hover {
        background-color: #DDDDDD;
    }
    .option:active {
        background-color: #AAAAAA;
    }
    .selected {
        background-color: aqua !important;
    }
</style>