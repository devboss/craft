import api from '../../api';

const state = {
    id: 0,
    title: '',
    firstName: '',
    lastName: '',
    emailAddress: '',
    telephone: '',
    address1: '',
    address2: '',
    city: '',
    postCode: '',
    information: '',
    country: {
        id: 0,
        name: '',
        countryCodeAlpha2: '',
        countryCodeAlpha3: '',
        countryCodeNumeric: null,
        sortOrder: 0,
    },
};

const actions = {
    loadMyDetails({commit}) {
        return new Promise((resolve, reject) => {
            api.get('my-details/me')
                .then((response) => {
                    commit('setMyDetails', response.data);

                    resolve(response);
                })
                .catch(error => {
                    console.error(error);
                    reject(error);
                });
        });
    },
    updateMyDetails({dispatch}, myDetails) {
        return new Promise((resolve, reject) => {
            api.put('my-details/me', myDetails)
                .then(response => {
                    dispatch('loadMyDetails');
                    resolve();
                })
                .catch(error => {
                    console.error(error);
                    reject(error);
                });
        });
    },
    changePassword({dispatch}, {currentPassword, newPassword, confirmPassword}) {
        return new Promise((resolve, reject) => {
            api.put('my-details/password/change', {
                password: currentPassword,
                newPassword: newPassword,
                confirmPassword: confirmPassword
            })
                .then(response => {
                    resolve();
                })
                .catch(error => {
                    console.error(error);
                    reject(error);
                });
        });
    }
};

const mutations = {
    setMyDetails(state, details) {
        state.id = details.id;
        state.title = details.title;
        state.firstName = details.firstName;
        state.lastName = details.lastName;
        state.emailAddress = details.emailAddress;
        state.telephone = details.telephone;
        state.address1 = details.address1;
        state.address2 = details.address2;
        state.city = details.city;
        state.postCode = details.postCode;
        state.information = details.information;
        state.country = details.country;
    },
};

const getters = {
    getMyDetails(state) {
        return {
            id: state.id,
            title: state.title,
            firstName: state.firstName,
            lastName: state.lastName,
            emailAddress: state.emailAddress,
            telephone: state.telephone,
            address1: state.address1,
            address2: state.address2,
            city: state.city,
            postCode: state.postCode,
            information: state.information,
            country: state.country,
            exists() {
                return this.id !== 0;
            }
        };
    },
};

export default {
    state,
    getters,
    actions,
    mutations,
};