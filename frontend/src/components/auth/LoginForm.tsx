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
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    const loadingToast = toast.loading("Logging in...");
    try {
      await login(username, password);
      toast.success("Logged in successfully!", { id: loadingToast });
      navigate("/dashboard");
    } catch (error: any) {
      toast.error("Login failed: " + (error.response?.data?.detail || error.message), {
        id: loadingToast,
      });
    }
  };

  return (
    <div>
      <AuthInputField type="text" placeholder="Username" value={username} onChange={setUsername} />
      <PasswordToggle value={password} onChange={setPassword} />
      <SubmitButton text="Log in" onClick={handleLogin} />
      <GoogleAuthButton />
      <GuestLogin />
    </div>
  );
};

export default LoginForm;
