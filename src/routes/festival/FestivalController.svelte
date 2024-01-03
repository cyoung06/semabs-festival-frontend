<script>
    import MediaPlayer from "../setup/[id]/MediaPlayer.svelte";
    import Leaderboard from "./Leaderboard.svelte";
    import Votes from "./Votes.svelte";
    import {getMediaDownloadUrl, pause, play, stop, seek, getPlaybackStatus, beginEvent, nextMediaForce} from '$lib/api'
    import { onMount } from "svelte";
    import Questions from "./Questions.svelte";

    let maxWidth, localPaused = true, localVideo, localDuration, localCurrentTime, localCurrentBar;
    let remotePaused = true, remoteVideo, remoteDuration, remoteCurrentTime = 0, remoteCurrentBar;

    let manuallyPaused = false;

    export let data;
    let selected;

    let nextUp, currentPlaying;
    let isPlayingReally;
	onMount(() => {
		const interval = setInterval(() => {
            getPlaybackStatus().then(status => {
                nextUp = status.next;
                currentPlaying = status.media;
                remotePaused = !status.playing;
                isPlayingReally = status.playing;
                if (Math.abs(remoteCurrentTime - (status.time/1000.0)) > 0.07) {
                    remoteCurrentTime = status.time / 1000.0;
                }
                if (manuallyPaused == false) {
                    localPaused = remotePaused;
                    localCurrentTime = remoteCurrentTime;
                }
            });
		}, 1000);
		//If a function is returned from onMount, it will be called when the component is unmounted.
		return () => clearInterval(interval);
	});
    

    const format = (value) => {
        let val = isNaN(value) ? 0 : value;

        const second = val % 60;
        const min = Math.floor(val / 60);
        return `${("0"+min).slice(-2)}:${("00"+(Math.round(second * 100) / 100).toFixed(2)).slice(-5)}`
    }
    $: {
        localCurrentTime;
        if (localCurrentBar != undefined && !localPaused) {
            localCurrentBar.scrollIntoView({inline: "center"});
        }
    }


    function mouseMove(e) {
		if (e.type !== 'touchmove' && !(e.buttons & 1)) return; // mouse not down

        const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
        const { left, right } = this.getBoundingClientRect();
        localCurrentTime = (localDuration * (clientX - left)) / (right - left);
        manuallyPaused = true;
        if (localCurrentTime > localDuration) localCurrentTime = localDuration;
    }

    const triggerPlaybackifneeded = () => {
        if (remoteVideo != null) {
            
            if (isPlayingReally) remoteVideo.play();
            else remoteVideo.pause();
        }
        if (!manuallyPaused && localVideo != null) {
            if (isPlayingReally) localVideo.play();
            else localVideo.pause();
        }
    }
