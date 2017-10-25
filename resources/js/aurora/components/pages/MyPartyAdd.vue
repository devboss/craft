<template>
    <div class="row mmb-my-party-add">
        <div class="small-12 column">
            <h1 class="image-title small-bottom-margin">
                <span class="image-title__image--add-people inline-block text-center">
                    Add People
                </span>
            </h1>
        </div>
        <div class="small-12 column">
            <h2 class="heading-2--my-experience-booked-time text-center">
                {{ booking.bookedTime }} on {{bookedDay}}
            </h2>

            <h2 class="heading-2--my-experience-booked-time text-center">
                {{ bookedDate }}
            </h2>
        </div>

        <div class="small-12 column">
            <div class="text-center">
                <span class="my-experience__subtitle--booking-reference">
                    Booking Reference:
                </span>
                <span class="my-experience__subtitle--actual-booking-reference">
                    {{ booking.bookingReference }}
                </span>
            </div>
        </div>


        <div class="small-12 column text-center">
            <span class="image-misc__image--underline">
                    &nbsp;
            </span>
        </div>

        <div class="small-12 column">
            <div class="image-misc__image--additional-tickets-box text-center show-for-large">
                <div>
                    Please note that the maximum family group size for this tour is 8, you will be able to add a maximum of {{maxAvailableTickets}} ADDITIONAL TICKETS to your booking, subject to availability.
                </div>
            </div>
            <div class="image-misc__image--mobile-additional-tickets-box text-center hide-for-large">
                <div>
                    Please note that the maximum family group size for this tour is 8, you will be able to add a maximum of {{maxAvailableTickets}} ADDITIONAL TICKETS to your booking, subject to availability.
                </div>
            </div>
        </div>

        <gateway-error></gateway-error>

        <div class="small-12 column nopadding">
            <party-additions
                    :booking="booking"
                    :prices="{adult: adultPrice, senior: seniorPrice, child: childPrice}"
                    :available-cancellation-policies="availableInsurance">
            </party-additions>
        </div>

    </div>
</template>

<script>
	import PartyAdditions from '../PartyAdditions.vue';
	import GatewayError from '../GatewayError.vue';
	import Booking from '../../mixins/Booking';
	import Prices from '../../mixins/Prices';
    import Extras from '../../mixins/Extras';
    import EmptyCheckout from '../../mixins/EmptyCheckout';

	export default {
		components: {
			PartyAdditions,
			GatewayError,
		},
		mixins: [Booking, Prices, Extras, EmptyCheckout],
        mounted() {
            this.$store.commit('resetExtras');
        },
		computed: {
			bookedDate() {
				return moment(this.booking.bookedDate).format('dddd Do MMMM YYYY');
			},
			bookedDay() {
				return moment(this.booking.bookedDate).format('dddd');
			},
			maxAvailableTickets() {
				let maxAvailableTickets = 8 - (this.booking.adultsTickets + this.booking.seniorsTickets + this.booking.childrenTickets
					+ this.booking.infantsTickets + this.booking.carersTickets);

				return maxAvailableTickets > 0 ? maxAvailableTickets : 0;
			}
		},
	}
</script>