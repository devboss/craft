import store from '../store';
import {mapGetters} from 'vuex';

export default {
    beforeRouteEnter (to, from, next) {
        store.dispatch('loadMyDetails').then(() => {
            next();
        });
    },
    beforeRouteUpdate (to, from, next) {
        store.dispatch('loadMyDetails').then(() => {
            next();
        });
    },
    computed: mapGetters({
        myDetails: 'getMyDetails',
    }),
};