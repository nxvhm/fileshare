import axios from "axios";
import { Token } from "./Token";

const axiosInstance = axios.create();
axiosInstance.defaults.baseURL = import.meta.env.VITE_API_URL;
axiosInstance.interceptors.request.use(function(config) {
    if (!Token.isExpired()) {
        config.headers['Authorization'] = `Bearer ${Token.get()}`
    }
    return config;
});

export default axiosInstance
