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
import config from './store/modules/manage-my-booking';
store.registerModule('config', config);

import VTooltip from 'v-tooltip';
Vue.use(VTooltip, {
	container: 'body',
	trigger: 'hover focus'
});

import localForage from './local-forage/index';

import VueRouter from 'vue-router';
Vue.use(VueRouter);


import PaymentCallback from './components/pages/PaymentCallback.vue';
import MyBookings from './components/pages/MyBookings.vue';
import MyExperience from './components/pages/MyExperience.vue';
import MyParty from './components/pages/MyParty.vue';
import MyPartyAdd from './components/pages/MyPartyAdd.vue';
import AvailabilitySearchDay from './components/pages/AvailabilitySearchDay.vue';
import AvailabilitySearchSlot from './components/pages/AvailabilitySearchSlot.vue';
import TransferComplete from './components/pages/TransferComplete.vue';
import GuestEdit from './components/pages/GuestEdit.vue';
import ChildEdit from './components/pages/ChildEdit.vue';
import NewChildEdit from './components/pages/NewChildEdit.vue';
import MagicalExtras from './components/pages/MagicalExtras.vue';
import MyDetails from './components/pages/MyDetails.vue';
import TicketsPayment from './components/pages/TicketsPayment.vue';
import ExtrasPayment from './components/pages/ExtrasPayment.vue';
import TransferPayment from './components/pages/TransferPayment.vue';
import Redirect from './components/pages/RedirectComponent.vue';
import OAuthCallback from './components/pages/OAuthCallback.vue';

const baseSegment = '/manage-my-booking';

const router = new VueRouter({
    mode: 'history',
    routes: [
        {name: 'oauth.callback', path: baseSegment + '/oauth/callback'},
        {name: 'oauth.callback.with.props', path: baseSegment + '/oauth/callback/:id/:name', component: OAuthCallback, props: true},
        {name: 'gateway.callback', path: baseSegment + '/gateway/callback/:type', component: PaymentCallback, props: true},
        {name: 'my-bookings', path: baseSegment + '/', component: MyBookings},
        {name: 'my-experience', path: baseSegment + '/my-experience', component: MyExperience},
        {name: 'my-party', path: baseSegment + '/my-party', component: MyParty},
        {name: 'my-party.create', path: baseSegment + '/my-party/add', component: MyPartyAdd},
        {name: 'availability.day', path: baseSegment + '/transfer/availability/transfer/overview', component: AvailabilitySearchDay},
        {name: 'availability.slot', path: baseSegment + '/transfer/availability/transfer/search', component: AvailabilitySearchSlot},
        {name: 'transfer.complete', path: baseSegment + '/transfer/complete', component: TransferComplete},
        {name: 'guest.edit', path: baseSegment + '/my-party/guest/:id', component: GuestEdit, props: true},
        {name: 'child.edit', path: baseSegment + '/my-party/child/:childId', component: ChildEdit, props: true},
	    {name: 'new.child.edit', path: baseSegment + '/my-party/new-child', component: NewChildEdit, props: true},
        {name: 'magical-extras', path: baseSegment + '/magical-extras', component: MagicalExtras},
        {name: 'extras.payment', path: baseSegment + '/magical-extras/payment', component: ExtrasPayment},
        {name: 'my-details', path: baseSegment + '/my-details', component: MyDetails},
        {name: 'payment', path: baseSegment + '/tickets/payment', component: TicketsPayment},
        {name: 'transfer.payment', path: baseSegment + '/transfer/payment', component: TransferPayment},
	    {name: 'mmb-home', path: '/', component: Redirect}
    ],
});


import AuthenticationError from './errors/AuthenticationError';

import api from './api';

// Add a request interceptor
api.interceptors.request.use(config => {
    // Do something before request is sent
    config.headers['Authorization'] = 'Bearer ' + store.getters.accessToken;

    if (config.method !== 'get') {
        config.withCredentials = true;
    }

    return config;
});

// Add a response interceptor
api.interceptors.response.use(response => {
    // Do something with response data
    return response;
}, error => {
    // Do something with response error
    if (error.response && error.response.status === 401) {
        store.dispatch('authenticate', _.omit(router.currentRoute, ['matched']), router.currentRoute.name);
    }

    return Promise.reject(error);
});

router.beforeEach((to, from, next) => {
    if (store.getters.isAuthenticated) {
        if (store.getters.getBooking.id === 0) {
            store.dispatch('loadBookings').then(() => {
                if (router.currentRoute.name === 'my-bookings' && store.getters.getBookings.length === 1) {
                    router.replace({name: 'my-experience'});
                }
                next();
            });
            return;
        }
        next();
        return;
    }
    if (_.startsWith(to.path, `${baseSegment}/oauth/callback`)) {
        try {
            const params = to.params;
            store.dispatch('authorize', to.hash).then(() => {
                store.commit('redirectTo', {redirectTo: null});
                router.replace({name: 'oauth.callback.with.props', params: params});
            });
            return;
        } catch (error) {
            if (error instanceof AuthenticationError) {
                console.error(error.message);
                next();
                return;
            }
            throw error;
        }
    }
    store.dispatch('authenticate', to, 'mmb-home');
});

import Multiselect from 'vue-multiselect';
import MMBNav from './components/MmbNav.vue';
import WoodenHorse from './components/WoodenHorse.vue';
Vue.component('multiselect', Multiselect);
Vue.component('mmb-nav', MMBNav);
Vue.component('wooden-horses', WoodenHorse);

import Booking from './mixins/Booking';

import VueAnalytics from 'vue-analytics';

Vue.use(VueAnalytics, {
    id: 'UA-100951527-1',
    router: router,
});

const app = new Vue({
    el: '#app',
    mixins: [Booking],
    store: store,
    router: router,
    methods: {
        logout() {
            this.$store.dispatch('logout').then(() => {
                router.replace('/');
            });
        },
    },
});

const t = {
	init() {
		$(document).ready(function () {
			$(document).on('click', '.image-misc__image--cross', function () {
				const activeInfo = $('.active.info').find('.day-selector__inside-date--small, .day-selector__inside-date--medium');
				$.each(activeInfo, function (k, i) {
					if(i._tooltip) {
						i._tooltip.hide();
					}

				});
			});

			$(document).on('click', '.slot-selector__whats-included', function () {
				if($(this).next()) {
					$(this).next().toggle();
				}
			});
		});
	}
};
t.init();