</script>
<svelte:window on:mousemove={triggerPlaybackifneeded}/>
<div class="bigwrapper">
    <div class="mediaArea">
        {#if currentPlaying != null}
        <span><button on:click={async () => {
            if (!confirm("Are you sure to end event???")) return;
            if (!confirm("Are you really sure? to reset everything (including leaderboard) and end this event??")) return;
            if (!confirm("Are you triple sure??? This can't be reverted")) return;
            await stop();
            alert("Requested to stop");
        }}>Stop and reset everything</button></span>
        <div class="splitview">
            <div class="video" bind:offsetWidth={maxWidth}>
                <h1>Local</h1>
                <MediaPlayer  muted={true} src={getMediaDownloadUrl(currentPlaying.id)} bind:paused={localPaused} bind:video={localVideo} bind:currentTime={localCurrentTime} bind:duration={localDuration} maxW={maxWidth}/>
            </div>
            <div class="video">
                <h1>Remote</h1>
                <MediaPlayer muted={true} pausable={false} src={getMediaDownloadUrl(currentPlaying.id)} bind:paused={remotePaused} bind:video={remoteVideo} bind:currentTime={remoteCurrentTime} bind:duration={remoteDuration} maxW={maxWidth}/>
            </div>
        </div>
        <div class="playbackControl">
            <button on:click={() => {manuallyPaused = false;}}>Sync local to remote</button>
            {#if localPaused}
                <button on:click={() => {manuallyPaused = true; localVideo.play();}}>Play</button>
            {:else}
                <button on:click={() => {manuallyPaused=true; localVideo.pause(); }}>Stop</button>
            {/if}
            {format(localCurrentTime)}/{format(localDuration)}
            <button disabled={!remotePaused || !localPaused} on:click={async () => {remoteCurrentTime = localCurrentTime; await seek(localCurrentTime * 1000)}}>Sync &gt;</button> 
            {#if remotePaused}
                <button on:click={async () => {localCurrentTime = remoteCurrentTime; remoteVideo.play(); localVideo.play(); await play();manuallyPaused=false;}}>Play</button>
            {:else}
                <button on:click={async () => {remoteVideo.pause(); await pause(); }}>Stop</button>
            {/if}
            {format(remoteCurrentTime)}/{format(remoteDuration)}
            
        </div>
        <div class="playbackControl">
            Next media: {nextUp == null ? "none" : `${nextUp.name} (${nextUp.id})`}
            <span>
                Force set next...
                <select bind:value={selected}>
                    {#each data.media as media}
                        <option value={media.id}>{media.name}</option>
                    {/each}
                </select>
            
                <button on:click={() => nextMediaForce(selected)}>Go!</button>
            </span>
        </div>
        
        <div class="wrapper-wrapper">
            <div class="timeline-wrapper">
                <div class="timeline" style:width="{localDuration*100}px">
                    <div class="topbar" on:mousemove={mouseMove} on:mousedown={mouseMove} on:touchmove|preventDefault={mouseMove}>
                        {#each Array(Math.floor(!(localDuration > 0) ? 1 : localDuration+1)).keys() as sec}
                            <span class="timemarker" style:left={sec * 100+5}px>{format(sec)}</span>
                        {/each}
                    </div>
                    <div class="eventarea">
                        {#each currentPlaying.events as event}
                            <div class="eventblock" style:left="{event.timestamp / 10}px">
                                {event.data.type}
                            </div>
                        {/each}
                    </div>
                </div>
                {#each Array(Math.floor(!(localDuration > 0) ? 1 : localDuration+1)).keys() as sec}
                    <div class="bar" style:left="{sec*100}px"></div>
                {/each}
                <div class="movingbar1" style:left="{localCurrentTime*100}px" bind:this={localCurrentBar}></div>
                <div class="movingbar2" style:left="{remoteCurrentTime*100}px" bind:this={remoteCurrentBar}></div>
            </div>
        </div>
        {:else}
            <span>
                Begin event using...
                <select bind:value={selected}>
                    {#each data.media as media}
                        <option value={media.id}>{media.name}</option>
                    {/each}
                </select>
            
                <button on:click={() => beginEvent(selected)}>Go!</button>
            </span>
        {/if}
    </div>
    <div class="rightArea">
        <div class="leaderboard">
            <Leaderboard/>
        </div>
        <div class="vote">
            <Votes />
        </div>
        <div class="questions">
            <Questions />
        </div>
    </div>
</div>


<style>
    .bigwrapper {
        width: 100%;
        height: 100%;
        display: flex;
        background-color: black;
        color: white;
        flex-direction: row;
    }
    .mediaArea {
        display: flex;
        flex-grow: 1;
        flex-direction: column;
        overflow: scroll;
        gap: 1em;
        padding: 1em;
    }
    .splitview {
        display: flex;
        flex-direction: row;
        align-items: stretch;
        justify-content: stretch;
        flex-grow: 1;
    }
    .rightArea {
        display: flex;
        max-width: 400px;
        flex-grow: 1;
        flex-direction: column;
    }
    .leaderboard {
        display: flex;
        flex-grow: 1;
        padding: 1em;
        min-height: 0;
    }
    .vote {
        display: flex;
        padding: 1em;
        min-height: 0;
    }
    .questions {
        display: flex;
        padding: 1em;
        min-height: 0;
    }
    .rightArea > div {
        border-color: white;
        border-width: 1px;
        border-style: solid;
    }


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
        height: 8em;
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
    .movingbar1 {
        position: absolute;
        height: 8em;
        width: 3px;
        background-color: blue;
        top: 0;
    }
    .movingbar2 {
        position: absolute;
        height: 8em;
        width: 3px;
        background-color: green;
        top: 0;
    }
</style>