<template>
    <div class="row">
        <div class="column">
            <div class="row extra-selector__content">
                <div class="small-12 column">
                    <h1 class="image-title image-title--party-selector">
                <span class="image-title__image--magical-extras">
                       Magical Extras
                </span>
                    </h1>
                </div>
                <div class="small-12 large-9 column nopaddingleft">
                    <template v-if="this.paymentErrors">
                        <payment-errors></payment-errors>
                    </template>
                    <booking-details
                            :existing-customer-details="myDetails"
                            :number-of-children="additionalTickets.children"
                            :successUrl="successUrl"
                            :failureUrl="failureUrl"
                            @pay="makePayment"
                            v-if="myDetails.exists()"
                            :show-children="false">
                    </booking-details>
                </div>
                <div class="small-12 large-3 column nopaddingright extra-selector__booking-summary">
                    <booking-summary :booking="party"
                                     :extras="additionalExtras"
                                     :prices="prices"
                                     :can-remove-extras="false">
                    </booking-summary>
                </div>
            </div>

        </div>
    </div>
</template>

<script>
    import ReservationAlert from '../ReservationAlert.vue';
    import BookingDetails from '../BookingDetails.vue';
    import BookingSummary from '../BookingSummary.vue';
    import PaymentErrorContainer from '../booking-portal-pages/PaymentErrorsContainer.vue';
    import MyDetails from '../../mixins/MyDetails';
    import AdditionalTickets from '../../mixins/AdditionalTickets';
    import Booking from '../../mixins/Booking';
    import Prices from '../../mixins/Prices';
    import PaymentErrorsMixin from '../../mixins/PaymentErrors';

    export default {
        components: {
            BookingDetails,
            BookingSummary,
            'payment-errors': PaymentErrorContainer,
        },
        mixins: [Booking, MyDetails, AdditionalTickets, Prices, PaymentErrorsMixin],
        mounted() {
            if(this.additionalExtras && this.additionalExtras.length < 1) {
                this.$router.replace({name: 'magical-extras'});
            }
        },
        computed: {
            successUrl() {
                return window.location.origin + this.$router.resolve({name:'gateway.callback', params: {type: 'extras'}}).href + '?bookingId=' + this.$store.getters.getBooking.id;
            },
            failureUrl() {
                return window.location.origin + this.$router.resolve({name:'gateway.callback', params: {type: 'extras'}}).href + '?bookingId=' + this.$store.getters.getBooking.id;
            },
            day() {

                return {date: moment(this.$store.getters.getBooking.bookedDate)};
            },
            time() {
                return {time: this.$store.getters.getBooking.bookedTime};
            },
            prices() {
                let adultPrice = 0;
                let seniorPrice = 0;
                let childPrice = 0;
                let totalPrice = 0;

                return {adultPrice, seniorPrice, childPrice, totalPrice};
            }
        },
        methods: {
            makePayment(params) {
                this.$store.dispatch('orderAdditionalExtras', params)
                    .then(() => {
                        setTimeout(() => {
                            $('#paymentGatewayForm').submit();
                        }, 200);
                    });
            }
        }
    }
</script>