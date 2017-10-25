const state = {
    errorCode: '',
    errorMessage: '',
    validationErrors: '',
};

const actions = {};

const mutations = {
    setError(state, error) {
        state.errorCode = error.errorCode;
        state.errorMessage = error.errorMessage;
        state.validationErrors = error.validationErrors;
    },
};

const getters = {
    getError(state) {
        return {
            errorCode: state.errorCode,
            errorMessage: state.errorMessage,
            validationErrors: state.validationErrors,
            exists() {
                return this.errorCode !== '';
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