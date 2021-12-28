<script>
    export let subproof;
</script>

{#each subproof.premise as _}
    <div />
{/each}

{#each subproof.body as elem, i}
    {#if typeof elem["value"] === "string"}
        <div key={elem["idx"]}>
                <div class="justification-type">{elem["justification"][0]}</div>
                <div class="justification-lines">{elem["justification"][1]}</div>
        </div>
    {:else}
        <svelte:self bind:subproof={elem} />
    {/if}
{/each}