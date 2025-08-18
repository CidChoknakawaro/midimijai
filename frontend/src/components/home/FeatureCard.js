import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const FeatureCard = ({ title, description }) => {
    return (_jsxs("div", { className: "p-4 border rounded shadow", children: [_jsx("h3", { className: "text-xl font-bold", children: title }), _jsx("p", { className: "text-sm", children: description })] }));
};
export default FeatureCard;
