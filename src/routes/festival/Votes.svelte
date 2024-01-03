<script>
    import { onMount } from "svelte";
    import {getCurrentVote } from '$lib/api'


    let currentVote = null;
	onMount(() => {
		const interval = setInterval(() => {
            getCurrentVote().then(vote => currentVote = vote);
		}, 1000);
		//If a function is returned from onMount, it will be called when the component is unmounted.
		return () => clearInterval(interval);
	});
</script>
<div class="list">
<h1>Votes</h1>
    {#if currentVote == null}
        Waiting for voting
    {:else}
            {#each currentVote.options as opt, idx}
                <div class="option">
                    {opt} | {currentVote.effectiveVotes[idx]} votes ({Object.entries(currentVote.votes).filter(([k,v]) => v == idx).map(([k,v]) => k).join(",")})
                </div>
            {/each}
    {/if}
</div>
<style>
    .list {
        display: flex;
        flex-direction: column;
        gap: 1em;
        overflow-y: auto;
        width: 100%;
    }
    .option {
        display: flex;
        padding :1em;
        background-color: #DDDDDD;
        border-radius: 1em;
        width: 100%;
        color: black;
    }
</style>