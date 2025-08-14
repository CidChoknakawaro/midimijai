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
  | { type: "IMPORT_SAMPLE"; file: File };   // <- NEW

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
