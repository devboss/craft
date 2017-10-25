<template>
    <div class="row nopadding">
        <div class="small-3 medium-3 large-3 column text-center show-for-medium " v-for="part in partsOfTheDay">
            <h2 class="heading-2--calendar-day">
                {{ part.label }}
            </h2>
        </div>

        <div class="small-12 medium-12 large-12 column text-center show-for-large nopadding" v-for="row in optionsGrid">
            <div class="row nopadding slot-selector__slots-wrapper">
                <div :class="['small-3 medium-3 large-3 column nopadding', {active: (slot && slot.id)}, {info: isCurrent((slot && slot.id) ? slot.id : false)}]"
                     v-for="slot in row" @click="slot.id ? change(slot) : null">
                    <div class="slot-selector__slot-inner">
                        <template v-if="slot && slot.id">
                            <h3>{{ slot.time }}</h3>
                            <div>
                                <span class="slot-selector__group-total">
                                   Group Total:
                                </span>
                                <span class="slot-selector__group-price">
                                    £{{ slot.totalPrice }}
                                </span>
                                <div class="slot-selector__info text-left"
                                     v-if="(slot.information !== '' && slot.information.join !== 'undefined')">
                                    <span class="inline-block" v-for="inf in slot.information">
                                        {{inf}}
                                    </span>
                                </div>
                            </div>
                        </template>
                        <template v-else-if="typeof slot !== 'undefined'">
                            <div class="slot-selector__slot-inner--unavailable">
                                <span class="slot-selector__group-price slot-selector__group-price--unavailable">
                                    TOY FACTORY FULL
                                </span>
                            </div>
                        </template>
                    </div>
                </div>
            </div>
        </div>

        <div class="small-12 medium-12 large-12 column text-center show-for-medium-only" v-for="row in optionsGrid">
            <div class="row nopadding slot-selector__slots-wrapper">
                <div :class="['small-3 medium-3 large-3 column', {active: (slot && slot.id)}, {info: isCurrent((slot && slot.id) ? slot.id : false)}]"
                     v-for="slot in row" @click="slot.id ? change(slot, true) : null">

                    <template v-if="(slot && slot.id)">
                        <div :class="['slot-selector__slot-inner slot-selector__medium-slot', { 'day-selector__inside-date--medium': (slot && slot.id) }, {'day-selector__inside-date-unavailable--medium': !(slot && slot.id)}]"
                             v-tooltip="mediumTooltipOptions">
                            <template v-if="slot && slot.id">
                                <h3>{{ slot.time }}</h3>
                                <div>
                                    <span class="slot-selector__group-total">
                                       Group Total:
                                    </span>
                                            <span class="slot-selector__group-price">
                                        £{{ slot.totalPrice }}
                                    </span>
                                    <div class="slot-selector__info text-left" v-if="(slot.information !== '' && slot.information.join !== 'undefined')">
                                        {{ slot.information.join(", ") }}
                                    </div>
                                </div>
                            </template>
                            <template v-else-if="typeof slot !== 'undefined'">
                                <div class="slot-selector__slot-inner--unavailable">
                                <span class="slot-selector__group-price slot-selector__group-price--unavailable">
                                    TOY FACTORY FULL
                                </span>
                                </div>
                            </template>
                        </div>
                    </template>

                    <template v-else>
                        <div :class="['slot-selector__slot-inner slot-selector__medium-slot', { 'day-selector__inside-date--medium': (slot && slot.id) }, {'day-selector__inside-date-unavailable--medium': !(slot && slot.id)}]">
                            <template v-if="slot && slot.id">
                                <h3>{{ slot.time }}</h3>
                                <div>
                                    <span class="slot-selector__group-total">
                                       Group Total:
                                    </span>
                                            <span class="slot-selector__group-price">
                                        £{{ slot.totalPrice }}
                                    </span>
                                    <div class="slot-selector__info text-left"
                                         v-if="(slot.information !== '' && slot.information.join !== 'undefined')">
                                        {{ slot.information.join(", ") }}
                                    </div>
                                </div>
                            </template>
                            <template v-else-if="typeof slot !== 'undefined'">
                                <div class="slot-selector__slot-inner--unavailable">
                                <span class="slot-selector__group-price slot-selector__group-price--unavailable">
                                    TOY FACTORY FULL
                                </span>
                                </div>
                            </template>
                        </div>
                    </template>
                </div>
            </div>
        </div>


        <div class="small-12 medium-12 large-12 column text-center show-for-small-only nopadding"
             v-for="row in optionsGridSmall">
            <div class="row nopadding slot-selector__slots-wrapper">
                <div class="small-12 column slot-selector-small-heading">
                    <h2 class="heading-2--calendar-day">
                        {{ row.part }}
                    </h2>

                </div>
                <div :class="['small-6 column ', {active: (slot && slot.id)}, {info: isCurrent((slot && slot.id) ? slot.id : false)}]"
                     v-for="slot in row.times" @click="slot.id ? change(slot, true) : null">
                    <template v-if="(slot && slot.id)">
                        <div :class="['slot-selector__slot-inner -small-slot', { 'day-selector__inside-date--medium': (slot && slot.id) }, {'day-selector__inside-date-unavailable--medium': !(slot && slot.id)}]"
                             v-tooltip="smallTooltipOptions">
                            <template v-if="(slot && slot.id)">
                                <h3>{{ slot.time }}</h3>
                                <div>
                                    <span class="slot-selector__group-total">
                                       Group Total:
                                    </span>
                                        <span class="slot-selector__group-price">
                                        £{{ slot.totalPrice }}
                                    </span>
                                    <div class="slot-selector__info text-left"
                                         v-if="(slot.information !== '' && slot.information.join !== 'undefined')">
                                        {{ slot.information.join(", ") }}
                                    </div>
                                </div>
                            </template>
                            <template v-else-if="typeof slot !== 'undefined'">
                                <div class="slot-selector__slot-inner--unavailable">
                                <span class="slot-selector__group-price slot-selector__group-price--unavailable">
                                    TOY FACTORY FULL
                                </span>
                                </div>
                            </template>
                        </div>
                    </template>

                    <template v-else>
                        <div :class="['slot-selector__slot-inner -small-slot', { 'day-selector__inside-date--medium': (slot && slot.id) }, {'day-selector__inside-date-unavailable--medium': !(slot && slot.id)}]">
                            <template v-if="slot && slot.id">
                                <h3>{{ slot.time }}</h3>
                                <div>
                                    <span class="slot-selector__group-total">
                                       Group Total:
                                    </span>
                                        <span class="slot-selector__group-price">
                                        £{{ slot.totalPrice }}
                                    </span>
                                    <div class="slot-selector__info text-left"
                                         v-if="(slot.information !== '' && slot.information.join !== 'undefined')">
                                        {{ slot.information.join(", ") }}
                                    </div>
                                </div>
                            </template>
                            <template v-else-if="typeof slot !== 'undefined'">
                                <div class="slot-selector__slot-inner--unavailable">
                                <span class="slot-selector__group-price slot-selector__group-price--unavailable">
                                    TOY FACTORY FULL
                                </span>
                                </div>
                            </template>
                        </div>
                    </template>

                </div>
            </div>
        </div>

    </div>

