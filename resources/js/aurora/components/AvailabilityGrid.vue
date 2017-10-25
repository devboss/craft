<template>
	<div class="row">
		<div class="col-sm-8">
			<day-selector :options="days" :weekday-adjustment="1" :value="selectedDay" @change="updateDay"
			              v-show="showDaySelector" v-if="days.length > 0"></day-selector>
			<nav v-if="showSlotSelector">
				<ul class="pager">
					<li :class="['previous', { disabled: !hasPrevDay }]"><a href="#" @click.prevent="prevDay"><span
						aria-hidden="true">&larr;</span> Previous day</a></li>
					<li v-if="selectedDay">{{ selectedDay.date.format('dddd Do MMMM') }}</li>
					<li :class="['next', { disabled: !hasNextDay }]"><a href="#" @click.prevent="nextDay">Next day <span
						aria-hidden="true">&rarr;</span></a></li>
				</ul>
			</nav>
			<slot-selector :options="availableSlots" :selectedDay="selectedDay" :slots="slots" :party="party" :value="selectedSlot" @change="updateSlot"
			               v-show="showSlotSelector"></slot-selector>

		</div>
		<div class="col-sm-4">
			<booking-summary @removeExtra="removeExtra">
				<button :class="['btn', 'btn-default', {disabled: !canContinueBooking}]" :disabled="!canContinueBooking"
				        @click="continueBooking">Continue booking
				</button>
			</booking-summary>
		</div>
	</div>
</template>

<script>
	import BookingSummary from './BookingSummary.vue';
	import DaySelector from './DaySelector.vue';
	import SlotSelector from './SlotSelector.vue';
	import ExtraSelector from './ExtraSelector.vue';
	import { mapGetters } from 'vuex';

	export default {
		components: {
			ExtraSelector,
			'booking-summary': BookingSummary,
			'day-selector': DaySelector,
			'slot-selector': SlotSelector,
			'extra-selector': ExtraSelector
		},
		data() {
			return {
				showDaySelector: true,
				showSlotSelector: false,
				showExtraSelector: false
			}
		},
		mounted() {},
		computed: {
			...mapGetters({
				days: 'availability',
				selectedDay: 'day',
				selectedSlot: 'slot',
				party: 'party',
				slots: 'slotAvailability'
			}),
			canContinueBooking() {
				return (this.showDaySelector && this.selectedDay) || (this.showSlotSelector && this.selectedSlot) || this.showExtraSelector;
			},
			hasPrevDay() {
				try {
					let selectedDayIndex = this.indexOf(this.selectedDay);

					return (typeof this.firstAvailableDay(selectedDayIndex, -1) === 'object');
				} catch (error) {
					return false;
				}
			},
			hasNextDay() {
				try {
					let selectedDayIndex = this.indexOf(this.selectedDay);

					return (typeof this.firstAvailableDay(selectedDayIndex, 1) === 'object');
				} catch (error) {
					return false;
				}
			},
			availableSlots() {
				return _.get(this.selectedDay, 'availableSlots', 0);
			},
		},
		methods: {
			continueBooking() {

				if(this.showExtraSelector){
					//we have selected an extra
					this.showExtraSelector = false;
					this.$emit('extrasSelected');

				}

				if (this.showSlotSelector) {
					this.showSlotSelector = false;
					this.showExtraSelector = true;
					this.$emit('tourSelected');
				}

				if (this.showDaySelector) {
					this.showDaySelector = false;
					this.showSlotSelector = true;
					this.$emit('dateSelected');
				}
			},
			updateDay(day) {
				this.$store.commit('day', day);
			},
			updateSlot(slot) {
				this.$store.commit('slot', slot);
			},
			prevDay() {
				this.changeDay(-1);
			},
			nextDay() {
				this.changeDay(1);
			},
			changeDay(step) {
				try {
					let selectedDayIndex = this.indexOf(this.selectedDay);
					this.$store.commit('day', this.firstAvailableDay(selectedDayIndex, step));
					this.$store.commit('slot', null);
					this.$emit('dateSelected');
				} catch (error) {
					if (!(error instanceof RangeError)) {
						throw error;
					}
				}
			},
			indexOf(day) {
				let currentDay = day;

				return _.findIndex(this.days, day => {
					return day.date.isSame(currentDay.date, 'day');
				});
			},
			firstAvailableDay(currentIndex, step) {
				let day = this.days[currentIndex + step];

				if (_.has(day, 'availableSlots') && day.availableSlots > 0) {
					return day;
				}

				return this.firstAvailableDay(currentIndex + step, step);
			},
			addExtra(extra) {
				this.$store.commit('addExtra', extra);
			},
			removeExtra(id) {
				this.$store.commit('removeExtra', id);
			}
		}
	}
</script>