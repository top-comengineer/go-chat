import axios from 'axios';
import { BaseUrl } from './config';
import { store } from './index';

const axiosInstance = axios.create({
  baseURL: BaseUrl
});

axiosInstance.interceptors.request.use(
  config => {
    const token = store.getState().auth.token;
    if (token) {
      config.headers.authorization = token;
    }

    return config;
  },
  error => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  response => response,
  error => Promise.reject(error)
);

export default axiosInstance;
