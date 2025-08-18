export const getActiveNotesAtBeat = (notes, beat) => {
    return notes.filter(note => beat >= note.time && beat < note.time + note.duration);
};
