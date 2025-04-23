import React, { useState } from "react";
import AuthInputField from "./AuthInputField";
import PasswordToggle from "./PasswordToggle";
import GoogleAuthButton from "./GoogleAuthButton";
import SubmitButton from "./SubmitButton";
import GuestLogin from "./GuestLogin";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";


const LoginForm: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { login } = useAuth();

  const handleLogin = async () => {
    try {
      await login(username, password);
      alert("Logged in successfully!");
      // TODO: redirect to dashboard or workspace
    } catch (error: any) {
      alert("Login failed: " + (error.response?.data?.detail || error.message));
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
