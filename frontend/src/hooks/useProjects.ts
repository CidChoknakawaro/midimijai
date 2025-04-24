import { useState, useEffect } from "react";
import {
  getAllProjects,
  createProject,
  deleteProject,
  updateProject,
  getProjectById,
} from "../services/projectService";

export interface Project {
  id: number;
  name: string;
  data: string;
  created_at: string;
  updated_at?: string;
  user_id: number;
}

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const data = await getAllProjects();
      setProjects(data);
    } catch (err: any) {
      console.error("❌ Failed to load projects", err);
      setError("Failed to load projects.");
    } finally {
      setLoading(false);
    }
  };

  const addProject = async (name: string, data: string) => {
    const newProject = await createProject(name, data);
    setProjects((prev) => [...prev, newProject]);
  };

  const removeProject = async (id: number) => {
    await deleteProject(id);
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  const renameProject = async (id: number, name: string, data: string) => {
    const updated = await updateProject(id, name, data);
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, name: updated.name } : p))
    );
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