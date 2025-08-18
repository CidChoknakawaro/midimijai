import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import FeatureList from "../components/home/FeatureList";
import StepGuide from "../components/home/StepGuide";
import UserTypes from "../components/home/UserTypes";
import Footer from "../components/home/Footer";
import HeroSection from "../components/home/HeroSection";
const HomePage = () => {
    return (_jsxs("div", { className: "min-h-screen bg-[#fbf5ee]", children: [_jsx(HeroSection, {}), _jsx(FeatureList, {}), _jsx(StepGuide, {}), _jsx(UserTypes, {}), _jsx(Footer, {})] }));
};
export default HomePage;
