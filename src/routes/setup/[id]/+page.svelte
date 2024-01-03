<script>
    import {getMediaDownloadUrl ,addEvent, updateEvent, removeEvent, deleteMedia, renameMedia, swapMedia} from '$lib/api'
    import MediaPlayer from './MediaPlayer.svelte';
    import EventEditor from './EventEditor.svelte';

    export let data;
    let paused, video;
    let currentTime;
    let duration;

    let selected = undefined;
    let currentBar;

    const format = (value) => {
        let val = isNaN(value) ? 0 : value;

        const min = Math.floor(val / 60);
        let subsecond = Math.floor(val%1 * 100) / 100;
        const second = Math.floor(val % 60);
        if (fps != null) {
            subsecond = "00"+("0"+Math.floor(subsecond * fps)).slice(-2)
        }
        return `${("0"+min).slice(-2)}:${("0"+second).slice(-2)}.${(subsecond+"0000").slice(2,4)}`
    }


    function mouseMove(e) {
		if (e.type !== 'touchmove' && !(e.buttons & 1)) return; // mouse not down

        const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
        const { left, right } = this.getBoundingClientRect();
        currentTime = (duration * (clientX - left)) / (right - left);
        if (currentTime > duration) currentTime = duration;
    }

    const newEvent = async () => {
        const event = await addEvent(data.media.id, {id: "un", timestamp: currentTime*1000, data: {type: "dummy"}})

        data.media.events.push(
            event
        )

        data = data;
        selected = event;
    }
    $: {
        currentTime;
        if (currentBar != undefined && !paused)
            currentBar.scrollIntoView({ inline: "center"});
    }

    let warning = [];
    $: {
        const sorted = [...data.media.events].sort((a,b) => (a.timestamp - b.timestamp));
        console.log(sorted);
        warning = [];
        let nextMediaSet = false;
        let lastEventCount = -1;
        let anyKindOfQuestion = false;
        let question = false;
        for (const event of sorted) {
            if (event.data.type === "voteBegin") {
                if (anyKindOfQuestion)warning.push(event.timestamp+": Can not have two votes or questions going at the same time");
                lastEventCount = event.data.options.length;
                anyKindOfQuestion = true;
            }
            if (event.data.type === "questionBegin") {
                if (anyKindOfQuestion)warning.push(event.timestamp+": Can not have two votes or questions going at the same time");
                anyKindOfQuestion = true;
                question = true;
            }
            if (event.data.type === "questionEnd") {
                if (!question) warning.push(event.timestamp + ": Question did not begin");
                anyKindOfQuestion = false;
                question = false;
            }
            if (event.data.type === "voteEnd") {
                if (lastEventCount == -1) {
                    warning.push(event.timestamp+": Vote did not begin")
                    continue
                }
                if (event.data.points.length !== lastEventCount+1)  {
                    warning.push(event.timestamp+": Length of Points per option should be equal to #options + 1 ")
                }
                if (event.data.nextMedia !== null && event.data.nextMedia.length !== lastEventCount+1)  {
                    warning.push(event.timestamp+": Length of next media should be equal to #options + 1 ")
                } else if (event.data.nextMedia) {
                    nextMediaSet = true;
                }

                if (event.data.nextMedia !== null) {
                    for (const media of event.data.nextMedia) {
                        if (media === null) warning.push(event.timestamp +": Null can not be set as Next media option")
                    }
                }

                lastEventCount = -1;
                anyKindOfQuestion = false;
            }
            if (event.data.type === "nextMedia") {
                nextMediaSet = true;
            }
        }
        if (lastEventCount != -1) warning.push("A vote that begun in current media also must end in current media");
        if (!nextMediaSet) warning.push("Next media is not set")
    }
    let maxWidth;
    let fps;
    const keydown = (e) => {
        if (fps != null) {
            if (e.key === "ArrowRight") {
                currentTime += 1/fps;
            } else if (e.key === "ArrowLeft") {
                currentTime -= Math.max(0, 1/fps);
            }
        }
    }
    let swapProgress = null;
    let input;
    const swapVideo = (e) => {
        input.click();
    }


    const fileChanged = async (e) => {
        const file = e.target.files[0]
        const mediaPromise = swapMedia(file, data.media.id, (loaded, total) => {
            swapProgress = [loaded, total]
        });
        swapProgress = [0, 100]
        data.media = await mediaPromise;
        swapProgress = null;
        e.target.value = "";
        data = data;
    }

    function formatBytes(bytes, decimals = 2) {
        if (!+bytes) return '0 Bytes'

        const k = 1024
        const dm = decimals < 0 ? 0 : decimals
        const sizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB']

        const i = Math.floor(Math.log(bytes) / Math.log(k))

        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
    }
</script>

