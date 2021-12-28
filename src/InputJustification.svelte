<script>
    export let subproof;
    export let selectedRow;
    import {JUST} from "./toLatex"
</script>

{#each subproof.premise as _}
    <div />
{/each}

{#each subproof.body as elem, i}
    {#if typeof elem["value"] === "string"}
        <!-- Only render the select inputs for the row whose input box is currently selected -->
        <div key={elem["idx"]}>
            {#if elem["idx"] === selectedRow}
                <select name="justifications" id="justifications" bind:value={elem["justification"][0]}>
                    {#each Object.keys(JUST) as just}
                        <option value={just}>{just}</option>
                    {/each}
                </select>
                <input class="justification-line-refs" bind:value={elem["justification"][1]}/>
            {:else}
                <div class="justification-type">{elem["justification"][0]}</div>
                <div class="justification-lines">{elem["justification"][1]}</div>
            {/if}
        </div>
    {:else}
        <svelte:self bind:subproof={elem} bind:selectedRow />
    {/if}
{/each}
