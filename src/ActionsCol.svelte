<script>
    export let subproof;
    export let selectedRow;
    export let parent; // True if this is the top-level of the proof (not a subproof)

    function addStep(section, i) {
        let tmp = subproof[section];
        tmp.splice(i + 1, 0, { value: "", idx: 1, justification: ["", ""] });
        subproof[section] = tmp;
    }

    function addSubproof(i) {
        let tmp = subproof.body;
        tmp.splice(i, 0, {
            premise: [{ value: "", idx: 1, justification: ["", ""] }],
            body: [{ value: "", idx: 1, justification: ["", ""] }],
        });
        subproof.body = tmp;
    }
</script>

{#each subproof.premise as prem, i (prem.idx) }
    {#if parent}
        <div key={prem["idx"]}>
            {#if prem["idx"] === selectedRow}
                <button on:click={() => addStep("premise", i)}>+ Row</button>
            {/if}
        </div>
    {:else}
        <div />
    {/if}
{/each}

{#each subproof.body as elem, i (elem.idx)}
    {#if typeof elem["value"] === "string"}
        <!-- Only render the buttons for the row whose input box is currently selected -->
        <div key={elem["idx"]}>
            {#if elem["idx"] === selectedRow}
                <button on:click={() => addStep("body", i)}>+ Row</button>
                <button on:click={() => addSubproof(i)}>+ Subproof</button>
            {/if}
        </div>
    {:else}
        <svelte:self bind:subproof={elem} bind:selectedRow parent={false} />
    {/if}
{/each}
