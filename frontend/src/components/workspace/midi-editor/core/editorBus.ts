// frontend/src/components/workspace/midi-editor/core/editorBus.ts
export type EditorCommand =
  | { type: "UNDO" }
  | { type: "REDO" }
  | { type: "CUT" }
  | { type: "COPY" }
  | { type: "PASTE" }
  | { type: "DELETE" }
  | { type: "SELECT_ALL" }
  | { type: "TRANSPOSE" }
  | { type: "VELOCITY" }
  | { type: "NOTE_LENGTH" }
  | { type: "HUMANIZE" }
  | { type: "ARPEGGIATE" }
  | { type: "STRUM" }
  | { type: "LEGATO" }
  // carry File payloads:
  | { type: "IMPORT_SAMPLE"; file: File }
  | { type: "IMPORT_MIDI_FILE"; file: File }
  // export
  | { type: "EXPORT_MIDI" }
  // AI apply payload (example shape)
  | { type: "APPLY_AI_TO_TRACK"; notes: Array<{ pitch:number; time:number; duration:number; velocity:number }>; bpm?: number }
  // UI / settings
  | { type: "OPEN_GRID_SETTINGS" }
  | { type: "OPEN_AUDIO_ENGINE" }
  | { type: "OPEN_MIDI_INPUT" }
  | { type: "OPEN_SHORTCUTS" }
  | { type: "TOGGLE_SNAP" }
  | { type: "OPEN_LATENCY_SETTINGS" }
  // zoom with value
  | { type: "SET_ZOOM"; value: 1 | 2 | 4 };

let subscribers: ((cmd: EditorCommand) => void)[] = [];

export function subscribe(fn: (cmd: EditorCommand) => void) {
  subscribers.push(fn);
  return () => {
    subscribers = subscribers.filter((s) => s !== fn);
  };
}

export function publish(cmd: EditorCommand) {
  subscribers.forEach((s) => s(cmd));
}