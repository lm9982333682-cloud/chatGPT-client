import axios from "axios";
import store from '../store/store.js'



const axiosInstance = axios.create({
    // baseURL: "http://localhost:5000/api",
    baseURL: "https://chatgpt-server-hvby.onrender.com/api",
    withCredentials: true,

});

axiosInstance.interceptors.request.use(config => {

    const accessToken = store.getState().auth.accessToken;
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`
    };

    return config;
}, err => Promise.reject(err))




export default axiosInstance
