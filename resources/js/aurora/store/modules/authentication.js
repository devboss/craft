import randomstring from 'randomstring';
import AuthenticationError from '../../errors/AuthenticationError';
import auth from '../../auth';

const state = {
    accessToken: null,
    csrfToken: null,
    redirectTo: null,
};

const actions = {
    authenticate ({commit, getters}, redirectTo, name) {
        let redirectUri = encodeURIComponent(`${getters.getBaseURL}/oauth/callback/${getters.getBooking.id}/${redirectTo.name ? redirectTo.name : 'mmb-home'}`);
        let csrfToken = randomstring.generate();
        commit('accessToken', {accessToken: null});
        commit('redirectTo', {redirectTo: redirectTo});
        commit('csrfToken', {csrfToken: csrfToken});

        window.location = auth.defaults.baseURL + 'auth/oauth/authorize'
            + '?client_id=public'
            + '&response_type=token'
            + '&redirect_uri=' + redirectUri
            + '&state=' + csrfToken;
    },
    authorize ({commit, getters}, fragment) {
        if (fragment.length === 0 || fragment[0] !== '#') {
            throw new AuthenticationError('Invalid response fragment.');
        }

        let payload = _.fromPairs(_.map(fragment.substr(1).split('&'), keyValue => {
            return keyValue.split('=');
        }));

        let csrfToken = getters.csrfToken;
        let state = payload.state;
        let accessToken = payload.access_token;

        if (state !== csrfToken) {
            throw new AuthenticationError('Invalid CSRF token.');
        }

        commit('accessToken', {accessToken: accessToken});
    },
    logout ({commit}) {
        return new Promise((resolve, reject) => {
            commit('accessToken', {accessToken: null});

            auth.post('auth/logout', {}, {
                withCredentials: true,
            })
                .then(response => {
                    resolve();
                })
                .catch(error => {
                    reject(error);
                });
        });
    },
};

const mutations = {
    accessToken (state, payload) {
        state.accessToken = payload.accessToken;

        if (payload.accessToken === null) {
            sessionStorage.removeItem('mmb__accessToken');
        } else {
            sessionStorage.setItem('mmb__accessToken', payload.accessToken);
        }
    },
    csrfToken (state, payload) {
        state.csrfToken = payload.csrfToken;

        if (payload.csrfToken === null) {
            sessionStorage.removeItem('mmb__csrfToken');
        } else {
            sessionStorage.setItem('mmb__csrfToken', payload.csrfToken);
        }
    },
    redirectTo (state, payload) {
        state.redirectTo = payload.redirectTo;

        if (payload.redirectTo === null) {
            sessionStorage.removeItem('mmb__redirectTo');
        } else {
            sessionStorage.setItem('mmb__redirectTo', JSON.stringify(payload.redirectTo));
        }
    },
};

const getters = {
    isAuthenticated (state, getters) {
        return getters.accessToken !== null;
    },
    accessToken() {
        if (state.accessToken !== null) {
            return state.accessToken;
        }

        return sessionStorage.getItem('mmb__accessToken');
    },
    csrfToken() {
        if (state.csrfToken !== null) {
            return state.csrfToken;
        }

        return sessionStorage.getItem('mmb__csrfToken');
    },
    redirectTo() {
        if (state.redirectTo !== null) {
            return state.redirectTo;
        }

        return JSON.parse(sessionStorage.getItem('mmb__redirectTo'));
    },
};

export default {
    state,
    getters,
    actions,
    mutations,
};
