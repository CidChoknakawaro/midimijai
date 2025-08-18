import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useRef, useState, useEffect } from 'react';
import './PianoRoll.css';
import { Rnd } from 'react-rnd';
const ROW_HEIGHT = 20;
const BEATS = 64;
const labelWidth = 40;
const START_PITCH = 84;
const END_PITCH = 36;
const PITCHES = Array.from({ length: START_PITCH - END_PITCH + 1 }, (_, i) => START_PITCH - i);
const midiToNoteName = (midi) => {
    const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const note = notes[midi % 12];
    const octave = Math.floor(midi / 12) - 1;
    return `${note}${octave}`;
};
const PianoRoll = ({ notes, setNotes, playheadRef, gridWidth, snapToGrid, onPlayheadScrub, isPlaying }) => {
    const snap = (value) => (snapToGrid ? Math.round(value) : value);
    const scrollContainerRef = useRef(null);
    const [visibleRange, setVisibleRange] = useState([0, PITCHES.length]);
    const [velocityEditorId, setVelocityEditorId] = useState(null);
    // Virtualized rows
    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = scrollContainerRef.current?.scrollTop || 0;
            const visibleRows = Math.ceil(window.innerHeight / ROW_HEIGHT);
            const startRow = Math.max(0, Math.floor(scrollTop / ROW_HEIGHT) - 2);
            const endRow = Math.min(startRow + visibleRows + 6, PITCHES.length);
            setVisibleRange([startRow, endRow]);
        };
        handleScroll();
        const el = scrollContainerRef.current;
        el?.addEventListener('scroll', handleScroll);
        return () => el?.removeEventListener('scroll', handleScroll);
    }, []);
    const handleRulerClick = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left - labelWidth;
        const clampedX = Math.max(0, x);
        const beat = clampedX / gridWidth;
        onPlayheadScrub(beat);
        if (playheadRef.current) {
            playheadRef.current.style.left = `${clampedX}px`;
        }
    };
    const handleDoubleClick = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left - labelWidth;
        const y = e.clientY - rect.top;
        const beat = snap(x / gridWidth);
        const rowIndex = Math.floor(y / ROW_HEIGHT);
        const pitch = PITCHES[rowIndex];
        if (pitch === undefined || beat < 0)
            return;
        const isOverlapping = notes.some(n => n.pitch === pitch && beat >= n.time && beat < n.time + n.duration);
        if (isOverlapping)
            return;
        const newNote = {
            id: Date.now().toString(),
            pitch,
            time: beat,
            duration: 1,
            velocity: 100
        };
        setNotes([...notes, newNote]);
    };
    const updateNote = (id, pitch, time, duration) => {
        setNotes(notes.map(n => n.id === id ? { ...n, pitch, time, duration } : n));
    };
    const updateVelocity = (id, velocity) => {
        setNotes(notes.map(n => n.id === id ? { ...n, velocity } : n));
    };
    return (_jsxs("div", { className: "piano-roll-viewport", children: [_jsxs("div", { className: "top-ruler", onMouseDown: handleRulerClick, children: [_jsx("div", { className: "ruler-corner", style: { width: labelWidth }, children: _jsx("strong", { children: "Notes" }) }), Array.from({ length: BEATS }).map((_, i) => (_jsx("div", { className: "ruler-beat", style: { width: `${gridWidth}px` }, children: i }, i)))] }), _jsx("div", { className: "piano-roll-scroll-container", ref: scrollContainerRef, children: _jsxs("div", { className: "piano-roll-inner", style: { width: `${BEATS * gridWidth + labelWidth}px` }, children: [_jsx("div", { className: "piano-roll-rows", children: PITCHES.map((pitch) => (_jsx("div", { className: "roll-row", children: _jsx("div", { className: "roll-label", children: midiToNoteName(pitch) }) }, pitch))) }), _jsxs("div", { className: "piano-roll-content", onDoubleClick: handleDoubleClick, children: [_jsxs("div", { className: "grid-overlay", children: [PITCHES.map((_, i) => (_jsx("div", { className: "grid-line horizontal", style: { top: i * ROW_HEIGHT } }, `h-${i}`))), Array.from({ length: BEATS }).map((_, i) => (_jsx("div", { className: `grid-line vertical ${i % 4 === 0 ? 'bar-line' : ''}`, style: { left: i * gridWidth } }, `v-${i}`)))] }), _jsx("div", { ref: playheadRef, style: {
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: '2px',
                                        height: '100%',
                                        backgroundColor: 'red',
                                        zIndex: 100
                                    } }), notes
                                    .filter(note => {
                                    const row = START_PITCH - note.pitch;
                                    return row >= visibleRange[0] && row <= visibleRange[1];
                                })
                                    .map(note => {
                                    const top = (START_PITCH - note.pitch) * ROW_HEIGHT;
                                    const left = note.time * gridWidth;
                                    const width = note.duration * gridWidth;
                                    if (isPlaying) {
                                        return (_jsx("div", { style: {
                                                position: 'absolute',
                                                top,
                                                left,
                                                width,
                                                height: ROW_HEIGHT,
                                                backgroundColor: '#4c79ff',
                                                borderRadius: 2,
                                                color: 'white',
                                                fontSize: '10px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                pointerEvents: 'none',
                                            }, children: note.pitch }, note.id));
                                    }
                                    return (_jsxs(Rnd, { size: { width, height: ROW_HEIGHT }, position: { x: left, y: top }, bounds: "parent", enableResizing: { left: true, right: true }, onDoubleClick: (e) => {
                                            e.preventDefault();
                                            setNotes(notes.filter(n => n.id !== note.id));
                                        }, onContextMenu: (e) => {
                                            e.preventDefault();
                                            setVelocityEditorId(note.id);
                                        }, onDragStop: (_, d) => {
                                            const newTime = snap(d.x / gridWidth);
                                            const newPitch = PITCHES[Math.round(d.y / ROW_HEIGHT)];
                                            updateNote(note.id, newPitch, newTime, note.duration);
                                        }, onResizeStop: (_, direction, ref, delta, pos) => {
                                            const newDuration = snap(ref.offsetWidth / gridWidth);
                                            const newTime = snap(pos.x / gridWidth);
                                            const newPitch = PITCHES[Math.round(pos.y / ROW_HEIGHT)];
                                            updateNote(note.id, newPitch, newTime, newDuration);
                                        }, style: {
                                            position: 'absolute',
                                            background: '#4c79ff',
                                            borderRadius: 2,
                                            cursor: 'pointer',
                                            color: 'white',
                                            fontSize: '10px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            pointerEvents: 'auto',
                                            zIndex: 50,
                                        }, children: [_jsxs("div", { style: { pointerEvents: 'none' }, children: [note.pitch, " \u2022 ", note.duration.toFixed(2)] }), velocityEditorId === note.id && (_jsxs("div", { style: {
                                                    position: 'absolute',
                                                    top: -40,
                                                    left: 0,
                                                    background: '#fff',
                                                    padding: '4px',
                                                    border: '1px solid #ccc',
                                                    zIndex: 999,
                                                }, onClick: (e) => e.stopPropagation(), children: [_jsx("label", { children: "Velocity:" }), _jsx("input", { type: "range", min: 1, max: 127, value: note.velocity, onChange: (e) => updateVelocity(note.id, parseInt(e.target.value)) }), _jsx("button", { onClick: () => setVelocityEditorId(null), children: "\u274C" })] }))] }, note.id));
                                })] })] }) })] }));
};
export default PianoRoll;
