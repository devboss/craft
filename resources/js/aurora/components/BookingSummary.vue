<template>
    <div>
        <h2 class="heading-2--gill-sans">
            You've selected...
        </h2>

        <h3 v-if="day && day.date">
            {{ day.date.format('dddd Do MMMM') }}
            <p>
                <span class="booking-summary__time" v-if="time && time.time">@ {{ time.time }}</span>
            </p>
        </h3>

        <h3 v-if="showAdults">
            {{ booking.adults }}x {{ adultsLabel }}
            <template v-if="totalAdultsPrice"><span class="booking-summary__price text-right">£{{ totalAdultsPrice
                }}</span></template>
        </h3>
        <h3 v-if="showSeniors">
            {{ booking.seniors }}x {{ seniorsLabel }}
            <template v-if="totalSeniorsPrice"><span class="booking-summary__price text-right">£{{ totalSeniorsPrice
                }}</span></template>
        </h3>
        <h3 v-if="showChildren">
            {{ booking.children }}x {{ childrenLabel }}
            <template v-if="totalChildrenPrice"><span class="booking-summary__price text-right">£{{ totalChildrenPrice
                }}</span></template>
        </h3>
        <h3 v-if="showInfants">{{ booking.babies }}x {{ infantsLabel }}</h3>
        <h3 v-if="showCarers">{{ booking.carers }}x {{ carersLabel }}</h3>
        <h3 v-if="showWheelchairs">{{ booking.wheelchairs }}x {{ wheelchairsLabel }}</h3>

        <template v-if="showExtras">
            <div class="booking-summary__extras">
                <h3 v-for="extra in this.extras">
                    <template v-if="extra.type === 'INSURANCE'">
                        1 x {{ extra.name }} <span class="booking-summary__price text-right">£{{ parseFloat(extra.totalExtraPrice).toFixed(2)
                        }}</span>
                    </template>
                    <template v-else>


                        {{ extra.qty }} x <span v-html="extra.name"></span><span
                            class="booking-summary__price text-right">£{{ extra.totalExtraPrice }}
                            <template v-if="canRemoveExtras">
                                <span class="image-misc__image--removeextra show-for-small-only"
                                      v-if="extra.type !== 'INSURANCE'" @click="removeExtra(extra.id)"></span>
                            </template>
                             <template v-if="canRemoveExtras">
                                <span class="image-misc__image--removeextrainverse show-for-medium"
                                      v-if="extra.type !== 'INSURANCE'" @click="removeExtra(extra.id)"></span>
                             </template>

                        </span>

                    </template>
                </h3>
            </div>

        </template>
        <template v-if="transfer">
            <h3 v-if="showTotalPrice">Current booking total<br>£{{ paidAmount }}</h3>
            <h3 v-if="showTotalPrice">New booking total<br>£{{ totalPrice }}</h3>
            <h3 v-if="showTotalPrice">Difference<br>£{{ totalPriceDifference }}</h3>
        </template>
        <template v-else>
            <p v-if="promoCodeDescription">{{ promoCodeDescription }}</p>
            <p v-if="showTotalPrice" class="booking-summary__total-price">Total price: <span
                    class="booking-summary__total-price-price">£{{ totalPrice }}</span></p>
        </template>

        <slot></slot>

        <div v-if="showInfoBox">

            <h2 class="heading-2--calendar-day" v-if="!isPremiumBooking">
                Prices includes:
            </h2>

            <h2 class="heading-2--calendar-day" v-if="isPremiumBooking">
                The tour includes:
            </h2>

            <ul class="booking-summary__list" v-if="!isPremiumBooking">
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

            <ul class="booking-summary__list" v-if="isPremiumBooking">
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

        <div v-if="isSuperStar">
            <h2 class="heading-2--calendar-day">
                Please note:
            </h2>
            <p>
                These days are specially designed for children with additional needs. For more information, please <a href="/superstar-days" class="text-link"  target="_blank">click here</a>
            </p>
        </div>

        <div class="input-container -card-container" v-if="showCards">
            <div class="image-misc__image--cards"></div>
        </div>

    </div>
</template>

<script>
	export default {
		props: {
            promoCodeDescription: String,
			day: Object,
			time: Object,
			booking: Object,
			extras: Array,
			prices: Object,
			showInfoBox: {
				type: Boolean,
				default: false
			},
			canRemoveExtras: {
				type: Boolean,
				default: true
			},
			transfer: {
				type: Boolean,
				default: false
			},
            emitToRemove: {
			    type: Boolean,
                default: false
            },
            showCards: {
            	type: Boolean,
                default: false
            },
            isSuperStar: {
            	type: Boolean,
                default: false
            },
            isPremiumBooking: {
            	type: Boolean,
                default: false
            }
		},
		computed: {
			totalPriceDifference() {
				let difference = parseFloat(parseFloat(this.totalPrice) - parseFloat(this.paidAmount)).toFixed(2);

				return difference >= 0 ? difference : 0;
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
				}, 0.00);

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
            paidAmount() {
			    return this.$store.getters.getBooking.paidAmount;
            }
		},
		methods: {
			removeExtra(id) {
			    if(this.emitToRemove) {
			       this.$emit('removeExtra', id);
                } else {
                    this.$store.commit('removeExtra', id);
                }
			}
		}
	}
</script>