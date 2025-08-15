// frontend/src/components/workspace/midi-editor/core/editorBus.ts
type EditorCommand =
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
  | { type: "IMPORT_SAMPLE"; file: File }
  // NEW — already published by your File menu/navbar
  | { type: "IMPORT_MIDI_FILE"; file: File }
  | { type: "EXPORT_MIDI" }
  // NEW — apply one generated clip to current track (append at end or at playhead)
  | { type: "APPLY_AI_TO_TRACK"; notes: Array<{ pitch:number; time:number; duration:number; velocity:number }>; bpm?: number; };

const bus = new EventTarget();

export function publish(cmd: EditorCommand) {
  bus.dispatchEvent(new CustomEvent("cmd", { detail: cmd }));
}

export function subscribe(fn: (cmd: EditorCommand) => void) {
  const handler = (e: Event) => {
    const ce = e as CustomEvent<EditorCommand>;
    fn(ce.detail);
  };
  bus.addEventListener("cmd", handler);
  return () => bus.removeEventListener("cmd", handler);
}
