// src/components/workspace/midi-editor/core/editorBus.ts

export type EditorCommand =
  | { type: "UNDO" }
  | { type: "REDO" }
  | { type: "CUT" }
  | { type: "COPY" }
  | { type: "PASTE" }
  | { type: "DELETE" }
  | { type: "SELECT_ALL" }
  | { type: "SET_ZOOM"; value: 1 | 2 | 4 }
  | { type: "TOGGLE_SNAP" }
  | { type: "EXPORT_MIDI" }
  | { type: "IMPORT_MIDI_FILE"; file: File }
  | { type: "TRANSPOSE" }
  | { type: "VELOCITY" }
  | { type: "NOTE_LENGTH" }
  | { type: "HUMANIZE" }
  | { type: "ARPEGGIATE" }
  | { type: "STRUM" }
  | { type: "LEGATO" }
  | { type: "OPEN_AUDIO_ENGINE" }
  | { type: "OPEN_MIDI_INPUT" }
  | { type: "OPEN_SHORTCUTS" }
  | { type: "OPEN_GRID_SETTINGS" }
  | { type: "OPEN_LATENCY_SETTINGS" };

type Subscriber = (cmd: EditorCommand) => void;

const subs = new Set<Subscriber>();

export function publish(cmd: EditorCommand) {
  subs.forEach((fn) => {
    try {
      fn(cmd);
    } catch (e) {
      console.error("[editorBus] subscriber error:", e);
    }
  });
}

export function subscribe(fn: Subscriber) {
  subs.add(fn);
  return () => subs.delete(fn);
}

// ✅ Compatibility alias so older code can still import this name
export const postEditorCommand = publish;

const editorBus = { publish, subscribe };
export default editorBus;
