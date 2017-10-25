<template>
    <div class="row">
        <div class="small-12 column">
            <stop-selling-warning class="margin-top-medium margin-bottom-none"></stop-selling-warning>
        </div>

        <div class="small-12 column">
            <h1 class="image-title small-bottom-margin">
            <span class="image-title__image--your-time inline-block text-center">
                Your Time
            </span>
            </h1>
        </div>
        <div class="small-12 column">
            <h2 class="heading-2--my-experience-booked-time text-center">
                {{ booking.bookedTime }} on {{bookedDay}}
            </h2>

            <h2 class="heading-2--my-experience-booked-time text-center">
                {{ bookedDate }}
            </h2>
        </div>

        <div class="small-12 column margin-bottom-small">
            <p class="text-center">
                <span class="my-experience__subtitle--booking-reference">
                    Booking Reference:
                </span>
                <span class="my-experience__subtitle--actual-booking-reference">
                    {{ booking.bookingReference }}
                </span>
            </p>
        </div>

        <div class="small-12 column">
            <div class="alert alert-info">
                Please note that the maximum family group size for this tour is 8, you will be able to add a maximum of {{ maxAvailableTickets }} ADDITIONAL TICKETS to your booking, subject to availability.
            </div>
        </div>

        <div class="medium-1 column"></div>

        <div class="small-12 column">
            <a :class="['button margin-bottom-medium rotate-ccw-small my-experience__change-your-date', {'button--disabled': mustStopSelling}]" @click="changeDate">
                <span class="button__inner">
                    <span class="button__text">Change your date </span>
                    <svg class="button__arrow">
                        <use xlink:href="/images/svg/sprite.svg#button-arrow"
                             xmlns:xlink="http://www.w3.org/1999/xlink"></use>
                    </svg>
                </span>
            </a>
        </div>

        <div class="small-12 column">
            <h1 class="image-title small-bottom-margin">
            <span class="image-title__image--your-party inline-block text-center">
                Your Time
            </span>
            </h1>
        </div>

        <div class="small-12 column my-experience__group-comp">
            <div>
                <div class="my-experience__group-number text-center">
                    {{booking.adultsTickets}}
                </div>
                <div class="my-experience__group-number-label text-center">

                    Adults

                </div>
            </div>
            <div>
                <div class="my-experience__group-number text-center">
                    {{booking.seniorsTickets}}
                </div>
                <div class="my-experience__group-number-label text-center">
                    Seniors

                </div>
            </div>
            <div>
                <div class="my-experience__group-number text-center">
                    {{booking.childrenTickets}}
                </div>
                <div class="my-experience__group-number-label text-center">

                    Children


                </div>
            </div>
            <div>
                <div class="my-experience__group-number text-center">
                    {{booking.infantsTickets}}
                </div>
                <div class="my-experience__group-number-label text-center">

                    Infants


                </div>
            </div>
            <div>
                <div class="my-experience__group-number text-center">
                    {{booking.carersTickets}}
                </div>
                <div class="my-experience__group-number-label text-center">

                    Carers


                </div>
            </div>
            <div>
                <div class="my-experience__group-number text-center">
                    {{booking.wheelchairsTickets}}
                </div>
                <div class="my-experience__group-number-label text-center">

                    Wheelchair

                </div>
            </div>
        </div>

        <div class="small-12 column text-center my-experience__total-price">
            <span>
                TOTAL:
            </span>
            <span class="my-experience__group-number">
                &pound; {{booking.paidAmount}}
            </span>
        </div>

        <div class="small-12 column">
            <a :class="['button margin-bottom-medium rotate-ccw-small my-experience__change-your-date', {'button--disabled': mustStopSelling}]" @click="addPeople">
                <span class="button__inner">
                    <span class="button__text">Add people </span>
                    <svg class="button__arrow">
                        <use xlink:href="/images/svg/sprite.svg#button-arrow"
                             xmlns:xlink="http://www.w3.org/1999/xlink"></use>
                    </svg>
                </span>
            </a>
        </div>
    </div>
</template>

<script>
	import PartySummary from '../PartySummary.vue';
    import StopSellingWarning from '../StopSellingWarning.vue';
	import Booking from '../../mixins/Booking';
	import MyDetails from '../../mixins/MyDetails';
    import StopSelling from '../../mixins/StopSelling';

	export default {
		components: {
			PartySummary,
            StopSellingWarning,
		},
		mixins: [Booking, MyDetails, StopSelling],
		computed: {
			bookedDate() {
				return moment(this.booking.bookedDate).format('Do MMMM YYYY');
			},
			bookedDay() {
				return moment(this.booking.bookedDate).format('dddd');
			},
            maxAvailableTickets() {
                let maxAvailableTickets = 8 - (this.booking.adultsTickets + this.booking.seniorsTickets + this.booking.childrenTickets
                    + this.booking.infantsTickets + this.booking.carersTickets);

                return maxAvailableTickets > 0 ? maxAvailableTickets : 0;
            },
		},
        methods: {
			changeDate() {
				if (!this.mustStopSelling) {
                    this.$router.push({name: 'availability.day'});
                }
            },
	        addPeople() {
                if (!this.mustStopSelling) {
                    this.$router.push({name: 'my-party.create'});
                }
            }
        }
	}
</script>
