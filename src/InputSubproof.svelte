<script>
    import SubproofFramework from "./SubproofFramework.svelte";
    export let subproof;
    export let selectedRow

</script>

<SubproofFramework>
    <svelte:fragment slot="premise">
        {#each subproof.premise as prem}
            <div><input bind:value={prem[0]} class="expression-input" on:focus={() => selectedRow = prem[1]}/></div>
        {/each}
    </svelte:fragment>
    <svelte:fragment slot="body">
        {#each subproof.body as elem}
            {#if typeof elem[0] === "string"}
                <div>
                    <input bind:value={elem[0]} class="expression-input" on:focus={() => selectedRow = elem[1]}/>
                </div>
            {:else}
                <svelte:self bind:subproof={elem} bind:selectedRow/>
            {/if}
        {/each}
    </svelte:fragment>
</SubproofFramework>
