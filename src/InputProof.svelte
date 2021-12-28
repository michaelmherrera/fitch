<script>
    import InputSubproof from "./InputSubproof.svelte";
    import ActionsCol from "./ActionsCol.svelte"
    import InputJustification from "./InputJustification.svelte";
    import Katex from "./Katex.svelte";
    export let length;
    export let subproof;
    let selectedRow = 1
    $: console.log("Selected row " + selectedRow)
</script>

<div class="input-proof-framework">
    <div>#</div>
    <div>Statement</div>
    <div>Justification</div>
    <div></div>
    <div class="num-col">
        {#each { length: length } as _, i}
            <div><Katex math={`${i + 1}`} /></div>
        {/each}
    </div>
    <div name="statement-col">
        <InputSubproof bind:subproof bind:selectedRow/>
    </div>
    <div class="justification-col">
        <InputJustification bind:subproof bind:selectedRow></InputJustification>
    </div>
    <div class="actions-col">
        <ActionsCol bind:subproof bind:selectedRow></ActionsCol>
    </div>
</div>
