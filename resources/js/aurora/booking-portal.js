
/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

require('./bootstrap');

/**
 * Next, we will create a fresh Vue application instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */

import store from './store';
import config from './store/modules/booking-portal';
store.registerModule('config', config);

import Multiselect from 'vue-multiselect';
Vue.component('multiselect', Multiselect);

import VueRouter from 'vue-router';
import VTooltip from 'v-tooltip';

import localForage from './local-forage/index';

Vue.use(VTooltip, {
	container: 'body',
	trigger: 'hover focus'
});
Vue.use(VueRouter);

import PartySelectorContainer from './components/booking-portal-pages/PartySelectorContainer.vue';
import DaySelectorContainer from './components/booking-portal-pages/DaySelectorContainer.vue';
import SlotSelectorContainer from './components/booking-portal-pages/SlotSelectorContainer.vue';
import CancellationProtectionContainer from './components/booking-portal-pages/CancellationProtectionContainer.vue';
import ExtraSelectorContainer from './components/booking-portal-pages/ExtraSelectorContainer.vue';
import BookingDetailContainer from './components/booking-portal-pages/BookingDetailsContainer.vue';
import BookingSuccessContainer from './components/booking-portal-pages/BookingSuccessContainer.vue';
import BookingFailureContainer from './components/booking-portal-pages/BookingFailureContainer.vue';
import BookingCompleteContainer from './components/booking-portal-pages/BookingCompleteContainer.vue';

const baseSegment = '/booking-portal';

const router = new VueRouter({
	mode: 'history',
	routes: [
		{ name: 'partySelector', path: baseSegment + '/', component: PartySelectorContainer},
		{ name: 'daySelector', path: baseSegment + '/availability/overview', component: DaySelectorContainer },
		{ name: 'slotSelector', path: baseSegment + '/availability/search', component: SlotSelectorContainer },
		{ name: 'extraSelector', path: baseSegment + '/availability/extras', component: ExtraSelectorContainer },
		{ name: 'cancellationProtectionSelector', path: baseSegment + '/availability/protection', component: CancellationProtectionContainer },
		{ name: 'bookingDetailContainer', path: baseSegment + '/booking/details', component: BookingDetailContainer, props: true},
		{ name: 'success.callback', path: baseSegment + '/booking/confirmed/:id', component: BookingSuccessContainer, props: true},
		{ name: 'failure.callback', path: baseSegment + '/booking/failed/:id', component: BookingFailureContainer, props: true },
		{ name: 'success.final', path: baseSegment + '/booking/complete/:reference', component: BookingCompleteContainer, props: true }
	]
});

import VueAnalytics from 'vue-analytics';

Vue.use(VueAnalytics, {
    id: 'UA-100951527-1',
    router: router,
});

const bookingPortal = new Vue({
    el: '#booking-portal',
    store: store,
	router: router,
}).$mount('#booking-portal');


const t = {
	init() {
		$(document).ready(function () {
			$(document).on('click', '.image-misc__image--cross', function (e) {
				e.preventDefault();
				const activeInfo = $('.active.info').find('.day-selector__inside-date--small, .day-selector__inside-date--medium');
				$.each(activeInfo, function (k, i) {
					if(i._tooltip) {
						i._tooltip.hide();
					}

				});
			});

			$(document).on('click', '.slot-selector__whats-included', function (e) {
				e.preventDefault();
				if($(this).next()) {
					$(this).next().toggle();
				}
			});
		});
	}
};
t.init();