import {mapGetters} from 'vuex';

export default {
    computed: mapGetters({
        order: 'order',
        checkout: 'checkout',
        referrers: 'referrers'
    }),
};