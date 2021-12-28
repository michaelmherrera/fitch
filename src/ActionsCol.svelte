<script>
    export let subproof;
    export let selectedRow;
    function addStep(i) {
        let tmp = subproof.body;
        tmp.splice(i + 1, 0, { value: "", idx: 1, justification: ["", ""] });
        subproof.body = tmp;
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

{#each subproof.premise as prem}
    <div />
{/each}

{#each subproof.body as elem, i}
    {#if typeof elem["value"] === "string"}
        <!-- Only render the buttons for the row whose input box is currently selected -->
        <div key={elem["idx"]}>
            {#if elem["idx"] === selectedRow}
                <button on:click={() => addStep(i)}>+ Row</button>
                <button on:click={() => addSubproof(i)}>+ Subproof</button>
            {/if}
        </div>
    {:else}
        <svelte:self bind:subproof={elem} bind:selectedRow />
    {/if}
{/each}
