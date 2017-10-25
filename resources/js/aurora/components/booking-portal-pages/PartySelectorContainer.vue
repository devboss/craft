<template>
    <div class="row" v-if="bookingPortalLive">
        <div class="column">
            <template v-if="loaded">
                <party-selector :locations="locations" :promptForLocation="promptForLocation"
                                :promptForSeason="promptForSeason" :premiumSearchEnabled="premiumSearchEnabled"
                                :premiumSearch="premiumSearch"
                                @partySelected="searchForAvailability"
                                @searchTypeSelected="setSearchType"></party-selector>
            </template>
        </div>
    </div>
    <offline v-else></offline>
</template>

<script>
	import PartySelector from '../PartySelector.vue';
	import Offline from '../Offline.vue';
	import Booking from '../../mixins/Booking';


	export default {
		components: {
			'party-selector': PartySelector,
			'offline': Offline,
		},
		mixins: [Booking],
		mounted() {
			this.$store.dispatch('loadLocations');
		},
		computed: {
			loaded() {
				return _.keys(this.locations).length > 0;
			},
			bookingPortalLive() {
				return (this.$route.query.accessToken && this.$route.query.accessToken === window.bookingPortalAccessToken) || window.bookingPortalLive;
			}
		},
		methods: {
			searchForAvailability(party) {
				this.$store.commit('party', party);
				this.$router.push({name: 'daySelector'});
			},
            setSearchType(type) {
                this.$store.commit('setPremiumSearch', type);
            }
		}
	}
</script>