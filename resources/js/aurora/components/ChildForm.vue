<template>
    <div class="row nopadding child-form__form-wrapper">
        <div class="small-12 column nopadding">
            <div class="input-container">
                <label for="firstName" class="text-right">FIRST NAME:</label>
                <template v-if="canEdit">
                    <input type="text" id="firstName" name="firstName"
                           placeholder="First name"
                           v-model="child.firstName">
                </template>
                <template v-else>
                    <input type="text" id="firstName" name="firstName"
                           placeholder="First name" disabled="disabled"
                           v-model="child.firstName">
                </template>
                <div class="input-container__error"
                     v-if="(nameErrors['firstName']) && canEdit"> {{nameErrors['firstName']}}
                </div>
            </div>
        </div>
        <div class="small-12 column nopadding">
            <div class="input-container">
                <label for="lastName" class="text-right">SURNAME:</label>
                <input type="text" id="lastName" name="lastName"
                       placeholder="Last name"
                       v-model="child.lastName">
                <div class="input-container__error"
                     v-if="(nameErrors['lastName']) && canEdit"> {{nameErrors['lastName']}}
                </div>
            </div>
        </div>
        <div class="small-12 column nopadding">
            <div class="input-container -next-help-text">
                <label for="firstName_confirm" class="text-right">RE-ENTER FIRST NAME:</label>

                <template v-if="canEdit">
                    <input type="text" id="firstName_confirm" name="firstName_confirm"
                           placeholder="First name" v-model="child.firstName">
                </template>
                <template v-else>
                    <input type="text" id="firstName_confirm" name="firstName_confirm"
                           placeholder="First name" v-model="child.firstName" disabled="disabled">
                </template>
                <div class="input-container__error"
                     v-if="(typeof errors['child.firstName'] !== 'undefined') && canEdit"> {{errors['child.firstName']}}
                </div>
            </div>
        </div>
        <div class="small-12 column nopadding">
            <div class="input-container">
                <label>
                    &nbsp;
                </label>
                <span class="input-container__help-text">
                Please note, the spelling you provide will be printed on your child’s invitation from Father Christmas.
            </span>
            </div>
        </div>
        <div class="small-12 column nopadding">
            <div :class="['input-container -next-help-text', {'input-container--danger': hasError('child.answers.pronunciation')}]">
                <label for="namePronunciation">How do you pronounce your child's name?</label>
                <input type="text" id="namePronunciation" name="namePronunciation"
                       placeholder="Pronunciation" v-model="child.answers.pronunciation">
                <span class="input-container__error" v-if="hasError('child.answers.pronunciation')">{{ getError('child.answers.pronunciation') }}</span>
            </div>
        </div>
        <div class="small-12 column nopadding">
            <div class="input-container">
                <label>
                    &nbsp;
                </label>
                <span class="input-container__help-text">
                    Please write the phonetic pronunciation to help Father Christmas e.g. Joseph = jo - sef.
                </span>
            </div>
        </div>
        <div class="small-12 column nopadding">
            <div class="input-container -next-help-text">
                <label class="text-right">Gender:</label>
                <multiselect :options="genders" :id="'child-gender'" :searchable="false" :custom-label="formatSelect"
                             :allow-empty="true" v-model="gender" :show-labels="false"></multiselect>
            </div>
        </div>
        <div class="small-12 column nopadding">
            <div class="input-container">
                <label>
                    &nbsp;
                </label>
                <span class="input-container__help-text">
                Please provider the child's gender.
            </span>
            </div>
        </div>
        <div class="small-12 column nopadding">
            <div class="input-container">
                <label for="relationship" class="text-right">Relationship:</label>
                <multiselect id="relationship" name="relationship" label="name" track-by="value"
                             :options="relationships" :searchable="false" :allow-empty="false" :showLabels="false"
                             v-model="relationship"></multiselect>
            </div>
        </div>
        <div class="small-12 column nopadding">
            <div class="input-container">
                <label for="dateOfBirth" class="text-right">Date of birth:</label>
                <datepicker input-class="form-control" id="dateOfBirth" name="dateOfBirth"
                            placeholder="Date of birth" format="dd/MM/yyyy"
                            v-model="child.dob"></datepicker>
            </div>

        </div>
        <div class="small-12 column nopadding">
            <div :class="['input-container -next-help-text', {'input-container--danger': hasError('child.answers.favoritePersonThing')}]">
                <label for="favoriteThing" class="text-right">Favorite person or pet or thing:</label>
                <input type="text" id="favoriteThing" name="favoriteThing"
                       placeholder="Favourite thing" v-model="child.answers.favoritePersonThing">
                <span class="input-container__error" v-if="hasError('child.answers.favoritePersonThing')">{{ getError('child.answers.favoritePersonThing') }}</span>
            </div>
        </div>
        <div class="small-12 column nopadding">
            <div :class="['input-container -next-help-text', {'input-container--danger': hasError('child.answers.whatIsFavoritePersonThing')}]">
                <label for="favoriteThingRelationship" class="text-right">Relationship of favorite person or pet or thing:</label>
                <input type="text" id="favoriteThingRelationship" name="favoriteThingRelationship"
                       placeholder="Relationship of favourite thing" v-model="child.answers.whatIsFavoritePersonThing">
                <span class="input-container__error" v-if="hasError('child.answers.whatIsFavoritePersonThing')">{{ getError('child.answers.whatIsFavoritePersonThing') }}</span>
            </div>
        </div>
        <div class="small-12 column nopadding">
            <div class="input-container">
                <label>
                    &nbsp;
                </label>
                <span class="input-container__help-text">
                    Father Christmas will need to know who/what the favourite thing is e.g granny/toy doll
                </span>
            </div>
        </div>
        <div class="small-12 column nopadding">
            <div :class="['input-container -next-help-text', {'input-container--danger': hasError('child.answers.favoriteActivityPassTime')}]">
                <label for="favoriteActivity" class="text-right">Favorite activity or pastime:</label>
                <input type="text" id="favoriteActivity" name="favoriteActivity"
                       placeholder="Favourite activity" v-model="child.answers.favoriteActivityPassTime">
                <span class="input-container__error" v-if="hasError('child.answers.favoriteActivityPassTime')">{{ getError('child.answers.favoriteActivityPassTime') }}</span>
            </div>
        </div>
        <div class="small-12 column nopadding">
            <div class="input-container">
                <label>
                    &nbsp;
                </label>
                <span class="input-container__help-text">
                e.g. Ballet/Cubs.
            </span>
            </div>
        </div>
        <div class="small-12 column nopadding">
            <div :class="['input-container -next-help-text', {'input-container--danger': hasError('child.answers.memorableEvent')}]">
                <label for="memorableEvent" class="text-right">Memorable event:</label>
                <input type="text" id="memorableEvent" name="memorableEvent"
                       placeholder="Memorable event" v-model="child.answers.memorableEvent">
                <span class="input-container__error" v-if="hasError('child.answers.memorableEvent')">{{ getError('child.answers.memorableEvent') }}</span>
            </div>
        </div>
        <div class="small-12 column nopadding">
            <div class="input-container">
                <label>
                    &nbsp;
                </label>
                <span class="input-container__help-text">
                Please provide details of a memorable event that has happened to your child in the two weeks prior to visiting Lapland<sup>UK</sup>. e.g. Scored a goal in football/swam 10m.
            </span>
            </div>
        </div>
        <div class="small-12 column nopadding">
            <div class="input-container">
                <label for="attendedBefore" class="text-right input-container__attended-before-label">Please let us know if this child has attended the event before:</label>
                <span class="input-container__help-text">
                Please let us know if your child has attended the event before. This will allow Father Christmas to deliver a more personalised visit.
                <div>
                    <div class="input-container__attendance-year inline-block" v-for="year in reversedYears"
                         v-if="year > 2013">
                        <label class="input-container__text text-right -terms" :for="year">
                            <input type="checkbox" v-model="child.answers.yearsOfAttendance" :id="year" :value="year">
                            {{year}}
                        </label>
                    </div>
                    <template v-if="showMore">
                        <div class="input-container__attendance-year inline-block" v-for="year in reversedYears"
                             v-if="year < 2014">
                            <label class="input-container__text text-right -terms" :for="year">
                                <input type="checkbox" v-model="child.answers.yearsOfAttendance" :id="year" :value="year">
                                {{year}}
                            </label>
                        </div>
                    </template>
                </div>
                <div class="input-container__show-more-years text-center">
                    <div class="inline-block" @click="showMoreYears" v-if="!showMore">
                        Show more...
                    </div>
                </div>
            </span>
            </div>
        </div>
        <div class="small-12 column nopadding">
            <div class="input-container">
                <label>
                    &nbsp;
                </label>
                <span class="input-container__help-text -no-italic">
                <a :class="['button margin-bottom-medium rotate-ccw-small']" @click="update">
                    <span class="button__inner">
                        <span class="button__text">Update</span>
                        <svg class="button__arrow">
                            <use xlink:href="/images/svg/sprite.svg#button-arrow"
                                 xmlns:xlink="http://www.w3.org/1999/xlink"></use>
                        </svg>
                    </span>
                </a>
            </span>

            </div>
        </div>

    </div>

