export const getActiveNotesAtBeat = (notes: any[], beat: number): any[] => {
  return notes.filter(note =>
    beat >= note.time && beat < note.time + note.duration
  );
};
