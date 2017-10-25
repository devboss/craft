<template>
    <div class="row">
        <div class="small-12 column text-center">
            <h1 class="image-title image-title--adult-details">
                    <span class="image-title__image--adult-details">
                        Adults Details
                    </span>
            </h1>
        </div>
        <div class="small-12 column text-center">
            <p class="paragraph-sans">
                Please help Father Christmas deliver a personalised meeting by providing the details below.
            </p>
        </div>
        <child-form :child="guest" v-if="guest" :can-edit="canEdit"></child-form>
    </div>
</template>

<script>
    import ChildForm from '../ChildForm.vue';
    import Attendees from '../../mixins/Attendees';

    export default {
        components: {
            ChildForm,
        },
        mixins: [Attendees],
        props: {
            id: String | Number,
            adultsOnly: false,
        },
        computed: {
            guest() {
                if (this.adultsOnly) {
                    let guest = _.find(this.adults, {id: parseInt(this.id)});

                    if (!_.has(guest, 'answers') || guest.answers === null) {
                        guest.answers = {
                            'pronunciation': '',
                            'favoritePersonThing': '',
                            'whatIsFavoritePersonThing': '',
                            'favoriteActivityPassTime': '',
                            'memorableEvent': '',
                            'attendedBefore': true,
                            'yearsOfAttendance': []
                        }
                    }

                    return guest;
                }

                return _.find(this.children, {id: parseInt(this.id)});
            },
            canEdit() {
                return !_.has(this.guest, 'firstName');
            }
        },
    }
</script>
