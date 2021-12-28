<script>
    import ProofFramework from "./ProofFramework.svelte";
    import RenderedSubproof from "./RenderedSubproof.svelte";
    import RenderedJustification from "./RenderedJustification.svelte"
    import Katex from "./Katex.svelte";
    export let subproof;
    export let length;
</script>

<ProofFramework {length}>
    <svelte:fragment slot="body">
        <RenderedSubproof {subproof}/>
    </svelte:fragment>
    <svelte:fragment slot="justification">
        <RenderedJustification {subproof}></RenderedJustification>
    </svelte:fragment>
</ProofFramework>
