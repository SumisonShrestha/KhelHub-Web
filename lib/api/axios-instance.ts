import axios from "axios";

const isServer = typeof window === "undefined";
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ||
    (isServer ? `http://localhost:${process.env.PORT || 3000}` : "");

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

export default axiosInstance;
