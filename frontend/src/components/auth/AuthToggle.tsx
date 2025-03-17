import React from "react";

interface AuthToggleProps {
  isLogin: boolean;
  setIsLogin: (value: boolean) => void;
}

const AuthToggle: React.FC<AuthToggleProps> = ({ isLogin, setIsLogin }) => {
  return (
    <div className="flex mb-4">
      <button
        className={`w-1/2 py-2 ${isLogin ? "bg-blue-500 text-white" : "bg-gray-200"}`}
        onClick={() => setIsLogin(true)}
      >
        Log in
      </button>
      <button
        className={`w-1/2 py-2 ${!isLogin ? "bg-blue-500 text-white" : "bg-gray-200"}`}
        onClick={() => setIsLogin(false)}
      >
        Sign up
      </button>
    </div>
  );
};

export default AuthToggle;