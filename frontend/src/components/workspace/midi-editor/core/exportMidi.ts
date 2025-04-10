import { Midi } from '@tonejs/midi';

export function exportMidi(notes: any[], bpm: number) {
  const midi = new Midi();

  // ✅ Set BPM in MIDI header (critical for timing)
  midi.header.setTempo(bpm);

  // ✅ Add a track
  const track = midi.addTrack();
  track.name = 'Exported from Real-Time MIDI Editor';
  track.channel = 0;
  track.instrument.name = 'Piano';

  // ✅ Add all notes
  notes.forEach(note => {
    track.addNote({
      midi: note.pitch,
      time: note.time, // in beats
      duration: note.duration, // in beats
      velocity: note.velocity / 127, // normalized
    });
  });

  // ✅ Generate and download MIDI file
  const bytes = midi.toArray();
  const blob = new Blob([bytes], { type: 'audio/midi' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'track.mid';
  a.click();
  URL.revokeObjectURL(url);
}
