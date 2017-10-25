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

                    <div class="slot-selector__nav-wrapper">
                        <nav>
                            <ul class="pager slot-selector__nav">
                                <li :class="['previous', { disabled: !hasPrevDay }]">
                                    <a href="#" @click.prevent="prevDay">
                                        <div class="image-misc__image--backarrow -previous"></div> Previous day
                                    </a>
                                </li>
                                <li :class="['next text-right', { disabled: !hasNextDay }]">
                                    <a href="#" @click.prevent="nextDay">
                                        Next day <div class="image-misc__image--backarrow -next"></div>
                                    </a>
                                </li>
                            </ul>
                        </nav>
                    </div>


                    <slot-selector :booking="party"  :options="availableSlots" :selectedDay="selectedDay" :is-premium-search="this.booking.premiumSlot ? this.booking.premiumSlot : false" :slots="slots" :party="party" :value="selectedSlot" @continueBooking="continueBooking" @change="updateSlot"></slot-selector>
                </div>
                <div class="small-12 medium-12 large-3 column nopaddingright show-for-large">
                    <booking-summary :booking="party" :prices="selectedSlot" :show-info-box="true" :is-premium-booking="this.booking.premiumSlot ? this.booking.premiumSlot : false" :transfer="true" @removeExtra="removeExtra">

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
    import SlotSelector from '../SlotSelector.vue';
    import BookingSummary from '../BookingSummary.vue';
    import Booking from '../../mixins/Booking';

    export default {
        components: {
            'slot-selector': SlotSelector,
            'booking-summary': BookingSummary
        },
        mixins: [Booking],
        computed: {
            availableSlots() {
                return _.get(this.selectedDay, 'availableSlots', 0);
            },
            canContinueBooking() {
                return this.selectedSlot;
            },
            hasPrevDay() {
                return this.checkPrevOrNext('prev');
            },
            hasNextDay() {
                return this.checkPrevOrNext('next');
            },
            /*
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
            }*/
        },
        mounted() {
            if(this.selectedDay === null) {
                return this.$router.push({name: 'availability.day'});
            }
            this.dateChanged();
        },
        methods: {
            checkPrevOrNext(direction) {
                let hasPrevOrNext = false;
                if(this.selectedDay === null) {
                    return hasPrevOrNext;
                }

                const date = moment(this.selectedDay.date);
                this.days.forEach((val, i) => {
                    if(direction === 'prev') {
                        if(val.date && moment(val.date).isBefore(date)) {
                            hasPrevOrNext = true;
                        }
                    }
                    if(direction === 'next') {
                        if(val.date && moment(val.date).isAfter(date)) {
                            hasPrevOrNext = true;
                        }
                    }
                });

                return hasPrevOrNext;

            },
            updateSlot(slot) {
                this.$store.commit('slot', slot);
            },
            firstAvailableDay(currentMomentDay, step) {
                const filteredDays = _.filter(this.days, (val, i) => {
                    if(step < 0) {
                        //prev
                        return (val.date && moment(val.date).isBefore(currentMomentDay) && val.availableSlots && val.availableSlots > 0);
                    }

                    if(step > 0) {
                        //next
                        return (val.date && moment(val.date).isAfter(currentMomentDay) && val.availableSlots && val.availableSlots > 0);
                    }
                });
                if(filteredDays.length > 0) {
                    if(step < 0) {
                        return _.last(filteredDays);
                    }
                    if(step > 0) {
                        return _.head(filteredDays);
                    }
                }
            },
            /*
            firstAvailableDay(currentIndex, step) {
                let day = this.days[currentIndex + step];

                if (_.has(day, 'availableSlots') && day.availableSlots > 0) {
                    return day;
                }

                return this.firstAvailableDay(currentIndex + step, step);
            },*/
            removeExtra() {
                console.log('remove extra');
            },
            continueBooking() {
                let vm = this;
                this.$store.dispatch('reserveTransfer')
                    .then(paymentRequired => {
                        if (paymentRequired) {
                            vm.$router.push({name: 'transfer.payment'});
                        } else {
                            vm.$router.push({name: 'transfer.complete'});
                        }
                    });
//                this.$store.dispatch('reserveSlot').then(response => {
//                    if(response.status === 200) {
//                        this.$store.commit('resetReservationExpiry');
//                        this.$store.commit('setReservationExpiry', moment(response.data.validUntil));
//                        this.$router.push({name: 'extraSelector'});
//                    }
//                }).catch(error => {
//                    console.error(error);
//                });
            },
            indexOf(day) {
                let currentDay = day;

                return _.findIndex(this.days, day => {
                    return day.date.isSame(currentDay.date, 'day');
                });
            },
            prevDay() {
                if(this.hasPrevDay) {
                    this.changeDay(-1);
                }
            },
            nextDay() {
                if(this.hasNextDay) {
                    this.changeDay(1);
                }
            },
            /*prevDay() {
                this.changeDay(-1);
            },
            nextDay() {
                this.changeDay(1);
            },*/
            changeDay(step) {
                try {

                    const activeInfo = $('.active.info').find('.day-selector__inside-date--small, .day-selector__inside-date--medium');
                    $.each(activeInfo, function (k, i) {
                        if(i._tooltip) {
                            i._tooltip.hide();
                        }

                    });

                    this.$store.commit('day', this.firstAvailableDay(moment(this.selectedDay.date), step));
                    this.$store.commit('slot', null);
                    this.dateChanged();
                } catch (error) {
                    if (!(error instanceof RangeError)) {
                        throw error;
                    }
                }
            },
            dateChanged() {
                this.$store.dispatch('loadSlotAvailability');
            }
        }
    }
</script>