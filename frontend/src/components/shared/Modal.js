import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const Modal = ({ onClose, children, title }) => {
    return (_jsx("div", { onClick: onClose, style: {
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
        }, children: _jsxs("div", { onClick: (e) => e.stopPropagation(), style: {
                background: "#fff",
                padding: "1.25rem 1.5rem",
                borderRadius: 12,
                minWidth: 320,
                maxWidth: 640,
                position: "relative",
                boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
            }, children: [title && (_jsx("h3", { style: { margin: 0, marginBottom: "0.75rem", fontWeight: 600 }, children: title })), _jsx("button", { onClick: onClose, "aria-label": "Close modal", style: {
                        position: "absolute",
                        top: 10,
                        right: 12,
                        border: "none",
                        background: "transparent",
                        fontSize: 18,
                        cursor: "pointer",
                    }, children: "\u00D7" }), children] }) }));
};
export default Modal;
