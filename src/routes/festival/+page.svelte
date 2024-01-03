<script>
    import FestivalController from './FestivalController.svelte';

    export let data;

    import { browser } from '$app/environment';

    if (browser && localStorage.getItem("unlock") != "true") location.href="/";
</script>

<FestivalController data={data}/>
