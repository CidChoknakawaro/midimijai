import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import AuthInputField from "./AuthInputField";
import PasswordToggle from "./PasswordToggle";
import GoogleAuthButton from "./GoogleAuthButton";
import SubmitButton from "./SubmitButton";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
const SignUpForm = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const { register } = useAuth();
    const navigate = useNavigate();
    const handleRegister = async () => {
        if (password !== confirmPassword) {
            toast.error("Passwords do not match!");
            return;
        }
        const loadingToast = toast.loading("Creating account...");
        try {
            await register(username, password);
            toast.success("Account created and logged in!", { id: loadingToast });
            navigate("/dashboard");
        }
        catch (error) {
            toast.error("Signup failed: " + (error.response?.data?.detail || error.message), { id: loadingToast });
        }
    };
    return (_jsxs("div", { children: [_jsx(AuthInputField, { type: "text", placeholder: "Username", value: username, onChange: setUsername }), _jsx(PasswordToggle, { value: password, onChange: setPassword, placeholder: "Password" }), _jsx(PasswordToggle, { value: confirmPassword, onChange: setConfirmPassword, placeholder: "Confirm password" }), _jsx(SubmitButton, { text: "Sign up", onClick: handleRegister }), _jsxs("div", { className: "flex items-center gap-3 my-3 text-black/40 text-xs", children: [_jsx("span", { className: "flex-1 h-px bg-black/20" }), _jsx("span", { children: "or" }), _jsx("span", { className: "flex-1 h-px bg-black/20" })] }), _jsx(GoogleAuthButton, {})] }));
};
export default SignUpForm;
