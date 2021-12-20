<script>
    import RenderedProof from "./RenderedProof.svelte";
    import InputProof from "./InputProof.svelte";
    function numberRows(proof, rowNum) {
        let rows = proof.premise.length;
        for (const elem of proof.premise) {
            elem[1] = rowNum[0];
            rowNum[0] += 1;
        }
        for (const elem of proof.body) {
            if (typeof elem[0] === "string") {
                elem[1] = rowNum[0];
                rowNum[0] += 1;
                rows += 1;
            } else {
                rows += numberRows(elem, rowNum);
            }
        }
        return rows;
    }

    let subproof = {
        premise: [[""]],
        body: [
            [""]
        ],
    };

    $: length = numberRows(subproof, [1]);

    $: console.log(subproof);
</script>

<main>
    <!-- <RenderedProof proof={subproof}></RenderedProof> -->
    <InputProof {length} bind:subproof />
</main>
