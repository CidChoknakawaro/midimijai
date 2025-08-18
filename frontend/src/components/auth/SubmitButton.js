import { jsx as _jsx } from "react/jsx-runtime";
const SubmitButton = ({ text, onClick }) => {
    return (_jsx("button", { onClick: onClick, className: "\r\n        w-full mt-4 h-11 rounded-md\r\n        bg-[#ff5200] text-black font-semibold\r\n        border border-black/20\r\n        shadow-[0_16px_30px_-10px_rgba(255,82,0,0.45)]\r\n        hover:brightness-110 active:translate-y-[1px] transition\r\n      ", children: text }));
};
export default SubmitButton;
