import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:8000/api/health';

export const predictRisk = async (data) => {
    const response = await axios.post(`${BASE_URL}/predict`, data);
    return response.data;
};

export const getHistory = async (userId) => {
    const response = await axios.get(`${BASE_URL}/history/${userId}`);
    return response.data;
};

export const getBaseline = async (userId) => {
    const response = await axios.get(`${BASE_URL}/baseline/${userId}`);
    return response.data;
};

export const setBaseline = async (userId) => {
    const response = await axios.post(`${BASE_URL}/baseline/${userId}`);
    return response.data;
};

export const getAllUsers = async () => {
    const response = await axios.get(`${BASE_URL}/users`);
    return response.data;
};

export const deleteUser = async (userId) => {
    const response = await axios.delete(`${BASE_URL}/users/${userId}`);
    return response.data;
};