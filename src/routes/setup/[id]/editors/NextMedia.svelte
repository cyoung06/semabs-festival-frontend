<script>
    import {getMedias} from '$lib/api'

    export let data;

    let medias = getMedias();
</script>

Next Media 

{#await medias}
Loading...
{:then mediaList}
<select bind:value={data.mediaId}>
    {#each mediaList as media}
        <option value={media.id}>{media.name}</option>
    {/each}
</select>
{/await}