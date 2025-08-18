import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { Tooltip as ReactTooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
const Tooltip = ({ text, children }) => {
    return (_jsxs(_Fragment, { children: [_jsx("span", { "data-tooltip-id": "tooltip", "data-tooltip-content": text, children: children }), _jsx(ReactTooltip, { id: "tooltip" })] }));
};
export default Tooltip;
