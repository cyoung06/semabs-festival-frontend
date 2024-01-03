<script>
    import DummyEditor from "./editors/DummyEditor.svelte";
    import EndVote from "./editors/EndVote.svelte";
    import NextMedia from "./editors/NextMedia.svelte";
    import NotFound from "./editors/NotFound.svelte";
    import SceneEditor from "./editors/SceneEditor.svelte";
    import StartVote from "./editors/StartVote.svelte";

    import {updateEvent} from '$lib/api';

	import { createEventDispatcher } from 'svelte';
    import PauseEditor from "./editors/PauseEditor.svelte";
    import StartQuestion from "./editors/StartQuestion.svelte";

	const dispatch = createEventDispatcher();
    
    export let mediaId;
    export let event;
    export let currentTime;
    export let format;

    let selected;
    $: selected = event?.data?.type;



    const editors = {
        "dummy": DummyEditor,
        "nextMedia": NextMedia,
        "switchScene": SceneEditor,
        "voteBegin": StartVote,
        "voteEnd": EndVote,
        "pause": PauseEditor,
        "questionBegin": StartQuestion,
        "questionEnd": DummyEditor
    }
    const datas = {
        "dummy": {type: "dummy"},
        "voteBegin": {type: "voteBegin", options: []},
        "voteEnd": {type: "voteEnd", points: [], nextMedia: null},
        "switchScene": {type: "switchScene", sceneId: "default"},
        "nextMedia": {type: "nextMedia", mediaId: "mediaID"},
        "pause": {type: "pause"},
        "questionBegin": {type: "questionBegin", question: "Who made this?", incorrectPoints: -10, correctPoints: 10},
        "questionEnd": {type: "questionEnd"}
    }
    const getEditor = (type) => {
        if (editors[type] === undefined) return NotFound;
        return editors[type];
    }
</script>

<div class="wrapper">
    <span class="Title">Event Editor</span>
    <hr/>
    <span>Id: {event.id}</span>
    <span>Time: {format(event.timestamp/1000)}</span>
    <hr/>
    Event Type: 
    <select value={event.data.type} on:change={(e) => {event.data = JSON.parse(JSON.stringify(datas[e.target.value])); event = event;}}>
        <option value="voteBegin">Start Vote</option>
        <option value="voteEnd">End Vote</option>
        <option value="questionBegin">Start question</option>
        <option value="questionEnd">End question</option>
        <option value="switchScene">Switch Scene</option>
        <option value="nextMedia">Set Next Media</option>
        <option value="pause">Pause</option>
        <option value="dummy">Nothing</option>
    </select>
    <hr/>
    <svelte:component this={getEditor(selected)} bind:data={event.data}/>
    <hr/>
    <button on:click={async () => {event.timestamp = currentTime*1000; await updateEvent(mediaId, event); event = event; dispatch('save');}}>MOVE2CURSOR</button>
    <button on:click={async () => {await updateEvent(mediaId, event); event = event; dispatch('save');}}>SAVE</button>
    <div class="spacer"></div>
    <button on:click={() => {
        if (!confirm("Are you sure to delete?")) return;

        dispatch('delete', event);
    }}>Delete</button>
</div>

<style> 
.spacer {
    display: flex;
    flex: 1;
    min-height: 5em;
}
    .wrapper {
        display: flex;
        width: 20em;
        margin: 1em;
        background-color: darkgray;
        flex-direction: column;
        padding: 1em;
        gap: 0.5em;
        overflow-y: auto;
    }
    hr {
        margin-left: 0;
        margin-right: 0;
        align-self: stretch;
    }
</style>