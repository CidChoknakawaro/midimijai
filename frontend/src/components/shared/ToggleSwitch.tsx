import React from "react";

interface ToggleSwitchProps {
  isOn: boolean;
  handleToggle: () => void;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ isOn, handleToggle }) => {
  return (
    <label className="cursor-pointer flex items-center space-x-2">
      <input 
        type="checkbox" 
        checked={isOn} 
        onChange={handleToggle} 
        className="hidden"
      />
      <span 
        className="w-6 h-6 border border-black flex items-center justify-center text-lg"
      >
        {isOn ? "On" : "Off"}
      </span>
    </label>
  );
};

export default ToggleSwitch;