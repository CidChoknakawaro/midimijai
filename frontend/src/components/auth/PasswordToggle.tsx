import React, { useState } from "react";

interface Props {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}

const PasswordToggle: React.FC<Props> = ({
  value,
  onChange,
  placeholder = "Password",
}) => {
  const [show, setShow] = useState(false);
  return (
    <label className="block mb-2">
      <span className="block text-xs text-black/60 mb-1">{placeholder}</span>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="
            w-full bg-white/80 px-3 py-2 rounded-lg
            border border.black/20 focus:outline-none
            focus:border.black/60 placeholder:text-black/40
          "
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-black/60 hover:text-black"
          aria-label={show ? "Hide password" : "Show password"}
        >
          <img
            src={show ? "/Close_eye.png" : "/Eye.png"}
            alt={show ? "Hide password" : "Show password"}
            className="w-5 h-5"
          />
        </button>
      </div>
    </label>
  );
};

export default PasswordToggle;
