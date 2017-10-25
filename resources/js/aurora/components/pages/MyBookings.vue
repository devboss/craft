<template>
    <div v-show="false">
        <h2>My Bookings</h2>
        <p>Please click on the booking you wish to manage then click again on Manage Booking to proceed.</p>

        <div class="panel panel-default">
            <table class="table">
                <thead>
                    <tr>
                        <th>Booking reference</th>
                        <th>Date of visit</th>
                        <th>Adults</th>
                        <th>Seniors</th>
                        <th>Children</th>
                        <th>Infants</th>
                        <th>Carers</th>
                        <th>Wheelchairs</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="booking in bookings" @click="selectBooking(booking)">
                        <td>{{ booking.bookingReference }}</td>
                        <td>{{ booking.bookedDate }}</td>
                        <td>{{ booking.adultsTickets }}</td>
                        <td>{{ booking.seniorsTickets }}</td>
                        <td>{{ booking.childrenTickets }}</td>
                        <td>{{ booking.infantsTickets }}</td>
                        <td>{{ booking.carersTickets }}</td>
                        <td>{{ booking.wheelchairsTickets }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
    import Booking from '../../mixins/Booking';

    export default {
        mixins: [Booking],
        computed: {
            bookings() {
                return this.$store.getters.getBookings;
            }
        },
        mounted() {
        	if(this.bookings && this.bookings.length > 0){
        		this.selectBooking(this.bookings[0]);
            }
        },
        methods: {
            selectBooking(booking) {
                this.$store.commit('setBooking', {booking: booking});
                this.$router.push({name: 'my-experience'});
            }
        }
    }
</script>