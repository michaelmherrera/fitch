<script>
    import ProofFramework from "./ProofFramework.svelte"
    import InputSubproof from "./InputSubproof.svelte";
    export let length;
    export let subproof;

</script>

<ProofFramework length={length}>
    <svelte:fragment slot="body">
        <InputSubproof bind:subproof={subproof}/>
    </svelte:fragment>
</ProofFramework>
            


