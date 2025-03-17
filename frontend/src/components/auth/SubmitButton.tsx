import React from "react";

interface SubmitButtonProps {
  text: string;
  onClick: () => void;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ text, onClick }) => {
  return (
    <button className="w-full p-2 mt-2 bg-blue-500 text-white rounded" onClick={onClick}>
      {text}
    </button>
  );
};

export default SubmitButton;