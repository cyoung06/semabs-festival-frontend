
<script>
    import {answer as answerAPI} from '$lib/api';
    export let question;
    export let username;

    let answer;
    let saved = 0;
    const submit = async (answer) => {
        saved ++;
        setTimeout(() => {saved --}, 1000);
        answerAPI(username, answer);
    }

    let thing = -1;
    const change = (answer) => {
        console.log("wat")
        clearTimeout(thing);
        thing = setTimeout(() => {submit(answer)}, 500);
    }
    $: change(answer);
</script>

<h1 class="question">{question.question}</h1>
<span class="inputthing">

<input type="text" placeholder="정답을 여기 입력" width="300px" bind:value={answer}/>
</span>
<span class="saved" style:opacity={saved > 0 ? "100%" : "0%"}>정답 저장됨 :D</span>


<style>
    .saved {
        transition: all 0.2s;
        color: greenyellow;
    }
    .question {
        align-items: center;
        justify-content: center;
        display: flex;
    }
    .inputthing {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: stretch;
        width: 100%;
    }
    .inputthing > input {
        font-size: large;
        width: 100%;
        max-width: 300px;
        padding: 0.5em;
        border-radius: 0.5em;
    }
    .list {
        display: flex;
        flex-direction: column;
        gap: 1em;
        align-items: stretch;
        width: 300px;
        padding: 1em;
        overflow-y: auto;
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