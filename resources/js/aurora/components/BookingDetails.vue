<template>
    <form @submit.prevent="null" id="booking-details-payment-form">
        <div id="booking-details" class="row nopadding">
            <div class="small-12 column nopadding">
                <h2 class="heading-2__booking-detail text-center">Customer Details</h2>
            </div>
            <div class="small-12 column nopadding">
                <div :class="['input-container', {'input-container--danger': hasError('customer.firstName')}]">
                    <label class="input-container__text text-right" for="firstName">First name</label>
                    <input type="text" required id="firstName" placeholder="First name" :disabled="existingCustomer"
                           v-model="customer.firstName" autocomplete="on">

                    <div class="input-container__error"
                         v-if="(errors['customer.firstName'] !== null)"> {{errors['customer.firstName']}}
                    </div>
                </div>
            </div>
            <div class="small-12 column nopadding">
                <div :class="['input-container', {'input-container--danger': hasError('customer.lastName')}]">
                    <label class="input-container__text text-right" for="lastName">Last name</label>
                    <input type="text" required placeholder="Last name" id="lastName" :disabled="existingCustomer"
                           v-model="customer.lastName" autocomplete="on">
                    <div class="input-container__error"
                         v-if="(errors['customer.lastName'] !== null)"> {{errors['customer.lastName']}}
                    </div>
                </div>
            </div>


            <div class="small-12 column nopadding">
                <div :class="['input-container', {'input-container--danger': hasError('customer.emailAddress')}]">
                    <label class="input-container__text text-right" for="emailAddress">Email address</label>
                    <input type="email" required placeholder="Email address" id="emailAddress"
                           :disabled="existingCustomer"
                           v-model="customer.emailAddress" autocomplete="on">
                    <div class="input-container__error"
                         v-if="(errors['customer.emailAddress'] !== null)"> {{errors['customer.emailAddress']}}
                    </div>
                </div>
            </div>

            <div class="small-12 column nopadding">
                <div :class="['input-container', {'input-container--danger': hasError('customer.emailAddressConfirmation')}]"
                     v-if="!existingCustomer">
                    <label class="input-container__text text-right"
                           for="emailAddressConfirmation">Repeat email address</label>
                    <input type="text" required placeholder="Repeat email address" id="emailAddressConfirmation"
                           v-model="customer.emailAddressConfirmation" autocomplete="on">
                    <div class="input-container__error"
                         v-if="(errors['customer.emailAddressConfirmation'] !== null)">
                        {{errors['customer.emailAddressConfirmation']}}
                    </div>
                </div>
            </div>


            <div class="small-12 column nopadding">
                <div :class="['input-container', {'input-container--danger': hasError('customer.telephone')}]">
                    <label class="input-container__text text-right" for="telephone">Telephone</label>
                    <input type="tel" required placeholder="Telephone" id="telephone" :disabled="existingCustomer"
                           v-model="customer.telephone" autocomplete="on">
                    <div class="input-container__error"
                         v-if="(errors['customer.telephone'] !== null)"> {{errors['customer.telephone']}}
                    </div>
                </div>
            </div>
            <template v-if="canShowChildren">
                <div class="small-12 column nopadding">
                    <h2 class="heading-2__booking-detail text-center">Child ticket details</h2>
                    <p class="text-center booking-detail__children_alert">
                        <strong>Please note:</strong>
                        Your invitations from Father Christmas will be addressed to your children using the names you
                        enter here. Please make sure you check these names before moving on as you won’t be able to edit
                        these later. Child tickets are non-transferable.
                    </p>
                </div>
                <div class="small-12 column nopadding">
                    <p class="booking-detail__children_alert">
                        <strong style="text-transform: uppercase;">
                            Please only enter your children's first names. You can update their surnames later in the 'Personalise my Visit' section of the website.
                        </strong>
                    </p>
                </div>
                <div class="small-12 column nopadding">
                    <div :class="['input-container', {'input-container--danger': (typeof guestErrors[number - 1] !== 'undefined')}]"
                         v-for="number in numberOfGuests" :key="number">
                        <label class="input-container__text text-right" :for="['guestName-'+number]">Child {{ number
                            }} first name</label>
                        <input type="text" required :id="['guestName-'+number]" placeholder="Child name"
                               v-model="guests[number - 1].name">
                        <div class="input-container__error"
                             v-if="(typeof guestErrors[number - 1] !== 'undefined')"> {{guestErrors[number - 1]}}
                        </div>
                    </div>
                </div>
            </template>
            <template v-if="adultsOnly">
                <div class="small-12 column nopadding">
                    <h2 class="heading-2__booking-detail text-center">Adult ticket details</h2>
                    <p class="text-center booking-detail__children_alert">
                        <strong>Please note:</strong>
                        Your invitations from Father Christmas will be addressed to your guests using the names you
                        enter here. Please make sure you check these names before moving on as you won’t be able to edit
                        these later. These tickets are non-transferable.
                    </p>
                </div>
                <div class="small-12 column nopadding">
                    <p class="booking-detail__children_alert">
                        <strong style="text-transform: uppercase;">
                            Please only enter your guest's first names. You can update their surnames later in the 'Personalise my Visit' section of the website.
                        </strong>
                    </p>
                </div>
                <div class="small-12 column nopadding">
                    <div :class="['input-container', {'input-container--danger': (typeof guestErrors[number - 1] !== 'undefined')}]"
                         v-for="number in numberOfGuests" :key="number">
                        <label class="input-container__text text-right" :for="['guestName-'+number]">Guest {{ number
                            }} first name</label>
                        <input type="text" required :id="['guestName-'+number]" placeholder="Guest name"
                               v-model="guests[number - 1].name">
                        <div class="input-container__error"
                             v-if="(typeof guestErrors[number - 1] !== 'undefined')"> {{guestErrors[number - 1]}}
                        </div>
                    </div>
                </div>
            </template>

            <div class="small-12 column nopadding">
                <h2 class="heading-2__booking-detail text-center">Payment Details</h2>
            </div>

            <div class="small-12 column nopadding" v-show="promoCodeApplied !== 2">
                <div :class="['input-container', {'input-container--danger': !hasValidCardName}]">
                    <label class="input-container__text text-right" for="cardName">Name on card</label>
                    <input type="text" required placeholder="Name on card" id="cardName" v-model="card.name">
                    <span class="input-container__error" v-if="!hasValidCardName">The card name does not appear to be valid.</span>
                </div>
            </div>

            <div class="small-12 column nopadding" v-show="promoCodeApplied !== 2">
                <div :class="['input-container', {'input-container--danger': !hasValidCardType}]">
                    <label class="input-container__text text-right" for="cardType">Card type</label>
                    <multiselect id="cardType" track-by="type" label="label" placeholder="Select card type"
                                 :options="cards" :searchable="false"
                                 :allow-empty="false" :show-labels="false" v-model="cardType"></multiselect>
                    <span class="input-container__error" v-if="!hasValidCardType">The card type is not selected.</span>
                </div>
            </div>

            <div class="small-12 column nopadding" v-show="promoCodeApplied !== 2">
                <div :class="['input-container -creditcard', {'input-container--danger': !hasValidCardNumber}]">
                    <label class="input-container__text text-right" for="cardNumber">Card number</label>
                    <input type="tel" id="cardNumber" required placeholder="Card number" @keypress="maskCardNumber"
                           @keyup="setCardType"
                           @change="validateCard(card.number)" v-model="card.number">
                    <span class="input-container__error" v-if="!hasValidCardNumber">The card number does not appear to be valid.</span>
                </div>
            </div>


            <div class="small-12 column nopadding" v-show="promoCodeApplied !== 2">
                <div :class="['input-container -calendar', {'input-container--danger': !hasValidCardExpiry}]">
                    <label class="input-container__text text-right" for="cardExpiry">Expiration date</label>

                    <month-picker id="cardExpiry"
                                placeholder="Expiration date"
                                v-model="card.expiry" format="MM/yyyy" :disabled=pickerDisabled></month-picker>
                    <span class="input-container__error" v-if="!hasValidCardExpiry">The expiry date does not appear to be valid.</span>
                </div>

            </div>

            <div class="small-12 column nopadding" v-show="promoCodeApplied !== 2">
                <div :class="['input-container', {'input-container--danger': !hasValidCV2}]">
                    <label class="input-container__text text-right" for="cardCV2">Card CV2</label>
                    <input type="tel" id="cardCV2" required placeholder="Card CV2" @keypress="maskCV2"
                           v-model="card.cv2">
                    <span class="input-container__error" v-if="!hasValidCV2">The CV2 value does not appear to be valid.</span>
                </div>

            </div>

            <div class="small-12 column nopadding" v-show="promoCodeApplied !== 2">
                <div class="input-container">
                    <label class="input-container__text text-right" for="cardIssueNumber">Issue number</label>
                    <input type="tel" id="cardIssueNumber" placeholder="Issue number" v-model="card.issueNumber">
                </div>
            </div>

            <div class="small-12 column nopadding">
                <div class="input-container -promocode" v-if="!existingCustomer">
                    <label class="input-container__text text-right" for="promoCode">Promotion code</label>

                    <input type="text" id="promoCode" placeholder="Promo code"
                           :disabled="promoCodeApplied > 0" v-model="promoCode">
                    <span class="pc-apply" v-show="promoCodeApplied === 0 || promoCodeApplied === -1 || promoCodeApplied === -2"
                          @click="applyPromoCode"></span>
                    <span class="input-container__error" v-if="promoCodeApplied > 0">Promotional code applied successfully.</span>
                    <span class="input-container__error"
                          v-if="promoCodeApplied === -1">This promotional code has already been used.</span>
                    <span class="input-container__error" v-if="promoCodeApplied < -1">There has been an error applying the promotional code.</span>
                </div>
            </div>

            <div class="small-12 column nopadding">
                <div class="input-container">
                    <label class="input-container__text text-right" for="billingAddress1">Address line 1</label>
                    <input type="text" required id="billingAddress1" placeholder="Address line 1"
                           v-model="billing.address1" autocomplete="on">
                    <span class="input-container__error"
                          v-if="(errors['billing.address1'] !== null)"> {{errors['billing.address1']}} </span>
                </div>

            </div>

            <div class="small-12 column nopadding">
                <div class="input-container">
                    <label class="input-container__text text-right" for="billingAddress2">Address line 2</label>
                    <input type="text" id="billingAddress2" placeholder="Address line 2" v-model="billing.address2"
                           autocomplete="on">
                </div>

            </div>

            <div class="small-12 column nopadding">
                <div class="input-container">
                    <label class="input-container__text text-right" for="billingCity">City</label>
                    <input type="text" required id="billingCity" placeholder="City" v-model="billing.city"
                           autocomplete="on">
                    <span class="input-container__error"
                          v-if="(errors['billing.city'] !== null)"> {{errors['billing.city']}} </span>
                </div>

            </div>

            <div class="small-12 column nopadding">
                <div class="input-container">
                    <label class="input-container__text text-right" for="billingPostCode">Postcode</label>
                    <input type="text" required id="billingPostCode" placeholder="Postcode" v-model="billing.postcode"
                           autocomplete="on">
                    <span class="input-container__error"
                          v-if="(errors['billing.postcode'] !== null)"> {{errors['billing.postcode']}} </span>
                </div>

            </div>

            <div class="small-12 column nopadding">
                <div class="input-container">
                    <label class="input-container__text text-right" for="billingCountry">Country</label>
                    <multiselect id="billingCountry" track-by="code" label="name" placeholder="Country"
                                 :options="countries"
                                 :searchable="true"
                                 :allow-empty="false" :show-labels="false" v-model="billing.country"></multiselect>
                </div>

            </div>

            <div class="small-12 column nopadding">
                <div class="input-container" v-if="!existingCustomer">
                    <label class="input-container__text text-right"
                           for="referrerReason">Where did you hear about us?</label>
                    <multiselect id="referrerReason" class="where-did-you-hear" :options="referrers" label="name" :searchable="false" :allow-empty="false"
                                 :show-labels="false" v-model="referrerReason"></multiselect>
                </div>

            </div>

            <div class="small-12 column nopadding">
                <div class="input-container" v-if="!existingCustomer">
                    <label class="input-container__text text-right -terms" for="terms">
                        <input type="checkbox" required id="terms" v-model="hasAcceptedTerms">
                        I have read and accepted the <a href="/terms-and-conditions" target="_blank" class="text-link">Terms & Conditions</a>
                    </label>
                </div>

            </div>

            <div class="small-12 column nopadding">

                <div class="input-container">
                    <template v-if="!hideButton">
                        <a class=""
                           :class="['button margin-bottom-medium rotate-ccw-small booking-detail__make-payment-button', {'booking-summary__continue--disabled': !canMakePayment}]"
                           @click="canMakePayment ? createOrder() : fakeCall()">
                    <span class="button__inner">
                        <span class="button__text">Make Payment</span>
                        <svg class="button__arrow">
                            <use xlink:href="/images/svg/sprite.svg#button-arrow"
                                 xmlns:xlink="http://www.w3.org/1999/xlink"></use>
                        </svg>
                    </span>
                        </a>
                    </template>

                    <template v-else>
                        <a class=""
                           :class="['button margin-bottom-medium rotate-ccw-small booking-detail__make-payment-button', {'booking-summary__continue--disabled': !canMakePayment}]"
                           @click="fakeCall()">
                    <span class="button__inner">
                        <span class="button__text">Make Payment</span>
                        <svg class="button__arrow">
                            <use xlink:href="/images/svg/sprite.svg#button-arrow"
                                 xmlns:xlink="http://www.w3.org/1999/xlink"></use>
                        </svg>
                    </span>
                        </a>
                    </template>

                </div>
            </div>

            <div class="small-12 column">

                <gateway-form v-if="checkout !== null && order !== null"
                              :gatewayUrl="checkout.paymentGatewayUrl"
                              :reserveReq="reservationId"
                              :grandTotal="checkout.grandTotal"
                              :hash="checkout.paymentRequestParameters.hash"
                              :transactionId="checkout.paymentRequestParameters.transactionId"
                              :successRedirectionUrl="this.successUrl"
                              :failureRedirectionUrl="this.failureUrl"
                              :paymentAmountCurrency="GBP"
                              :paymentAmountAmount="checkout.grandTotal"
                              :customerId="checkout.paymentRequestParameters.customerId"
                              :firstName="order.orderView.firstName"
                              :lastName="order.orderView.lastName"
                              :telephone="order.orderView.telephone"
                              :email="order.orderView.emailAddress"
                              :confirmEmail="order.orderView.emailAddress"
                              :adultsOnly="adultsOnly"
                              :guestFirstName="guestFirstName"
                              :cardCardholderName="card.name"
                              :cardType="card.type.toUpperCase()"
                              :cardNumber="card.number.replace(/\s+/g, '')"
                              :expiryDate="formattedCardExpiry"
                              :cvn="card.cv2"
                              :issueNo="card.issueNumber"
                              :addressLine1="order.orderView.addressLine1"
                              :addressLine2="order.orderView.addressLine2"
                              :city="order.orderView.city"
                              :postCode="order.orderView.postCode"
                              :country="order.orderView.country"
                              :referrerReasonId="order.orderView.referrerReasonId"

                ></gateway-form>
            </div>
        </div>
    </form>
