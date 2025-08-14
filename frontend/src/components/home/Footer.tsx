import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="mt-10 bg-[#efe6dc]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-[13px]">
          <div>
            <h4 className="font-semibold mb-2">Company</h4>
            <p>About us</p>
            <p>Contact</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Platform</h4>
            <p>Pricing</p>
            <p>FAQs</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Support</h4>
            <p>Terms of Service</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Legal & Policies</h4>
            <p>Privacy Policy</p>
            <p>Cookie Policy</p>
            <p>User Agreements</p>
          </div>
        </div>
        <p className="text-[12px] text-black/60 mt-6">
          © {new Date().getFullYear()} MIDIMIJAI. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
