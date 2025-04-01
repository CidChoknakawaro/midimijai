import React, { useState } from "react";

const steps = [
  {
    title: "Step 1: Type a prompt",
    description:
      "Use natural language to generate MIDI patterns. You can describe a mood, style, or musical idea, and the AI will generate a matching MIDI sequence.",
  },
  {
    title: "Step 2: Modify in the MIDI Editor",
    description:
      "Once the AI generates your MIDI, you can tweak it using the editor. Adjust note timing, velocity, or structure to better fit your style.",
  },
  {
    title: "Step 3: Import custom sound libraries",
    description:
      "Instead of using default MIDI instrument sounds, you can import and assign custom sound samples or virtual instruments.",
  },
  {
    title: "Step 4: Export and use in any DAW",
    description:
      "Once your MIDI is ready, export it and use it in any Digital Audio Workstation (DAW) like FL Studio, Ableton, or Logic Pro.",
  },
];

const StepGuide: React.FC = () => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(0);

  return (
    <section className="py-10 px-4 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center">Step-by-Step Guide</h2>

      <div className="flex flex-col md:flex-row gap-8">
        {/* LEFT: Step List */}
        <ul className="flex-1">
          {steps.map((step, index) => (
            <li
              key={index}
              className="border-b py-4 cursor-pointer"
              onClick={() =>
                setSelectedIndex(selectedIndex === index ? null : index)
              }
            >
              <div className="flex justify-between items-center font-semibold text-lg">
                <span>{step.title}</span>
                <span>{selectedIndex === index ? "▲" : "▼"}</span>
              </div>
              {selectedIndex === index && (
                <p className="mt-2 text-gray-700">{step.description}</p>
              )}
            </li>
          ))}
        </ul>

        {/* RIGHT: Video Placeholder */}
        <div className="flex-1 flex items-start justify-center">
          <div className="w-full h-64 bg-gray-300 flex items-center justify-center text-gray-600 text-sm rounded border">
            {selectedIndex !== null
              ? `[Video for: ${steps[selectedIndex].title}]`
              : `[No step selected]`}
          </div>
        </div>
      </div>
    </section>
  );
};

export default StepGuide;