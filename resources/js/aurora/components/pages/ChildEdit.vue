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
    import Children from '../../mixins/Attendees';

    export default {
        components: {
            ChildForm,
        },
        mixins: [Children],
        props: {
            childId: String | Number
        },
        data() {
            return {
                canEdit: false
            };
        },
        mounted() {
            const child  = _.find(this.children, {id: parseInt(this.childId)});
            this.canEdit = !_.has(child, 'firstName');
        },
        computed: {
            child() {
                return _.find(this.children, {id: parseInt(this.childId)});
            }
        },
    }
</script>
