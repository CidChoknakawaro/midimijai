import axios from 'axios';
const RAW = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const BASE = RAW.replace(/\/+$/, '');
const API_URL = `${BASE}/auth`;
export const register = async (username, password) => {
    const res = await axios.post(`${API_URL}/register`, { username, password });
    return res.data;
};
export const login = async (username, password) => {
    const res = await axios.post(`${API_URL}/login`, { username, password });
    return res.data;
};
