import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useNavigate } from "react-router-dom";
const Navbar = () => {
    const navigate = useNavigate();
    return (_jsxs("nav", { className: "w-full flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3", children: [_jsx("img", { src: "/MIDIMIJAI-LOGO.png", alt: "MIDIMIJAI", className: "h-5 w-auto" }), _jsxs("div", { className: "flex items-center gap-2 sm:gap-3", children: [_jsx("button", { className: "text-xs sm:text-[12px] border border-[#1b1b1b] rounded-md px-3 py-1 bg-white/60", children: "EN / TH" }), _jsx("button", { onClick: () => navigate("/auth"), className: "text-xs sm:text-[12px] border border-[#1b1b1b] rounded-md px-3 py-1 bg-white/60", children: "Login" })] })] }));
};
export default Navbar;
