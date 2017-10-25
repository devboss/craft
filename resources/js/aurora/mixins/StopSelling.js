import store from '../store';

const hour = 17;
const minute = 0;

function mustStopSelling() {
    let hasBookings = store.getters.getBookings.length > 0;

    if (hasBookings) {
        let booking = store.getters.getBooking;
        let tourDate = moment(booking.bookedDate + ' ' + booking.bookedTime, 'YYYY-MM-DD HH:mm');
        let tourDateDeadline = tourDate.clone().subtract(1, 'day').hour(hour).minute(minute);

        if (moment().isSameOrAfter(tourDateDeadline)) {
            return true;
        }
    }

    return false;
}

export default {
    beforeRouteEnter (to, from, next) {
        if ((to.name === 'my-party' || to.name === 'magical-extras') && mustStopSelling()) {
            return next({name: 'my-experience'});
        }

        return next();
    },
    data() {
        return {
            stopSellingDeadlineFormat: 'HH:mm',
        }
    },
    computed: {
        stopSellingDeadline() {
            return moment().hour(hour).minute(minute).format(this.stopSellingDeadlineFormat);
        },
        mustStopSelling() {
            return mustStopSelling();
        }
    },
}
