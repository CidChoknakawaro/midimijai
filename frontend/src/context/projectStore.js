// src/context/projectStore.js
import { create } from "zustand";

const initialProject = {
  bpm: 120,
  activeTrackId: null,
  tracks: [
    // Example:
    // { id: "t1", name: "Piano", instrument: "piano", notes: [] }
  ],
};

export const useProjectStore = create((set, get) => ({
  // ---- state
  project: initialProject,

  // ---- selectors
  getProject: () => get().project,
  getTracks: () => get().project?.tracks || [],
  getBpm: () => get().project?.bpm || 120,
  getActiveTrackId: () => get().project?.activeTrackId || null,
  getActiveTrack: () => {
    const p = get().project;
    if (!p?.activeTrackId) return null;
    return (p.tracks || []).find((t) => t.id === p.activeTrackId) || null;
  },

  // ---- setters
  setProject: (updater) => {
    set((state) => {
      const next =
        typeof updater === "function" ? updater(state.project) : updater;
      return { project: next };
    });
  },

  selectTrack: (trackId) => {
    set((state) => {
      const p = state.project || initialProject;
      if (!p.tracks?.some((t) => t.id === trackId)) return { project: p };
      return { project: { ...p, activeTrackId: trackId } };
    });
  },

  // Ensure an active track exists; if not, pick first and return its id
  ensureActiveTrack: () => {
    const p = get().project || initialProject;
    if (p.activeTrackId && (p.tracks || []).some(t => t.id === p.activeTrackId)) {
      return p.activeTrackId;
    }
    const first = (p.tracks || [])[0];
    if (!first) return null;
    set({ project: { ...p, activeTrackId: first.id } });
    return first.id;
  },

  // ---- AI append action
  appendNotesToActiveTrack: (notes, bpm) => {
    set((state) => {
      const proj = state.project || initialProject;
      const activeId = proj.activeTrackId;
      if (!activeId) return { project: proj };
      const nextTracks = (proj.tracks || []).map((t) =>
        t.id === activeId
          ? { ...t, notes: [...(t.notes || []), ...(notes || [])] }
          : t
      );
      return {
        project: {
          ...proj,
          bpm: bpm || proj.bpm,
          tracks: nextTracks,
        },
      };
    });
  },
}));
