import React, { useState } from "react";
import AuthInputField from "./AuthInputField";
import PasswordToggle from "./PasswordToggle";
import GoogleAuthButton from "./GoogleAuthButton";
import SubmitButton from "./SubmitButton";
import GuestLogin from "./GuestLogin";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const LoginForm: React.FC = () => {
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
    } catch (error: any) {
      toast.error(
        "Login failed: " + (error.response?.data?.detail || error.message),
        { id: loadingToast }
      );
    }
  };

  return (
    <div>
      <AuthInputField type="text" placeholder="Username" value={username} onChange={setUsername} />
      <PasswordToggle value={password} onChange={setPassword} />

      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-transparent select-none">.</span>
        <button type="button" className="text-xs text-black/70 hover:text-black underline underline-offset-2">
          Forgot password
        </button>
      </div>

      <SubmitButton text="Log in" onClick={handleLogin} />

      {/* OR divider */}
      <div className="flex items-center gap-3 my-3 text-black/40 text-xs">
        <span className="flex-1 h-px bg-black/20" />
        <span>or</span>
        <span className="flex-1 h-px bg-black/20" />
      </div>

      <GoogleAuthButton />
      <GuestLogin />
    </div>
  );
};

export default LoginForm;
