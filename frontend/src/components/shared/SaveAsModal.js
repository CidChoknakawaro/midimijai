import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import Modal from "./Modal";
export default function SaveAsModal({ isOpen, initialName, onSave, onCancel, }) {
    const [name, setName] = useState(initialName);
    useEffect(() => {
        if (isOpen) {
            setName(initialName);
        }
    }, [isOpen, initialName]);
    if (!isOpen)
        return null;
    return (_jsxs(Modal, { title: "Save Project As\u2026", onClose: onCancel, children: [_jsx("input", { type: "text", value: name, onChange: (e) => setName(e.target.value), className: "w-full px-3 py-2 border rounded mb-4" }), _jsxs("div", { className: "flex justify-end space-x-2", children: [_jsx("button", { onClick: onCancel, className: "px-4 py-2", children: "Cancel" }), _jsx("button", { onClick: () => onSave(name), className: "px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600", children: "Save" })] })] }));
}
