<script>
    import IndependentPartRenderer from "./IndependentPartRenderer.svelte";
    import MediaList from "./MediaList.svelte";

    export let data;

    const parseNode = (media) => {
        const sorted = [...media.events].sort((a,b) => (a.timestamp - b.timestamp));
        let warning = [];
        let nextMediaSet = false;
        let lastEventCount = -1;
        let question = false;
        let anyInput = false;

        let nextMedias = [];
        let voteOpts = [];

        let votes = [];
        let questions = [];
        for (const event of sorted) {
            if (event.data.type === "voteBegin") {
                if (anyInput) warning.push(event.timestamp+": Can not have two votes or questions going at the same time");
                lastEventCount = event.data.options.length;
                voteOpts = event.data.options;
                anyInput = true;
            }
            if (event.data.type === "questionBegin") {
                if (anyInput) warning.push(event.timestamp+": Can not have two votes or questions going at the same time");
                questions.push({
                    question: event.data.question,
                    correctPoints: event.data.correctPoints,
                    incorrectPoints: event.data.incorrectPoints
                });
                anyInput = true;
                question = true;
            }
            if (event.data.type === "questionEnd") {
                if (!question) warning.push(event.timestamp +": Question did not begin");
                anyInput = false;
                question = false;
            }
            if (event.data.type === "voteEnd") {
                if (lastEventCount == -1) {
                    warning.push(event.timestamp+": Vote did not begin")
                    continue
                }
                if (event.data.points.length !== lastEventCount+1)  {
                    warning.push(event.timestamp+": Length of Points per option should be equal to #options + 1 ")
                }
                if (event.data.nextMedia !== null && event.data.nextMedia.length !== lastEventCount+1)  {
                    warning.push(event.timestamp+": Length of next media should be equal to #options + 1 ")
                } else if (event.data.nextMedia) {
                    nextMediaSet = true;
                }

                if (event.data.nextMedia !== null) {
                    nextMedias = []
                    for (const [i, media] of event.data.nextMedia.entries()) {
                        if (media === null) warning.push(event.timestamp +": Null can not be set as Next media option")
                        if (media === "ignored") continue;
                        nextMedias.push({
                            name: i == 0 ? "default" : i-1 < voteOpts.length ? voteOpts[i-1] : "INVALID IDX: "+i,
                            value: media
                        })
                    }
                }

                let opts = []

                for (let i = 0; i <= lastEventCount; i++) {
                    opts.push({name: i == 0 ? "Default": i-1 < lastEventCount ? voteOpts[i-1] : `Invalid Index ${idx}`, point: event.data.points[i]})
                }
                votes.push(opts);

                lastEventCount = -1;
                anyInput = false;
            }
            if (event.data.type === "nextMedia") {
                nextMediaSet = true;
                nextMedias.push({
                    name: "nextmedia",
                    value: event.data.mediaId
                })
            }
        }
        if (lastEventCount != -1) warning.push("A vote that begun in current media also must end in current media");
        if (!nextMediaSet) warning.push("Next media is not set")

        return {
            name: media.name,
            id: media.id,
            next: nextMedias,
            votes: votes,
            questions: questions,
            warnings: warning
        }
    }

    let parsed = {}
    let realRepresentation = {};

    let independentParts = [];
    $: {
        for (const media of data.media) {
            parsed[media.id] = parseNode(media);
        }
        console.log(parsed)
        for (const [key, media] of Object.entries(parsed)) {
            realRepresentation[key] = {id: media.id, name: media.name,next: media.next, prev: [], votes: media.votes, questions: media.questions, warnings: media.warnings};
        }
        for (const [key, media] of Object.entries(realRepresentation)) {
            for (const nextObj of media.next) {
                const key = nextObj.value;
                nextObj.value = realRepresentation[nextObj.value];
                if (nextObj.value == undefined) {
                    nextObj.value = realRepresentation[key] = {id: key, name: "$INVALID MEDIA!$", next: [], prev: [], votes: []};
                }
                nextObj.value.prev.push(media);
            }
        }
        console.log(realRepresentation);
        independentParts = [];

        let parts = Object.values(realRepresentation);
        while (parts.length > 0) {
            let visit = [parts.pop()];
            let construct = {}
            construct[visit[0].id] = visit[0];
            console.log(construct)
            while (visit.length > 0) {
                let visita = visit.pop()
                console.log(visita);
                for (const elem of visita.next) {
                    if (construct[elem.value.id] == undefined)
                        visit.push(elem.value);
                    construct[elem.value.id] = elem.value;
                    parts = parts.filter(a => a !== elem.value);
                }
                for (const elem of visita.prev)  {
                    if (construct[elem.id] == undefined)
                        visit.push(elem);
                    construct[elem.id] = elem;
                    parts = parts.filter(a => a !== elem);
                }
            }
            console.log(construct)
            independentParts.push(construct);
        }
    }

</script>

<div class="lol">
{#each independentParts as part}
<IndependentPartRenderer part={part} def={realRepresentation}/>
{/each}
</div>

<style>
    .lol {
        display: flex;
        flex-direction: column;
        overflow-y: auto;
        width: 100%;
        padding: 1em;
    }
</style>
