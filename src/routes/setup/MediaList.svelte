<script>
    import {createMedia, getMedias} from '$lib/api.js'

    let mediaList = getMedias()

    let input;
    const createItem = () => {
        input.click();
    } 
    let uploads = {};
    let inc = 0;
    function formatBytes(bytes, decimals = 2) {
        if (!+bytes) return '0 Bytes'

        const k = 1024
        const dm = decimals < 0 ? 0 : decimals
        const sizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB']

        const i = Math.floor(Math.log(bytes) / Math.log(k))

        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
    }


    const fileChanged = async (e) => {
        const name = prompt("미디어 이름?")
        const file = e.target.files[0]
        const id = inc++;
        const mediaPromise = createMedia(file, name, (loaded, total) => {
            uploads[id] = {name: name, progress: [loaded, total]}
        });
        uploads[id] = {name: name, progress: [0, 100]}
        const media = await mediaPromise;
        delete uploads[id]
        e.target.value = "";

        mediaList = getMedias();
    }
</script>

<div class="mediaList">
    <a class="title" href="/setup">미디어</a>
    <hr/>
    {#await mediaList}
        Loading...
    {:then data } 
        {#each data as media}
            <a href="/setup/{media.id}" target="_self" class="me">{media.name}</a>
        {/each}
    {/await}
    {#each Object.entries(uploads) as [k,upload]}
        <div class="upload">
            <span>{upload.name}</span>
            <span>{formatBytes(upload.progress[0])} / {formatBytes(upload.progress[1])}</span>
            <progress value={upload.progress[0] / upload.progress[1]}/>
        </div>
    {/each}
    <div class="spacer"/>

    <button on:click={createItem}>+</button>
    <input type="file" hidden bind:this={input} on:change={fileChanged}/>
</div>

<style>
    .spacer {
        flex: 1;
    }
    a, a:hover, a:focus, a:active {
        text-decoration: none;
        color: inherit;
    }

    .me {
        display: flex;
        padding: 0.5em;
        background-color: darkgray;
        border-radius: 0.5em;
        cursor: pointer;
    }


	progress {
		display: flex;
		height: 10px;
        width: 100%;
	}
    .upload {
        display: flex;
        flex-direction: column;
        align-items: stretch;

        display: flex;
        padding: 0.5em;
        background-color: lightgreen;
        color: black;
        border-radius: 0.5em;
    }

    .title {
        font-size: larger;
        align-items: center;
        justify-content: center;
        display: flex;
    }
    .mediaList {
        display: flex;
        width: 25em;
        background-color: gray;
        margin: 1em;
        padding: 1em;
        align-items: stretch;
        border-radius: 1em;
        flex-direction: column;
        overflow-x: hidden;
        gap: 0.25em;
    }
    hr {
        margin-left: 0;
        margin-right: 0;
        align-self: stretch;
    }
</style>