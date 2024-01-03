<script>
    export let data;
</script>

<div class="list">
Question
<input type="text" bind:value={data.question}/>
Correct Points
<input type="number" bind:value={data.correctPoints}/>
Incorrect Points
<input type="number" bind:value={data.incorrectPoints}/>
</div>

<style>
    .list {
        display: flex;
        flex-direction: column;
        gap: 0.5em;
    }
    .option {
        display: flex;
        flex-direction: row;
    }
    .option input {
        display: flex;
        flex-grow: 1;
    }
    /* .option button {
        border: none;
    } */
</style>