<script>
    let pwd = '';
    String.prototype.hashCode = function() {
    var hash = 0,
        i, chr;
    if (this.length === 0) return hash;
    for (i = 0; i < this.length; i++) {
        chr = this.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
    }

// lovesemicolon!!
    const unlock = () => {
        console.log(pwd);
        if (pwd.hashCode() == 168029663) {
            localStorage.setItem("unlock", true);
        } else {
            localStorage.clear();
        }
        location.reload();
    }
    let unlocked = localStorage.getItem("unlock") == "true";
</script>

<div class="wrapper">
    <h1>방송제 메뉴 </h1>
    <div class="list">
        {#if unlocked}
            <a href="/setup">Setup</a>
        {/if}
        <a href="/vote">Voting</a>
        {#if unlocked}
            <a href="/festival">Festival Mgr</a>
            <a href="/grader">Grading</a>
        {/if}
        
    </div>
    <span>
        unlock other menus
        <input type="password" placeholder="admin pwd" bind:value={pwd}>
        <button on:click={unlock}>Unlock</button>
    </span>
</div>

<style>
    a {
        padding: 1em;
        display: flex;
        background-color: aqua;
        border-radius: 1.5em;
        border-color: black;
        border-width: 1px;
        border-style: solid;
        box-sizing: border-box;
    }
    .list {
        display: flex;
        gap: 1em;
        flex-wrap: wrap;
    }
    .wrapper {
        padding: 1em;
        display: flex;
        flex-direction: column;
        gap: 1em;
    }
</style>