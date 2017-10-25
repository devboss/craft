<template>
    <form class="row" @submit.prevent="">
        <div class="small-12 column text-center">
            <h2 class="heading-2--small-doves">Customer details</h2>
        </div>
        <div class="small-12 column text-center">
            <p>
                Please provide us with your contact details so that we can post your Lapland<sup>UK</sup> pack including children's
                invitations from Father Christmas.
            </p>
        </div>
        <div class="small-12 column child-form__form-wrapper">
            <div :class="['input-container margin-bottom-small', {'input-container--danger': hasError('myDetails.firstName')}]">
                <label class="input-container__text text-right" for="firstName">First name</label>
                <input type="text" class="form-control" id="firstName" v-model="myDetails.firstName">
                <span class="input-container__error" v-if="hasError('myDetails.firstName')">
                    {{ getError('myDetails.firstName') }}
                </span>
            </div>
            <div :class="['input-container margin-bottom-small', {'input-container--danger': hasError('myDetails.lastName')}]">
                <label class="input-container__text text-right" for="lastName">Last name</label>
                <input type="text" class="form-control" id="lastName" v-model="myDetails.lastName">
                <span class="input-container__error" v-if="hasError('myDetails.lastName')">
                    {{ getError('myDetails.lastName') }}
                </span>
            </div>
            <div :class="['input-container margin-bottom-small', {'input-container--danger': hasError('myDetails.telephone')}]">
                <label class="input-container__text text-right" for="telephone">Telephone</label>
                <input type="tel" class="form-control" id="telephone" v-model="myDetails.telephone">
                <span class="input-container__error" v-if="hasError('myDetails.telephone')">
                    {{ getError('myDetails.telephone') }}
                </span>
            </div>
            <div :class="['input-container margin-bottom-small', {'input-container--danger': hasError('myDetails.emailAddress')}]">
                <label class="input-container__text text-right" for="emailAddress">Email address</label>
                <input type="email" class="form-control" id="emailAddress" v-model="myDetails.emailAddress">
                <span class="input-container__error" v-if="hasError('myDetails.emailAddress')">
                    {{ getError('myDetails.emailAddress') }}
                </span>
            </div>
            <div :class="['input-container margin-bottom-small', {'input-container--danger': hasError('myDetails.address1')}]">
                <label class="input-container__text text-right" for="myDetailsAddress1">Address line 1</label>
                <input type="text" class="form-control" id="myDetailsAddress1" v-model="myDetails.address1">
                <span class="input-container__error" v-if="hasError('myDetails.address1')">
                    {{ getError('myDetails.address1') }}
                </span>
            </div>
            <div :class="['input-container margin-bottom-small', {'input-container--danger': hasError('myDetails.address2')}]">
                <label class="input-container__text text-right" for="myDetailsAddress2">Address line 2</label>
                <input type="text" class="form-control" id="myDetailsAddress2" v-model="myDetails.address2">
                <span class="input-container__error" v-if="hasError('myDetails.address2')">
                    {{ getError('myDetails.address2') }}
                </span>
            </div>
            <div :class="['input-container margin-bottom-small', {'input-container--danger': hasError('myDetails.city')}]">
                <label class="input-container__text text-right" for="myDetailsCity">City</label>
                <input type="text" class="form-control" id="myDetailsCity" v-model="myDetails.city">
                <span class="input-container__error" v-if="hasError('myDetails.city')">
                    {{ getError('myDetails.city') }}
                </span>
            </div>
            <div :class="['input-container margin-bottom-small', {'input-container--danger': hasError('myDetails.postCode')}]">
                <label class="input-container__text text-right" for="myDetailsPostCode">Postcode</label>
                <input type="text" class="form-control" id="myDetailsPostCode" v-model="myDetails.postCode">
                <span class="input-container__error" v-if="hasError('myDetails.postCode')">
                    {{ getError('myDetails.postCode') }}
                </span>
            </div>
            <div :class="['input-container margin-bottom-small', {'input-container--danger': hasError('myDetails.country')}]">
                <label class="input-container__text text-right" for="myDetailsCountry">Country</label>
                <multiselect id="myDetailsCountry" track-by="code" label="name" :options="countries" :searchable="true"
                             :allow-empty="false" :show-labels="false" v-model="myDetails.country"
                             style="padding:0 0.75rem!important"></multiselect>
                <span class="input-container__error" v-if="hasError('myDetails.country')">
                    {{ getError('myDetails.country') }}
                </span>
            </div>
            <div class="input-container">
                <label>&nbsp;</label>
                <span class="input-container__help-text -no-italic">
                    <button :class="['button margin-bottom-medium rotate-ccw-small']" style="width:100%;" @click.prevent="update">
                        <span class="button__inner">
                            <span class="button__text">Update details</span>
                            <svg class="button__arrow">
                                <use xlink:href="/images/svg/sprite.svg#button-arrow"
                                     xmlns:xlink="http://www.w3.org/1999/xlink"></use>
                            </svg>
                        </span>
                    </button>
                </span>
            </div>
        </div>
    </form>
</template>

<script>
    import Multiselect from 'vue-multiselect';
    import Validation from '../mixins/Validation';

    const countries = require('country-list')();

    export default {
        components: {
            'multiselect': Multiselect,
        },
        mixins: [Validation],
        props: {
            myDetails: {
                type: Object,
                default: {
                    id: 0,
                    title: '',
                    firstName: '',
                    lastName: '',
                    emailAddress: '',
                    telephone: '',
                    address1: '',
                    address2: '',
                    city: '',
                    postCode: '',
                    information: '',
                    country: {
                        id: 0,
                        name: '',
                        countryCodeAlpha2: '',
                        countryCodeAlpha3: '',
                        countryCodeNumeric: null,
                        sortOrder: 0
                    }
                }
            },
            countries: {
                type: Array,
                default() {
                    return countries.getData();
                }
            },
        },
        data() {
            return {
                rules: {
                    'myDetails.firstName': ['required'],
                    'myDetails.lastName': ['required'],
                    'myDetails.telephone': ['required'],
                    'myDetails.emailAddress': ['required', 'email'],
                    'myDetails.address1': ['required'],
                    'myDetails.address2': ['required'],
                    'myDetails.city': ['required'],
                    'myDetails.postCode': ['required'],
                    'myDetails.country.countryCodeAlpha2': ['required'],
                },
                hasValidEmail: true,
            }
        },
        methods: {
            update() {
                this.$store.dispatch('updateMyDetails', this.myDetails);
            }
        }
    }
</script>