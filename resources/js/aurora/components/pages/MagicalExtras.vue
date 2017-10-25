<template>
    <div class="row magical-extras__wrapper">
        <div class="small-12 column">
            <h1 class="image-title image-title--party-selector">
                <span class="image-title__image--magical-extras">
                       Magical Extras
                </span>
            </h1>
        </div>
        <div class="small-12 medium-12 large-9 column nopaddingleft">
            <extra-selector @addExtra="addExtra"></extra-selector>
        </div>
        <div class="small-12 medium-12 large-3 column nopaddingright">
            <booking-summary :booking="party" :prices="selectedSlot" :extras="additionalExtras" @removeExtra="removeExtra" :emit-to-remove="true">
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
</template>

<script>
    import ExtraSelector from '../ExtraSelector.vue';
    import BookingSummary from '../BookingSummary.vue';
    import Booking from '../../mixins/Booking';
    import EmptyCheckout from '../../mixins/EmptyCheckout';
    import StopSelling from '../../mixins/StopSelling';

    export default {
        components: {
            'extra-selector': ExtraSelector,
            'booking-summary': BookingSummary,
        },
        mixins: [Booking, EmptyCheckout, StopSelling],
        mounted(){
            this.$store.dispatch('loadAvailableExtras');
            this.$store.commit('party', {
                adults: 0,
                seniors: 0,
                children: 0,
                babies: 0,
                carers: 0,
                wheelchairs: 0
            });
        },
        computed: {
            additionalExtras() {
                return this.$store.getters.getAdditionalExtras;
            },
            canContinueBooking() {
                return (this.additionalExtras && this.additionalExtras.length > 0);
            }
        },
        methods: {
            continueBooking() {
                let vm = this;

                this.$store.dispatch('reserveAdditionalExtras', {bookingId: this.booking.id, extras: this.additionalExtras}).then(() => {
                    vm.$router.push({name: 'extras.payment'});
                });
            },
            addExtra(extra) {
                console.log(extra);
                this.$store.commit('setAdditionalExtras', extra);
            },
            restartAvailabilitySearch(){
                this.$store.commit('day', null);
                this.$store.commit('slot', null);
                this.$store.commit('resetExtras');
                this.$store.commit('resetSlotAvailability');
                this.$store.commit('resetAvailability');
                this.$router.push({name: 'partySelector'})
            },
            removeExtra(id) {
                this.$store.commit('removeAdditionalExtra', id);
            }
        }
    }
</script>
