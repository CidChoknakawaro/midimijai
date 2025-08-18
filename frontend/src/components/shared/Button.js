import { jsx as _jsx } from "react/jsx-runtime";
const Button = ({ text, onClick, disabled, className }) => {
    return (_jsx("button", { onClick: onClick, disabled: disabled, className: `px-4 py-2 rounded ${className}`, children: text }));
};
export default Button;
