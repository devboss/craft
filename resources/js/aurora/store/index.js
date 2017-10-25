import Vue from 'vue';
import Vuex from 'vuex';
import auth from './modules/authentication';
import booking from './modules/booking';
import bookings from './modules/bookings';
import myDetails from './modules/my-details';
import errors from './modules/errors';

Vue.use(Vuex);

const state = {};

const actions = {};

const mutations = {};

const getters = {};

export default new Vuex.Store({
    state,
    getters,
    actions,
    mutations,
    modules: {
        auth,
        myDetails,
        booking,
        bookings,
        errors,
    },
});