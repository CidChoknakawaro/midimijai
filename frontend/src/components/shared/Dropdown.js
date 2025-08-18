import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useRef } from 'react';
const Dropdown = ({ label, options }) => {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);
    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current &&
                !dropdownRef.current.contains(event.target)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    return (_jsxs("div", { ref: dropdownRef, style: { position: 'relative', display: 'inline-block' }, children: [_jsx("button", { onClick: () => setOpen((prev) => !prev), children: label }), open && (_jsx("div", { style: {
                    position: 'absolute',
                    background: 'white',
                    border: '1px solid #ccc',
                    marginTop: '0.5rem',
                    zIndex: 10,
                    whiteSpace: 'nowrap',
                }, children: options.map((opt, i) => (_jsx("div", { style: {
                        padding: '0.5rem 1rem',
                        cursor: 'pointer',
                        userSelect: 'none',
                    }, onClick: () => {
                        console.log(`Selected: ${opt}`);
                        setOpen(false);
                    }, children: opt }, i))) }))] }));
};
export default Dropdown;
