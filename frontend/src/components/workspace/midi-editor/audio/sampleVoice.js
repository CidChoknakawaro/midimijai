// src/components/workspace/midi-editor/audio/sampleVoice.ts
import * as Tone from "tone";
const voices = new Map();
const isFiniteNum = (v) => Number.isFinite(Number(v));
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
export function getSampleVoice(trackId, sampleUrl, sampleRootMidi = 67) {
    const existing = voices.get(trackId);
    if (existing)
        return existing;
    const player = new Tone.Player({
        url: sampleUrl,
        autostart: false,
        loop: false,
        volume: -4,
    }).toDestination();
    const voice = {
        trigger: (midiIn, durationBeatsIn, velocityIn = 96) => {
            // Make sure AudioContext is started
            // (Your app should call Tone.start() on first user gesture.)
            const bpm = isFiniteNum(Tone.Transport.bpm?.value)
                ? Number(Tone.Transport.bpm.value)
                : 120;
            const midi = isFiniteNum(midiIn) ? clamp(Math.trunc(midiIn), 0, 127) : 60;
            const durationBeats = isFiniteNum(durationBeatsIn) && durationBeatsIn > 0
                ? durationBeatsIn
                : 0.5;
            const velNorm = clamp((isFiniteNum(velocityIn) ? velocityIn : 96) / 127, 0.05, 1);
            const playbackRate = Math.pow(2, (midi - sampleRootMidi) / 12);
            player.playbackRate = isFiniteNum(playbackRate) ? playbackRate : 1;
            // Use gainToDb safely
            const db = Tone.gainToDb(velNorm);
            if (isFiniteNum(db))
                player.volume.value = db;
            player.start();
            // schedule a stop so overlaps don’t pile up
            const stopAt = Tone.now() + Math.max(0.05, (durationBeats * 60) / bpm);
            player.stop(stopAt);
        },
        dispose: () => {
            try {
                player.dispose();
            }
            catch { }
            voices.delete(trackId);
        },
    };
    voices.set(trackId, voice);
    return voice;
}
export function disposeAllSampleVoices() {
    voices.forEach((v) => v.dispose());
    voices.clear();
}
