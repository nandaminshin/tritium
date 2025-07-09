import axios from 'axios';

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;
axios.defaults.withCredentials = true;

axios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        // For any other error, just reject the promise so that the .catch()
        // block in your component can handle it.
        return Promise.reject(error);
    }
);

export default axios;
