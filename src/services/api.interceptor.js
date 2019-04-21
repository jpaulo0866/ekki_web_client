import axios from "axios";
import {getToken, logout} from "./auth";
import properties from '../properties.json';

const api = axios.create({
    baseURL: properties.api_url
});

api.interceptors.request.use(async config => {
    const jwt = getToken();
    if (jwt) {
        config.headers.token = jwt.token;
    }
    return config;
});

api.interceptors.response.use(async (response) => {
    console.log(response);
    if (response.status === 401
        || response.status === 403) {
            logout();
        } 
    return response;
  }, 
  (error) => {
    console.log(error);
    
    if (error.toString().includes('status code 401')) {
        logout();
    }
    return Promise.reject(error);
  }
);

export default api;