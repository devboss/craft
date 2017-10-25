<template>
    <div class="row">
        <div class="column">

            <header-bears></header-bears>

            <div class="row">
                <div class="small-12 column text-center">
                    <h1 class="image-title image-title--party-selector">
                    <span class="image-title__image--booktickets">
                        Book Tickets
                    </span>
                    </h1>
                </div>
            </div>

            <div class="row show-for-large">
                <div class="small-12 column text-center">
                    <h1 class="image-title image-title--party-selector">
                        <span class="image-misc__image--steps3">

                        </span>
                    </h1>
                </div>
            </div>

            <div class="row extra-selector__content nopadding">
                <div class="small-12 medium-12 large-9 column nopadding">
                    <template v-if="this.paymentErrors">
                        <payment-errors></payment-errors>
                    </template>
                    <template v-if="showTimer">
                        <reservation-alert :duration="300" :default-time-left="'30'" @expired="restartAvailabilitySearch"></reservation-alert>
                    </template>
                    <booking-details
                            :number-of-adults="($store.getters.party.adults + $store.getters.party.seniors)"
                            :number-of-children="$store.state.booking.children"
                            :successUrl="successUrl"
                            :failureUrl="failureUrl"
                            :promoCodeApplied="promoCodeApplied"
                            @pay="makePayment"
                            @applyPromoCode="applyPromoCode">
                    </booking-details>
                </div>

                <div class="small-12 medium-12 large-3 column nopaddingright extra-selector__booking-summary">
                    <booking-summary :booking="party" :prices="selectedSlot" :show-cards="true" :extras="extras" :promoCodeDescription="promoCodeDescription" :show-info-box="false" :can-remove-extras="false"></booking-summary>
                </div>
            </div>
        </div>
    </div>

</template>

<script>
	import BookingSummary from '../BookingSummary.vue';
	import BookingDetails from '../BookingDetails.vue';
	import ReservationAlert from '../ReservationAlert.vue';
	import Booking from '../../mixins/Booking';
	import PaymentErrorContainer from './PaymentErrorsContainer.vue';
	import PaymentErrorsMixin from '../../mixins/PaymentErrors';
	import HeaderBears from './HeaderBears';

	export default {
		components: {
			'booking-summary': BookingSummary,
			'booking-details': BookingDetails,
			'reservation-alert': ReservationAlert,
			'payment-errors': PaymentErrorContainer,
			'header-bears': HeaderBears
		},
		mixins: [Booking, PaymentErrorsMixin],
		mounted() {
			if (this.selectedDay === null) {
				return this.$router.push({name: 'daySelector'});
			}
			if (this.selectedSlot === null) {
				return this.$router.push({name: 'slotSelector'});
			}
			if(!this.$route.params['recoveryFromFailedPayment']) {
				this.$store.dispatch('createCheckout').then(() => {
					this.showTimer = true;
				});
            }

			this.$store.dispatch('loadReferrers');
		},
        data() {
		    return {
                promoCodeApplied: 0,
                promoCodeDescription: null,
                showTimer: false
            }
        },
		computed: {
			reservationId() {
				return (this.$store.getters.checkout !== null) ? this.$store.getters.checkout.reservationView.id : "false";
			},
			successUrl() {
				return window.location.origin + this.$router.resolve({
						name: 'success.callback',
						params: {id: this.reservationId}
					}).href;
			},
			failureUrl() {
				return window.location.origin + this.$router.resolve({
						name: 'failure.callback',
						params: {id: this.reservationId}
					}).href;
			}
		},
		methods: {
			applyPromoCode(code) {
				this.promoCodeApplied = 0;
				this.$store.dispatch('applyPromoCode', {promoCode: code})
                    .then(response => {
				        this.promoCodeApplied = (response.data.grandTotal[1] === 0) ? 2 : 1;
                        this.promoCodeDescription = response.data.promoCodeDescription;
                    })
                    .catch(error => {
                        if (error.status === 404) {
                            this.promoCodeApplied = -1;
                        } else {
                            this.promoCodeApplied = -2;
                        }
                    });
			},
			restartAvailabilitySearch() {
				this.$store.commit('day', null);
				this.$store.commit('slot', null);
				this.$store.commit('resetExtras');
				this.$store.commit('resetSlotAvailability');
				this.$store.commit('resetAvailability');
				this.$router.push({name: 'partySelector'});
			},
			makePayment(params) {
                let vm = this;
                let reservationId = this.$store.getters.getReservationId;
                let transactionId = this.$store.getters.getTransactionId;
                let responseCode = 'OK';
                let hash = this.$store.getters.getHash;


                this.$store.commit('resetPaymentErrors');
				this.$store.dispatch('createOrder', params)
                    .then(response => {
                        if (response.data.orderView.amountPaid[1] === 0) {
                            vm.$store.dispatch('finaliseOrder', {
                                id: reservationId,
                                transactionId: transactionId,
                                responseCode: responseCode,
                                hash: hash
                            })
                                .then(finalOrder => {
                                    if(finalOrder && finalOrder.status && finalOrder.status === 200) {
                                        return vm.$router.push({
                                            name: 'success.final',
                                            params: {reference: finalOrder.data.bookingView.bookingReference}
                                        });
                                    }
                                });
                        } else {
                            setTimeout(() => {
                                $('#paymentGatewayForm').submit();
                            }, 200);
                        }
                    });
			}
		}
	}
</script>
