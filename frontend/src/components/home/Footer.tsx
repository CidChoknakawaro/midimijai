import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="py-6 bg-gray-900 text-white text-center text-sm px-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
        <div><h4 className="font-bold">Company</h4><p>About Us</p><p>Contact</p></div>
        <div><h4 className="font-bold">Platform</h4><p>Pricing</p><p>FAQs</p></div>
        <div><h4 className="font-bold">Support</h4><p>Terms of Service</p></div>
        <div><h4 className="font-bold">Legal</h4><p>Privacy Policy</p><p>Cookie Policy</p></div>
      </div>
      <p className="mt-6">&copy; 2025 MIDIMIJAI. All rights reserved.</p>
    </footer>
  );
};

export default Footer;