</template>


<script>
    import Multiselect from 'vue-multiselect';
    import Validation from '../mixins/Validation';
    import GatewayForm from './booking-portal-pages/GatewayForm.vue';
    import Order from '../mixins/Order';
    import AdultsOnly from '../mixins/AdultsOnly';
    import MonthPicker from './MonthPicker.vue';
    const countries = require('country-list')();

    export default {
        components: {
            'multiselect': Multiselect,
            'gateway-form': GatewayForm,
            'month-picker': MonthPicker
        },
        mixins: [AdultsOnly, Order, Validation],
        props: {
            showChildren: {
                type: Boolean,
                default: true
            },
            promoCodeApplied: {
                type: Number,
                default: 0,
            },
            existingChildren: {
                type: Array,
                default() {
                    return [];
                }
            },
            successUrl: String,
            failureUrl: String,
            existingCustomerDetails: Object,
            cardFormat: {
                type: RegExp,
                default() {
                    return /(\d{1,4})/g;
                }
            },
            cards: {
                type: Array,
                default() {
                    return [
                        {
                            label: 'Maestro',
                            type: 'MAESTRO',
                            patterns: [
                                5018, 502, 503, 506, 56, 58, 639, 6220, 67
                            ],
                            format: this.defaultFormat,
                            length: _.range(12, 19),
                            cvcLength: [3],
                            luhn: true
                        },
                        // Credit cards
                        {
                            label: 'Visa',
                            type: 'VISA',
                            patterns: [4],
                            format: this.defaultFormat,
                            length: [13, 16],
                            cvcLength: [3],
                            luhn: true
                        },
                        {
                            label: 'Mastercard',
                            type: 'MC',
                            patterns: [
                                51, 52, 53, 54, 55,
                                22, 23, 24, 25, 26, 27
                            ],
                            format: this.defaultFormat,
                            length: [16],
                            cvcLength: [3],
                            luhn: true
                        },
                        {
                            label: 'Diners Club',
                            type: 'DINERS',
                            patterns: [30, 36, 38, 39],
                            format: /(\d{1,4})(\d{1,6})?(\d{1,4})?/,
                            length: [14],
                            cvcLength: [3],
                            luhn: true
                        }
                    ];
                }
            },
            countries: {
                type: Array,
                default() {
                    return countries.getData();
                }
            },
            reasons: {
                type: Array,
                default() {
                    return [
                        'Recommended by a friend',
                        'Other',
                        'Email from LaplandUK',
                        'Heart Radio Promotion',
                        'We’ve visited before',
                        'Social Media (Facebook, Instagram etc)',
                    ];
                }
            },
            numberOfAdults: {
                type: Number,
                default: 0
            },
            numberOfChildren: {
                type: Number,
                default: 0
            }
        },
        data() {
            return {
                rules: {
                    'customer.firstName': ['required'],
                    'customer.lastName': ['required'],
                    'customer.telephone': ['required'],
                    'customer.emailAddress': ['required', 'email'],
                    'customer.emailAddressConfirmation': ['required', 'email'],
                    'billing.address1': ['required'],
                    'billing.city': ['required'],
                    'billing.postcode': ['required'],
                    'billing.country.name': ['required']
                },
                hasValidCardNumber: true,
                hasValidCardExpiry: true,
	            hasValidCardName: true,
	            hasValidCardType: true,
	            hasValidCV2: true,
                existingCustomer: false,
                customer: {
                    firstName: '',
                    lastName: '',
                    telephone: '',
                    emailAddress: '',
                    emailAddressConfirmation: '',
                },
                guests: [],
                card: {
                    name: '',
                    type: '',
                    number: '',
                    expiry: '',
                    cv2: '',
                    issueNumber: '',
                },
                promoCode: '',
                billing: {
                    address1: '',
                    address2: '',
                    city: '',
                    postcode: '',
                    country: {
                        code: 'GB',
                        name: 'United Kingdom',
                    },
                },
                referrerReason: '',
                hasAcceptedTerms: false,
                guestErrors: [],
                showGateway: false,
                hideButton: false,
                showDayView: false,
            }
        },

        created() {
            if (this.existingCustomerDetails) {
                this.existingCustomer = true;
                this.customer.firstName = this.existingCustomerDetails.firstName;
                this.customer.lastName = this.existingCustomerDetails.lastName;
                this.customer.emailAddress = this.existingCustomerDetails.emailAddress;
                this.customer.emailAddressConfirmation = this.existingCustomerDetails.emailAddress;
                this.customer.telephone = this.existingCustomerDetails.telephone;
                if(this.existingChildren && this.existingChildren.length > 0) {
	                this.guests = _.map(this.existingChildren, child => {
		                return {name: child.firstName};
	                });
                }
                if(this.numberOfGuests && this.numberOfGuests > 0) {
	                this.guests = _.times(this.numberOfGuests, index => {
		                return {name: ''};
	                });
                }

            } else {
                if (this.order && this.order.orderView) {
                    const ov = this.order.orderView;
                    this.customer.firstName = ov.firstName;
                    this.customer.lastName = ov.lastName;
                    this.customer.emailAddress = ov.emailAddress;
                    this.customer.emailAddressConfirmation = ov.emailAddress;
                    this.customer.telephone = ov.telephone;
                    this.billing.address1 = ov.addressLine1;
                    this.billing.address2 = ov.addressLine2;
                    this.billing.city = ov.city;
                    this.billing.postcode = ov.postCode;
                    this.billing.country = {code: ov.country, name: 'United Kingdom'};
                }
                this.guests = _.times(this.numberOfGuests, index => {
                    return {name: ''};
                });
            }

            if (this.numberOfGuests > this.guests.length) {
                let children = _.fill(new Array(this.numberOfGuests - this.guests.length), {name: ''});
                this.guests = _.concat(this.guests, children);
            }
        },
        computed: {
            numberOfGuests() {
                return this.adultsOnly ? this.numberOfAdults : this.numberOfChildren;
            },
            canShowChildren() {
                return this.showChildren ? !this.adultsOnly : false;
            },
        	pickerDisabled() {
		        const d = new Date();
		        d.setMonth(d.getMonth());
        		return {
        			to: d
                }
            },
            reservationId() {
                return this.$store.getters.getReservationId;
            },
            canMakePayment() {
                if(this.existingCustomerDetails) {
                    return (this.existingCustomerDetails || this.hasAcceptedTerms);
                }
                
                return ((this.existingCustomerDetails || this.hasAcceptedTerms) && this.referrerReason !== '');
            },
            guestFirstName() {
                return _.map(this.guests, child => {
                    return child.name;
                }).join(',');
            },
            cardNumber() {
                return this.card.number.split(' ').join('');
            },
            cardType: {
                get() {
                    return _.find(this.cards, {type: this.card.type});
                },

                set(card) {
                    let selectedCard = _.find(this.cards, {type: card.type});
                    this.card.type = selectedCard.type;
                }
            },
            expiryDate() {
                return _.map(this.card.expiry.split('/'), segment => {
                    return segment.trim();
                }).reverse().join('-');
            },
            GBP() {
                return "GBP";
            },
            formattedCardExpiry() {
                const momentExpiry = moment(this.card.expiry);
                return momentExpiry.format('YYYY-MM');
            }
        },
        methods: {
            applyPromoCode(){
                this.$emit('applyPromoCode', this.promoCode);
            },

            validateDetails() {
	            this.areChildrenValid();
	            this.isBillingValid();
	            this.isCardDetailsValid();
                return (this.isCustomerValid() && this.areChildrenValid() && this.isBillingValid() && this.isCardDetailsValid());
            },
            createOrder() {
                this.passes();
                if (this.validateDetails()) {
                    this.disableButton();
                    this.processPayment();
                }

            },
            fakeCall() {
            	//do nothing
            },
            processPayment() {
                this.$emit('pay', {
                    customer: this.customer,
                    billing: this.billing,
                    children: this.guests,
                    referrer: this.referrerReason,
                    code: this.promoCodeApplied > 0 ? this.promoCode : '',
                });
            },
            disableButton() {
                this.hideButton = true;

                setTimeout(() => {
                    this.hideButton = false;
                }, 3000);
            },
            isCustomerValid() {
            	this.customer.firstName = this.customer.firstName.trim();
	            this.customer.lastName = this.customer.lastName.trim();
	            this.customer.telephone = this.customer.telephone.trim();
	            this.customer.emailAddress = this.customer.emailAddress.trim();
	            this.customer.emailAddressConfirmation = this.customer.emailAddressConfirmation.trim();
                return (
                    !this.hasError('customer.firstName')
                    && !this.hasError('customer.lastName')
                    && !this.hasError('customer.telephone')
                    && !this.hasError('customer.emailAddress')
                    && !this.hasError('customer.emailAddressConfirmation')
                    && this.emailAddressConfirmation === this.emailAddress
                );
            },
            areChildrenValid() {
                let valid = true;
                if (this.showChildren === false) {
                    return valid;
                }
                this.guestErrors = [];
                this.guests.forEach((child, index) => {
                	child.name = child.name.trim();
                    if (_.isEmpty(child.name) || child.name.includes(",")) {
                        this.guestErrors[index] = "Please enter your childs first name (without commas).";
                        valid = false;
                    }
                });
                return valid;
            },
            isBillingValid() {
            	this.billing.address1 = this.billing.address1.trim();
	            this.billing.city = this.billing.city.trim();
	            this.billing.postcode = this.billing.postcode.trim();
                return (
                    !this.hasError('billing.address1')
                    && !this.hasError('billing.city')
                    && !this.hasError('billing.postcode')
                    && !this.hasError('billing.country')
                );
            },
            isCardDetailsValid() {
                if (this.promoCodeApplied === 2) {
                    return true;
                }

                let valid = true;
	            this.hasValidCardName = true;
	            this.hasValidCardNumber = true;
	            this.hasValidCV2 = true;
	            this.hasValidCardExpiry = true;

                if(this.card.name.length < 1) {
                	this.hasValidCardName = false;
                	valid = false;
                }
                if(typeof this.cardType === 'undefined') {
                	valid = false;
                }

                this.validateCard(this.card.number);
                if(!this.hasValidCardNumber) {
                    valid = false;
                }

                if(this.card.cv2.length < 1) {
                	this.hasValidCV2 = false;
                	valid = false;
                }
                if(this.card.expiry.length < 1) {
                	this.hasValidCardExpiry = false;
                	valid = false;
                }

                return valid && this.hasValidCardNumber && this.hasValidCardExpiry;
            },
            validateExpiry(date) {
                let ref = date.split('/');
                if (ref.length !== 2) {
                    this.hasValidCardExpiry = false;
                }
                let month = ref[0];
                let year = ref[1];
                if (!(month && year)) {
                    this.hasValidCardExpiry = false;
                }
                month = $.trim(month);
                year = $.trim(year);
                if (!/^\d+$/.test(month)) {
                    this.hasValidCardExpiry = false;
                }
                if (!/^\d+$/.test(year)) {
                    this.hasValidCardExpiry = false;
                }
                if (!((1 <= month && month <= 12))) {
                    this.hasValidCardExpiry = false;
                }
                if (year.length === 2) {
                    if (year < 70) {
                        year = "20" + year;
                    } else {
                        year = "19" + year;
                    }
                }
                if (year.length !== 4) {
                    this.hasValidCardExpiry = false;
                }
                let expiry = new Date(year, month);
                let currentTime = new Date;
                expiry.setMonth(expiry.getMonth() - 1);
                expiry.setMonth(expiry.getMonth() + 1, 1);
                this.hasValidCardExpiry = (expiry > currentTime);
            },
            validateCard(number) {
                let card, ref;
                number = (number + '').replace(/\s+|-/g, '');


                if (!/^\d+$/.test(number)) {
                    this.hasValidCardNumber = false;
                    return;
                }

                card = this.cardFromNumber(number);
                if (typeof card === 'undefined') {
                    this.hasValidCardNumber = false;
                    return;
                }
                ref = number ? number.length : 0;
                this.hasValidCardNumber = (_.indexOf(card.length, ref) >= 0) && (card.luhn === false || this.luhnCheck(number));
            },
            luhnCheck(number) {
                let digit, digits, i, len, odd, sum;
                odd = true;
                sum = 0;
                digits = (number + '').split('').reverse();
                for (i = 0, len = digits.length; i < len; i++) {
                    digit = digits[i];
                    digit = parseInt(digit, 10);
                    if ((odd = !odd)) {
                        digit *= 2;
                    }
                    if (digit > 9) {
                        digit -= 9;
                    }
                    sum += digit;
                }
                return sum % 10 === 0;
            },
            maskCardNumber(event) {
                if (this.restrictNumeric(event) === false) {
                    event.preventDefault();
                    return false;
                }

                if (this.restrictCardNumber(event) === false) {
                    event.preventDefault();
                    return false;
                }

                if (this.formatCardNumber(event) === false) {
                    event.preventDefault();
                    return false;
                }

                if (this.formatBackCardNumber(event) === false) {
                    event.preventDefault();
                    return false;
                }

                return true;
            },
            maskExpiryDate() {
                if (this.restrictNumeric(event) === false) {
                    event.preventDefault();
                    return false;
                }

                if (this.restrictExpiry(event) === false) {
                    event.preventDefault();
                    return false;
                }

                if (this.formatExpiry(event) === false) {
                    event.preventDefault();
                    return false;
                }

                if (this.formatForwardSlashAndSpace(event) === false) {
                    event.preventDefault();
                    return false;
                }

                if (this.formatForwardExpiry(event) === false) {
                    event.preventDefault();
                    return false;
                }

                return true;
            },
            maskCV2() {
                if (this.restrictNumeric(event) === false) {
                    event.preventDefault();
                    return false;
                }

                if (this.restrictCV2(event) === false) {
                    event.preventDefault();
                    return false;
                }

                return true;
            },
            setCardType(event) {
                let card = this.cardFromNumber(this.card.number);

                if (card) {
                    this.cardType = card;
                }
            },
            restrictNumeric(event) {
                let input;
                if (event.metaKey || event.ctrlKey) {
                    return true;
                }
                if (event.which === 32) {
                    return false;
                }
                if (event.which === 0) {
                    return true;
                }
                if (event.which < 33) {
                    return true;
                }
                input = String.fromCharCode(event.which);
                return !!/[\d\s]/.test(input);
            },
            restrictCardNumber(event) {
                let $target, card, digit, value;
                $target = $(event.currentTarget);
                digit = String.fromCharCode(event.which);
                if (!/^\d+$/.test(digit)) {
                    return;
                }
                if (this.hasTextSelected($target)) {
                    return;
                }
                value = ($target.val() + digit).replace(/\D/g, '');
                card = this.cardFromNumber(value);
                if (card) {
                    return value.length <= card.length[card.length.length - 1];
                } else {
                    return value.length <= 16;
                }
            },
            formatCardNumber(event) {
                // Only format if input is a number
                let digit = String.fromCharCode(event.which);
                if (!(/^\d+$/.test(digit))) {
                    return;
                }

                let $target = $(event.currentTarget);
                let value = $target.val();
                let card = this.cardFromNumber(value + digit);
                let length = (value.replace(/\D/g, '') + digit).length;

                let upperLength = 16;
                if (card) {
                    upperLength = card.length[card.length.length - 1];
                }

                if (length >= upperLength) {
                    return;
                }

                // Return if focus isn't at the end of the text
                if ($target.prop('selectionStart') &&
                    $target.prop('selectionStart') !== value.length) {
                    return;
                }

                let re;

                if (card && card.type === 'amex') {
                    // AMEX cards are formatted differently
                    re = /^(\d{4}|\d{4}\s\d{6})$/;
                } else {
                    re = /(?:^|\s)(\d{4})$/;
                }

                // If '4242' + 4
                if (re.test(value)) {
                    event.preventDefault();
                    setTimeout(() => $target.val(value + ' ' + digit));
                    // If '424' + 2
                } else if (re.test(value + digit)) {
                    event.preventDefault();
                    setTimeout(() => $target.val(value + digit + ' '));
                }
            },
            formatBackCardNumber(event) {
                let $target, value;
                $target = $(event.currentTarget);
                value = $target.val();
                if (event.which !== 8) {
                    return;
                }
                if (($target.prop('selectionStart') !== null) && $target.prop('selectionStart') !== value.length) {
                    return;
                }
                if (/\d\s$/.test(value)) {
                    event.preventDefault();
                    return setTimeout(() => {
                        return $target.val(value.replace(/\d\s$/, ''));
                    });
                } else if (/\s\d?$/.test(value)) {
                    event.preventDefault();
                    return setTimeout(() => {
                        return $target.val(value.replace(/\d$/, ''));
                    });
                }
            },
            restrictExpiry(event) {
                let $target, digit, value;
                $target = $(event.currentTarget);
                digit = String.fromCharCode(event.which);
                if (!/^\d+$/.test(digit)) {
                    return;
                }
                if (this.hasTextSelected($target)) {
                    return;
                }
                value = $target.val() + digit;
                value = value.replace(/\D/g, '');
                if (value.length > 6) {
                    return false;
                }
            },
            formatExpiry(event) {
                let $target, digit, val;
                digit = String.fromCharCode(event.which);
                if (!/^\d+$/.test(digit)) {
                    return;
                }
                $target = $(event.currentTarget);
                val = $target.val() + digit;
                if (/^\d$/.test(val) && (val !== '0' && val !== '1')) {
                    event.preventDefault();
                    return setTimeout(() => {
                        return $target.val("0" + val + " / ");
                    });
                } else if (/^\d\d$/.test(val)) {
                    event.preventDefault();
                    return setTimeout(() => {
                        let m1, m2;
                        m1 = parseInt(val[0], 10);
                        m2 = parseInt(val[1], 10);
                        if (m2 > 2 && m1 !== 0) {
                            return $target.val("0" + m1 + " / " + m2);
                        } else {
                            return $target.val(val + " / ");
                        }
                    });
                }
            },
            formatForwardSlashAndSpace(event) {
                let $target, val, which;
                which = String.fromCharCode(event.which);
                if (!(which === '/' || which === ' ')) {
                    return;
                }
                $target = $(event.currentTarget);
                val = $target.val();
                if (/^\d$/.test(val) && val !== '0') {
                    return $target.val("0" + val + " / ");
                }
            },
            formatForwardExpiry(event) {
                let $target, digit, val;
                digit = String.fromCharCode(event.which);
                if (!/^\d+$/.test(digit)) {
                    return;
                }
                $target = $(event.currentTarget);
                val = $target.val();
                if (/^\d\d$/.test(val)) {
                    return $target.val(val + " / ");
                }
            },
            formatBackExpiry(event) {
                let $target, value;
                $target = $(event.currentTarget);
                value = $target.val();
                if (event.which !== 8) {
                    return;
                }
                if (($target.prop('selectionStart') != null) && $target.prop('selectionStart') !== value.length) {
                    return;
                }
                if (/\d\s\/\s$/.test(value)) {
                    event.preventDefault();
                    return setTimeout(() => {
                        return $target.val(value.replace(/\d\s\/\s$/, ''));
                    });
                }
            },
            restrictCV2(event) {
                let $target, digit, val;
                $target = $(event.currentTarget);
                digit = String.fromCharCode(event.which);
                if (!/^\d+$/.test(digit)) {
                    return;
                }
                if (this.hasTextSelected($target)) {
                    return;
                }
                val = $target.val() + digit;
                return (val.length <= 4);
            },
            cardFromNumber(number) {
                let c, p;
                number = (number + '').replace(/\D/g, '');

                _.forEach(this.cards, card => {
                    _.forEach(card.patterns, pattern => {
                        p = pattern + '';

                        if (number.substr(0, p.length) === p) {
                            c = card;
                        }
                    });
                });

                return c;
            },
            hasTextSelected($target) {
                let ref;
                if (($target.prop('selectionStart') != null) && $target.prop('selectionStart') !== $target.prop('selectionEnd')) {
                    return true;
                }
                if ((typeof document !== "undefined" && document !== null ? (ref = document.selection) != null ? ref.createRange : void 0 : void 0) != null) {
                    if (document.selection.createRange().text) {
                        return true;
                    }
                }
                return false;
            },
        }
    }
</script>
