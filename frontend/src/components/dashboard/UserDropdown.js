import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef, useEffect } from "react";
const UserDropdown = () => {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);
    useEffect(() => {
        const onClick = (e) => {
            if (ref.current && !ref.current.contains(e.target))
                setOpen(false);
        };
        document.addEventListener("mousedown", onClick);
        return () => document.removeEventListener("mousedown", onClick);
    }, []);
    return (_jsxs("div", { ref: ref, className: "relative", children: [_jsxs("button", { onClick: () => setOpen((v) => !v), className: "min-w-[190px] px-5 py-3 rounded-md text-white flex items-center justify-between", style: { background: "#000" }, children: [_jsx("span", { children: "Username" }), _jsx("span", { className: "ml-3", children: "\u25BE" })] }), open && (_jsxs("div", { className: "absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg overflow-hidden", children: [_jsx("button", { className: "block w-full text-left px-4 py-2 hover:bg-gray-100", children: "Switch account" }), _jsx("button", { className: "block w-full text-left px-4 py-2 hover:bg-gray-100", children: "Sign out" })] }))] }));
};
export default UserDropdown;
