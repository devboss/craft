<template>
    <div class="row" v-if="loaded">
        <div class="col-sm-12">
            <!--reservation-alert :duration="300" @expired="restartAvailabilitySearch" v-if="showReservationAlert"></reservation-alert>
            <party-selector :locations="locations" :promptForLocation="promptForLocation" :promptForSeason="promptForSeason" @partySelected="searchForAvailability" v-if="showPartySelector"></party-selector>
            <availability-grid @dateSelected="dateSelected" @tourSelected="createReservation" @extrasSelected="extrasSelected" v-if="showAvailabilityGrid"></availability-grid>
            <cancel-protection @update="updateExtras" @cancellationProtectionSelected="collectBookingDetails" v-if="showCancelProtection"></cancel-protection>
            <booking-details v-if="showBookingDetails"></booking-details-->
        </div>
    </div>
</template>

<script>
    import AvailabilityGrid from './AvailabilityGrid.vue';
    import PartSelector from './PartySelector.vue';
    import ReservationAlert from './ReservationAlert.vue';
    import CancelProtection from './CancelProtection.vue';
    import BookingDetails from './BookingDetails.vue';
    import ExtraSelector from './ExtraSelector.vue';
    import Booking from '../mixins/Booking';

    export default {
        components: {
	        ExtraSelector,
	        CancelProtection,
	        'availability-grid': AvailabilityGrid,
            'party-selector': PartSelector,
            'reservation-alert': ReservationAlert,
            'cancel-protection': CancelProtection,
            'booking-details': BookingDetails,
            'extra-selector': ExtraSelector
        },
        mixins: [Booking],
        data() {
            return {
                showPartySelector: true,
                showAvailabilityGrid: false,
                showReservationAlert: false,
                showExtrasSelector: false,
                showCancelProtection: false,
                showBookingDetails: false
            }
        },
        mounted() {
            this.$store.dispatch('loadLocations');
        },
        computed: {
            loaded() {
                return _.keys(this.locations).length > 0;
            }
        },
        methods: {
            searchForAvailability(party) {
                this.$store.commit('party', party);
                this.$store.dispatch('checkAvailability');
                this.showPartySelector = false;
                this.showAvailabilityGrid = true;
            },
            restartAvailabilitySearch() {
                this.$store.commit('day', null);
                this.$store.commit('slot', null);
                this.$store.commit('resetExtras');
                this.$store.commit('resetSlotAvailability');
                this.$store.commit('resetAvailability');
                this.showPartySelector = true;
                this.showAvailabilityGrid = false;
                this.showBookingDetails = false;
                this.showReservationAlert = false;
            },
            clearReservation() {
                this.showReservationAlert = false;
            },
            createReservation() {
                //this.showAvailabilityGrid = false;
                this.showReservationAlert = true;
                //this.showExtrasSelector = true;
                this.$store.dispatch('loadAvailableExtras');
            },
	        dateSelected() {
                this.$store.dispatch('loadSlotAvailability');
            },
	        extrasSelected() {
            	this.showAvailabilityGrid = false;
            	this.showCancelProtection = true;
            },
            updateExtras(extra, price) {
                if (extra !== null) {
                	extra.selectedValue = price;
                    this.$store.commit('addExtra', extra);
                } else {
                    this.$store.commit('removeInsuranceExtra');
                }
            },
            collectBookingDetails() {
                this.showCancelProtection = false;
                this.showBookingDetails = true;
            }
        }
    }
</script>