import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const ToggleSwitch = ({ isOn, handleToggle }) => {
    return (_jsxs("label", { className: "cursor-pointer flex items-center space-x-2", children: [_jsx("input", { type: "checkbox", checked: isOn, onChange: handleToggle, className: "hidden" }), _jsx("span", { className: "w-6 h-6 border border-black flex items-center justify-center text-lg", children: isOn ? "On" : "Off" })] }));
};
export default ToggleSwitch;
