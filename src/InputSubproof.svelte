<script>
    import { writable } from "svelte/store";
    import SubproofFramework from "./SubproofFramework.svelte";
    export let subproof;
    export let updateSignal

    function addStep() {
        subproof.body = [...subproof.body, ""]
        updateSignal()
    }

    function addSubproof() {
        subproof.body = [...subproof.body, { premise: [""], body: [] }];
        updateSignal()
    }

    $: updateSignal(subproof)
</script>

<SubproofFramework>
    <svelte:fragment slot="premise">
        {#each subproof.premise as prem}
            <div><input bind:value={prem} /></div>
        {/each}
    </svelte:fragment>
    <svelte:fragment slot="body">
        {#each subproof.body as elem}
            {#if typeof elem === "string"}
                <div><input bind:value={elem} /></div>
            {:else}
                <svelte:self subproof={elem} updateSignal={updateSignal}/>
            {/if}
        {/each}
        <div>
            <button on:click={addStep}> + Step</button>
            <button on:click={addSubproof}> + Subproof</button>
        </div>
    </svelte:fragment>
</SubproofFramework>