</template>

<script>
	import Datepicker from 'vuejs-datepicker';
	import Multiselect from 'vue-multiselect';
	import Validation from '../mixins/Validation';

	export default {
		components: {
			'datepicker': Datepicker,
			'multiselect': Multiselect
		},
		mixins: [Validation],
		props: {
		    canEdit: Boolean,
			child: {
				type: Object,
				default: {
					id: 0,
					booking: null,
					type: 'CHILD',
					relationship: 'SON',
					gender: 'MALE',
					firstName: '',
					lastName: '',
					emailAddress: null,
					address1: null,
					address2: null,
					city: null,
					postCode: null,
					country: null,
					dob: '',
					primary: false,
					useBookerDetail: false,
					answers: {
						'pronunciation': '',
						'favoritePersonThing': '',
						'whatIsFavoritePersonThing': '',
						'favoriteActivityPassTime': '',
						'memorableEvent': '',
						'attendedBefore': true,
						'yearsOfAttendance': []
					}
				}
			},
		},
		data() {
			let rules = {
				'child.answers.pronunciation': ['max:22'],
				'child.answers.favoritePersonThing': ['max:32'],
				'child.answers.whatIsFavoritePersonThing': ['max:16'],
				'child.answers.favoriteActivityPassTime': ['max:40'],
				'child.answers.memorableEvent': ['max:40'],
			};

			return {

				rules: rules,
				relationships: [
					{name: 'Not Specified', value: 'NOT_SPECIFIED'},
					{name: 'Son', value: 'SON'},
					{name: 'Daughter', value: 'DAUGHTER'},
					{name: 'Grandson', value: 'GRANDSON'},
					{name: 'Granddaughter', value: 'GRANDDAUGHTER'},
				],
				years: [
					2007,
					2008,
					2009,
					2010,
					2011,
					2012,
					2013,
					2014,
					2015,
					2016
				],
				showMore: false,
                nameErrors: {
					firstName: false,
                    lastName: false
                }
			}

		},

		computed: {
			relationship: {
				get() {
					return _.find(this.relationships, {value: this.child.relationship});
				},
				set(relationship) {
					this.child.relationship = relationship.value;
				}
			},
			genders() {
				return [
					{
						value: 'MALE',
						label: 'Male'
					},
					{
						value: 'FEMALE',
						label: 'Female'
					}
				];
			},
			gender: {
				get() {
					return _.find(this.genders, {value: this.child.gender});
				},
				set(gender) {
					this.child.gender = gender.value;
				}
			},
			reversedYears() {
				return this.years.reverse();
			},
            isValid() {
	            return _.reduce(this.errors, (isValid, error) => {
		            return isValid === false || error !== null ? false : true;
	            }, true);
            },
		},
        mounted() {
			this.passes && this.passes();
			this.$watch('child.firstName', child => {
                this.child.firstName = this.child.firstName.trim();
                if(_.isEmpty(this.child.firstName) || this.child.firstName.includes(",")) {
                	this.nameErrors.firstName = "This first name needs to be filled in.";
                } else {
	                this.nameErrors.firstName = false;
                }
            });
	        this.$watch('child.lastName', child => {
		        if(_.isEmpty(this.child.lastName)) {
			        this.nameErrors.lastName = "This last name needs to be filled in.";
		        } else {
			        this.nameErrors.lastName = false;
		        }
	        });
	        
        },
		methods: {
			update() {

			    if (this.isValid && !this.nameErrors.firstName && !this.nameErrors.lastName) {
                    let vm = this;

                    this.$store.dispatch('updateAttendee', {
                        bookingId: this.$store.getters.getBooking.id,
                        attendee: this.child,
                        booking: this.$store.getters.getBooking
                    })
                    .then(() => {
                        vm.$router.push({name: 'my-party'});
                    });
                }
			},
			formatSelect(options) {
				if (options.label) {
					return options.label;
				}
				return this.capitalizeFirstLetter(options);
			},
			capitalizeFirstLetter(string) {
				string = string.toLowerCase();
				return string.charAt(0).toUpperCase() + string.slice(1);
			},
			yearIn(year) {
				return _.find(this.child.answers.yearsOfAttendance, (storedYear) => {
					return year == storedYear;
				});
			},
			showMoreYears() {
				this.showMore = !this.showMore;
			}
		}
	}
</script>