<svelte:window on:keydown={keydown}/>
<input type="file" hidden bind:this={input} on:change={fileChanged}/>
<div class="wrapper">
    <div class="mediasettings">
        <input type="text" bind:value={data.media.name} placeholder="mediaName"/>
        <button on:click={async () => {
            await renameMedia(data.media.id, data.media.name);
            alert("Renamed :)");
        }}>Rename</button>
        {#if swapProgress == null}
            <button on:click={swapVideo}>Swap Video</button>
        {:else}
            <div class="uploadProgress">
                <span>{formatBytes(swapProgress[0])} / {formatBytes(swapProgress[1])}</span>
                <progress value={swapProgress[0] / swapProgress[1]}/>
            </div>
        {/if}
        <div class="spacer"/>
        ID: {data.media.id}
        <div class="spacer"/>
        <button style="align-self: center" on:click={async () => {
            if (!confirm("Are you sure to delete???")) return;
            if (!confirm("Are you really sure? to delete this media??")) return;
            if (!confirm("Are you triple sure??? This can't be reverted")) return;
            await deleteMedia(data.media.id)
            location.href = "/setup"
    
        }}>Delete this media</button>
    </div>
    <div class="video" bind:offsetWidth={maxWidth}>
        <MediaPlayer muted={false} src={getMediaDownloadUrl(data.media.id)} bind:paused bind:video bind:currentTime bind:duration maxW={maxWidth} bind:fps/>
    </div>
    <div class="playbackControl">
        {#if paused}
            <button on:click={() => {video.play()}}>Play</button>
        {:else}
            <button on:click={() => {video.pause()}}>Stop</button>
        {/if}
        {format(currentTime)}/{format(duration)} / FPS: {fps}
    </div>
    {#each warning as warn}
    <div class="warning">
            <span>{warn}</span>
    </div>
    {/each}
    <div class="wrapper-wrapper">
        <div class="timeline-wrapper">
            <div class="timeline" style:width="{duration*100}px">
                <div class="topbar" on:mousemove={mouseMove} on:mousedown={mouseMove} on:touchmove|preventDefault={mouseMove}>
                    {#each Array(Math.floor(!(duration > 0) ? 1 : duration+1)).keys() as sec}
                        <span class="timemarker" style:left={sec * 100+5}px>{format(sec)}</span>
                    {/each}
                </div>
                <div class="eventarea">
                    {#each data.media.events as event}
                        <div class="eventblock" class:eventselected={selected?.id==event?.id} style:left="{event.timestamp / 10}px" on:click={() => {
                            if (selected !== event) {
                                selected = event
                                currentTime = selected.timestamp / 1000;
                            } else {
                                selected = undefined;
                            }
                        }}>
                            {event.data.type}
                        </div>
                    {/each}
                </div>
            </div>
            {#each Array(Math.floor(!(duration > 0) ? 1 : duration+1)).keys() as sec}
                <div class="bar" style:left="{sec*100}px"></div>
            {/each}
            <div class="movingbar" style:left="{currentTime*100}px" bind:this={currentBar}></div>
        </div>
    </div>
      
    <button on:click={newEvent}>New Event</button>
</div>

{#if selected !== undefined}
    <EventEditor mediaId={data.media.id} format={format} bind:event={selected} on:save={() => data =data} on:delete={async (ev) => {
        selected = undefined;
        await removeEvent(data.media.id, ev.detail)
        data.media.events = data.media.events.filter(a => a != ev.detail);
        data = data;
    }} bind:currentTime/>
{/if}
<style>

    .video {
        flex-direction: column;
        display: flex;
        align-items: center;
        justify-content: last;
        flex: 1;
    }
    .wrapper {
        display: flex;
        padding: 1em;
        height: 100%;
        flex-direction: column;
        flex: 1 1 100%;
        width: 0;
        gap: 0.5em;
    }
    .eventselected {
        background-color: green !important;
    }
    .playbackControl {
        display: flex;
        justify-content: center;
        gap: 1em;
    }
    .timeline {
        display: flex;
        flex-direction: column;
        height: 8em;
        background-color: white;
        position: relative;
        -webkit-user-select: none; 
        user-select: none;
    }
    .eventarea {
        position: relative;
        display: flex;
        flex-grow: 1;
    }
    .eventblock {
        width: 1em;
        height: 100%;
        padding-top:  0.3em;
        padding-bottom:  0.3em;
        position: absolute;
        border-radius: 0.3em;
        background-color: #555555;
        writing-mode: vertical-lr;
        text-orientation: sideways;
        -webkit-user-select: none; 
        user-select: none;
        cursor: grab
    }
    .wrapper-wrapper {
        display: flex;
        flex-direction: row;
        overflow-x: scroll;
        overflow-y: hidden;
        background-color: #333333;
    }
    .warning {
        padding: 1em;
        background-color: lightcoral;
        border-radius: 1em;
        display: flex;
        flex-direction: column;
    }
    .timemarker {
        -webkit-user-select: none; 
        user-select: none;
        position: absolute;
        cursor:default;
    }
    .timeline-wrapper {
        display: flex;
        flex-direction: column;
        position: relative;
        overflow-x: scroll;
        overflow-y: hidden;
        height: 9em;
        min-width: 0;
    }
    .topbar {
        height: 1.3em;
        background-color: gray;
        position: relative;
    }
    .bar {
        position: absolute;
        height: 8em;
        width: 2px;
        background-color: #333333;
        top: 0;
    }
    .movingbar {
        position: absolute;
        height: 8em;
        width: 3px;
        background-color: blue;
        top: 0;
    }
    .mediasettings  {
        display: flex;
        flex-direction: row;
    }
    .spacer {
        flex: 1;
    }


	progress {
		display: flex;
		height: 10px;
        width: 100%;
	}
    .uploadProgress {
        display: flex;
        flex-direction: column;
        align-items: stretch;

        display: flex;
        padding: 0.5em;
        background-color: lightgreen;
        color: black;
        border-radius: 0.5em;
    }
</style>