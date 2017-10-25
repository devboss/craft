if (!window.location.origin) {
    window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port: '');
}
const state = {
    baseSegment: '/booking-portal',
    baseURL: window.location.origin + this.baseSegment,
};

const actions = {};

const mutations = {};

const getters = {
    getBaseURL(state) {
        return state.baseURL;
    },
};

export default {
    state,
    getters,
    actions,
    mutations,
};