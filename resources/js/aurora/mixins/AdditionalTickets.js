import {mapGetters} from 'vuex';

export default {
    computed: mapGetters({
        additionalTickets: 'getAdditionalTickets',
        additionalExtras: 'getAdditionalExtras',
    }),
};