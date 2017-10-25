import {mapGetters} from 'vuex';

export default {
    beforeRouteEnter (to, from, next) {
        next(vm => {
            vm.$store.dispatch('loadAvailableExtras').then(() => {
                next();
            });
        });
    },
    beforeRouteUpdate (to, from, next) {
        this.$store.dispatch('loadAvailableExtras').then(() => {
            next();
        });
    },
    computed: mapGetters({
        availableExtras: 'availableExtras',
        availableInsurance: 'availableInsurance',
    }),
};