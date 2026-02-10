import axios from "axios";

const baseURL = import.meta.env.VITE_BACKEND_URL?.replace(/\/$/, ""); // remove trailing slash


export const http = axios.create({
    baseURL,
    withCredentials: true, // because auth uses cookie token
    timeout: 20000,
});

http.interceptors.response.use(
    (res) => res,
    (err) => {
        // Optional: central place to handle 401, etc.
        return Promise.reject(err);
    }
);
