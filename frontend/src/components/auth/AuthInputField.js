import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const AuthInputField = ({ type, placeholder, value, onChange }) => {
    return (_jsxs("label", { className: "block mb-4", children: [_jsx("span", { className: "block text-xs text-black/60 mb-1", children: placeholder }), _jsx("input", { type: type, value: value, onChange: (e) => onChange(e.target.value), className: "\r\n          w-full bg-white/80 px-3 py-2 rounded-lg\r\n          border border-black/20 focus:outline-none\r\n          focus:border-black/60\r\n          placeholder:text-black/40\r\n        ", placeholder: placeholder })] }));
};
export default AuthInputField;
