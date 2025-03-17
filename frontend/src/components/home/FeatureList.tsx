import React, { useState } from "react";

const features = [
  { title: "AI-powered MIDI generation", description: "Generate unique melodies, chord progressions, and rhythms instantly with AI." },
  { title: "Deep MIDI editing", description: "Manually fine-tune MIDI notes, timing, velocity, and styles." },
  { title: "Import and edit multiple MIDI files", description: "Load multiple MIDI files into the workspace and edit them together." },
  { title: "Assign custom sound libraries", description: "Use your own samples and assign custom sounds to tracks." },
];

const FeatureList: React.FC = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  return (
    <section className="py-10 max-w-4xl mx-auto px-4">
      <h2 className="text-3xl font-bold mb-6 text-center">What Can You Do?</h2>
      <ul>
        {features.map((feature, index) => (
          <li key={index} className="border-b py-3 cursor-pointer flex justify-between items-center" onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}>
            <span className="font-bold">{feature.title}</span>
            <span>{expandedIndex === index ? "▲" : "▼"}</span>
            {expandedIndex === index && <p className="text-gray-600 mt-2">{feature.description}</p>}
          </li>
        ))}
      </ul>
    </section>
  );
};

export default FeatureList;