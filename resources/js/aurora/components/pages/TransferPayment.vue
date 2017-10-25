<template>
    <div class="row">
        <div class="column">

            <div class="row extra-selector__content">

                <div class="small-12 column availability-search-day__title">
                    <h1 class="image-title image-title--party-selector">
                        <span class="image-title__image--change-your-date">
                           Change Your Date
                        </span>
                    </h1>
                </div>

                <div class="small-12 medium-12 large-9 column nopaddingleft">
                    <reservation-alert :duration="300" :default-time-left="'30'" @expired="restartAvailabilitySearch"></reservation-alert>
                    <!--template v-if="this.paymentErrors">
                        <payment-errors></payment-errors>
                    </template-->
                    <booking-details
                            :existing-customer-details="myDetails"
                            :number-of-children="$store.state.booking.children"
                            :successUrl="successUrl"
                            :failureUrl="failureUrl"
                            @pay="makePayment"
                            @applyPromoCode="applyPromoCode"
                            :show-children="false">
                    </booking-details>
                </div>

                <div class="small-12 medium-12 large-3 column nopaddingright extra-selector__booking-summary">
                    <booking-summary :day="day"
                                     :time="time"
                                     :booking="party"
                                     :prices="selectedSlot"
                                     :transfer="true">
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
    import Attendees from '../../mixins/Attendees';
    import MyDetails from '../../mixins/MyDetails';
    import AdditionalTickets from '../../mixins/AdditionalTickets';
    import Prices from '../../mixins/Prices';
    import Booking from '../../mixins/Booking';

    export default {
        components: {
            ReservationAlert,
            BookingDetails,
            BookingSummary,
        },
        mixins: [Attendees, Booking, MyDetails, AdditionalTickets, Prices],
        created() {
            if (this.$store.getters.reservationExpiry === null) {
                this.restartAvailabilitySearch();
            }
        },
        computed: {
            successUrl() {
                return window.location.origin + this.$router.resolve({name:'gateway.callback', params: {type: 'transfer'}}).href + '?bookingId=' + this.$store.getters.getBooking.id;
            },
            failureUrl() {
                return window.location.origin + this.$router.resolve({name:'gateway.callback', params: {type: 'transfer'}}).href + '?bookingId=' + this.$store.getters.getBooking.id;
            },
            day() {
                return this.$store.getters.day;
            },
            time() {
                return this.$store.getters.slot;
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
                this.$router.push({name: 'availability.day'});
            },
            makePayment(params) {
                params['isTransfer'] = true;
                this.$store.dispatch('orderAdditionalTickets', params)
                    .then(() => {
                        setTimeout(() => {
                            $('#paymentGatewayForm').submit();
                        }, 200);
                    });
            },
	        applyPromoCode() {

            }
        }
    }
</script>