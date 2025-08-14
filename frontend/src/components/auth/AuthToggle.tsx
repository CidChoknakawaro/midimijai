import React from "react";

interface AuthToggleProps {
  isLogin: boolean;
  setIsLogin: (v: boolean) => void;
}

const AuthToggle: React.FC<AuthToggleProps> = ({ isLogin, setIsLogin }) => {
  return (
    <div className="w-full">
      <div className="grid grid-cols-2 rounded-xl overflow-hidden bg-white/60 border border-black/10">
        <button
          onClick={() => setIsLogin(false)}
          className={
            "py-2.5 text-sm sm:text-base transition " +
            (!isLogin
              ? "bg-[#ff7a00] text-black font-semibold"
              : "text-black/70 hover:bg-black/5")
          }
        >
          Sign up
        </button>
        <button
          onClick={() => setIsLogin(true)}
          className={
            "py-2.5 text-sm sm:text-base transition " +
            (isLogin
              ? "bg-[#ff7a00] text-black font-semibold"
              : "text-black/70 hover:bg.black/5")
          }
        >
          Log in
        </button>
      </div>
    </div>
  );
};

export default AuthToggle;