</template>

<script>
	export default {
		props: {
			options: Number,
			value: Object,
			party: Object,
			slots: Array,
			selectedDay: Object,
			booking: Object,
            isPremiumSearch: {
				type: Boolean,
                default: false
            }
		},
		data() {
			return {
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
						end: '23:59',
					},
				]
			}
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
					classes: `show-for-medium-only slot-selector__medium`,
					content: `
                    <div class="day-selector__responsive-selected">
                        <div class="day-selector-resposive-close image-misc__image--cross"></div>
                        <h1>You've selected...</h1>
                        <h2 class="day-selector__responsive-selected--date">
                            ${this.selectedDay !== null && this.selectedDay.date && this.value && this.value.time ? this.selectedDay.date.format('dddd Do MMMM') + ` @ ` + this.value.time : ``}
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
                            <a class="button -inverse -mobile margin-bottom-small small-v-tooltip">
                                <span class="button__inner"><span class="button__text">Continue Booking</span>
                                <svg class="button__arrow">
                                    <use xlink:href="/images/svg/sprite.svg#button-arrow" xmlns:xlink="http://www.w3.org/1999/xlink"></use>
                                </svg></span>
                            </a>
                        </div>
                        <div class="text-center slot-selector__whats-included">
                            See what’s included <div class="image-misc__image--arrowdown inline-block"></div>
                        </div>
                        ${this.isPremiumSearch ?
                            `
                                <div style="display: none;">
                                    <ul class="booking-summary__list -responsive-whats-included">
                                        <li>A private meet & greet with The Elf Travel Master</li>
                                        <li>Front row seats in The Glade and a personal audience with Sage</li>
                                        <li>Freedom of the Elven Village - stay for as long as you like, before you visit Father Christmas</li>
                                        <li>A reserved table, and meal in the Elven Restaurant</li>
                                        <li>A scrapbook containing the photos of your meeting with Father Christmas</li>
                                        <li>Conker Hats for everybody</li>
                                        <li>A copy of Mother Christmas’ Puzzoodles book for every child</li>
                                        <li>VIP parking</li>
                                        <li>All of this is in addition to the Premium Lapland<sup>UK</sup> experience</li>
                                    </ul>
                               </div>

                            `

                            :
                            `
                               <div style="display: none;">
                                    <ul class="booking-summary__list -responsive-whats-included">
                                        <li>Personalised invitation to every child from Father Christmas by post</li>
                                        <li>Entry to Lapland<sup>UK</sup></li>
                                        <li>Elf Passport for every child</li>
                                        <li>All activities, and performances including ice skating</li>
                                        <li>Beautiful gift from Father Christmas for every child</li>
                                        <li>One free photo per booking</li>
                                        <li>Booking fees</li>
                                        <li>Parking at Whitmoor Forest</li>
                                        <li>Christmas Morning Thank You card from Father Christmas for every child</li>
                                    </ul>
                               </div>
                            `
					    }

                    </div>`
				};
			},
			smallTooltipOptions() {
				return {
					trigger: 'click',
					placement: 'top',
					classes: `show-for-small-only slot-selector__medium`,
					content: `
                    <div class="day-selector__responsive-selected">
                        <div class="day-selector-resposive-close image-misc__image--cross"></div>
                        <h1>You've selected...</h1>
                        <h2 class="day-selector__responsive-selected--date">
                            ${this.selectedDay !== null && this.selectedDay.date && this.value && this.value.time ? this.selectedDay.date.format('dddd Do MMMM') + ` @ ` + this.value.time : ``}
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
                            <a class="button -inverse -mobile margin-bottom-small small-v-tooltip">
                                <span class="button__inner"><span class="button__text">Continue Booking</span>
                                <svg class="button__arrow">
                                    <use xlink:href="/images/svg/sprite.svg#button-arrow" xmlns:xlink="http://www.w3.org/1999/xlink"></use>
                                </svg></span>
                            </a>
                        </div>
                        <div class="text-center slot-selector__whats-included">
                            See what’s included <div class="image-misc__image--arrowdown inline-block"></div>
                        </div>
                        ${this.isPremiumSearch ?
						    `

                                <div style="display: none;">
                                    <ul class="booking-summary__list -responsive-whats-included">
                                        <li>A private meet & greet with The Elf Travel Master</li>
                                        <li>Front row seats in The Glade and a personal audience with Sage</li>
                                        <li>Freedom of the Elven Village - stay for as long as you like, before you visit Father Christmas</li>
                                        <li>A reserved table, and meal in the Elven Restaurant</li>
                                        <li>A scrapbook containing the photos of your meeting with Father Christmas</li>
                                        <li>Conker Hats for everybody</li>
                                        <li>A copy of Mother Christmas’ Puzzoodles book for every child</li>
                                        <li>VIP parking</li>
                                        <li>All of this is in addition to the Premium Lapland<sup>UK</sup> experience</li>
                                    </ul>
                               </div>

                            `

                            :
                            `
                               <div style="display: none;">
                                    <ul class="booking-summary__list -responsive-whats-included">
                                        <li>Personalised invitation to every child from Father Christmas by post</li>
                                        <li>Entry to Lapland<sup>UK</sup></li>
                                        <li>Elf Passport for every child</li>
                                        <li>All activities, and performances including ice skating</li>
                                        <li>Beautiful gift from Father Christmas for every child</li>
                                        <li>One free photo per booking</li>
                                        <li>Booking fees</li>
                                        <li>Parking at Whitmoor Forest</li>
                                        <li>Christmas Morning Thank You card from Father Christmas for every child</li>
                                    </ul>
                               </div>
                            `
					    }
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
			optionsGrid() {
				return _.zip(..._.map(this.partsOfTheDay, part => {
					return _.filter(this.slots, slot => {
						let startTime = part.start.split(':');
						let endTime = part.end.split(':');

						let start = this.selectedDay.date.clone().hour(_.head(startTime)).minute(_.last(startTime, 1));
						let end = this.selectedDay.date.clone().hour(_.head(endTime)).minute(_.last(endTime, 1));

						const slotSplit = slot.time.split(':');
						const slotDateTime = this.selectedDay.date.clone().set({
							hour: _.head(slotSplit),
							minute: _.last(slotSplit)
						});
						return slotDateTime.isBetween(start, end, null, '[)');
					});
				}));
			},
			optionsGridSmall() {
				return _.map(this.partsOfTheDay, part => {
					return {
						part: part.label, times: _.filter(this.slots, slot => {
							let startTime = part.start.split(':');
							let endTime = part.end.split(':');

							let start = this.selectedDay.date.clone().hour(_.head(startTime)).minute(_.last(startTime, 1));
							let end = this.selectedDay.date.clone().hour(_.head(endTime)).minute(_.last(endTime, 1));

							const slotSplit = slot.time.split(':');
							const slotDateTime = this.selectedDay.date.clone().set({
								hour: _.head(slotSplit),
								minute: _.last(slotSplit)
							});
							return slotDateTime.isBetween(start, end, null, '[)');
						})
					};
				});
			}
		},
		methods: {
			isCurrent(id) {
				if (!id) {
					return false;
				}
				return (this.value && id) ? (this.value.id === id) : false;
			},
			change(slot, responsive = false) {
				if (typeof slot === 'object') {
					if (responsive) {
						const activeInfo = $('.active.info').find('.day-selector__inside-date--small, .day-selector__inside-date--medium');
						$.each(activeInfo, function (k, i) {
							if (i._tooltip) {
								i._tooltip.hide();
							}
						});
						return this.$emit('change', slot);
					}
					this.$emit('change', slot);
				}
			},
			groupTotal(slot) {
				return parseFloat(parseFloat(slot.nicePrice) * (this.party.adults + this.party.seniors + this.party.children)).toFixed(2);
			},
		}
	}
</script>
