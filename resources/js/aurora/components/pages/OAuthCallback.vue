<template>

</template>
<script>
    export default {
        mounted() {
            if(this.$store.getters.isAuthenticated) {
                this.$store.dispatch('loadBookings').then(() => {
                    const bookings = this.$store.getters.getBookings;
                    if(this.$route.params.id === '0') {
                        this.$store.commit('setBooking', {booking: bookings[0]});
                    } else {
                        bookings.forEach(loadedBooking => {
                            if(loadedBooking.id.toString() === this.$route.params.id) {
                                this.$store.commit('setBooking', {booking: loadedBooking});
                            }
                        });
                    }
                    this.$router.replace({name: this.$route.params.name});
                });
            }
        }
    }
</script>