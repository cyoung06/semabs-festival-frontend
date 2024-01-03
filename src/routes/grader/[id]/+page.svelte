<script>
    import {grade, finishGrade, reDoGrade} from '$lib/api';

    import { browser } from '$app/environment';

    if (browser && localStorage.getItem("unlock") != "true") location.href="/";
    
    export let data;

    let question = data.dump.filter(a => a.id === data.id)[0];
    const update = async (team, checked) => {
        await grade(data.id, team, checked);
    }

    const comp = async () => {
        await finishGrade(data.id)
        location.reload();
    }
    const re = async () => {
        await reDoGrade(data.id)
        location.reload();
    }
</script>
<div class="wrapper">
    <a href="/grader">Back</a>
    <h1>{question.question}
        {#if !question.gradingComp}
        <button on:click={comp}>채점 끝</button>
        {:else}
        <button on:click={re}>재채점</button>
        {/if}
    </h1>
    <hr/>
    {#each Object.entries(question.answers) as [team, answer]}
        <span class="answer">
            {#if !question.gradingComp}
                <span>정답? <input type="checkbox" bind:checked={question.grade[team]} on:change={(e) => update(team, e.target.checked)}></span>
            {/if}
            <span class="team">{team}</span>
            <span>:&nbsp;</span>
            <span class="">{answer}</span>
        </span>
    {/each}
</div>


<style>
    .answer {
        display: flex;
    }
    .team {
        display: flex;
        width: 100px;
        justify-content: right;
        align-items: end;
    }
    .wrapper {
        background-color: black;
        width: 100%;
        height: 100%;
        color: white;
        padding: 1em;
        flex-direction: column;
        display: flex;
        gap: 0.5em;
        overflow-y: scroll;
    }
    a {
        color: white;
    }
    hr {
        margin-left: 0;
        margin-right: 0;
        align-self: stretch;
    }
</style>