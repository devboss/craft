import {mapGetters} from 'vuex';

export default {
	computed: mapGetters({
		paymentErrors: 'paymentErrors'
	}),
};