import React, { useState } from "react";
import AuthInputField from "./AuthInputField";
import PasswordToggle from "./PasswordToggle";
import GoogleAuthButton from "./GoogleAuthButton";
import SubmitButton from "./SubmitButton";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const SignUpForm: React.FC = () => {
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
    } catch (error: any) {
      toast.error(
        "Signup failed: " + (error.response?.data?.detail || error.message),
        { id: loadingToast }
      );
    }
  };

  return (
    <div>
      <AuthInputField type="text" placeholder="Username" value={username} onChange={setUsername} />
      <PasswordToggle value={password} onChange={setPassword} placeholder="Password" />
      <PasswordToggle value={confirmPassword} onChange={setConfirmPassword} placeholder="Confirm password" />

      <SubmitButton text="Sign up" onClick={handleRegister} />

      <div className="flex items-center gap-3 my-3 text-black/40 text-xs">
        <span className="flex-1 h-px bg-black/20" />
        <span>or</span>
        <span className="flex-1 h-px bg-black/20" />
      </div>

      <GoogleAuthButton />
    </div>
  );
};

export default SignUpForm;
