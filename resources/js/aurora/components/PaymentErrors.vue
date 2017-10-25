<template>
	<div class="alert alert-danger">
		<strong>Warning!</strong>

		<p>{{ message }}</p>

		<ul v-if="validationErrors.length > 0">
			<li v-for="error in validationErrors">{{ error }}</li>
		</ul>
	</div>
</template>

<script>
	export default {
		props: {
			message: String,
			validationErrors: Array
		}
	}
</script>