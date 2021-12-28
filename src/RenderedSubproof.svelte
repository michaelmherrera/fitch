<script>
    import SubproofFramework from "./SubproofFramework.svelte";
    import Katex from "./Katex.svelte";
    export let subproof;
</script>

<SubproofFramework>
    <svelte:fragment slot="premise">
        {#each subproof.premise as prem}
            <div class="rendered-proof-content"><Katex math={prem["value"]} /></div>
        {/each}
    </svelte:fragment>
    <svelte:fragment slot="body">
        {#each subproof.body as elem}
            {#if typeof elem["value"] === "string"}
                <div class="rendered-proof-content"><Katex math={elem["value"]} /></div>
            {:else}
                <svelte:self subproof={elem} />
            {/if}
        {/each}
    </svelte:fragment>
</SubproofFramework>
