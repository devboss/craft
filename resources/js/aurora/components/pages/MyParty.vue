<template>
    <div class="row nopadding">
        <div class="column nopadding">
            <template v-if="!adultsOnly">
                <div class="row">
                    <div class="small-12 column text-center">
                        <h1 class="image-title image-title--childs-details">
                        <span class="image-title__image--childs-details">
                            Childs Details
                        </span>
                        </h1>
                    </div>
                </div>

                <div class="small-12 column text-center">
                    <p>
                        Please enter the required information for your child's personalised Father Christmas visit.
                    </p>
                </div>

                <div class="small-12 column text-center">
                    <h3>
                        We recommend completing this once you have received your invitations later in the year.
                    </h3>
                </div>

                <div class="small-12 column text-center">
                    <div class="my-party__small-policy">
                        All information is kept in the strictest of confidence in line with our <a class="link" href="#">Privacy Policy</a>.
                    </div>
                </div>

                <div class="small-12 column text-center my-party__child-details-break">
                    <h3>
                        Please click the Edit button to submit magical details for each child.
                    </h3>
                </div>

                <div class="small-12 column text-center">
                    <div class="my-party__italic-warning">
                        We understand that this information can change so feel free to update child details up until the day before your visit.
                    </div>
                </div>

                <gateway-error></gateway-error>

                <children :children="children"></children>
            </template>
            <div class="row">
                <div class="small-12 column text-center">
                    <h1 class="image-title image-title--childs-details">
                    <span class="image-title__image--adult-details">
                        Adult Details
                    </span>
                    </h1>
                </div>
            </div>

            <adults :adults="adults" :seniors="seniors" :carers="carers" v-if="!adultsOnly"></adults>
            <children :children="adults" v-else></children>
        </div>
    </div>
</template>

<script>
    import Children from '../Children.vue';
    import Adults from '../Adults.vue';
    import GatewayError from '../GatewayError.vue';
    import Attendees from '../../mixins/Attendees';
    import AdultsOnly from '../../mixins/AdultsOnly';
    import StopSelling from '../../mixins/StopSelling';

    export default {
        components: {
            Children,
            Adults,
            GatewayError,
        },
        mixins: [AdultsOnly, Attendees, StopSelling],
        created() {
            if (this.children.length === 0) {
                this.adultsOnly = true;
            }
        }

    }
</script>
