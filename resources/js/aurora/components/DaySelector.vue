<template>
    <div>
        <div class="row hide-for-large">
            <div class="small-12 column text-center">
                <h2 class="heading-2--gill-sans">
                    Select the date you would like to visit.
                </h2>
            </div>
        </div>
        <div class="row show-for-large nopadding day-selector__backarrow" v-if="displayBackToParty">
            <div class="large-1 column text-left image-misc__image--backarrow-wrapper" style="padding-left: 0;"
                 @click="backToCalendar">
                <div class="image-misc__image--backarrow inline-block"></div>
            </div>
            <div class="large-11 column nopadding back-to-calendar" @click="backToCalendar">
                Back to party
            </div>
        </div>
        <div class="row nopadding">
            <div class="small-12 column nopadding">
                <div class="day-selector__available-square-wrapper">
                    <div class="day-selector__available-square">

                    </div>
                </div>
                <div class="day-selector__available-square-label">
                    Available
                </div>
                <div class="day-selector__unavailable-square-wrapper">
                    <div class="day-selector__unavailable-square">

                    </div>
                </div>
                <div class="day-selector__unavailable-square-label">
                    Unavailable
                </div>
            </div>
        </div>

        <div class="row nopadding show-for-large day-selector__weekdays">
            <div class="day-selector__calendar--day" v-for="day in daysOfTheWeek">
                <h2 class="heading-2--calendar-day text-center">
                    {{ day }}
                </h2>
            </div>
        </div>

        <div class="row nopadding show-for-large">
            <div class="small-12 day-selector__separator"></div>
        </div>

        <div class="row nopadding show-for-large" v-for="week in weeks">
            <div :class="['day-selector__calendar--day day-selector__calendar--date ', { active: day.isActive }, { info: isCurrent(day) }]"
                 v-for="day in week"
                 @click="change(day)">

                <div :class="[{ 'day-selector__inside-date': day.isActive }, {'day-selector__inside-date-unavailable': !day.isActive}]">
                    <div class="day-selector__inside-date-month">{{ day.date.format('MMMM') }}</div>
                    <div class="day-selector__inside-date-number">{{ day.date.format('Do') }}</div>
                    <template v-if="day.availableSlots > 0">
                        <div class="day-selector__inside-date-from">from</div>
                        <div class="day-selector__inside-date-price">
                            £{{ day.lowestPrice }}pp
                        </div>
                        <div class="day-selector__inside-date-info" v-if="(day.information !== '' && day.information.join !== 'undefined')">
                            <template v-for="info in day.information">
                                <div>
                                    {{info}}
                                </div>
                            </template>
                        </div>

                    </template>
                    <template v-else-if="(day.information !== '' && typeof day.information !== 'undefined' && day.information.join !== 'undefined')">
                        <div class="day-selector__inside-date-info -white-info">
                            <template v-for="info in day.information">
                                <div>
                                    {{info}}
                                </div>
                            </template>
                        </div>
                    </template>
                </div>


            </div>
        </div>

        <div class="row nopadding show-for-small-only day-selector__small-days">
            <template v-for="week in weeks">
                <div :class="['small-6 medium-6 column ', { active: day.isActive }, { info: isCurrent(day) }]"
                     v-for="day in week"
                     @click="change(day, true)">

                    <template v-if="day.isActive">
                        <div :class="[{ 'day-selector__inside-date--small': day.isActive }, {'day-selector__inside-date-unavailable--small': !day.isActive}]"
                             v-tooltip="smallTooltipOptions">
                            <div class="day-selector__inside-date-month">{{ day.date.format('MMMM') }}</div>
                            <div class="day-selector__inside-date-number">{{ day.date.format('Do') }}</div>
                            <template v-if="day.availableSlots > 0">
                                <div class="day-selector__inside-date-from">from</div>
                                <div class="day-selector__inside-date-price">
                                    £{{ day.lowestPrice }}pp
                                </div>
                                <div class="day-selector__inside-date-info" v-if="(day.information !== '' && day.information.join !== 'undefined')">
                                    {{ day.information.join(", ") }}
                                </div>
                            </template>
                        </div>
                    </template>

                    <template v-else>
                        <div :class="[{ 'day-selector__inside-date--small': day.isActive }, {'day-selector__inside-date-unavailable--small': !day.isActive}]">
                            <div class="day-selector__inside-date-month">{{ day.date.format('MMMM') }}</div>
                            <div class="day-selector__inside-date-number">{{ day.date.format('Do') }}</div>
                            <template v-if="day.availableSlots > 0">
                                <div class="day-selector__inside-date-from">from</div>
                                <div class="day-selector__inside-date-price">
                                    £{{ day.lowestPrice }}pp
                                </div>
                                <div class="day-selector__inside-date-info" v-if="(day.information !== '' && day.information.join !== 'undefined')">
                                    {{ day.information.join(", ") }}
                                </div>
                            </template>
                        </div>
                    </template>



                </div>
            </template>

        </div>

        <div class="row nopadding show-for-medium-only day-selector__medium-days">
            <template v-for="week in weeks">
                <div :class="['small-3 medium-3 column ', { active: day.isActive }, { info: isCurrent(day) }]"
                     v-for="day in week"
                     @click="change(day, true)">

                    <template v-if="day.isActive">
                        <div :class="[{ 'day-selector__inside-date--medium': day.isActive }, {'day-selector__inside-date-unavailable--medium': !day.isActive}]"
                             v-tooltip="mediumTooltipOptions">
                            <div class="day-selector__inside-date-month">{{ day.date.format('MMMM') }}</div>
                            <div class="day-selector__inside-date-number">{{ day.date.format('Do') }}</div>
                            <template v-if="day.availableSlots > 0">
                                <div class="day-selector__inside-date-from">from</div>
                                <div class="day-selector__inside-date-price">
                                    £{{ day.lowestPrice }}pp
                                </div>
                                <div class="day-selector__inside-date-info" v-if="(day.information !== '' && day.information.join !== 'undefined')">
                                    {{ day.information.join(", ") }}
                                </div>
                            </template>
                        </div>
                    </template>

                    <template v-else>
                        <div :class="[{ 'day-selector__inside-date--medium': day.isActive }, {'day-selector__inside-date-unavailable--medium': !day.isActive}]">
                            <div class="day-selector__inside-date-month">{{ day.date.format('MMMM') }}</div>
                            <div class="day-selector__inside-date-number">{{ day.date.format('Do') }}</div>
                            <template v-if="day.availableSlots > 0">
                                <div class="day-selector__inside-date-from">from</div>
                                <div class="day-selector__inside-date-price">
                                    £{{ day.lowestPrice }}pp
                                </div>
                                <div class="day-selector__inside-date-info" v-if="(day.information !== '' && day.information.join !== 'undefined')">
                                    {{ day.information.join(", ") }}
                                </div>
                            </template>
                        </div>
                    </template>




                </div>
            </template>
            <div class="small-3 medium-3">
                &nbsp;
            </div>
            <div class="small-3 medium-3">
                &nbsp;
            </div>
        </div>

    </div>

