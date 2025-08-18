import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useContext, useEffect, useRef, useState, memo, useMemo } from "react";
import * as Tone from "tone";
import { getActiveNotesAtBeat } from "../../core/midiUtils";
import { TransportContext } from "../../core/TransportContext";
import "./TrackDashboard.css";
const MAX_BEAT = 63;
const NOTE_HEIGHT = 3;
const PITCH_RANGE = [36, 84];
const isFiniteNum = (v) => Number.isFinite(Number(v));
const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));
/**
 * Normalize a raw note (AI or editor) to the dashboard format:
 * { id, pitch (MIDI int), time (beats >=0), duration (beats > 0), velocity127 (0..127) }
 */
function normalizeNotes(notes) {
    if (!Array.isArray(notes))
        return [];
    return notes
        .map((n, idx) => {
        // support both shapes
        const pitch = isFiniteNum(n?.pitch) ? Math.trunc(n.pitch) :
            isFiniteNum(n?.midi) ? Math.trunc(n.midi) : 60;
        const time = isFiniteNum(n?.time) && n.time >= 0 ? Number(n.time) : 0;
        const duration = isFiniteNum(n?.duration) && n.duration > 0 ? Number(n.duration) : 0.5;
        // velocity may be 0..127 or 0..1
        let v = n?.velocity ?? n?.velocity127 ?? 96;
        const velocity127 = v <= 1 ? Math.round(clamp(v, 0.05, 1) * 127) : Math.round(clamp(v, 1, 127));
        const id = String(n?.id ?? `${pitch}@${time.toFixed(4)}#${idx}`);
        return {
            id,
            pitch: clamp(pitch, 0, 127),
            time,
            duration: clamp(duration, 0.05, 16),
            velocity127: clamp(velocity127, 1, 127),
        };
    })
        .filter((n) => n.duration > 0 && n.time >= 0);
}
/** Normalize incoming AI notes before merging into raw track.notes */
function normalizeIncomingNotes(notes) {
    return normalizeNotes(notes);
}
const TrackDashboard = ({ tracks, onEditTrack, onAddTrack, updateTrack, deleteTrack }) => {
    const { bpm, isPlaying, playheadBeat, setPlayheadBeat } = useContext(TransportContext);
    const [muteMap, setMuteMap] = useState({});
    const [soloMap, setSoloMap] = useState({});
    const [volumeMap, setVolumeMap] = useState({});
    const [panMap, setPanMap] = useState({});
    const [redLineLeft, setRedLineLeft] = useState(0);
    const redLineBeatRef = useRef(playheadBeat);
    const animationRef = useRef(null);
    const instrumentMap = useRef(new Map());
    const activeNotesMap = useRef(new Map());
    // NEW: buffer AI notes if an apply arrives before any tracks exist
    const pendingApplyRef = useRef(null);
    // Listen for global "apply to track" and auto-create track if needed
    useEffect(() => {
        function onCmd(ev) {
            const e = ev;
            const detail = e.detail || {};
            if (detail.type !== "APPLY_AI_TO_TRACK")
                return;
            const incoming = normalizeIncomingNotes(detail.notes || []);
            if (!incoming.length)
                return;
            // If there are no tracks yet, create one and buffer the apply
            if (!tracks.length) {
                pendingApplyRef.current = { notes: incoming, bpm: detail.bpm };
                onAddTrack();
                return;
            }
            // otherwise apply to target (or first track)
            const targetId = detail.targetTrackId || tracks[0].id;
            const t = tracks.find(x => x.id === targetId) || tracks[0];
            const merged = [...(t.notes || []), ...incoming.map(n => ({
                    id: n.id, pitch: n.pitch, time: n.time, duration: n.duration, velocity: n.velocity127
                }))];
            updateTrack(t.id, { notes: merged });
        }
        window.addEventListener("cmd", onCmd);
        return () => window.removeEventListener("cmd", onCmd);
    }, [tracks, onAddTrack, updateTrack]);
    // Flush buffered apply once a track exists
    useEffect(() => {
        if (!pendingApplyRef.current)
            return;
        if (!tracks.length)
            return;
        const { notes /*, bpm*/ } = pendingApplyRef.current;
        pendingApplyRef.current = null;
        const t = tracks[0]; // apply to first created track
        const merged = [...(t.notes || []), ...notes.map(n => ({
                id: n.id, pitch: n.pitch, time: n.time, duration: n.duration, velocity: n.velocity127
            }))];
        updateTrack(t.id, { notes: merged });
    }, [tracks, updateTrack]);
    // Pre-normalize notes for all tracks so everything downstream is safe.
    const normalizedByTrackId = useMemo(() => {
        const map = new Map();
        tracks.forEach((t) => map.set(t.id, normalizeNotes(t.notes)));
        return map;
    }, [tracks]);
    // Build instruments for current track list
    useEffect(() => {
        // dispose old
        instrumentMap.current.forEach((i) => i?.dispose?.());
        instrumentMap.current.clear();
        tracks.forEach((track) => {
            const vol0to100 = isFiniteNum(volumeMap[track.id]) ? Number(volumeMap[track.id]) : 100;
            const volDb = clamp(vol0to100, 0, 100) - 100; // 0..100 -> -100..0 dB
            const panVal = isFiniteNum(panMap[track.id]) ? clamp(Number(panMap[track.id]), -1, 1) : 0;
            const volume = new Tone.Volume(volDb).toDestination();
            const pan = new Tone.Panner(panVal).connect(volume);
            if (track.instrument?.startsWith("Imported:")) {
                instrumentMap.current.set(track.id, { synth: null, pan, volume });
            }
            else {
                let synth;
                switch (track.instrument) {
                    case "Piano":
                        synth = new Tone.PolySynth().connect(pan);
                        break;
                    case "Synth":
                        synth = new Tone.Synth().connect(pan);
                        break;
                    case "AMSynth":
                        synth = new Tone.AMSynth().connect(pan);
                        break;
                    case "MembraneSynth":
                        synth = new Tone.MembraneSynth().connect(pan);
                        break;
                    default:
                        synth = new Tone.PolySynth().connect(pan);
                        break;
                }
                instrumentMap.current.set(track.id, { synth, pan, volume });
            }
            activeNotesMap.current.set(track.id, new Set());
        });
        return () => {
            instrumentMap.current.forEach((i) => {
                i?.synth?.dispose?.();
                i?.pan?.dispose?.();
                i?.volume?.dispose?.();
            });
        };
    }, [tracks, volumeMap, panMap]);
    // Timeline + playback driving
    useEffect(() => {
        let lastTime = performance.now();
        const tick = (now) => {
            const delta = Math.max(now - lastTime, 0) / 1000;
            lastTime = now;
            const safeBpm = isFiniteNum(bpm) && bpm > 0 ? bpm : 120;
            if (isPlaying) {
                const beatsMoved = (safeBpm / 60) * delta;
                redLineBeatRef.current += beatsMoved;
                if (redLineBeatRef.current >= MAX_BEAT)
                    redLineBeatRef.current = 0;
                setPlayheadBeat(redLineBeatRef.current);
            }
            else {
                redLineBeatRef.current = playheadBeat;
                stopAllNotes();
            }
            setRedLineLeft(redLineBeatRef.current * 10);
            const soloed = Object.entries(soloMap)
                .filter(([, s]) => s)
                .map(([id]) => id);
            tracks.forEach((track) => {
                const muted = !!muteMap[track.id];
                const blockedBySolo = soloed.length > 0 && !soloMap[track.id];
                if (!muted && !blockedBySolo && isPlaying) {
                    triggerTrackNotes(track, redLineBeatRef.current, normalizedByTrackId.get(track.id) || []);
                }
            });
            animationRef.current = requestAnimationFrame(tick);
        };
        animationRef.current = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(animationRef.current);
    }, [isPlaying, bpm, tracks, muteMap, soloMap, playheadBeat, setPlayheadBeat, normalizedByTrackId]);
    const triggerTrackNotes = (track, beat, safeNotes) => {
        const instruments = instrumentMap.current.get(track.id);
        const synth = instruments?.synth;
        // getActiveNotesAtBeat expects notes with at least { id, time, duration }
        const nowActive = getActiveNotesAtBeat(safeNotes, beat);
        const activeIds = activeNotesMap.current.get(track.id);
        nowActive.forEach((note) => {
            if (!activeIds.has(note.id)) {
                const now = Tone.now();
                if (track.instrument?.startsWith("Imported:")) {
                    const url = track.customSoundUrl;
                    if (!url)
                        return;
                    const safeBpm = isFiniteNum(bpm) && bpm > 0 ? bpm : 120;
                    const durationSec = clamp((note.duration / safeBpm) * 60, 0.05, 30);
                    const semis = note.pitch - 60; // treat 60 (C4) as root
                    const rate = Math.pow(2, semis / 12);
                    const playbackRate = isFiniteNum(rate) ? clamp(rate, 0.25, 4) : 1;
                    const player = new Tone.Player({
                        url,
                        autostart: true,
                        playbackRate,
                        onstop: () => player.dispose(),
                    }).connect(instruments.pan);
                    // schedule stop so overlaps don’t pile up
                    setTimeout(() => player.stop(), durationSec * 1000);
                }
                else if (synth) {
                    const name = Tone.Frequency(note.pitch, "midi").toNote();
                    const velNorm = clamp((note.velocity127 ?? 96) / 127, 0.05, 1);
                    synth.triggerAttack(name, now, velNorm);
                }
                activeIds.add(note.id);
            }
        });
        // releases
        activeIds.forEach((id) => {
            const stillActive = nowActive.find((n) => n.id === id);
            if (!stillActive) {
                const note = safeNotes.find((n) => n.id === id);
                if (note && synth && !track.instrument?.startsWith("Imported:")) {
                    const name = Tone.Frequency(note.pitch, "midi").toNote();
                    synth.triggerRelease(name, Tone.now());
                }
                activeIds.delete(id);
            }
        });
    };
    const stopAllNotes = () => {
        tracks.forEach((track) => {
            const synth = instrumentMap.current.get(track.id)?.synth;
            const activeIds = activeNotesMap.current.get(track.id);
            const safeNotes = normalizedByTrackId.get(track.id) || [];
            activeIds.forEach((id) => {
                const note = safeNotes.find((n) => n.id === id);
                if (note && synth && !track.instrument?.startsWith("Imported:")) {
                    const name = Tone.Frequency(note.pitch, "midi").toNote();
                    synth.triggerRelease(name, Tone.now());
                }
            });
            activeIds.clear();
        });
    };
    const toggleMute = (id) => setMuteMap((prev) => ({ ...prev, [id]: !prev[id] }));
    const toggleSolo = (id) => setSoloMap((prev) => ({ ...prev, [id]: !prev[id] }));
    const setVolume = (id, v) => setVolumeMap((prev) => ({ ...prev, [id]: v }));
    const setPan = (id, v) => setPanMap((prev) => ({ ...prev, [id]: v }));
    const getTopFromPitch = (pitch) => {
        const [min, max] = PITCH_RANGE;
        return (max - pitch) * NOTE_HEIGHT;
        // if pitch outside range, it will clamp visually off-range, which is okay
    };
    return (_jsx("div", { className: "dashboard-container", children: _jsxs("div", { className: "dashboard-timeline-wrapper", children: [tracks.map((track) => {
                    const notes = normalizedByTrackId.get(track.id) || [];
                    return (_jsx("div", { className: "dashboard-track-row", children: _jsxs("div", { className: "track-row-flex", children: [_jsxs("div", { className: "track-controls ctrl-dark", children: [_jsx("button", { type: "button", className: "ctrl-title", onClick: () => onEditTrack(track.id), title: "Open track editor", "aria-label": `Open ${track.name} in editor`, children: track.name }), _jsxs("div", { className: "instrument-line", children: [_jsx("span", { className: "instrument-name", children: track.instrument || "Piano" }), _jsx("button", { type: "button", className: `icon-btn ${muteMap[track.id] ? "active" : ""}`, onClick: () => toggleMute(track.id), "aria-pressed": !!muteMap[track.id], title: muteMap[track.id] ? "Unmute" : "Mute", children: _jsx("img", { src: muteMap[track.id] ? "/not_mute.png" : "/mute.png", alt: muteMap[track.id] ? "Unmute" : "Mute", style: { width: 16, height: 16 } }) }), _jsx("button", { type: "button", className: `icon-btn ${soloMap[track.id] ? "active" : ""}`, onClick: () => toggleSolo(track.id), "aria-pressed": !!soloMap[track.id], title: soloMap[track.id] ? "Unsolo" : "Solo", children: _jsx("img", { src: "/speaker.png", alt: soloMap[track.id] ? "Unsolo" : "Solo", style: { width: 16, height: 16 } }) }), _jsx("button", { type: "button", className: "icon-btn delete-btn", onClick: () => {
                                                        if (window.confirm(`Delete track "${track.name}"?`)) {
                                                            deleteTrack(track.id);
                                                        }
                                                    }, title: "Delete track", children: _jsx("img", { src: "/delete-white.png", alt: "Delete", style: { width: 16, height: 16 } }) })] }), _jsxs("div", { className: "track-sliders", children: [_jsxs("label", { className: "slider-row", children: [_jsx("span", { children: "Volume" }), _jsx("input", { className: "range volume", type: "range", min: 0, max: 100, value: volumeMap[track.id] ?? 100, onChange: (e) => setVolume(track.id, parseInt(e.target.value)) })] }), _jsxs("label", { className: "slider-row", children: [_jsx("span", { children: "Pan" }), _jsx("input", { className: "range pan", type: "range", min: -1, max: 1, step: 0.01, value: panMap[track.id] ?? 0, onChange: (e) => setPan(track.id, parseFloat(e.target.value)) })] })] })] }), _jsxs("div", { className: "track-timeline", children: [_jsx("div", { className: "mini-playhead", style: { left: `${redLineLeft}px` } }), Array.from({ length: 64 }).map((_, i) => (_jsx("div", { className: `timeline-cell ${i % 4 === 0 ? "bar" : ""}`, style: { left: i * 10 } }, i))), notes.map((note) => (_jsx("div", { className: "mini-note", style: {
                                                left: `${note.time * 10}px`,
                                                width: `${note.duration * 10}px`,
                                                top: `${getTopFromPitch(note.pitch)}px`,
                                                height: `${NOTE_HEIGHT}px`,
                                            } }, note.id)))] })] }) }, track.id));
                }), _jsx("div", { style: { display: "flex", justifyContent: "center", marginTop: 10 }, children: _jsx("button", { type: "button", className: "add-track-row", onClick: onAddTrack, "aria-label": "Add track", title: "Add track", children: "\uFF0B" }) })] }) }));
};
export default memo(TrackDashboard);
