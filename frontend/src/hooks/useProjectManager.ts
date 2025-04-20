import { useState } from "react";
import { Project, Track } from "../types/projectTypes";

const STORAGE_KEY = "midimijai.projects";

function generateId() {
  return Date.now().toString();
}

function getNow() {
  return new Date().toISOString();
}

export function useProjectManager() {
  const [currentProject, setCurrentProject] = useState<Project | null>(null);

  // 🆕 Create New Project
  function newProject() {
    const project: Project = {
      id: generateId(),
      name: "Untitled Project",
      tracks: [],
      createdAt: getNow(),
      updatedAt: getNow(),
    };
    setCurrentProject(project);
  }

  // 💾 Save Project to localStorage
  function saveProject() {
    if (!currentProject) return;
    const projects = getAllProjects();
    const updated = {
      ...currentProject,
      updatedAt: getNow(),
    };
    const index = projects.findIndex((p) => p.id === updated.id);
    if (index !== -1) {
      projects[index] = updated;
    } else {
      projects.push(updated);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    setCurrentProject(updated);
  }

  // 💾 Save As (rename + new ID)
  function saveAsProject(newName: string) {
    if (!currentProject) return;
    const newProject: Project = {
      ...currentProject,
      id: generateId(),
      name: newName,
      createdAt: getNow(),
      updatedAt: getNow(),
    };
    const projects = getAllProjects();
    projects.push(newProject);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    setCurrentProject(newProject);
  }

  // 📂 Open by ID
  function openProject(id: string) {
    const found = getAllProjects().find((p) => p.id === id);
    if (found) {
      setCurrentProject(found);
    }
  }

  // ❌ Close Project
  function closeProject() {
    setCurrentProject(null);
  }

  // 📜 Get All from localStorage
  function getAllProjects(): Project[] {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  }

  return {
    currentProject,
    newProject,
    saveProject,
    saveAsProject,
    openProject,
    closeProject,
    getAllProjects,
  };
}
