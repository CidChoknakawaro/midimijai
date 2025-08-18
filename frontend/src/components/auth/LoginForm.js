import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import AuthInputField from "./AuthInputField";
import PasswordToggle from "./PasswordToggle";
import GoogleAuthButton from "./GoogleAuthButton";
import SubmitButton from "./SubmitButton";
import GuestLogin from "./GuestLogin";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
const LoginForm = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const { login } = useAuth();
    const navigate = useNavigate();
    const handleLogin = async () => {
        const loadingToast = toast.loading("Logging in...");
        try {
            await login(username, password);
            toast.success("Logged in successfully!", { id: loadingToast });
            navigate("/dashboard");
        }
        catch (error) {
            toast.error("Login failed: " + (error.response?.data?.detail || error.message), { id: loadingToast });
        }
    };
    return (_jsxs("div", { children: [_jsx(AuthInputField, { type: "text", placeholder: "Username", value: username, onChange: setUsername }), _jsx(PasswordToggle, { value: password, onChange: setPassword }), _jsxs("div", { className: "flex items-center justify-between mb-1", children: [_jsx("span", { className: "text-xs text-transparent select-none", children: "." }), _jsx("button", { type: "button", className: "text-xs text-black/70 hover:text-black underline underline-offset-2", children: "Forgot password" })] }), _jsx(SubmitButton, { text: "Log in", onClick: handleLogin }), _jsxs("div", { className: "flex items-center gap-3 my-3 text-black/40 text-xs", children: [_jsx("span", { className: "flex-1 h-px bg-black/20" }), _jsx("span", { children: "or" }), _jsx("span", { className: "flex-1 h-px bg-black/20" })] }), _jsx(GoogleAuthButton, {}), _jsx(GuestLogin, {})] }));
};
export default LoginForm;
