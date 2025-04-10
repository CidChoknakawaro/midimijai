import { Midi } from '@tonejs/midi';

export async function importMidiFile(file: File) {
  const arrayBuffer = await file.arrayBuffer();
  const midi = new Midi(arrayBuffer);

  const notes: any[] = [];

  midi.tracks.forEach(track => {
    track.notes.forEach(note => {
      notes.push({
        id: `${note.midi}-${note.time}`, // unique-ish ID
        pitch: note.midi,
        time: note.time,
        duration: note.duration,
        velocity: Math.round(note.velocity * 127)
      });
    });
  });

  return {
    bpm: midi.header.tempos?.[0]?.bpm || 120,
    notes
  };
}