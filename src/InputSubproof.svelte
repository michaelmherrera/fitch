<script>
    import SubproofFramework from "./SubproofFramework.svelte";
    export let subproof;
    export let selectedRow

</script>

<SubproofFramework>
    <svelte:fragment slot="premise">
        {#each subproof.premise as prem}
            <div><input type="text" bind:value={prem["value"]} class="expression-input" on:focus={() => selectedRow = prem["idx"]}/></div>
        {/each}
    </svelte:fragment>
    <svelte:fragment slot="body">
        {#each subproof.body as elem}
            {#if typeof elem["value"] === "string"}
                <div>
                    <input bind:value={elem["value"]} class="expression-input" on:focus={() => selectedRow = elem["idx"]}/>
                </div>
            {:else}
                <svelte:self bind:subproof={elem} bind:selectedRow/>
            {/if}
        {/each}
    </svelte:fragment>
</SubproofFramework>
