<script>
    export let part;
    export let def;

    let connections = [];

    const populate = (fromPt, name, elem, x, y) => {
        if (def[elem.id].mark) {
            if (def[elem.id].x === x && def[elem.id].y === y) return 0;
            if (def[elem.id].count === undefined) def[elem.id].count = 0; ///
            const id = elem.id+"-dupe-"+(def[elem.id].count++);
            part[id] = {id: id, prev: ["","","","","","","","","","","",""], next: []};

            def[id] = {
                x: x,
                y: y,
                name: def[elem.id].name,
                next: ["","","","","","","","","","","",""],
                prev: ["","","","","","","","","","","",""],
                type: "goback"
            }
            if (fromPt !== null)
                connections.push({from: fromPt, to: {x: x, y: y+25}, name: name})
            return 50;
        }
        if (fromPt !== null)
            connections.push({from: fromPt, to: {x: x, y: y+100}, name: name})
        def[elem.id].x = x;
        def[elem.id].y = y;
        def[elem.id].mark = true;

        let yprime = y;
        let fromY = 100;
        for (const next of elem.next) {
            yprime += populate({x: x+200, y:y+ fromY}, next.name, next.value, x+300, yprime)
            yprime += 10;
            fromY += 20;
        }
        return Math.max(yprime - y, 200);
    }


    let root;
    let pop = false;
    $: {
        let list = Object.values(part)
        list.sort((a,b) => a.prev.length - b.prev.length);
        root = list[0];
        if (!pop) {
            pop = true;
            populate(null, "", root, 0, 0);//

            connections = connections;
            console.log(connections)
        }
    }
    let width, height;
    $: {
        width = Math.max(...connections.map(a => a.to.x));
        height = Math.max(...connections.map(a => a.to.y));
    }
</script>


<div class="wrapper">
    <svg width={width} height={height} class="svg">
        <style>
            .text {
                font: 20px serif;
                fill: white;
            }
        </style>
        {#each connections as conn}
            <line x1={conn.from.x} y1={conn.from.y} x2={conn.to.x} y2={conn.to.y} stroke="white"/>
            <text x={(conn.from.x+conn.to.x)/2} y={(conn.from.y + conn.to.y) / 2} fill="white" text-anchor="middle">{conn.name}</text>
        {/each}
    </svg>
    {#each Object.values(part) as part}
        {#if def[part.id].type === "goback"} 
            <div class="media2" style:left="{def[part.id].x}px" style:top="{def[part.id].y}px">
                Back to {def[part.id].name}
            </div>
        {:else}
            <div class="media" style:left="{def[part.id].x}px" style:top="{def[part.id].y}px">
                <span>{def[part.id].name} <a href="/setup/{part.id}">View</a></span>
                {#each def[part.id].warnings as warning}
                    <span class="warning">{warning}</span>
                {/each}
                <hr/>
                {#each def[part.id].votes as vote}
                    <hr/>
                    {#each vote as opt}
                        <span>{opt.name}: {opt.point}</span>
                    {/each}
                {/each}
                {#each def[part.id].questions as question}
                    <hr/>
                    <span>{question.question}</span>
                    <span>O: {question.correctPoints} / X: {question.incorrectPoints}</span>
                {/each}
            </div>
        {/if}
    {/each}
</div>

<style>
    .svg {
        position: absolute;
        top: 0;
        left: 0;
    }
    a, a:hover, a:focus, a:active {
        text-decoration: none;
        color: inherit;
    }
    .warning {
        color:coral;
    }
    .wrapper {
        display: flex;
        position: relative;
        width: 100%;
        flex-direction: column;
        overflow: scroll;
        flex-grow: 1;
        min-height: 600px;
    }
    .media {
        position: absolute;
        width: 200px;
        height: 200px;
        background-color: gray;
        padding: 1em;
        display: flex;
        flex-direction: column;
        overflow: scroll;
    }
    .media2 {
        position: absolute;
        width: 200px;
        height: 50px;
        background-color: blue;
        padding: 1em;
    }
    hr {
        margin-left: 0;
        margin-right: 0;
        align-self: stretch;
    }
</style>