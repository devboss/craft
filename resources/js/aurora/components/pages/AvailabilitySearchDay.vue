<template>
    <div class="row">
        <div class="column">
            <div class="row">
                <div class="small-12 column availability-search-day__title">
                    <h1 class="image-title image-title--party-selector">
                        <span class="image-title__image--change-your-date">
                           Change Your Date
                        </span>
                    </h1>
                </div>
                <div class="small-12 medium-12 large-9 column nopaddingleft">

                    <day-selector :booking="party" :options="days" :weekday-adjustment="1" :value="selectedDay" @change="updateDay"
                                  v-if="days.length > 0" :display-back-to-party="false" @continueBooking="continueBooking"></day-selector>
                </div>
                <div class="small-12 medium-12 large-3 column nopaddingright show-for-large">
                    <booking-summary :booking="party" :prices="selectedSlot" :show-info-box="true" :is-premium-booking="this.booking.premiumSlot ? this.booking.premiumSlot : false">

                        <div @click="canContinueBooking ? continueBooking() : null">
                            <a class="" :class="['button margin-bottom-medium rotate-ccw-small', {'booking-summary__continue--disabled': !canContinueBooking}]">
                                <span class="button__inner">
                                    <span class="button__text">Continue Booking</span>
                                    <svg class="button__arrow">
                                        <use xlink:href="/images/svg/sprite.svg#button-arrow"
                                             xmlns:xlink="http://www.w3.org/1999/xlink"></use>
                                    </svg>
                                </span>
                            </a>
                        </div>

                    </booking-summary>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import DaySelector from '../DaySelector.vue';
    import BookingSummary from '../BookingSummary.vue';
    import Booking from '../../mixins/Booking';
    import EmptyCheckout from '../../mixins/EmptyCheckout';

    export default {
        components: {
            'day-selector': DaySelector,
            'booking-summary': BookingSummary
        },
        mixins: [Booking, EmptyCheckout],
        computed: {
            canContinueBooking() {
                return this.selectedDay;
            },
            party() {
	            return this.$store.getters.party;
            }
        },
        created() {
            // Create required state
            this.$store.commit('location', 'Windsor');
            this.$store.commit('season', '2017');
            this.$store.commit('party', {
                adults: this.booking.adultsTickets,
                seniors: this.booking.seniorsTickets,
                children: this.booking.childrenTickets,
                babies: this.booking.infantsTickets,
                carers: this.booking.carersTickets,
                wheelchairs: this.booking.wheelchairsTickets,
            });


	        this.$store.commit('setPremiumSearch', this.booking.premiumSlot ? this.booking.premiumSlot : false);

            // Trigger availability search
            this.$store.dispatch('checkAvailability');
        },
        methods: {
            updateDay(day) {
                this.$store.commit('day', day);
                this.$store.commit('slot', null);
            },
            removeExtra() {
                console.log('remove extra');
            },
            continueBooking(){
                this.$router.push({name: 'availability.slot'});
            }
        }
    }
</script>