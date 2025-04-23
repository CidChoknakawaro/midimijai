import React, { useState } from "react";
import AuthInputField from "./AuthInputField";
import PasswordToggle from "./PasswordToggle";
import GoogleAuthButton from "./GoogleAuthButton";
import SubmitButton from "./SubmitButton";
import { useAuth } from "../../hooks/useAuth";

const SignUpForm: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const { register } = useAuth();

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      await register(username, password);
      alert("Account created and logged in!");
      // TODO: redirect to dashboard or workspace
    } catch (error: any) {
      alert("Signup failed: " + (error.response?.data?.detail || error.message));
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
