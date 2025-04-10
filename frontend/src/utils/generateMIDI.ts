import { Midi } from '@tonejs/midi';
import * as Tone from 'tone';
import { MIDINote } from '../context/midiStore';

export const generateMIDI = (notes: MIDINote[]) => {
  const midi = new Midi();
  const track = midi.addTrack();

  notes.forEach((note) => {
    track.addNote({
      midi: Tone.Frequency(note.pitch).toMidi(),
      time: note.time * Tone.Time('16n').toSeconds(),
      duration: Tone.Time('16n').toSeconds(),
    });
  });

  const blob = new Blob([midi.toArray()], { type: 'audio/midi' });
  const url = URL.createObjectURL(blob);
  return url;
};