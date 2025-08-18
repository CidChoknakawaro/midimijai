import { useState, useEffect } from "react";
import { getAllProjects, createProject, deleteProject, updateProject, getProjectById, } from "../services/projectService";
export const useProjects = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const fetchProjects = async () => {
        setLoading(true);
        try {
            const data = await getAllProjects();
            setProjects(data);
        }
        catch (err) {
            console.error("❌ Failed to load projects", err);
            setError("Failed to load projects.");
        }
        finally {
            setLoading(false);
        }
    };
    const addProject = async (name, data) => {
        const newProject = await createProject(name, data);
        setProjects((prev) => [...prev, newProject]);
    };
    const removeProject = async (id) => {
        await deleteProject(id);
        setProjects((prev) => prev.filter((p) => p.id !== id));
    };
    const renameProject = async (id, name, data) => {
        const updated = await updateProject(id, name, data);
        setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, name: updated.name } : p)));
    };
    useEffect(() => {
        fetchProjects();
    }, []);
    return {
        projects,
        loading,
        error,
        fetchProjects,
        addProject,
        removeProject,
        renameProject,
        getProjectById,
    };
};
