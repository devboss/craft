import {mapGetters} from 'vuex';

export default {
    computed: mapGetters({
	    days: 'availability',
	    promptForLocation: 'promptForLocation',
        promptForSeason: 'promptForSeason',
        locations: 'locations',
        booking: 'getBooking',
        party: 'party',
        selectedDay: 'day',
        selectedSlot: 'slot',
        extras: 'extras',
        availableExtras: 'availableExtras',
        availableInsurance: 'availableInsurance',
	    slots: 'slotAvailability',
	    location: 'location',
	    season: 'season',
        referrers: 'referrers',
        selectedReferrer: 'referrer',
	    premiumSearchEnabled: 'premiumSearchEnabled',
	    premiumSearch: 'premiumSearch'
    }),
};