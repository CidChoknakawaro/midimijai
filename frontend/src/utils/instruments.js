import * as Tone from 'tone';
export const getInstrument = (type) => {
    switch (type) {
        case 'keyboard':
            return new Tone.Synth().toDestination();
        case 'drums':
            return new Tone.MembraneSynth().toDestination();
        case 'bass':
            return new Tone.MonoSynth().toDestination();
        default:
            return new Tone.Synth().toDestination();
    }
};
