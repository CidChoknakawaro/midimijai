import React from "react";

interface AuthInputFieldProps {
  type: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}

const AuthInputField: React.FC<AuthInputFieldProps> = ({ type, placeholder, value, onChange }) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full p-2 border border-gray-300 rounded mb-2"
    />
  );
};

export default AuthInputField;