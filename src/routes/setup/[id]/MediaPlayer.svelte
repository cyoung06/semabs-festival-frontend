<script>
    export let currentTime, duration, paused = true;
    export let src;

    let videoWidth, videoHeight;

    export let video;
    export let maxW;

    export let pausable = true;

    export let muted = false;
    let bruh;
    



    function mouseMove(e) {
        if (!pausable) return;
		if (e.type !== 'touchmove' && !(e.buttons & 1)) return; // mouse not down

        const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
        const { left, right } = this.getBoundingClientRect();
        currentTime = (duration * (clientX - left)) / (right - left);
    }

    export let fps;
        let last_media_time, last_frame_num;
        let fps_rounder = [];
        let frame_not_seeked = true;
        // Part 2 (with some modifications):
        function ticker(useless, metadata) {
            var media_time_diff = Math.abs(metadata.mediaTime - last_media_time);
            var frame_num_diff = Math.abs(metadata.presentedFrames - last_frame_num);
            var diff = media_time_diff / frame_num_diff;
            if (
                diff &&
                diff < 1 &&
                frame_not_seeked &&
                fps_rounder.length < 50 &&
                video.playbackRate === 1 &&
                document.hasFocus()
            ) {
                fps_rounder.push(diff);
                fps = Math.round(1 / get_fps_average());
            }
            frame_not_seeked = true;
            last_media_time = metadata.mediaTime;
            last_frame_num = metadata.presentedFrames;
            video.requestVideoFrameCallback(ticker);
        }
        // Part 4:
        const onSeek = () => {
            fps_rounder = [];
                frame_not_seeked = false;
        }

    $: {
        fps_rounder = [];
        if (video != null && src != null) {
            console.log("Video change")
            video.requestVideoFrameCallback(ticker);
            video.removeEventListener("seeked", onSeek)
            video.addEventListener("seeked", onSeek);
        }
    }
    function get_fps_average() {
        return fps_rounder.reduce((a, b) => a + b) / fps_rounder.length;
    }
</script>

<div class="videoportion">
    <div class="videowrapper" bind:offsetHeight={bruh} style:width="{Math.min(videoWidth / videoHeight * bruh, maxW - 100)}px" style:height="{Math.min(bruh, videoHeight / videoWidth * (maxW - 100))}px">
        
    </div>
    <video height={Math.min(bruh, videoHeight / videoWidth * (maxW - 100))} bind:videoWidth bind:videoHeight src="{src}"
         bind:currentTime bind:duration bind:paused bind:this={video} muted={muted}
         on:click={pausable ?  () => {if (paused) video.play(); else video.pause()} : undefined}>
            <track kind="captions"/>
    </video>
    <progress value={currentTime / duration || 0} class="progress" style:top="{Math.min(bruh, videoHeight / videoWidth * (maxW - 100))}px"on:mousedown={mouseMove} on:mousemove={mouseMove} on:touchmove|preventDefault={mouseMove}/>
</div>

<style>
    video {
        object-fit: fill;
        position: absolute;
    }

    .videowrapper {
        display: flex;
        flex-grow: 1;
        position: relative;
        /* background-color: darkgray; */
    }
    .videoportion {
        display: flex;
        flex-direction: column;
        position: relative;
        flex-grow: 1;
    }
	progress {
		display: flex;
		height: 10px;
        position: absolute;
        left: 0;
        width: 100%;
		-webkit-appearance: none;
		appearance: none;
	}
</style>