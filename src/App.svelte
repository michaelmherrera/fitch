<script>
	import ProofFramework from "./ProofFramework.svelte";
</script>

<main>
	<div class="wrapper">
		<div>#</div>
		<div>Statement</div>
		<div>Justification</div>
		<div class="num-col">
			<div>1</div>
			<div>2</div>
			<div>5</div>
			<div>1</div>
			<div>2</div>
			<div>3</div>
			<div>4</div>
			<div>5</div>
			<div>1</div>
			<div>2</div>
			<div>3</div>
			<div>4</div>
			<div>5</div>
		</div>
		<div name="statement-col">
			<ProofFramework>
				<div slot="premise">A -> B</div>
				<svelte:fragment slot="body">
					<div>A -> B</div>
					<div>C -> D</div>
					<ProofFramework>
						<div slot="premise">A -> B ^ D -> E</div>
						<svelte:fragment slot="body">
							<ProofFramework>
								<div slot="premise">A -> B</div>
								<svelte:fragment slot="body">
									<div>A -> B</div>
									<div>C -> D</div>
									<div>C -> D</div>
								</svelte:fragment>
							</ProofFramework>
						</svelte:fragment>
					</ProofFramework>
				</svelte:fragment>
			</ProofFramework>
		</div>
		<div class="justification-col">
			<div>AI 1,2</div>
			<div>^E, 1-3</div>
			<div>5</div>
			<div>1</div>
			<div>2</div>
		</div>
	</div>
</main>

<style>
	.wrapper {
		display: grid;
		grid-auto-flow: row;
		grid-template-columns: 20px 200px 80px;
	}
</style>
