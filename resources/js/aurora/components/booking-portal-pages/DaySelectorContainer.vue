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

            <div class="row hide-for-small-only hide-for-medium-only">
                <div class="small-12 column text-center">
                    <h1 class="image-title image-title--party-selector">
                    <span class="image-misc__image--steps1">

                    </span>
                    </h1>
                </div>
            </div>

            <div class="row nopadding">

                <div class="small-12 medium-12 large-9 column nopadding day-selector__wrapper">
                    <day-selector :options="days" :weekday-adjustment="1" :value="selectedDay" :booking="party" @continueBooking="continueBooking" @change="updateDay"
                                  v-if="days.length > 0" @backToCalendar="backToCalendar" :is-super-star="isSuperstarDay"></day-selector>
                </div>
                <div class="small-12 medium-12 large-3 column nopaddingright show-for-large">
                    <booking-summary :booking="party" :prices="selectedSlot" :show-info-box="false" :is-super-star="isSuperstarDay">

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
            <div class="image-misc__image--bottombear hide-for-small-only hide-for-medium-only">
                &nbsp;
            </div>
        </div>
    </div>
</template>

<script>
	import DaySelector from '../DaySelector.vue';
	import BookingSummary from '../BookingSummary.vue';
	import Booking from '../../mixins/Booking';
	import HeaderBears from './HeaderBears';

	export default {
		components: {
			'day-selector': DaySelector,
			'booking-summary': BookingSummary,
			'header-bears': HeaderBears
		},
		mixins: [Booking],
		computed: {
			canContinueBooking() {
				return this.selectedDay;
			},
            isSuperstarDay() {
				let valid = false;
				if(!this.selectedDay) {
					return valid;
                }
				this.selectedDay.information.forEach(info => {
					if(info === 'SUPERSTAR') {
						valid = true;
                    }
                });
				return valid;
            }
		},
		mounted() {
			if (this.location === '' || this.season === '') {
				this.$router.push({name: 'partySelector'});
				return;
			}
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
				$(window).scrollTop(0);
				this.$router.push({name: 'slotSelector'});
			},
			backToCalendar() {
				this.$router.push({name: 'partySelector'});
			}
		}
	}
</script>