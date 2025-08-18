import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useEffect, useState } from 'react';
import * as Tone from 'tone';
export const TransportContext = createContext(null);
export const TransportProvider = ({ children }) => {
    const [bpm, setBpm] = useState(120);
    const [isPlaying, setIsPlaying] = useState(false);
    const [playheadBeat, setPlayheadBeat] = useState(0);
    const [metronome, setMetronome] = useState(false);
    const [loop, setLoop] = useState(false);
    // ---- centralized zoom & snap ----
    const [zoom, setZoom] = useState(1);
    const [snapToGrid, setSnapToGrid] = useState(true);
    const setZoomLevel = (z) => setZoom(z);
    const handleZoomIn = () => setZoom((z) => (z === 1 ? 2 : z === 2 ? 4 : 4));
    const handleZoomOut = () => setZoom((z) => (z === 4 ? 2 : z === 2 ? 1 : 1));
    const handlePlay = async () => {
        await Tone.start();
        setIsPlaying(true);
    };
    const handlePause = () => setIsPlaying(false);
    const returnToStart = () => setPlayheadBeat(0);
    const toggleMetronome = () => setMetronome((prev) => !prev);
    const toggleSnap = () => setSnapToGrid((s) => !s);
    const toggleLoop = () => setLoop((prev) => !prev);
    useEffect(() => {
        let metronomeSynth = null;
        let intervalId;
        if (metronome && isPlaying) {
            metronomeSynth = new Tone.Synth({
                oscillator: { type: 'square' },
                envelope: { attack: 0.001, decay: 0.01, sustain: 0.1, release: 0.1 }
            }).toDestination();
            intervalId = Tone.Transport.scheduleRepeat((time) => {
                metronomeSynth?.triggerAttackRelease("C5", "8n", time);
            }, "4n");
            Tone.Transport.start();
        }
        return () => {
            if (intervalId !== undefined)
                Tone.Transport.clear(intervalId);
            metronomeSynth?.dispose();
        };
    }, [metronome, isPlaying]);
    return (_jsx(TransportContext.Provider, { value: {
            bpm, setBpm,
            isPlaying, handlePlay, handlePause, returnToStart,
            playheadBeat, setPlayheadBeat,
            metronome, toggleMetronome,
            loop, toggleLoop,
            zoom, setZoomLevel, handleZoomIn, handleZoomOut,
            snapToGrid, setSnapToGrid, toggleSnap,
        }, children: children }));
};
