import { Midi } from "@tonejs/midi";
/**
 * @param jsonData  A JSON string like `{"notes":[…],"bpm":120}`
 * @param filename  The base name (no extension) for the download
 */
export function exportProject(jsonData, filename) {
    // parse your stored data
    const { notes, bpm } = JSON.parse(jsonData);
    // build a ToneJS Midi object
    const midi = new Midi();
    midi.header.setTempo(bpm);
    const track = midi.addTrack();
    notes.forEach((note) => track.addNote({
        midi: note.midi,
        time: note.time,
        duration: note.duration,
        velocity: note.velocity,
    }));
    // serialize to ArrayBuffer and download
    const bytes = midi.toArray();
    const blob = new Blob([bytes], { type: "audio/midi" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}.mid`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
