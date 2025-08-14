import React from "react";

interface Props {
  type: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}

const AuthInputField: React.FC<Props> = ({ type, placeholder, value, onChange }) => {
  return (
    <label className="block mb-4">
      <span className="block text-xs text-black/60 mb-1">{placeholder}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="
          w-full bg-white/80 px-3 py-2 rounded-lg
          border border-black/20 focus:outline-none
          focus:border-black/60
          placeholder:text-black/40
        "
        placeholder={placeholder}
      />
    </label>
  );
};

export default AuthInputField;
