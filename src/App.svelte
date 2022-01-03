<script>
    import RenderedProof from "./RenderedProof.svelte";
    import InputProof from "./InputProof.svelte";
    import {GetLatex} from "./toLatex"
    import _ from "lodash";
    let pauseHistory = false;
    let showInput = true;
    let history = [];

    function numberRows(proof, rowNum) {
        let rows = proof.premise.length;
        for (const elem of proof.premise) {
            elem["idx"] = rowNum[0];
            rowNum[0] += 1;
        }
        for (const elem of proof.body) {
            if (typeof elem["value"] === "string") {
                elem["idx"] = rowNum[0];
                rowNum[0] += 1;
                rows += 1;
            } else {
                rows += numberRows(elem, rowNum);
            }
        }
        return rows;
    }

    function updateHistory(subproof) {
        if (!pauseHistory) {
            history.push(_.cloneDeep(subproof));
        } else {
            pauseHistory = false;
        }
    }

    document.addEventListener("keydown", function (event) {
        if (event.metaKey || event.ctrlKey) {
            if(event.key === "z"){
                undo();
            }
            if(event.key === "v"){
                showInput = !showInput
            }
            
        }
    });

    function undo() {
        pauseHistory = true;
        if (_.isEqual(history[history.length - 1], subproof)) {
            history.pop();
        }
        if (history.length) {
            subproof = history.pop();
        }
    }

    let subproof = {
        premise: [{ value: "", idx: 1, justification: ["", ""] }],
        body: [{ value: "", idx: 1, justification: ["", ""] }],
    };

    $: length = numberRows(subproof, [1]);

    $: updateHistory(subproof);

    $: console.log(subproof)
</script>

<main>
    <div class="main-content">
        <div>
            <button on:click={() => undo()}>Undo (Ctrl+Z)</button>
            <button 
                on:click={() => (showInput = !showInput)}
                >{showInput ? "View Rendered (Ctrl+V)" : "View Input (Ctrl+V)"}</button
            >
        </div>
        {#if showInput}
            <InputProof {length} bind:subproof/>
        {:else}
            <RenderedProof {subproof} {length} />
        {/if}
        <div>
            <pre>
                {GetLatex(subproof)}
            </pre>
            
        </div>
    </div>
</main>

