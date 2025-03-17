import React from "react";

const userTypes = [
  { title: "For Producers", description: "Quickly generate MIDI ideas." },
  { title: "For Musicians", description: "Use AI to build melodies & chords." },
  { title: "For Beginners", description: "Learn MIDI editing in an easy way." },
];

const UserTypes: React.FC = () => {
  return (
    <section className="py-10 px-4">
      <h2 className="text-3xl font-bold mb-6 text-center">Who is this for?</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {userTypes.map((user, index) => (
          <div key={index} className="p-6 border rounded-lg shadow-md flex flex-col items-center">
            <div className="w-16 h-16 bg-gray-300 rounded-full mb-4"></div> {/* Placeholder for icon */}
            <h3 className="text-xl font-bold">{user.title}</h3>
            <p className="text-sm text-center">{user.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default UserTypes;