<script>
    export let data;
</script>

<div class="list">
Options
{#each data.options as option, idx}
    <div class="option">
        {idx+1}.
        <input type="text" bind:value={option}/>
        <button on:click={() => {data.options.splice(idx, 1); data = data;}}>x</button>
    </div>
{/each}

<button on:click={() => {data.options.push("value"); data = data;}}>Append</button>
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