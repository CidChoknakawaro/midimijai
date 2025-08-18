import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
const PasswordToggle = ({ value, onChange, placeholder = "Password", }) => {
    const [show, setShow] = useState(false);
    return (_jsxs("label", { className: "block mb-2", children: [_jsx("span", { className: "block text-xs text-black/60 mb-1", children: placeholder }), _jsxs("div", { className: "relative", children: [_jsx("input", { type: show ? "text" : "password", value: value, onChange: (e) => onChange(e.target.value), placeholder: placeholder, className: "\r\n            w-full bg-white/80 px-3 py-2 rounded-lg\r\n            border border.black/20 focus:outline-none\r\n            focus:border.black/60 placeholder:text-black/40\r\n          " }), _jsx("button", { type: "button", onClick: () => setShow((s) => !s), className: "absolute right-2 top-1/2 -translate-y-1/2 text-black/60 hover:text-black", "aria-label": show ? "Hide password" : "Show password", children: _jsx("img", { src: show ? "/Close_eye.png" : "/Eye.png", alt: show ? "Hide password" : "Show password", className: "w-5 h-5" }) })] })] }));
};
export default PasswordToggle;
