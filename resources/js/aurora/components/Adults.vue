<template>
    <div class="row nopadding">
        <div class="small-12 column text-center">
            <h3>
                To enhance the children's enjoyment of the day, all adult members of your party are optionally invited
                to submit their contact details to receive information on the Lapland<sup>UK</sup> story.
            </h3>
        </div>
        <div class="small-12 column nopadding adults__boxes-wrapper">
            <div class="row nopadding">
                <div class="small-6 column image-misc__image--child-details-box" v-for="(adult, index) in adults">
                    <form novalidate @submit.prevent="update" class="row nopadding">
                        <div class="small-12 medium-6 column">
                            <div>
                                <label for="adultFirstName" class="sr-only">Adult First name</label>
                            </div>
                            <div>
                                <input type="text" class="form-control" id="adultFirstName" name="adultFirstName"
                                       placeholder="First Name" v-model="adult.firstName"
                                       v-on:change="markAdultAsChanged(adult.ticketId)">
                            </div>
                        </div>
                        <div class="small-12 medium-6 column">
                            <div>
                                <label for="adultLastName" class="sr-only">Adult Last name</label>
                            </div>
                            <div>
                                <input type="text" class="form-control" id="adultLastName" name="adultLastName"
                                       placeholder="Last name" v-model="adult.lastName"
                                       v-on:change="markAdultAsChanged(adult.ticketId)">
                            </div>
                        </div>


                        <div class="small-12 medium-6 column">
                            <div>
                                <label class="control-label" for="adultEmailAddress">Email address</label>
                            </div>
                            <div>
                                <input type="email" class="form-control" id="adultEmailAddress" v-model="adult.emailAddress">
                            </div>
                        </div>
                        <div class="small-12 medium-6 column">
                            <div>
                                <label :for="'adult-relationship-' + index" class="control-label">Relationship</label>
                            </div>
                            <div>
                                <multiselect :options="relationsshipsOptions" :id="'adult-relationship-' + index"
                                             :searchable="false" :custom-label="formatSelect"
                                             :allow-empty="true" v-model="adult.relationship"
                                             :show-labels="false"></multiselect>
                            </div>
                        </div>
                        <div :class="['small-12 medium-12 column']">
                            <template>
                                <label>
                                    <input type="checkbox" :id="'adult-use-details'+index" :value="true" :checked="adult.useBookerDetail"
                                           @change="linkUnlinkPerson(adult)">
                                </label>
                                <label :for="'adult-use-details'+index" class="adults__use-my-details-label">
                                    Use my details (Booker Details)
                                </label>
                            </template>

                        </div>
                    </form>
                </div>


                <div class="small-6 column image-misc__image--child-details-box" v-for="(senior, index) in seniors">
                    <form novalidate @submit.prevent="update" class="row nopadding">
                        <div class="small-12 medium-6 column">
                            <div>
                                <label for="seniorFirstName" class="sr-only">Senior First name</label>
                            </div>
                            <div>
                                <input type="text" class="form-control" id="seniorFirstName" name="seniorFirstName"
                                       placeholder="First name" v-model="senior.firstName"
                                       v-on:change="markAdultAsChanged(senior.ticketId)">
                            </div>
                        </div>
                        <div class="small-12 medium-6 column">
                            <div>
                                <label for="seniorLastName" class="sr-only">Senior Last name</label>
                            </div>
                            <div>
                                <input type="text" class="form-control" id="seniorLastName" name="seniorLastName"
                                       placeholder="Last name" v-model="senior.lastName"
                                       v-on:change="markAdultAsChanged(senior.ticketId)">
                            </div>
                        </div>


                        <div class="small-12 medium-6 column">
                            <div>
                                <label class="control-label" for="seniorEmailAddress">Email address</label>
                            </div>
                            <div>
                                <input type="email" class="form-control" id="seniorEmailAddress" v-model="senior.emailAddress">
                            </div>
                        </div>
                        <div class="small-12 medium-6 column">
                            <div>
                                <label :for="'senior-relationship-' + index" class="control-label">Relationship</label>
                            </div>
                            <div>
                                <multiselect :options="relationsshipsOptions" :id="'senior-relationship-' + index"
                                             :searchable="false" :custom-label="formatSelect"
                                             :allow-empty="true" v-model="senior.relationship"
                                             :show-labels="false"></multiselect>
                            </div>
                        </div>
                        <div :class="['small-12 medium-12 column']">
                            <template>
                                <label>
                                    <input type="checkbox" :id="'senior-use-details'+index" :value="true" :checked="senior.useBookerDetail"
                                           @change="linkUnlinkPerson(senior)">
                                </label>
                                <label class="adults__use-my-details-label">
                                    Use my details (Booker Details)
                                </label>
                            </template>
                        </div>
                    </form>
                </div>

                <div class="small-6 column image-misc__image--child-details-box" v-for="(carer, index) in carers">
                    <form novalidate @submit.prevent="update" class="row nopadding">
                        <div class="small-12 medium-6 column">
                            <div>
                                <label for="carerFirstname" class="sr-only">Carer First name</label>
                            </div>
                            <div>
                                <input type="text" class="form-control" id="carerFirstname" name="carerFirstname"
                                       placeholder="First name" v-model="carer.firstName"
                                       v-on:change="markAdultAsChanged(carer.ticketId)">
                            </div>
                        </div>
                        <div class="small-12 medium-6 column">
                            <div>
                                <label for="carerLastName" class="sr-only">Carer Last name</label>
                            </div>
                            <div>
                                <input type="text" class="form-control" id="carerLastName" name="carerLastName"
                                       placeholder="Last name" v-model="carer.lastName"
                                       v-on:change="markAdultAsChanged(carer.ticketId)">
                            </div>
                        </div>


                        <div class="small-12 medium-6 column">
                            <div>
                                <label class="control-label" for="carerEmailAddress">Email address</label>
                            </div>
                            <div>
                                <input type="email" class="form-control" id="carerEmailAddress" v-model="carer.emailAddress">
                            </div>
                        </div>
                        <div class="small-12 medium-6 column">
                            <div>
                                <label :for="'carer-relationship-' + index" class="control-label">Relationship</label>
                            </div>
                            <div>
                                <multiselect :options="relationsshipsOptions" :id="'carer-relationship-' + index"
                                             :searchable="false" :custom-label="formatSelect"
                                             :allow-empty="true" v-model="carer.relationship"
                                             :show-labels="false"></multiselect>
                            </div>
                        </div>
                        <div :class="['small-12 medium-12 column']">
                            <template>
                                <label>
                                    <input type="checkbox" :id="'carer-use-details'+index" :value="true" :checked="carer.useBookerDetail"
                                           @change="linkUnlinkPerson(carer)">
                                </label>
                                <label :for="'carer-use-details'+index" class="adults__use-my-details-label">
                                    Use my details (Booker Details)
                                </label>
                            </template>
                        </div>
                    </form>
                </div>
            </div>
        </div>

        <div class="small-12 column text-center adults__update-details-wrapper">
            <a class="" :class="['button margin-bottom-medium rotate-ccw-small']" @click="update">
                <span class="button__inner">
                    <span class="button__text">Update details</span>
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
	export default {
		props: {
			adults: Array,
			seniors: Array,
			carers: Array
		},
		computed: {
			relationsshipsOptions() {
				return [
					{
						name: 'Other', value: 'NOT_SPECIFIED'
					},
					{
						name: 'Mother', value: 'MOTHER'
					},
					{
						name: 'Father', value: 'FATHER'
					},
					{
						name: 'Grandmother', value: 'GRANDMOTHER'
					},
					{
						name: 'Grandfather', value: 'GRANDFATHER'
					},
					{
						name: 'Aunt', value: 'AUNT'
					},
					{
						name: 'Uncle', value: 'UNCLE'
					},
					{
						name: 'Sibling', value: 'SIBLING'
					},
					{
						name: 'Godparent', value: 'GODPARENT'
					},
					{
						name: 'Friend', value: 'FRIEND'
					}
				]
			}
		},
		methods: {
			update() {
				let vm = this;
				let bookingId = this.$store.getters.getBooking.id;
                let people = _.concat(this.adults, this.seniors, this.carers);

                Promise.all(_.map(_.filter(people, function (o) {
					return o.changed === true;
				}), person => {
					person.id = person.ticketId;
					person.dob = moment();
					person.gender = 'MALE';
					person.AttendeeType = person.type;
					person.answers = {
						yearsOfAttendance: [""]
					};
					return vm.$store.dispatch('updateAttendee', {
						bookingId: bookingId,
						attendee: person,
						ticketId: person.ticketId,
						booking: this.$store.getters.getBooking
					});
				}))
					.then(() => {
                        this.adults.forEach(adult => {
                            adult.changed = false;
                        });
                        this.seniors.forEach(senior => {
                            senior.changed = false;
                        });
                        this.carers.forEach(carer => {
                            carer.changed = false;
                        });
						vm.$router.replace({name: 'my-party'});
					});
			},
			formatSelect(options) {
				if (options.name) {
					return options.name;
				}
				if (options === 'NOT_SPECIFIED') {
					return 'Other';
				}
				return this.capitalizeFirstLetter(options);
			},
			capitalizeFirstLetter(string) {
				string = string.toLowerCase();
				return string.charAt(0).toUpperCase() + string.slice(1);
			},
			linkUnlinkPerson(adult) {
                this.$store.dispatch('linkUnlinkPerson', {
                    bookingId: this.$store.getters.getBooking.id,
                    ticketId: adult.ticketId,
                    link: adult.useBookerDetail
                });

			},
			markAdultAsChanged(id) {
			    if (id === null) {
			        return;
                }

                let adult = _.find(this.adults, {ticketId: id});
                if(adult) {
                    adult.changed = true;
                }
                let senior = _.find(this.seniors, {ticketId: id});
                if(senior) {
                    senior.changed = true;
                }
                let carer = _.find(this.carers, {ticketId: id});
                if(carer) {
                    carer.changed = true;
                }
			}
		}
	}
</script>
