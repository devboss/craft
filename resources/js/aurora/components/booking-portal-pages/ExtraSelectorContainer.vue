<template>
    <div class="row">
        <div class="column nopadding">
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
                        <span class="image-misc__image--steps2">


                        </span>
                    </h1>
                </div>
            </div>
            <div class="row nopadding extra-selector__content">
                <div class="small-12 medium-12 large-9 column nopadding">
                    <reservation-alert :duration="300" @expired="restartAvailabilitySearch" :is-extras="true"></reservation-alert>
                    <extra-selector @addExtra="addExtra"></extra-selector>
                </div>

                <div class="small-12 medium-12 large-3 column extra-selector__booking-summary">
                    <div class="show-for-medium extra-selector__medium-booking-summary">
                        <booking-summary :day="selectedDay" :time="selectedSlot" :show-info-box="false" :booking="party"
                                         :prices="selectedSlot" :extras="extras">
                            <div @click="continueBooking">
                                <a class="" :class="['button margin-bottom-medium rotate-ccw-small']">
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
                    <div class="show-for-small-only extra-selector__small-booking-summary">
                        <booking-summary :day="selectedDay" :time="selectedSlot" :show-info-box="false" :booking="party"
                                         :prices="selectedSlot" :extras="extras">
                            <div @click="continueBooking">
                                <a class="" :class="['button -inverse margin-bottom-medium rotate-ccw-small']">
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

    </div>
</template>


<script>
	import ExtraSelector from '../ExtraSelector.vue';
	import BookingSummary from '../BookingSummary.vue';
	import ReservationAlert from '../ReservationAlert.vue';
	import Booking from '../../mixins/Booking';
	import HeaderBears from './HeaderBears';

	export default {
		components: {
			'extra-selector': ExtraSelector,
			'booking-summary': BookingSummary,
			'reservation-alert': ReservationAlert,
			'header-bears': HeaderBears
		},
		mixins: [Booking],
		mounted(){
			if (this.selectedDay === null) {
				return this.$router.push({name: 'partySelector'});
			}
			if (this.selectedSlot === null) {
				return this.$router.push({name: 'slotSelector'});
			}
			this.$store.dispatch('loadAvailableExtras');
		},
		methods: {
			continueBooking() {
				$(window).scrollTop(0);
				this.$router.push({name: 'cancellationProtectionSelector'});
			},
			addExtra(extra) {
				this.$store.commit('addExtra', extra);
			},
			restartAvailabilitySearch(){
				this.$store.commit('day', null);
				this.$store.commit('slot', null);
				this.$store.commit('resetExtras');
				this.$store.commit('resetSlotAvailability');
				this.$store.commit('resetAvailability');
				this.$router.push({name: 'partySelector'})
			}
		}
	}
</script>