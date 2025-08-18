import { jsx as _jsx } from "react/jsx-runtime";
const SearchBar = ({ value, onChange }) => (_jsx("div", { className: "w-full", style: { background: "#ff4e1a" }, children: _jsx("input", { type: "text", value: value, onChange: (e) => onChange(e.target.value), placeholder: "Search", className: "w-full bg-transparent placeholder-black/90 text-black\r\n                 px-5 py-3 text-[18px] focus:outline-none" }) }));
export default SearchBar;
