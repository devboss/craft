export default {
    created() {
        this.$store.commit('clearDayAndSlot');
        this.$store.commit('clearAdditionalTickets');
        this.$store.commit('clearAdditionalExtras');
    }
}