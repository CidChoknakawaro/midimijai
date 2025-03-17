import React, { useState } from "react";

interface PasswordToggleProps {
  value: string;
  onChange: (value: string) => void;
}

const PasswordToggle: React.FC<PasswordToggleProps> = ({ value, onChange }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex border border-gray-300 rounded mb-2">
      <input
        type={showPassword ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-2"
      />
      <button onClick={() => setShowPassword(!showPassword)}>👁</button>
    </div>
  );
};

export default PasswordToggle;