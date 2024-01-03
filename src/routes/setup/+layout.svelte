<script>
    import MediaList from "./MediaList.svelte";
    
    import { browser } from '$app/environment';

    if (browser && localStorage.getItem("unlock") != "true") location.href="/";
</script>

<div class="wrapper">
    <MediaList/>
    <slot/>
</div>

<style>
    .wrapper {
        display: flex;
        flex-direction: row;
        height: 100%;
        flex-grow: 1;
        background-color: #000000;
        color: white;
    }
</style>