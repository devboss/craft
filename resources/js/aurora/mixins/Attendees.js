import {mapGetters} from 'vuex';
import store from '../store';

export default {
    beforeRouteEnter (to, from, next) {
        store.dispatch('loadTickets', store.getters.getBooking.id).then(() => {
            next();
        });
    },
    beforeRouteUpdate (to, from, next) {
        store.dispatch('loadTickets', store.getters.getBooking.id).then(() => {
            next();
        });
    },
    computed: mapGetters({
        children: 'getChildAttendees',
        adults: 'getAdultAttendees',
        seniors: 'getSeniorAttendees',
        carers: 'getCarerAttendees',
    }),
};