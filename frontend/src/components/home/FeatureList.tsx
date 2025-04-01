import React, { useState } from "react";

const features = [
  {
    title: "AI-powered MIDI generation",
    description:
      "Generate unique melodies, chord progressions, and rhythms instantly with AI. Just type a prompt or select a style, and let MIDIMIJAI do the rest.",
  },
  {
    title: "Deep MIDI editing",
    description:
      "Manually fine-tune every MIDI note with powerful editing tools. Change timing, note length, velocity, or add advanced musical techniques.",
  },
  {
    title: "Import and edit multiple MIDI files",
    description:
      "Load multiple MIDI files into the workspace, edit them side by side, and create a seamless composition.",
  },
  {
    title: "Assign custom sound libraries",
    description:
      "Use your own samples and virtual instruments. Assign custom sounds to tracks for more control over your MIDI compositions.",
  },
];

const FeatureList: React.FC = () => {
  const [selectedFeatureIndex, setSelectedFeatureIndex] = useState<number | null>(0);

  return (
    <section className="py-10 px-4 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center">What can you do with MIDIMIJAI?</h2>

      <div className="flex flex-col md:flex-row gap-8">
        {/* LEFT: Dropdown Accordion List */}
        <ul className="flex-1">
          {features.map((feature, index) => (
            <li
              key={index}
              className="border-b py-4 cursor-pointer"
              onClick={() =>
                setSelectedFeatureIndex(index === selectedFeatureIndex ? null : index)
              }
            >
              <div className="flex justify-between items-center font-semibold text-lg">
                <span>{feature.title}</span>
                <span>{selectedFeatureIndex === index ? "▲" : "▼"}</span>
              </div>
              {selectedFeatureIndex === index && (
                <p className="mt-2 text-gray-600">{feature.description}</p>
              )}
            </li>
          ))}
        </ul>

        {/* RIGHT: Video Placeholder */}
        <div className="flex-1 flex items-start justify-center">
          <div className="w-full h-64 bg-gray-300 flex items-center justify-center text-gray-600 text-sm rounded border">
            {selectedFeatureIndex !== null
              ? `[Video for: ${features[selectedFeatureIndex].title}]`
              : `[No feature selected]`}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureList;