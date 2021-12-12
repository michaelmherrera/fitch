<script>
    import ProofFramework from "./ProofFramework.svelte"
    import InputSubproof from "./InputSubproof.svelte";
    import { writable, get} from 'svelte/store'

    let length = 0

    let subproof = writable({
        premise: [""],
        body: ["", writable(
            {
                premise: [""],
                body: [""]
            }
        )],
    })

    function updateSignal(){
        console.log()
    }


    subproof.subscribe(value => {
        length = countRows(value)
	});

    $: console.log($subproof)


    function countRows(proof){
        let rows = proof.premise.length
        for (const elem of proof.body){
            if (typeof elem === "string"){
                rows += 1
            } else {
                rows += countRows(get(elem))
            }
        }
        return rows
    }



</script>

<ProofFramework length={length}>
    <svelte:fragment slot="body">
        <InputSubproof bind:subproof={subproof}/>
    </svelte:fragment>
</ProofFramework>
            


