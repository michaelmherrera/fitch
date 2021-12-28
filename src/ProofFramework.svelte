<script>
    export let length
	import Katex from "./Katex.svelte";
</script>


	<div class="proof-framework">
		<div>#</div>
		<div>Statement</div>
		<div>Justification</div>
		<div class="num-col">
            {#each {length: length} as _, i}
                <div><Katex math={`${i+1}`}/></div>
            {/each}
		</div>
		<div name="statement-col">
            <slot name="body"></slot>
		</div>
		<div class="justification-col">
            <slot name="justification"></slot>
		</div>
	</div>


