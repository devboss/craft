import store from '../store';

export default {
    computed: {
        adultsOnly: {
            get() {
                return store.getters.getAdultsOnly;
            },
            set(value) {
                store.commit('setAdultsOnly', {adultsOnly: value});
            }
        },
    },
};
