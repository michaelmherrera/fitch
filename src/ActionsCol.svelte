<script>
    export let subproof;
    export let selectedRow;
    function addStep(i) {
        let tmp = subproof.body;
        tmp.splice(i, 0, [""]);
        subproof.body = tmp;
    }

    function addSubproof(i) {
        let tmp = subproof.body;
        tmp.splice(i, 0, {
            premise: [[""]],
            body: [[""]],
        });
        subproof.body = tmp;
    }
</script>

{#each subproof.premise as prem}
    <div />
{/each}

{#each subproof.body as elem, i}
    {#if typeof elem[0] === "string"}
        <!-- Only render the buttons for the row whose input box is currently selected -->
        <div key={elem[1]}>
            {#if elem[1] === selectedRow}
                <button on:click={() => addStep(i)}>+ Row</button>
                <button on:click={() => addSubproof(i)}>+ Subproof</button>
            {/if}
        </div>
    {:else}
        <svelte:self bind:subproof={elem} bind:selectedRow/>
    {/if}
{/each}
