<script>
    import ProofFramework from "./ProofFramework.svelte";
    import RenderedSubproof from "./RenderedSubproof.svelte";
    import Katex from "./Katex.svelte";
    export let proof;
    // let proof = {
    //     premise: [
    //         "\\exists A (A \\rightarrow B)",
    //         "\\exists A (A \\rightarrow B)",
    //     ],
    //     body: [
    //         {
    //             premise: [
    //                 "\\exists A (A \\rightarrow B)",
    //             ],
    //             body: ["\\exists A (A \\rightarrow B)",
    //                 {
    //             premise: [
    //                 "\\exists A (A \\rightarrow B)",
    //             ],
    //             body: ["\\exists A (A \\rightarrow B)",{
    //             premise: [
    //                 "\\exists A (A \\rightarrow B)",
    //             ],
    //             body: ["\\exists A (A \\rightarrow B)"],
    //         }],
    //         }
    //             ],
    //         },
    //     ],
    // };
</script>

<ProofFramework length={8}>
    <svelte:fragment slot="body">
        <RenderedSubproof subproof={proof} />
    </svelte:fragment>
    <svelte:fragment slot="justification">
        <div><Katex math={"\\exists I"}></Katex> <div><Katex math={"2,1-3"}></Katex></div></div>
        <div>^E, 1-3</div>
        <div>5</div>
        <div>1</div>
        <div>2</div>
    </svelte:fragment>
</ProofFramework>
