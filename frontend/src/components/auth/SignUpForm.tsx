import React, { useState } from "react";
import AuthInputField from "./AuthInputField";
import PasswordToggle from "./PasswordToggle";
import GoogleAuthButton from "./GoogleAuthButton";
import SubmitButton from "./SubmitButton";

const SignUpForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <div>
      <AuthInputField type="text" placeholder="Username" value={username} onChange={setUsername} />
      <PasswordToggle value={password} onChange={setPassword} />
      <PasswordToggle value={confirmPassword} onChange={setConfirmPassword} />
      <SubmitButton text="Sign up" onClick={() => alert("Signing up...")} />
      <GoogleAuthButton />
    </div>
  );
};

export default SignUpForm;