import React, { useState } from "react";
import LoginForm from "../components/auth/LoginForm";
import SignUpForm from "../components/auth/SignUpForm";
import AuthToggle from "../components/auth/AuthToggle";

const BEIGE = "#dcc7af";          
const PAGE_BG = "#f8f3ed";         

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: PAGE_BG }}
    >
      <div className="w-full max-w-md">
        {/* Logo */}
        <img
          src="/MIDIMIJAI-LOGO.png"
          alt="MIDIMIJAI"
          className="mx-auto mb-6 h-14 select-none"
          draggable={false}
        />

        {/* Card */}
        <div
          className="rounded-[28px] shadow-[0_30px_60px_-18px_rgba(0,0,0,0.25)] p-6 sm:p-8"
          style={{ background: BEIGE }}
        >
          {/* Toggle */}
          <AuthToggle isLogin={isLogin} setIsLogin={setIsLogin} />

          {/* Form */}
          <div className="mt-5">{isLogin ? <LoginForm /> : <SignUpForm />}</div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
