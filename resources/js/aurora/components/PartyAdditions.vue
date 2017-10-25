<template>
    <div>
        <div class="party-additions__wrapper -caps">
            <div class="hide-for-small-only">
                Ticket<br>Type
            </div>
            <div class="hide-for-small-only">
                Current<br>Quantity
            </div>
            <div class="hide-for-small-only">
                Additional<br>Ticket
            </div>
            <div class="hide-for-small-only">
                Additional<br>Quantity
            </div>
            <div class="hide-for-small-only">
                Additional<br>Price
            </div>

            <div class="show-for-small-only">
                TKT
            </div>
            <div class="show-for-small-only">
                QTY
            </div>
            <div class="show-for-small-only">
                ADD.
                <br>
                TKT
            </div>
            <div class="show-for-small-only">
                ADD.
                <br>
                QTY
            </div>
            <div class="show-for-small-only">
                ADD.
                <br>
                PRICE
            </div>
        </div>

        <div class="party-additions__wrapper -border -margin">
            &nbsp;
        </div>

        <div class="party-additions__wrapper -margin">
            <div>
                Adult
            </div>
            <div>
                {{ booking.adultsTickets }}
            </div>
            <div>
                £{{ prices.adult }}
            </div>
            <div>
                <multiselect placeholder="0" name="Adult" :options="availableAdultTicketOptions"
                             :searchable="false" track-by="value" label="label" :allow-empty="false" :show-labels="false" @select="ticketSelected"
                             v-model="adultAdditionalQuantity"></multiselect>
            </div>
            <div>
                £{{ adultAdditionalTotal }}
            </div>
        </div>

        <div class="party-additions__wrapper -margin">
            <div>
                Senior
            </div>
            <div>
                {{ booking.seniorsTickets }}
            </div>
            <div>
                £{{ prices.senior }}
            </div>
            <div>
                <multiselect placeholder="0" name="Senior" :options="availableSeniorTicketOptions"
                             :searchable="false" track-by="value" label="label" :allow-empty="false" :show-labels="false"
                             v-model="seniorAdditionalQuantity"></multiselect>
            </div>
            <div>
                £{{ seniorAdditionalTotal }}
            </div>
        </div>
<template v-if="!adultsOnly">
        <div class="party-additions__wrapper -margin">
            <div>
                Child
            </div>
            <div>
                {{ booking.childrenTickets }}
            </div>
            <div>
                £{{ prices.child }}
            </div>
            <div>
                <multiselect placeholder="0" name="Child" :options="availableChildTicketOptions"
                             :searchable="false" track-by="value" label="label" :allow-empty="false" :show-labels="false"
                             v-model="childAdditionalQuantity"></multiselect>
            </div>
            <div>
                £{{ childAdditionalTotal }}
            </div>
        </div>

        <div class="party-additions__wrapper -margin">
            <div>
                Infant
            </div>
            <div>
                {{ booking.infantsTickets }}
            </div>
            <div>
                £0.00
            </div>
            <div>
                <multiselect placeholder="0" name="Infant" :options="availableInfantTicketOptions"
                             :searchable="false" track-by="value" label="label" :allow-empty="false" :show-labels="false"
                             v-model="infantAdditionalQuantity"></multiselect>
            </div>
            <div>
                £0.00
            </div>
        </div>

        <div class="party-additions__wrapper -margin">
            <div>
                Carer
            </div>
            <div>
                {{ booking.carersTickets }}
            </div>
            <div>
                £0.00
            </div>
            <div>
                <multiselect placeholder="0" name="Carer" :options="availableCarerTicketOptions"
                             :searchable="false" track-by="value" label="label" :allow-empty="false" :show-labels="false"
                             v-model="carerAdditionalQuantity"></multiselect>
            </div>
            <div>
                £0.00
            </div>
        </div>
