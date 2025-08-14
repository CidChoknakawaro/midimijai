import React from "react";
import FeatureList from "../components/home/FeatureList";
import StepGuide from "../components/home/StepGuide";
import UserTypes from "../components/home/UserTypes";
import Footer from "../components/home/Footer";
import HeroSection from "../components/home/HeroSection";

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#fbf5ee]">
      <HeroSection />
      <FeatureList />
      <StepGuide />
      <UserTypes />
      <Footer />
    </div>
  );
};

export default HomePage;
