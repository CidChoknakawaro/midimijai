import { create } from 'zustand';
export const useMIDIStore = create((set) => ({
    notes: [],
    addNote: (note) => set((state) => ({
        notes: [...state.notes, note],
    })),
    removeNote: (track, time) => set((state) => ({
        notes: state.notes.filter((n) => !(n.track === track && n.time === time)),
    })),
    clearNotes: () => set({ notes: [] }),
}));
