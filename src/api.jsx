import axios from "axios";

// Base URL for the API
export const BASE_URL = "http://54.179.178.177:5000";

const API = axios.create({
    baseURL: BASE_URL + "/api/admin",
});

export default API;
