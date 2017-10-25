<template>
	<div class="row">
		<div class="col-md-12">
		</div>
	</div>
</template>

<script>
	export default {
		mounted() {
			//we need to finalise the success of the payment
			const query = this.$route.query;
			const params = this.$route.params;
			this.$store.dispatch('finaliseOrder',
				{
					id: params.id,
					transactionId: query.transactionId,
					responseCode: query.responseCode,
					hash: query.hash
				}
			)
			.then(finalOrder => {
				if(finalOrder && finalOrder.status && finalOrder.status === 200) {
					return this.$router.push({name: 'success.final', params: {reference: finalOrder.data.bookingView.bookingReference}});
				}
			})
			.catch(error => {
				console.log(error);
			});
		}
	}
</script>