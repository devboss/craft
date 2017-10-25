<template>
    <div>
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
        <div class="row">
            <div class="small-12 column text-center">
                <p class="party-selector__desc">
                    Lapland<sup>UK</sup> returns in 2017 for its 10th magical year. <span class="show-for-small-only">Are you invited?</span>
                </p>
            </div>
            <div class="small-12 column text-center hide-for-small-only">
                <p class="party-selector__desc">
                    Are you invited?
                </p>
            </div>
            <div class="small-12 column text-center hide-for-small-only">
                <p class="heading-2--small-doves">
                    18<sup>th</sup> November - 24<sup>th</sup> December
                </p>
            </div>
            <div class="small-12 column text-center hide-for-medium show-for-small-only">
                <p class="heading-2--small-doves">
                    18<sup>th</sup> November - <br/> 24<sup>th</sup> December
                </p>
            </div>
            <div class="small-12 column text-center">
                <span class="image-misc__image--underline">
                    &nbsp;
                </span>
            </div>
        </div>
        <div class="row" v-if="premiumSearchEnabled">
            <div class="column text-center">
                <h2 class="heading-2--gill-sans">
                    1. Select ticket type to display:
                </h2>
            </div>
        </div>
        <div class="row" v-if="premiumSearchEnabled">
            <div class="small-12 medium-12 column text-center">
                <div class="row">
                    <div class="small-12 medium-6 column party_selector__premium-standard-radio">
                        <div class="row">
                            <div class="small-12 medium-12 column">
                                <label @click="updateSearchType(false)" class="party-selector--premium-radio-label">
                                    <div class="cancel-protection__radio-outer">
                                        <div class="cancel-protection__radio-inner" v-if="!premiumSearch"></div>
                                    </div>
                                </label>
                                <label @click="updateSearchType(false)">
                                    <span class="party-selector__desc">Premium Tickets</span>
                                </label>
                            </div>
                            <div class="small-12 medium-12 column">
                                <span class="party-selector--from-price-left">From &pound;65</span>
                            </div>
                            <div class="small-12 medium-12 column">
                                <p>
                                    &nbsp;
                                </p>
                            </div>
                            <div class="small-12 medium-12 large-5">
                            </div>
                            <div class="small-12 medium-12 large-7 column" style="cursor: pointer;">
                                <h5 class="party-selector--from-price-right text-center" @click="togglePremiumHover">
                                    more information
                                </h5>
                                <div class="party-selector__more-information-wrapper party-selector__more-information-wrapper--left" v-show="showPremiumHover">
                                    <div class="day-selector-resposive-close image-misc__image--cross" style="float: right;" @click="togglePremiumHover"></div>
                                    <ul class="booking-summary__list -responsive-whats-included" style="padding-top: 20px;">
                                        <li>
                                            Lapland<sup>UK</sup> is a spell-binding Christmas experience.
                                        </li>
                                        <li>
                                            Booking includes:
                                        </li>
                                        <li>
                                            Personalised invitation to every child from Father Christmas by post
                                        </li>
                                        <li>
                                            Entry to Lapland<sup>UK</sup>
                                        </li>
                                        <li>
                                            Elf Passport for every child
                                        </li>
                                        <li>
                                            All activities, and performances including ice skating
                                        </li>
                                        <li>
                                            Beautiful gift from Father Christmas for every child
                                        </li>
                                        <li>
                                            One free photo per booking
                                        </li>
                                        <li>
                                            Booking fees & postage included
                                        </li>
                                        <li>
                                            Parking at Whitmoor Forest
                                        </li>
                                        <li>
                                            Christmas Morning Thank You card from Father Christmas for every child
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="small-12 medium-6 column party_selector__premium-premium-radio">
                        <div class="row">
                            <div class="small-12 medium-12 column">
                                <label @click="updateSearchType(true)" class="party-selector--premium-radio-label">
                                    <div class="cancel-protection__radio-outer">
                                        <div class="cancel-protection__radio-inner" v-if="premiumSearch"></div>
                                    </div>
                                </label>
                                <label @click="updateSearchType(true)">
                                    <span class="party-selector__desc">Premium+ Tickets</span>
                                </label>
                            </div>
                            <div class="small-12 medium-12 column">
                                <span class="party-selector--from-price-right">From &pound;190</span>
                            </div>
                            <div class="small-12 medium-12 column">
                                <p>
                                    &nbsp;
                                </p>
                            </div>
                            <div class="small-12 medium-12 large-7 column" style="cursor: pointer;">
                                <h5 class="party-selector__more-information-right text-center" @click="togglePremiumPlusHover">
                                    more information
                                </h5>
                                <div class="party-selector__more-information-wrapper party-selector__more-information-wrapper--right" v-show="showPremiumPlusHover">
                                    <div class="day-selector-resposive-close image-misc__image--cross" style="float: right;" @click="togglePremiumPlusHover"></div>
                                    <ul class="booking-summary__list -responsive-whats-included" style="padding-top: 20px;">
                                        <li>
                                            Lapland<sup>UK</sup> offers a limited number of Premium+ Tours providing the ultimate elven experience.
                                        </li>
                                        <li>
                                            The tour includes:
                                        </li>
                                        <li>
                                            Conker Hats for everybody,
                                        </li>
                                        <li>
                                            A copy of Mother Christmas’ <i>Puzzoodles</i> book for every child.
                                        </li>
                                        <li>
                                            A private meet & greet with The Elf Travel Master,
                                        </li>
                                        <li>
                                            Front row seats in The Glade and a personal audience with Sage.
                                        </li>
                                        <li>
                                            Freedom of the Elven Village - stay for as long as you like, before you visit Father Christmas
                                        </li>
                                        <li>
                                            A reserved table, and meal in the Elven Restaurant.
                                        </li>
                                        <li>
                                            A scrapbook containing the photos of your meeting with Father Christmas.
                                        </li>
                                        <li>
                                            VIP parking.
                                        </li>
                                        <li>
                                            All of this is in addition to the Premium Lapland<sup>UK</sup> experience.
                                        </li>
                                    </ul>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <p>
                    &nbsp;
                </p>
            </div>
        </div>
        <div class="row">
            <div class="column text-center">
                <h2 class="heading-2--gill-sans">
                    <template v-if="premiumSearchEnabled">2. </template>
                    Please enter the members of your party:
                </h2>
            </div>
        </div>
        <div class="row">
            <div class="medium-12 small-12 column party-selector--center">
                <div class="row">
                    <div class="medium-3 small-12 column">
                        <div :class="['text-center party-selector__selector-block', { 'has-error': false }]">
                            <div class="row">
                                <div class="column text-center">
                                    <label for="adults" class="bulleted-list-title">
                                        Adults
                                    </label>
                                </div>
                            </div>
                            <div class="row party-selector--age-row">
                                <div class="column text-center">
                                    <span class="party-selector__help-text">17-65 years</span>
                                </div>
                            </div>
                            <multiselect id="adults" class="party_selector__multiselect" name="adults"
                                         track-by="value" label="label" :options="availableAdults" :showPointer="false"
                                         :searchable="false" :allow-empty="false" :show-labels="false"
                                         v-model="numberOfAdults"></multiselect>

                        </div>
                    </div>
                    <div class="medium-3 small-12 column">
                        <div class="text-center party-selector__selector-block">
                            <div class="row">
                                <div class="column text-center">
                                    <label for="seniors" class="bulleted-list-title"
                                           v-tooltip="tooltipOptions('seniors')">
                                        Seniors
                                    </label>
                                </div>
                            </div>
                            <div class="row party-selector--age-row">
                                <div class="column text-center">
                                    <span class="party-selector__help-text">65 years+</span>
                                </div>
                            </div>

                            <multiselect id="seniors" class="party_selector__multiselect" name="seniors"
                                         track-by="value" label="label" :options="availableSeniors" :showPointer="false"
                                         :searchable="false" :allow-empty="false" :show-labels="false"
                                         v-model="numberOfSeniors"></multiselect>

                        </div>
                    </div>
                    <div class="medium-3 small-12 column">
                        <div class="text-center party-selector__selector-block">
                            <div class="row">
                                <div class="column text-center">
                                    <label for="children" class="bulleted-list-title">
                                        Children
                                    </label>
                                </div>
                            </div>
                            <div class="row party-selector--age-row">
                                <div class="column text-center">
                                    <span class="party-selector__help-text">1-16 years</span>
                                </div>
                            </div>
                            <multiselect id="children" class="party_selector__multiselect"
                                         name="children" track-by="value" label="label" :showPointer="false"
                                         :options="availableChildren" :searchable="false"
                                         :allow-empty="false" :show-labels="false"
                                         v-model="numberOfChildren"></multiselect>

                        </div>
                    </div>
                    <div class="medium-3 small-12 column">
                        <div class="text-center party-selector__selector-block">
                            <div class="row">
                                <div class="column text-center">
                                    <label for="babies" class="bulleted-list-title"
                                           v-tooltip="tooltipOptions('babies')">
                                        Infants
                                    </label>
                                </div>
                            </div>
                            <div class="row party-selector--age-row">
                                <div class="column text-center">
                                    <span class="party-selector__help-text">Under 1 year</span>
                                </div>
                            </div>
                            <multiselect id="babies" class="party_selector__multiselect" name="babies"
                                         track-by="value" label="label" :options="availableBabies" :showPointer="false"
                                         :searchable="false" :allow-empty="false" :show-labels="false"
                                         v-model="numberOfBabies"></multiselect>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="medium-12 small-12 column">
                        <div class="alert alert-warning" role="alert" v-if="errors.length > 0">
                            <ul>
                                <li v-for="error in errors"><span class="icon icon--warning"></span> {{ error }}</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>


        <div class="row party-selector__carer-box">
            <div class="medium-12 small-12 column">
                <div class="row">
                    <div class="medium-1 small-2 column text-right">

                        <input type="checkbox" id="party-selector-carer" v-model="showCarersAndWheelchairs">

                    </div>
                    <div class="medium-11 small-10 column party-selector--checkbox-label"
                         @click="toggleShowCarersAndWheelchairs">
                        <p>
                            Please click here if any member of your party is a carer or uses a wheelchair.
                        </p>
                    </div>
                </div>
            </div>

        </div>


        <div class="row party-selector__superstar" v-if="showCarersAndWheelchairs">
            <div class="medium-12 small-12 column">
                <div class="row">
                    <div class="medium-12 small-12 column">
                        <h2 class="heading-2--small-doves">Carers</h2>
                        <p>
                            We know that some children require additional assistance, and we are pleased to
                            offer complimentary carer tickets. Carers must provide assistance to the visitor and
                            proof of entitlement will be required on arrival at Lapland<sup>UK</sup>. There are a limited
                            number of complimentary carer tickets on every tour, allocated on a first-come,
                            first-served basis.
                        </p>
                        <p>
                            To qualify for a complimentary carer ticket, each booking must already include at
                            least one child and one adult ticket. To add additional carers, please choose the
                            number that you require from the drop down box.
                            (<strong>THESE FREE CARER TICKETS WILL BE AUTOMATICALLY ADDED TO YOUR BOOKING</strong>)
                        </p>
                        <div class="input-container">
                            <label for="carers" class="input-container__text">Carers</label>

                            <multiselect id="carers" name="carers" track-by="value" label="label"
                                         :options="availableCarers" :searchable="false"
                                         :allow-empty="false" :show-labels="false"
                                         v-model="numberOfCarers"></multiselect>

                        </div>
                    </div>
                </div>
            </div>

            <div class="medium-12 small-12 column">
                <div class="row">
                    <div class="medium-12 small-12 column">
                        <h2 class="heading-2--small-doves">Wheelchairs</h2>
                        <p>
                            We are pleased to welcome guests in wheelchairs. We are able to cater for 2
                            wheelchair guests per standard tour and up to 8 per tour on Superstar days. Please
                            can you let us know how many wheelchair spaces you require.
                        </p>
                        <p>
                            <strong>
                                THIS IS NOT A TICKET,
                                PLEASE ENSURE YOU PURCHASE A TICKET ABOVE FOR EACH WHEELCHAIR USER.
                            </strong>
                        </p>
                        <p>
                            Please note, Lapland<sup>UK</sup>
                            is staged in a natural forest environment. Some sections of
                            the path are steep and despite best endeavours, the ground can at times become muddy.
                        </p>
                        <div class="input-container">
                            <label for="carers" class="input-container__text">Wheelchairs</label>

                            <multiselect id="wheelchairs" name="wheelchairs" track-by="value"
                                         label="label" :options="availableWheelchairs"
                                         :searchable="false" :allow-empty="false" :show-labels="false"
                                         v-model="numberOfWheelchairs"></multiselect>

                        </div>
                    </div>
                </div>
            </div>

            <div class="medium-12 small-12 column">
                <div class="row">
                    <div class="medium-12 small-12 column">
                        <h2 class="heading-2--small-doves">Superstars</h2>
                        <p>
                            Superstar days are days specially tailored and subsidised by Lapland<sup>UK</sup>
                            for children
                            with additional needs and their families. These days are also suitable for adults
                            with special needs who still believe in Father Christmas. Complimentary carer
                            tickets apply, one carer per Superstar.
                            <br>
                            To qualify for a complimentary carer ticket, each booking must already include at
                            least one child and one adult ticket.
                        </p>
                        <p>
                            Proof of eligibility may be requested (please see
                            <a class="text-link" href="/faqs" target="_blank">
                                FAQ
                            </a>
                            page for approved documentation).
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="column">
                <div class="row">
                    <a class="button -mobile -party margin-bottom-medium small-12 rotate-ccw-small" @click="setParty">
                        <span class="button__inner">
                            <span class="button__text">Find a tour</span>
                            <svg class="button__arrow">
                                <use xlink:href="/images/svg/sprite.svg#button-arrow"
                                     xmlns:xlink="http://www.w3.org/1999/xlink"></use>
                            </svg>
                        </span>
                    </a>
                </div>
            </div>
        </div>

        <div class="row party-selector__groups">
            <div class="medium-12 small-12 column">
                <div class="row">
                    <div class="medium-12 small-12 column">
                        <p>
                            Groups: If you would like to book a party of more than 8 people, please see
                            <a class="text-link" href="/faqs">Frequently Asked Questions</a>
                            or contact us at <a class="text-link" href="mailto:enquiries@laplanduk.co.uk">enquiries@laplanduk.co.uk</a>.
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <div class="panel panel-default">
            <div class="panel-body">
                <form role="form" class="party-selector" @submit.prevent="setParty">
                    <div class="row form-body">
                        <template>
                            <div class="col-sm-6" v-if="promptForLocation">
                                <div class="form-group">
                                    <label for="location" class="col-sm-2 control-label">Location</label>
                                    <div class="col-sm-10">
                                        <multiselect id="location" name="location" :options="availableLocations"
                                                     :searchable="false" :allow-empty="false" :show-labels="false"
                                                     v-model="selectedLocation" @input="clearSeason"></multiselect>
                                    </div>
                                </div>
                            </div>
                            <div class="col-sm-6" v-if="promptForSeason">
                                <div class="form-group">
                                    <label for="season" class="col-sm-2 control-label">Season</label>
                                    <div class="col-sm-10">
                                        <multiselect id="season" name="season" :options="availableSeasons"
                                                     :searchable="false" :allow-empty="false" :show-labels="false"
                                                     v-model="selectedSeason"></multiselect>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
	import Multiselect from 'vue-multiselect';
	import HeaderBears from './booking-portal-pages/HeaderBears';
	import AdultsOnly from '../mixins/AdultsOnly';

	export default {
		components: {
			'multiselect': Multiselect,
			'header-bears': HeaderBears
		},
        mixins: [
		    AdultsOnly,
        ],
		props: {
			locations: Object,
			promptForLocation: true,
			promptForSeason: true,
			premiumSearchEnabled: Boolean,
			premiumSearch: Boolean
		},
		data() {
			return {
				errors: [],
				errorFields: [],
				maxPartySize: 8,
				selectedLocation: '',
				selectedSeason: '',
				numberOfAdults: {
					label: '0',
					value: 0
				},
				numberOfSeniors: {
					label: '0',
					value: 0
				},
				numberOfChildren: {
					label: '0',
					value: 0
				},
				numberOfBabies: {
					label: '0',
					value: 0
				},
				numberOfCarers: {
					label: '0',
					value: 0
				},
				numberOfWheelchairs: {
					label: '0',
					value: 0
				},
				showCarersAndWheelchairs: false,
                showPremiumHover: false,
                showPremiumPlusHover: false
			}
		},
		computed: {
			partySize() {
				return this.numberOfAdults.value
					+ this.numberOfSeniors.value
					+ this.numberOfChildren.value
					+ this.numberOfBabies.value
					+ this.numberOfCarers.value;
			},
			availableLocations() {
				return _.keys(this.locations);
			},
			availableSeasons() {
				return _.get(this.locations, this.selectedLocation, []);
			},
			numberOfResponsibleAdults() {
				let numberOfResponsibleAdults = this.numberOfAdults.value + this.numberOfSeniors.value;

				return {
					label: numberOfResponsibleAdults.toString(),
					value: numberOfResponsibleAdults
				};
			},
			numberOfDependantChildren() {
				let numberOfDependantChildren = this.numberOfChildren.value + this.numberOfBabies.value;

				return {
					label: numberOfDependantChildren.toString(),
					value: numberOfDependantChildren
				};
			},
			availableAdults() {
				return this.createOptions((this.maxPartySize - this.partySize + this.numberOfAdults.value) + 1);
			},
			availableSeniors() {
				return this.createOptions((this.maxPartySize - this.partySize + this.numberOfSeniors.value) + 1);
			},
			availableChildren() {
				return this.createOptions((this.maxPartySize - this.partySize + this.numberOfChildren.value) + 1);
			},
			availableBabies() {
				return this.createOptions((this.maxPartySize - this.partySize + this.numberOfBabies.value) + 1);
			},
			availableCarers() {
				return this.createOptions(3);
			},
			availableWheelchairs() {
				return this.createOptions(this.partySize + 1);
			}
		},
		methods: {
			tooltipOptions(type) {
				if (type === 'babies') {
					return {
						trigger: 'click',
						placement: 'top',
						content: `<p>Babies under 12 months (babies in arms) visit free on Observer Status (i.e. they do not receive the personalised invitation or husky toy nor take part in the Toy Factory or Mother Christmas activies).</p>`
					};
				}

				if (type === 'seniors') {
					return {
						trigger: 'click',
						placement: 'top',
						content: `<p>Proof of pensionable age may be required. </p>`
					};
				}
				return {
					trigger: 'click',
					content: `<div></div>`
				};
			},
			setParty() {
				let valid = this.validate();

				if (valid) {
					this.$emit(
						'partySelected',
						{
							adults: this.numberOfAdults.value,
							seniors: this.numberOfSeniors.value,
							children: this.numberOfChildren.value,
							babies: this.numberOfBabies.value,
							carers: this.numberOfCarers.value,
							wheelchairs: this.numberOfWheelchairs.value
						}
					);
				}
			},
			validate() {
				// Reset errors
				this.errors = [];

				if (this.adultsOnly) {
                    // Adults only validation
                    if ((this.numberOfResponsibleAdults.value < 1)) {
                        this.errors.push('Each booking requires a minimum of one adult or one senior ticket');
                        this.errorFields = [
                            'adults',
                            'seniors',
                        ];
                    }
                } else {
                    if (this.noAdultsOrChildren()) {
                        this.errors.push('Each booking requires a minimum of one adult and one paying child ticket');
                        this.errorFields = [
                            'adults',
                            'seniors',
                            'children',
                            'babies'
                        ];
                    }

                    if (this.noChildren()) {
                        this.errors.push('You need at least 1 child to attend the event');
                        this.errorFields = [
                            'children'
                        ];
                    }

                    if (this.notEnoughResponsibleAdults()) {
                        this.errors.push('Children and Infants must be accompanied by at least one adult')
                        this.errorFields = [
                            'adults',
                            'seniors'
                        ];
                    }
                }

				return (this.errors.length === 0);
			},
			noAdultsOrChildren() {
				return (this.numberOfResponsibleAdults.value < 1 && this.numberOfChildren.value < 1);
			},
			noChildren() {
				return (this.numberOfChildren.value < 1);
			},
			notEnoughResponsibleAdults() {
				return (this.numberOfDependantChildren.value > 0 && this.numberOfResponsibleAdults.value < 1);
			},
			clearSeason() {
				this.selectedSeason = '';
			},
			createOptions(size) {
				if (size < 0) {
					return [{label: '0', value: 0}];
				}
				if (size > 8) {
					return _.map(_.range(8), value => {
						return {
							label: value.toString(),
							value: value
						}
					});
				}
				return _.map(_.range(size), value => {
					return {
						label: value.toString(),
						value: value
					}
				});
			},
			toggleShowCarersAndWheelchairs() {
				this.showCarersAndWheelchairs = !this.showCarersAndWheelchairs;
			},
			updateSearchType(type) {
				this.$emit('searchTypeSelected', type);
			},
			togglePremiumHover() {
				this.showPremiumHover = !this.showPremiumHover;
				if(this.showPremiumPlusHover) {
					this.showPremiumPlusHover = !this.showPremiumPlusHover;
                }
            },
			togglePremiumPlusHover() {
				this.showPremiumPlusHover = !this.showPremiumPlusHover;
				if(this.showPremiumHover) {
					this.showPremiumHover = !this.showPremiumHover;
				}
			}
		}
	}
</script>
