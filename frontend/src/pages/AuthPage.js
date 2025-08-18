import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import LoginForm from "../components/auth/LoginForm";
import SignUpForm from "../components/auth/SignUpForm";
import AuthToggle from "../components/auth/AuthToggle";
const BEIGE = "#dcc7af";
const PAGE_BG = "#f8f3ed";
const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    return (_jsx("div", { className: "min-h-screen flex items-center justify-center px-4", style: { background: PAGE_BG }, children: _jsxs("div", { className: "w-full max-w-md", children: [_jsx("img", { src: "/MIDIMIJAI-LOGO.png", alt: "MIDIMIJAI", className: "mx-auto mb-6 h-14 select-none", draggable: false }), _jsxs("div", { className: "rounded-[28px] shadow-[0_30px_60px_-18px_rgba(0,0,0,0.25)] p-6 sm:p-8", style: { background: BEIGE }, children: [_jsx(AuthToggle, { isLogin: isLogin, setIsLogin: setIsLogin }), _jsx("div", { className: "mt-5", children: isLogin ? _jsx(LoginForm, {}) : _jsx(SignUpForm, {}) })] })] }) }));
};
export default AuthPage;
