import React from "react";

const userTypes = [
  {
    title: "For Producers",
    description: "Quickly generate MIDI ideas.",
    colorTop: "#3BD6D6",
    colorBottom: "white",
  },
  {
    title: "For Musicians",
    description: "Use AI to build melodies & chords.",
    colorTop: "#3BD6D6",
    colorBottom: "#3BD6D6",
  },
  {
    title: "For Beginners",
    description: "Learn MIDI editing in an easy way.",
    colorTop: "white",
    colorBottom: "#3BD6D6",
  },
];

const UserTypes: React.FC = () => {
  return (
    <section className="py-10 px-4">
      <h2 className="text-3xl font-bold mb-6 text-center">Who is this for?</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {userTypes.map((user, index) => (
          <div
            key={index}
            className="p-6 border rounded-lg shadow-md flex flex-col items-center text-center"
          >
            {/* SVG Placeholder */}
            <svg width="50" height="100" className="mb-4" viewBox="0 0 50 100">
              <circle cx="25" cy="20" r="15" stroke="black" strokeWidth="2" fill={user.colorTop} />
              <ellipse
                cx="25"
                cy="70"
                rx="18"
                ry="28"
                stroke="black"
                strokeWidth="2"
                fill={user.colorBottom}
              />
            </svg>

            <h3 className="text-xl font-bold">{user.title}</h3>
            <p className="text-sm mt-2">{user.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default UserTypes;