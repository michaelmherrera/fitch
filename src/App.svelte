<script>
	import RenderedProof from "./RenderedProof.svelte";
	import InputProof from "./InputProof.svelte"
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

    $: length = countRows(subproof);

    $: console.log(subproof)

</script>

<main>
	<!-- <RenderedProof proof={subproof}></RenderedProof> -->
	<InputProof length={length} bind:subproof={subproof}></InputProof>
</main>


