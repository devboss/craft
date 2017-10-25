import axios from 'axios';

const auth = axios.create({
    baseURL: window.baseApiUrl,
});

export default auth;