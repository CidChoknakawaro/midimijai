import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const AuthToggle = ({ isLogin, setIsLogin }) => {
    return (_jsx("div", { className: "w-full", children: _jsxs("div", { className: "grid grid-cols-2 rounded-xl overflow-hidden bg-white/60 border border-black/10", children: [_jsx("button", { onClick: () => setIsLogin(false), className: "py-2.5 text-sm sm:text-base transition " +
                        (!isLogin
                            ? "bg-[#ff7a00] text-black font-semibold"
                            : "text-black/70 hover:bg-black/5"), children: "Sign up" }), _jsx("button", { onClick: () => setIsLogin(true), className: "py-2.5 text-sm sm:text-base transition " +
                        (isLogin
                            ? "bg-[#ff7a00] text-black font-semibold"
                            : "text-black/70 hover:bg.black/5"), children: "Log in" })] }) }));
};
export default AuthToggle;
