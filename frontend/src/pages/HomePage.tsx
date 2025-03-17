import React from "react";
import Navbar from "../components/home/NavBar";
import HeroSection from "../components/home/HeroSection";
import FeatureList from "../components/home/FeatureList";
import StepGuide from "../components/home/StepGuide";
import UserTypes from "../components/home/UserTypes";
import Footer from "../components/home/Footer";

const HomePage: React.FC = () => {
  return (
    <div>
      <Navbar />
      <HeroSection />
      <FeatureList />
      <StepGuide />
      <UserTypes />
      <Footer />
    </div>
  );
};

export default HomePage;