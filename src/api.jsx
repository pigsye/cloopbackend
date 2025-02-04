import axios from "axios";

// Base URL for the API
export const BASE_URL = "http://127.0.0.1:5000/api";

const API = axios.create({
    baseURL: BASE_URL + "/admin",
});

export default API;