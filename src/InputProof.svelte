<script>
    import ProofFramework from "./ProofFramework.svelte"
    import InputSubproof from "./InputSubproof.svelte";
    
    function countRows(proof){
        let rows = proof.premise.length
        for (const elem of proof.body){
            if (typeof elem === "string"){
                rows += 1
            } else {
                rows += countRows(elem)
            }
        }
        return rows
    }

    let subproof = {
        premise: [""],
        body: ["",
            {
                premise: [""],
                body: [""]
            }
        ],
    }

    let length = countRows(subproof);

    function updateSignal(){
        console.log(subproof)
        length = countRows(subproof)
    }

</script>

<ProofFramework length={length}>
    <svelte:fragment slot="body">
        <InputSubproof bind:subproof={subproof} updateSignal={updateSignal}/>
    </svelte:fragment>
</ProofFramework>
            


