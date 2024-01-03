<script>
    import {getAllQuestion} from '$lib/api';
    import { onMount } from 'svelte';

    let questions = [];
	onMount(() => {
		const interval = setInterval(() => {
            getAllQuestion().then(vote => questions = vote);
		}, 1000);
		//If a function is returned from onMount, it will be called when the component is unmounted.
		return () => clearInterval(interval);
	});

    import { browser } from '$app/environment';

    if (browser && localStorage.getItem("unlock") != "true") location.href="/";
    
</script>

<div class="wrapper">
    <h1>채점하기</h1>
    <hr/>
    <div class="questions">
        {#each questions as question}
            <a href="/grader/{question.id}">{new Date(question.start * 1000)} / {question.question}</a>
        {/each}
    </div>
</div>

<style>
    .questions {
        display: flex;
        flex-direction: column;
        gap: 0.5em;
    }
    .wrapper {
        background-color: black;
        color: white;
        display: flex;
        width: 100%;
        height: 100%;
        padding: 1em;
        flex-direction: column;
    }
    hr {
        margin-left: 0;
        margin-right: 0;
        align-self: stretch;
    }
    a {
        color: white;
    }
</style>