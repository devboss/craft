import axios from 'axios';

const api = axios.create({
    baseURL: window.baseApiUrl,
});

export default api;