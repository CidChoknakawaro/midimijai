import React from "react";

const steps = [
  "Type a prompt for AI MIDI generation",
  "Modify the MIDI inside the editor",
  "Import custom sound libraries",
  "Export and use in any DAW",
];

const StepGuide: React.FC = () => {
  return (
    <section className="py-10 bg-gray-100 px-4">
      <h2 className="text-3xl font-bold mb-6 text-center">Step-by-Step Guide</h2>
      <div className="flex justify-center">
        <div className="border w-80 h-40 bg-gray-200 flex items-center justify-center text-gray-500">[Image Placeholder]</div>
      </div>
      <ul className="max-w-4xl mx-auto list-none mt-6 text-lg">
        {steps.map((step, index) => (
          <li key={index} className="flex items-center mb-2">
            ✅ <span className="ml-2">{step}</span>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default StepGuide;