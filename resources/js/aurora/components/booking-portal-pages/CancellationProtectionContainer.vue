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
                        <span class="image-misc__image--steps2">

                        </span>
                    </h1>
                </div>
            </div>
            <div class="row extra-selector__content nopadding">
                <div class="small-12 medium-12 large-9 column nopadding">
                    <reservation-alert :duration="300" @expired="restartAvailabilitySearch"></reservation-alert>
                    <cancellation-protection @addProtection="addExtra" @removeProtection="removeExtra"
                                             :availableInsurance="availableInsurance" :party="party"
                                             :ticketPlanPrice="ticketPlanPrice"
                                             :insuranceSelected="insuranceExtra"></cancellation-protection>
                </div>


                <div class="small-12 medium-12 large-3 column nopaddingright extra-selector__booking-summary">
                    <div class="show-for-medium extra-selector__medium-booking-summary">
                        <booking-summary :day="selectedDay" :time="selectedSlot" :show-info-box="false" :booking="party"
                                         :prices="selectedSlot" :extras="extras">
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
                    <div class="show-for-small-only extra-selector__small-booking-summary">
                        <booking-summary :day="selectedDay" :time="selectedSlot" :show-info-box="false" :booking="party"
                                         :prices="selectedSlot" :extras="extras">
                            <div @click="canContinueBooking ? continueBooking() : null">
                                <a class="" :class="['button -inverse margin-bottom-medium rotate-ccw-small', {'booking-summary__continue--disabled': !canContinueBooking}]">
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
	import CancellationProtection from '../CancelProtection.vue';
	import BookingSummary from '../BookingSummary.vue';
	import ReservationAlert from '../ReservationAlert.vue';
	import Booking from '../../mixins/Booking';
	import HeaderBears from './HeaderBears';

	export default {
		components: {
			'cancellation-protection': CancellationProtection,
			'booking-summary': BookingSummary,
			'reservation-alert': ReservationAlert,
			'header-bears': HeaderBears
		},
		mixins: [Booking],
		mounted() {
			this.$store.commit('removeInsuranceExtra');
			if (this.selectedDay === null) {
				return this.$router.push({name: 'partySelector'});
			}
			if (this.selectedSlot === null) {
				return this.$router.push({name: 'slotSelector'});
			}
		},
		data() {
			return {
				selected: false
			}
		},
		computed: {
			canContinueBooking() {
				return this.selected === true;
			},
			ticketPlanPrice() {
				if (this.availableInsurance && this.availableInsurance.length === 0) {
					return "0.00";
				}
				let party = this.party;
				let tickets = party.adults + party.seniors + party.children;
				let insurance = _.head(this.availableInsurance);
				return (tickets * insurance.price).toFixed(2);
			},
			insuranceExtra() {
				return _.find(this.extras, extra => {
					return extra.type === 'INSURANCE';
				});
			}
		},
		methods: {
			continueBooking() {
				$(window).scrollTop(0);
				this.$router.push({name: 'bookingDetailContainer'});
			},
			addExtra() {
				let insurance = _.head(this.availableInsurance);
				let party = this.party;

				let tickets = party.adults + party.seniors + party.children;
				insurance.selectedValue = tickets;
				this.selected = true;
				this.$store.commit('removeInsuranceExtra');
				this.$store.commit('addExtra', insurance);
			},
			removeExtra() {
				this.selected = true;
				this.$store.commit('removeInsuranceExtra');
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