</template>

<script>
	export default {
		props: {
			value: Object,
			options: Array,
			locale: {
				type: String,
				default: 'en'
			},
			daysOfTheWeekFormat: {
				type: String,
				default: 'ddd'
			},
			weekdayAdjustment: {
				type: Number,
				default: 0
			},
            booking: Object,
            displayBackToParty: {
				type: Boolean,
                default: true
            },
			isSuperStar: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				startDate: null,
				endDate: null,
				partsOfTheDay: [
					{
						label: 'Morning',
						start: '08:00',
						end: '11:30',
					},
					{
						label: 'Midday',
						start: '11:30',
						end: '14:00',
					},
					{
						label: 'Afternoon',
						start: '14:00',
						end: '16:30',
					},
					{
						label: 'Twilight',
						start: '16:30',
						end: '18:00',
					},
				]
			}
		},
		beforeMount() {
			this.startDate = _.head(this.options).date.clone().locale(this.locale);
			this.endDate = _.last(this.options).date.clone().locale(this.locale);
		},
        mounted() {
			$(document).on('click', '.small-v-tooltip', () => {
                this.$emit('continueBooking');
			});
        },
        beforeDestroy() {
	        $(document).off('click', '.small-v-tooltip');
        },
		computed: {
			mediumTooltipOptions() {
				return {
					trigger: 'click',
					placement: 'top',
					classes: `day-selector__selected-wrapper -medium-day-selector-wrapper show-for-medium-only`,
					content: `
                    <div class="day-selector__responsive-selected">
                        <div class="day-selector-resposive-close image-misc__image--cross"></div>
                        <h1>You've selected...</h1>
                        <h2 class="day-selector__responsive-selected--date">
                            ${this.value !== null && this.value.date ? this.value.date.format('dddd Do MMMM') : ``}
                        </h2>
                        <div>
                            ${this.showAdults ? `
                                <h3>
                                    ${this.booking && this.booking.adults ? this.booking.adults : ``}x ${this.adultsLabel}
                                    ${this.totalAdultsPrice ? `£${this.totalAdultsPrice}` : ``}
                                </h3>`
						: ``}
                            ${this.showSeniors ? `
                                <h3>
                                    ${this.booking && this.booking.seniors ? this.booking.seniors : ``}x ${this.seniorsLabel}
                                    ${this.totalSeniorsPrice ? `£${this.totalSeniorsPrice}` : ``}
                                </h3>
                            ` : ``}
                            ${this.showChildren ? `
                                <h3>
                                    ${this.booking && this.booking.children ? this.booking.children : ``}x ${this.childrenLabel}
                                    ${this.totalChildrenPrice ? `£${this.totalChildrenPrice}` : ``}
                                </h3>
                            ` : ``}
                           ${this.showInfants ? `
                                <h3>
                                    ${this.booking && this.booking.babies ? this.booking.babies : ``}x ${this.infantsLabel}
                                </h3>
                            ` : ``}
                           ${this.showCarers ? `
                                <h3>
                                    ${this.booking && this.booking.carers ? this.booking.carers : ``}x ${this.carersLabel}
                                </h3>
                            ` : ``}
                           ${this.showWheelchairs ? `
                                <h3>
                                    ${this.booking && this.booking.wheelchairs ? this.booking.wheelchairs : ``}x ${this.wheelchairsLabel}
                                </h3>
                            ` : ``}
                        </div>
                        <br>
                        <div>
                            <a class="button -inverse -mobile margin-bottom-medium small-v-tooltip">
                                <span class="button__inner"><span class="button__text">Continue Booking</span>
                                <svg class="button__arrow">
                                    <use xlink:href="/images/svg/sprite.svg#button-arrow" xmlns:xlink="http://www.w3.org/1999/xlink"></use>
                                </svg></span>
                            </a>
                        </div>
                        ${this.isSuperStar ? `
                            <div class="day-selector__super-star-day">
                                <h2 class="heading-2--calendar-day"  style="margin-bottom: -5px;">
                                    Please note:
                                </h2>
                                <p>
                                    These days are specially designed for children with additional needs. For more information, please <a href="/superstar-days" class="text-link"  target="_blank">click here</a>
                                </p>
                            </div>
                        ` : ``}

                    </div>`
				};
			},
			smallTooltipOptions() {
				return {
					trigger: 'click',
					placement: 'top',
					classes: `day-selector__selected-wrapper show-for-small-only`,
					content: `
                    <div class="day-selector__responsive-selected">
                        <div class="day-selector-resposive-close image-misc__image--cross"></div>
                        <h1>You've selected...</h1>
                        <h2 class="day-selector__responsive-selected--date">
                            ${this.value !== null && this.value.date ? this.value.date.format('dddd Do MMMM') : ``}
                        </h2>
                        <div>
                            ${this.showAdults ? `
                                <h3>
                                    ${this.booking && this.booking.adults ? this.booking.adults : ``}x ${this.adultsLabel}
                                    ${this.totalAdultsPrice ? `£${this.totalAdultsPrice}` : ``}
                                </h3>`
                            : ``}
                            ${this.showSeniors ? `
                                <h3>
                                    ${this.booking && this.booking.seniors ? this.booking.seniors : ``}x ${this.seniorsLabel}
                                    ${this.totalSeniorsPrice ? `£${this.totalSeniorsPrice}` : ``}
                                </h3>
                            ` : ``}
                            ${this.showChildren ? `
                                <h3>
                                    ${this.booking && this.booking.children ? this.booking.children : ``}x ${this.childrenLabel}
                                    ${this.totalChildrenPrice ? `£${this.totalChildrenPrice}` : ``}
                                </h3>
                            ` : ``}
                           ${this.showInfants ? `
                                <h3>
                                    ${this.booking && this.booking.babies ? this.booking.babies : ``}x ${this.infantsLabel}
                                </h3>
                            ` : ``}
                           ${this.showCarers ? `
                                <h3>
                                    ${this.booking && this.booking.carers ? this.booking.carers : ``}x ${this.carersLabel}
                                </h3>
                            ` : ``}
                           ${this.showWheelchairs ? `
                                <h3>
                                    ${this.booking && this.booking.wheelchairs ? this.booking.wheelchairs : ``}x ${this.wheelchairsLabel}
                                </h3>
                            ` : ``}
                        </div>
                        <br>
                        <div>
                            <a class="button -inverse -mobile margin-bottom-medium small-v-tooltip">
                                <span class="button__inner"><span class="button__text">Continue Booking</span>
                                <svg class="button__arrow">
                                    <use xlink:href="/images/svg/sprite.svg#button-arrow" xmlns:xlink="http://www.w3.org/1999/xlink"></use>
                                </svg></span>
                            </a>
                        </div>
                        ${this.isSuperStar ? `
                            <div class="day-selector__super-star-day">
                                <h2 class="heading-2--calendar-day"  style="margin-bottom: -5px;">
                                    Please note:
                                </h2>
                                <p>
                                    These days are specially designed for children with additional needs. For more information, please <a href="/superstar-days" class="text-link" target="_blank">click here</a>
                                </p>
                            </div>
                        ` : ``}
                    </div>`
				};
			},
			adultsLabel() {
				return (this.booking.adults > 1) ? 'Adults' : 'Adult';
			},
			seniorsLabel() {
				return (this.booking.seniors > 1) ? 'Seniors' : 'Senior';
			},
			childrenLabel() {
				return (this.booking.children > 1) ? 'Children' : 'Child';
			},
			infantsLabel() {
				return (this.booking.babies > 1) ? 'Infants' : 'Infant';
			},
			carersLabel() {
				return (this.booking.carers > 1) ? 'Carers' : 'Carer';
			},
			wheelchairsLabel() {
				return (this.booking.wheelchairs > 1) ? 'Wheelchairs' : 'Wheelchair';
			},
			currentTotalPrice() {
				let booking = this.$store.getters.getBooking;

				if (booking) {
					return parseFloat(parseFloat(booking.adultsTickets) + parseFloat(booking.seniorAmount)
						+ parseFloat(booking.childAmount) + parseFloat(booking.infantAmount)
						+ parseFloat(booking.carerAmount)).toFixed(2);
				}

				return 0;
			},
			totalAdultsPrice() {
				return _.has(this.prices, 'adultPrice') ? (parseFloat(this.prices.adultPrice)).toFixed(2) : 0;
			},
			totalSeniorsPrice() {
				return _.has(this.prices, 'seniorPrice') ? (parseFloat(this.prices.seniorPrice)).toFixed(2) : 0;
			},
			totalChildrenPrice() {
				return _.has(this.prices, 'childPrice') ? (parseFloat(this.prices.childPrice)).toFixed(2) : 0;
			},
			totalSlotPrice() {
				return _.has(this.prices, 'totalPrice') ? parseFloat(this.prices.totalPrice).toFixed(2) : 0;
			},
			totalPrice() {
				let extras = _.reduce(this.extras, (total, extra) => {
					return total += parseFloat(extra.totalExtraPrice);
				}, 0);

				return parseFloat(parseFloat(this.totalSlotPrice) + parseFloat(extras)).toFixed(2);
			},
			showAdults() {
				return (this.booking && this.booking.adults > 0);
			},
			showSeniors() {
				return (this.booking.seniors > 0);
			},
			showChildren() {
				return (this.booking.children > 0);
			},
			showInfants() {
				return (this.booking.babies > 0);
			},
			showCarers() {
				return (this.booking.carers > 0);
			},
			showWheelchairs() {
				return (this.booking.wheelchairs > 0);
			},
			showExtras() {
				return (this.extras && this.extras.length > 0);
			},
			showTotalPrice() {
				return (this.totalPrice > 0);
			},
			daysOfTheWeek() {
				return _.map([0, 1, 2, 3, 4, 5, 6], day => {
					let weekday = day + this.weekdayAdjustment;

					return moment().weekday(weekday).format(this.daysOfTheWeekFormat);
				});
			},
			weeks() {
				if (this.startDate === null || this.endDate === null) {
					return [];
				}

				let currentWeek = this.startDate.clone().startOf('week').day(this.weekdayAdjustment);
				let endDate = this.endDate.clone().endOf('day');
				let weeks = [];

				while (currentWeek.isSameOrBefore(endDate)) {
					let currentDay = currentWeek.clone();
					let days = [];

					for (let i = 0; i < 7; i++) {
						let day = _.find(this.options, day => {
							day.date = moment(day.date);
							return day.date.isSame(currentDay, 'day');
						});

						if (typeof day === 'undefined') {
							day = {
								date: currentDay.clone(),
								availableSlots: 0,
								isActive: false,
								isSelected: false,
							};
						}

						days.push(day);
						currentDay.add(1, 'day');
					}

					weeks.push(days);
					currentWeek.add(1, 'week');
				}

				return weeks;
			}
		},
		methods: {
			isCurrent(day) {
				return (this.value && day) ? (day.date.isSame(this.value.date, 'hour')) : false;
			},
			change(day, responsive = false) {
				if (day.isActive) {
					if (responsive) {
						const activeInfo = $('.active.info').find('.day-selector__inside-date--small, .day-selector__inside-date--medium');
						$.each(activeInfo, function (k, i) {
							if(i._tooltip) {
								i._tooltip.hide();
							}
						});
					}
					this.$emit('change', day);
				}
			},
			groupTotal(slot) {
				return parseFloat(parseFloat(slot.nicePrice) * (this.$store.state.adults + this.$store.state.seniors + this.$store.state.children)).toFixed(2);
			},
			backToCalendar() {
				this.$emit('backToCalendar');
			}
		}
	}
</script>
