import { jsx as _jsx } from "react/jsx-runtime";
const InputField = ({ type, placeholder, value, onChange, className }) => {
    return (_jsx("input", { type: type, placeholder: placeholder, value: value, onChange: onChange, className: `px-4 py-2 border rounded ${className}` }));
};
export default InputField;
