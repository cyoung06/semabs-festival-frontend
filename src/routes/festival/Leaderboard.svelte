<script>
    import { onMount } from "svelte";
    import {getPoints, incPoint, getTime, resetLeaderboard, deleteUser as delUser, addUser as legitAddUser} from '$lib/api'


    let points = {};
    let times = {};
	onMount(() => {
		const interval = setInterval(() => {
            getPoints().then(pt => points =pt);
            getTime().then(time => times = time);
		}, 1000);
		//If a function is returned from onMount, it will be called when the component is unmounted.
		return () => clearInterval(interval);
	});
    let leaderboard = [];

    $: {
        leaderboard = Object.entries(points).sort(([k1,v1],[k2,v2]) => {v2-v1});
    }

    const addPoint = async (name) => {
        const val = prompt("How much points should add?");
        if (val == null) return
        await incPoint(name, parseInt(val));
    }
    const reset = async () => {
        if (!confirm("Are you sure to reset???")) return;
        if (!confirm("Are you really sure? to reset this leaderboard??")) return;
        if (!confirm("Are you triple sure??? This can't be reverted")) return;
        await resetLeaderboard();
        alert("Reset it :)");
    }
    const deleteUser = async (name) => {
        if (!confirm(`Are you sure to delete ${name}?`)) return;
        await delUser(name);
    }
    const addUser = async () => {
        const username = prompt("username?");
        if (username == null) return;
        await legitAddUser(username);
    }
    const formatDuration = (time) => {
        const sec = time % 60;
        const min = Math.floor((time % 3600) / 60);
        const hr = Math.floor(time / 3600);
        let build = "";
        if (hr != 0) {
            build = hr +"h ";
        }
        if (hr != 0 || min != 0) {
            build += ("0"+min).slice(-2) + "m ";
        }
        build += ("0"+sec).slice(-2)+"s";
        
        return build;
    }

    const place = [1,2,2,3,3,4,4,4,5,5,5,5,6,6,6,7,7,8,8,9];
    const show = place.map((v, i, a) => i == 0 || a[i-1] != a[i] ? true: false);


</script>
<div class="list">
    <h1>Leaderboard <button on:click={reset}>Reset</button></h1>
    {#each leaderboard as [k, v], idx}
        <span class="lbentry">
            <span class="place">{show[idx] ? place[idx]+"등급" : ""}</span> 
            <span class="time">{idx+1}.&nbsp;</span> 
             {k}: {v} points&nbsp;<span class="time">{formatDuration(times[k])}</span> <button on:click={() => addPoint(k)}>Add pt</button><button on:click={() => deleteUser(k)}>Delete</button></span>
    {/each}
    <button on:click={addUser}>Add user</button>
</div>

<style>
    .list {
        display: flex;
        flex-direction: column;
        overflow-y: auto;
        width: 100%;
    }
    .time {
        color: gray;
    }
    .place {
        width: 3em;
    }
    .lbentry {
        display: flex;
    }
</style>