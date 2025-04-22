import axios, { AxiosInstance } from 'axios';

const api: AxiosInstance = axios.create({
    baseURL: "https://ticket-system-server-xgom.onrender.com",
    headers: {
        "Content-Type": "application/json",
    },
});

export default api;
