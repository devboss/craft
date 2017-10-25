import {mapGetters} from 'vuex';

export default {
    beforeRouteEnter (to, from, next) {
        next(vm => {
            vm.$store.dispatch('loadTimeSlotPrices', {
                bookingId: vm.$store.getters.getBooking.id,
                location: 'Windsor',
                season: '2017',
            }).then(() => {
                next();
            });
        });
    },
    beforeRouteUpdate (to, from, next) {
        this.$store.dispatch('loadTimeSlotPrices', {
            bookingId: this.$store.getters.getBooking.id,
            location: 'Windsor',
            season: '2017',
        }).then(() => {
            next();
        });
    },
    computed: mapGetters({
        adultPrice: 'getAdultPrice',
        seniorPrice: 'getSeniorPrice',
        childPrice: 'getChildPrice',
    }),
};