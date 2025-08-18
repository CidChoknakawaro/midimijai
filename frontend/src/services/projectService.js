import axios from "axios";
const RAW = import.meta.env.VITE_API_URL || "http://localhost:10000";
const BASE = RAW.replace(/\/+$/, "");
const API_URL = `${BASE}/projects`;
const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return { headers: token ? { Authorization: `Bearer ${token}` } : {} };
};
export const getAllProjects = async () => {
    const res = await axios.get(API_URL + "/", getAuthHeader());
    return res.data;
};
export const getProjectById = async (id) => {
    const res = await axios.get(`${API_URL}/${id}`, getAuthHeader());
    return res.data;
};
export const createProject = async (name, data) => {
    const res = await axios.post(`${API_URL}/`, { name, data }, getAuthHeader());
    return res.data;
};
export const updateProject = async (id, name, data) => {
    const res = await axios.put(`${API_URL}/${id}`, { name, data }, getAuthHeader());
    return res.data;
};
export const deleteProject = async (id) => {
    const res = await axios.delete(`${API_URL}/${id}`, getAuthHeader());
    return res.data;
};
