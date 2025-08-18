// frontend/src/services/projectService.ts
import axios from "axios";
const API_URL = "http://localhost:8000/projects";
const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
};
export const getAllProjects = async () => {
    const res = await axios.get(API_URL + "/", getAuthHeader());
    return res.data; // array of projects
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
