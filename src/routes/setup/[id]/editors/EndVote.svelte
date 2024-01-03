<script>
    import {getMedias} from '$lib/api'


    export let data;

    let medias = getMedias();

</script>

<div class="list">
Points for option
{#each data.points as option, idx}
    <div class="option">
        {idx == 0 ? "D" : idx}.
        <input type="number" bind:value={option}/>
        <button on:click={() => {data.points.splice(idx, 1); data = data;}}>x</button>
    </div>
{/each}

<button on:click={() => {data.points.push(1); data = data;}}>Append</button>
<hr/>

<div class="option">
    <input type="checkbox" name="choosenextmedia" checked={data.nextMedia !== null} on:change={(e) => {
        if (e.target.checked) data.nextMedia = [];
        else data.nextMedia = null
        data = data;
    }}/>
    <label for="choosenextmedia">Choose Next Media based on outcome</label>
</div>

{#if data.nextMedia !== null}
{#each data.nextMedia as option, idx}
    <div class="option">
        {idx == 0 ? "D" : idx}.
        {#await medias}
            Loading...
        {:then mediaList}
        <select bind:value={option}>
            <option value="ignored">Do not count</option>
            {#each mediaList as media}
                <option value={media.id}>{media.name}</option>
            {/each}
        </select>
        {/await}
        <button on:click={() => {data.nextMedia.splice(idx, 1); data = data;}}>x</button>
    </div>
{/each}
<button on:click={() => {data.nextMedia.push("ignored"); data = data;}}>Append</button>

{/if}
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
    .option select {
        display: flex;
        flex-grow: 1;
    }
    /* .option button {
        border: none;
    } */
    hr {
        margin-left: 0;
        margin-right: 0;
        align-self: stretch;
    }
</style>