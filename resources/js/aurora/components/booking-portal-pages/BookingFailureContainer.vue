<template>
	<div class="error-page error-page--conker">
		<h1 class="image-title image-title--oops">
			<span class="image-title__image--oops">Oops!</span>
		</h1>
		<div class="error-page__summary">
			<p>{{ errorMessage }}</p>
		</div>
		<div class="error-page__suggestion">
			<p>Please try again, if the problem persists contact <a href="mailto:enquiries@laplanduk.co.uk">enquiries@laplanduk.co.uk</a>.</p>
		</div>
	</div>
</template>

<script>
	import store from '../../store';

	export default {
        beforeRouteEnter (to, from, next) {
			store.commit('setPaymentErrors', {
                errorCode: to.query.errorCode,
				errorMessage: to.query.errorMessage,
				errors: to.query.validationErrors,
			});

			store.dispatch('orderFailed', {
				id: to.params.id,
				transactionId: to.query.transactionId
			})
				.then(finalOrder => {
					if(finalOrder && finalOrder.status && finalOrder.status === 200) {
						const reservationView = finalOrder.data.reservationView;
						const orderView = finalOrder.data.orderView;
						store.commit('party', reservationView.party);
						store.commit('location', reservationView.location);
						store.commit('season', reservationView.season);
						store.commit('setOrder', {orderView: orderView});
						store.commit('setReservationExpiry', moment().add(reservationView.secondsValidUntil, 's'));
						store.dispatch('recoverFromFailedPayment', {id: reservationView.id, date: reservationView.date, time: reservationView.time, extras: orderView.extras})
							.then(() => {
								next({name: 'bookingDetailContainer', params: {recoveryFromFailedPayment: true}});
							});
					}
				})
				.catch(error => {
                    next();
				});
		},
		computed: {
		    errorCode() {
                return this.$route.query.errorCode;
			},
            errorMessage() {
                return this.$route.query.errorMessage;
			},
            validationErrors() {
                return this.$route.query.validationErrors;
			}
		}
	}
</script>