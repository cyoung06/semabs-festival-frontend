<script>
    
    import {getCurrentVote, getPoints, getCurrentQuestion, getTime} from '$lib/api'
    import { onMount } from 'svelte';
    import Vote from './Vote.svelte';
    import Question from './Question.svelte';
    
    export let username;
    let currentVote;
    let currentQuestion;
    // let points = {};
    // let times = {};
    // let leaderboard = []
	onMount(() => {
		const interval = setInterval(() => {
            getCurrentVote().then(vote => currentVote = vote);
            getCurrentQuestion().then(question => currentQuestion = question);
            // getPoints().then(point => points= point);
            // getTime().then(time => times = time)
		}, 1000);
		//If a function is returned from onMount, it will be called when the component is unmounted.
		return () => clearInterval(interval);
	});
    // $: {
    //     leaderboard = Object.entries(points).sort(([k1,v1],[k2,v2]) => {v2-v1});
    // }
    // const formatDuration = (time) => {
    //     const sec = time % 60;
    //     const min = Math.floor((time % 3600) / 60);
    //     const hr = Math.floor(time / 3600);
    //     let build = "";
    //     if (hr != 0) {
    //         build = hr +"h ";
    //     }
    //     if (hr != 0 || min != 0) {
    //         build += ("0"+min).slice(-2) + "m ";
    //     }
    //     build += ("0"+sec).slice(-2)+"s";
        
    //     return build;
    // }
    // const place = [1,2,2,3,3,4,4,4,5,5,5,5,6,6,6,7,7,8,8,9];
    // const show = place.map((v, i, a) => i == 0 || a[i-1] != a[i] ? true: false);

</script>

<div class="wrapper">
    <h1>{username}</h1>
    <!-- <span>팀의 점수: {points[username]}</span> -->
    {#if currentVote == null && currentQuestion == null}
        투표/주관식 질문 기다리는 중...
    {:else}
        {#if currentVote != null}
            <Vote username={ username} bind:vote={currentVote}/>
        {/if}
        {#if currentQuestion != null}
            <Question username={username} bind:question={currentQuestion}/>
        {/if}
    {/if }
    <!-- <hr/>
    <h1>리더보드</h1>
    {#each leaderboard as [k,v], idx}
        <span class={`lbentry grade-${place[idx]} place-${idx}`} >
            <span class="place">{show[idx] ? place[idx]+"등급" : ""}</span> 
            <span class="time">{idx+1}.&nbsp;</span> 
            {k}: {v}점&nbsp;<span class="time">{formatDuration(times[k])}</span> 
        </span>
    {/each} -->
</div>

<style>
    /* .grade-1 {
        color: yellow;
        text-shadow: #FC0 1px 0 10px;
    }
    .grade-2 {
        color: yellow;
        text-shadow: #FC0 1px 0 10px;
    }
    .grade-9 {
        color: gold;
        font-weight: 900;
        text-shadow: #FC0 1px 0 10px;
    }
    .time {
        color: gray;
    }
    .place {
        width: 3em;
    }
    .lbentry {
        display: flex;
        width: 100%;
        justify-content: center;
    } */
    .wrapper {
        background-color: black;
        width: 100%;
        height: 100vh;
        color: white;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: start;
        overflow-y: auto;
    }
    /* hr {
        margin-left: 0;
        margin-right: 0;
        align-self: stretch;
    } */
</style>