</template>
        <div class="party-additions__wrapper">
            <div>
                &nbsp;
            </div>
            <div>
                &nbsp;
            </div>
            <div>
                &nbsp;
            </div>
            <div>
                &nbsp;
            </div>
            <div>
               TOTAL: £{{ additionalTicketsTotal }}
            </div>
        </div>
        <div class="row nopadding">
            <div class="small-12 column">
                <h2 class="heading-2--doves">
                    Wheelchairs
                </h2>
            </div>
            <div class="small-12 medium-2 column">
                <multiselect placeholder="0" name="numberOfAdditionalWheelchairs"
                             :options="numberOfAdditionalWheelchairOptions" :searchable="false" :allow-empty="true"
                             :show-labels="false" id="additional-wheelchairs" v-model="numberOfAdditionalWheelchairs"></multiselect>
            </div>
            <div class="small-12 medium-10 column sans-18-light">
                Do any of your party use a wheelchair? Please tell us about the number of wheelchairs that will be
                attend the event. You have already booked 0 <strong>wheelchairs</strong>. You can still add 3 wheelchairs at the most.
            </div>
            <div class="small-12 column nopadding">
                &nbsp;
            </div>
            <template v-if="canAddCancellationProtection > 0">
                <div class="small-12 column" v-for="cancellationPolicy in availableCancellationPolicies">
                    <h2 class="heading-2--doves">
                        {{ cancellationPolicy.name }}
                    </h2>
                </div>
                <div class="small-12 column sans-18-light" v-for="cancellationPolicy in availableCancellationPolicies">
                    <div class="cancel-protection__choice sans-18-light">
                        <label @click="addCancellationPolicy(cancellationPolicy)">
                            <div class="cancel-protection__radio-outer" >
                                <div class="cancel-protection__radio-inner" v-if="hasMadeProtectionChoice && cancellationPolicies.length > 0">

                                </div>
                            </div>
                            <input name="insurance" type="radio" data-type="Cancellation Protection">

                            Yes, please protect my purchase (total additional cost <span>£{{ showCancellationPolicyPrice(cancellationPolicy.price) }}</span>)
                            I confirm that I have read, understood and saved the
                            <a target="_blank" class="cancel-protection__termsandconds">terms and conditions</a>
                            of the TicketPlan Cancellation Protection.

                        </label>
                    </div>
                    <div class="cancel-protection__choice sans-18-light">
                        <label @click="removeCancellationPolicy(cancellationPolicy)" class="sans-18-light">
                            <div class="cancel-protection__radio-outer">
                                <div class="cancel-protection__radio-inner" style="" v-if="hasMadeProtectionChoice && cancellationPolicies.length === 0">

                                </div>
                            </div>
                            <input name="insurance" type="radio" data-type="Cancellation Protection">
                            I do not wish to purchase cancellation protection and accept my tickets are non-refundable.
                        </label>
                    </div>
                </div>
            </template>

            <div class="small-12 column">
                <a class="" :class="['button margin-bottom-medium rotate-ccw-small party-additions__check-availability-button', {'booking-summary__continue--disabled': !canCheckAvailability}]" @click="canCheckAvailability && checkAvailability()">
                    <span class="button__inner">
                        <span class="button__text show-for-large">Check availability and update</span>
                        <span class="button__text hide-for-large">Check availability</span>
                        <svg class="button__arrow">
                            <use xlink:href="/images/svg/sprite.svg#button-arrow"
                                 xmlns:xlink="http://www.w3.org/1999/xlink"></use>
                        </svg>
                    </span>
                </a>
            </div>
            <div class="small-12 column sans-18-light">
                If you would like to cancel your booking, you will need to have bought Cancellation Protection, for more information, please click here.
            </div>

        </div>
    </div>
</template>

