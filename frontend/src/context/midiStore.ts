import { create } from 'zustand';

export type MIDINote = {
  track: number;
  time: number;
  pitch: string;
  duration: number;
};

type MIDIState = {
  notes: MIDINote[];
  addNote: (note: MIDINote) => void;
  removeNote: (track: number, time: number) => void;
  clearNotes: () => void;
};

export const useMIDIStore = create<MIDIState>((set) => ({
  notes: [],
  addNote: (note) =>
    set((state) => ({
      notes: [...state.notes, note],
    })),
  removeNote: (track, time) =>
    set((state) => ({
      notes: state.notes.filter((n) => !(n.track === track && n.time === time)),
    })),
  clearNotes: () => set({ notes: [] }),
}));