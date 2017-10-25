<template>
    <div class="row">
        <div class="small-12 column text-center">
            <h1 class="image-title image-title--childs-details">
                    <span class="image-title__image--childs-details">
                        Childs Details
                    </span>
            </h1>
        </div>
        <div class="small-12 column text-center">
            <p class="paragraph-sans">
                Please help Father Christmas deliver a personalised meeting by providing the details below.
            </p>
        </div>
        <child-form :child="child" v-if="child" :can-edit="canEdit"></child-form>

    </div>

</template>

<script>
	import ChildForm from '../ChildForm.vue';

	export default {
		components: {
			ChildForm,
		},
		props: {
			ticketId: String | Number
		},
        mounted() {
			if(typeof this.ticketId === 'undefined') {
				return this.$router.replace({name: 'my-party'});
            }
        },
		data() {
			return {
				canEdit: true,
                child: {
	                id: null,
	                booking: null,
	                type: 'CHILD',
	                relationship: 'NOT_SPECIFIED',
	                gender: null,
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
                    ticketId: this.ticketId,
	                answers: {
		                'pronunciation': '',
		                'favoritePersonThing': '',
		                'whatIsFavoritePersonThing': '',
		                'favoriteActivityPassTime': '',
		                'memorableEvent': '',
		                'attendedBefore': false,
		                'yearsOfAttendance': []
	                }
                }
			};
		}
	}
</script>
