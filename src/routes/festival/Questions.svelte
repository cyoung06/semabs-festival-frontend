<script>
    import { onMount } from "svelte";
    import {
        getAllQuestion
    } from '$lib/api';


    let dump = [];
	onMount(() => {
		const interval = setInterval(() => {
            getAllQuestion().then(vote => dump = vote);
		}, 1000);
		//If a function is returned from onMount, it will be called when the component is unmounted.
		return () => clearInterval(interval);
	});
</script>

<div class="wrapper">
    <h1>질문</h1>
    {#each dump as question}
        <span>
            <a href="/grader/{question.id}">{question.question}</a>
            <span class={question.end == null ? "progress" : question.gradingComp ? "graded" : "grading"}>{question.end == null ? "진행중" : question.gradingComp ? "채점됨" : "채점중"}</span>
        </span>
    {/each}
</div>

<style>
    .progress {
        color: orange;
    }
    .grading {
        color: yellow;
    }
    .graded {
        color: greenyellow;
    }
    .wrapper {
        display: flex;
        flex-direction: column;
        overflow-x: scroll;
        overflow-y: auto;

    }
    a {
        color: white;
    }
</style>