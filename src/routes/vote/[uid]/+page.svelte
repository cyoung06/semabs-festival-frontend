<script>
    import UserUI from '../UserUI.svelte';

    export let data;
</script>

<UserUI username={data.uid}/>