<script>
    import AdultsOnly from '../mixins/AdultsOnly';

    export default {
        mixins: [
            AdultsOnly,
        ],
        props: {
            booking: Object,
            prices: Object,
            availableCancellationPolicies: Array,
        },
        created () {
            if ((this.booking.childrenTickets + this.booking.infantsTickets) === 0) {
                this.adultsOnly = true;
            }
        },
        data() {
            return {
                hasMadeProtectionChoice: false,
                numberOfAdditionalWheelchairs: 0,
                cancellationPolicies: [],
                adultCurrentQuantity: 1,

                adultAdditionalQuantity: {value: 0, label: '0'},

                seniorCurrentQuantity: 0,

                seniorAdditionalQuantity: {value: 0, label: '0'},

                childCurrentQuantity: 1,

                childAdditionalQuantity: {value: 0, label: '0'},

                infantCurrentQuantity: 0,

                infantAdditionalQuantity: {value: 0, label: '0'},

                carerCurrentQuantity: 0,

                carerAdditionalQuantity: {value: 0, label: '0'},
            }
        },
        computed: {
            canAddCancellationProtection() {
                return (
                this.adultAdditionalQuantity.value
                + this.seniorAdditionalQuantity.value
                + this.childAdditionalQuantity.value
                );
            },
            canCheckAvailability() {
                if(this.canAddCancellationProtection > 0) {
                    return (this.additionalTicketsQuantity > 0) && this.hasMadeProtectionChoice;
                }
                return (this.additionalTicketsQuantity > 0);
            },
            availableTickets() {
                let availableTickets = this.maxAvailableTickets - this.additionalTicketsQuantity;

                return availableTickets > 0 ? availableTickets : 0;
            },
            availableAdultTicketOptions() {
                return this.createTicketOptions(this.adultAdditionalQuantity.value);
            },
            availableSeniorTicketOptions() {
                return this.createTicketOptions(this.seniorAdditionalQuantity.value);
            },
            availableChildTicketOptions() {
                return this.createTicketOptions(this.childAdditionalQuantity.value);
            },
            availableInfantTicketOptions() {
                return this.createTicketOptions(this.infantAdditionalQuantity.value);
            },
            availableCarerTicketOptions() {
                return this.createTicketOptions(this.carerAdditionalQuantity.value);
            },
            adultAdditionalTotal() {
                return parseFloat(Math.round(this.adultAdditionalQuantity.value * this.prices.adult * 100) / 100).toFixed(2);
            },
            seniorAdditionalTotal() {
                return parseFloat(Math.round(this.seniorAdditionalQuantity.value * this.prices.senior * 100) / 100).toFixed(2);
            },
            childAdditionalTotal() {
                return parseFloat(Math.round(this.childAdditionalQuantity.value * this.prices.child * 100) / 100).toFixed(2);
            },
            additionalTicketsQuantity() {
                return (
                this.adultAdditionalQuantity.value
                + this.seniorAdditionalQuantity.value
                + this.childAdditionalQuantity.value
                + this.infantAdditionalQuantity.value
                + this.carerAdditionalQuantity.value);
            },
            additionalTicketsTotal() {
                let total = parseFloat(this.adultAdditionalTotal) + parseFloat(this.seniorAdditionalTotal)
                    + parseFloat(this.childAdditionalTotal);

                return parseFloat(Math.round(total * 100) / 100).toFixed(2);
            },
            numberOfAdditionalWheelchairOptions() {
                return _.range(this.additionalTicketsQuantity + 1);
            },
            maxAvailableTickets() {
                let maxAvailableTickets = 8 - (this.booking.adultsTickets + this.booking.seniorsTickets + this.booking.childrenTickets
                    + this.booking.infantsTickets + this.booking.carersTickets);

                return maxAvailableTickets > 0 ? maxAvailableTickets : 0;
            },
            cancellationPolicyQuantity() {
                if (this.cancellationPolicies.length === 0) {
                    return 0;
                }

                return this.adultAdditionalQuantity.value + this.seniorAdditionalQuantity.value + this.childAdditionalQuantity.value;
            },
            cancellationPolicyTotal() {
                return _.reduce(this.cancellationPolicies, (total, policy) => {
                    return total + (parseFloat(policy.price) * parseInt(this.cancellationPolicyQuantity));
                }, 0.00).toFixed(2);
            },
            grandTotal() {
                let total = parseFloat(this.additionalTicketsTotal ) + parseFloat(this.cancellationPolicyTotal);
                return parseFloat(Math.round(total * 100) / 100).toFixed(2);
            }
        },
        methods: {
            createTicketOptions(currentTicketTypeQuantity) {
                return _.map(_.range(this.availableTickets + currentTicketTypeQuantity + 1), value => {
                    return {
                        label: `${value}`,
                        value: value
                    };
                });
            },
            showCancellationPolicyPrice(price) {
                let tickets = this.adultAdditionalQuantity.value
                    + this.seniorAdditionalQuantity.value
                    + this.childAdditionalQuantity.value;

                return parseFloat(tickets * price).toFixed(2);
            },
            addCancellationPolicy(policy) {
                if (_.find(this.cancellationPolicies, policy)) {
                    return;
                }

                this.hasMadeProtectionChoice = true;
                this.cancellationPolicies.push(policy);
            },
            removeCancellationPolicy(policy) {
                this.hasMadeProtectionChoice = true;
                this.cancellationPolicies = _.reject(this.cancellationPolicies, policy);
            },
            checkAvailability() {
                let vm = this;

                this.$store.dispatch('reserveAdditionalTickets', {
                    bookingId: this.booking.id,
                    adults: this.adultAdditionalQuantity.value,
                    seniors: this.seniorAdditionalQuantity.value,
                    children: this.childAdditionalQuantity.value,
                    infants: this.infantAdditionalQuantity.value,
                    carers: this.carerAdditionalQuantity.value,
                    wheelchairs: this.numberOfAdditionalWheelchairs,
                    extras: _.map(this.cancellationPolicies, cancellationPolicy => {
                        let policy = _.clone(cancellationPolicy);

                        policy.qty = 1;
                        policy.selectedValue = this.cancellationPolicyQuantity;
                        return policy;
                    }),
                    successUrl: window.location.origin + this.$router.resolve({name:'gateway.callback'}).href,
                    failureUrl: window.location.origin + this.$router.resolve({name:'gateway.callback'}).href,
                })
                    .then((response = false) => {
                        if(response === 'Skipped payment and completed booking with 0 cost') {
                            setTimeout(() => {
                                this.$store.dispatch('loadBookings').then(() => {
                                    this.$store.getters.getBookings.forEach(loadedBooking => {
                                        if(loadedBooking.id === this.booking.id) {
                                            this.$store.commit('setBooking', {booking: loadedBooking});
                                        }
                                    });
                                });
                                return this.$router.push({name: 'transfer.complete'});
                            }, 1000);
                        }
                        vm.$router.push({name: 'payment'});
                    })
                    .catch(error => {

                    });
            },
	        ticketSelected(a,b,c) {
            }
        }
    }
</script>
