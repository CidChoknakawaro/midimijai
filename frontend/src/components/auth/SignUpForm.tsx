import React, { useState } from "react";
import AuthInputField from "./AuthInputField";
import PasswordToggle from "./PasswordToggle";
import GoogleAuthButton from "./GoogleAuthButton";
import SubmitButton from "./SubmitButton";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const SignUpForm: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

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
      toast.error("Signup failed: " + (error.response?.data?.detail || error.message), {
        id: loadingToast,
      });
    }
  };

  return (
    <div>
      <AuthInputField type="text" placeholder="Username" value={username} onChange={setUsername} />
      <PasswordToggle value={password} onChange={setPassword} />
      <PasswordToggle value={confirmPassword} onChange={setConfirmPassword} />
      <SubmitButton text="Sign up" onClick={handleRegister} />
      <GoogleAuthButton />
    </div>
  );
};

export default SignUpForm;
