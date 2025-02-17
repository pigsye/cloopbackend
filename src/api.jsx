import axios from "axios";

// Base URL for the API
export const BASE_URL = "http://127.0.0.1:5000";

const API = axios.create({
    baseURL: BASE_URL + "/api/admin",
});

export default API;