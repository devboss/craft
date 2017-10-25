<template>
    <div class="row ticket-payment__wrapper">
        <div class="column">
            <div class="row">
                <div class="small-12 medium-12 large-9 column nopaddingleft">
                    <template v-if="this.paymentErrors">
                        <payment-errors></payment-errors>
                    </template>
                    <reservation-alert :duration="300" @expired="restartAvailabilitySearch"></reservation-alert>
                    <booking-details
                            :show-children="additionalTickets.children > 0"
                            :existing-customer-details="myDetails"
                            :number-of-adults="additionalTickets.adults + additionalTickets.seniors"
                            :number-of-children="additionalTickets.children"
                            :successUrl="successUrl"
                            :failureUrl="failureUrl"
                            @pay="makePayment"
                            v-if="myDetails.exists()">
                    </booking-details>
                </div>
                <div class="small-12 medium-12 large-3 column nopaddingright extra-selector__booking-summary">
                    <booking-summary :day="day"
                                     :time="time"
                                     :booking="additionalTickets"
                                     :extras="additionalExtras"
                                     :prices="prices">
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
    import Prices from '../../mixins/Prices';
    import PaymentErrorsMixin from '../../mixins/PaymentErrors';

    export default {
        components: {
            ReservationAlert,
            BookingDetails,
            BookingSummary,
            'payment-errors': PaymentErrorContainer,
        },
        mixins: [MyDetails, AdditionalTickets, Prices, PaymentErrorsMixin],
        created() {
            if (this.$store.getters.reservationExpiry === null) {
                this.restartAvailabilitySearch();
            }
        },
        computed: {
            successUrl() {
                return window.location.origin + this.$router.resolve({name:'gateway.callback', params: {type: 'tickets'}}).href + '?bookingId=' + this.$store.getters.getBooking.id;
            },
            failureUrl() {
                return window.location.origin + this.$router.resolve({name:'gateway.callback', params: {type: 'tickets'}}).href + '?bookingId=' + this.$store.getters.getBooking.id;
            },
            day() {
                return {date: moment(this.$store.getters.getBooking.bookedDate)};
            },
            time() {
                return {time: this.$store.getters.getBooking.bookedTime};
            },
            prices() {
                let adultPrice = (this.adultPrice * this.additionalTickets.adults);
                let seniorPrice = (this.seniorPrice * this.additionalTickets.seniors);
                let childPrice = (this.childPrice * this.additionalTickets.children);
                let totalPrice = adultPrice + seniorPrice + childPrice;

                return {adultPrice, seniorPrice, childPrice, totalPrice};
            }
        },
        methods: {
            restartAvailabilitySearch() {
                this.$store.commit('resetReservationExpiry');
                this.$router.push({name: 'my-party.create'});
            },
            makePayment(params) {
                this.$store.dispatch('orderAdditionalTickets', params)
                    .then(() => {
                        setTimeout(() => {
                            $('#paymentGatewayForm').submit();
                        }, 200);
                    });
            }
        }
    }
</script>
