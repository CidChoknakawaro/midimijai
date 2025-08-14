import React from "react";

const people = [
  {
    img: "Producer.png", // replace with your actual path
    title: "For Producers",
    desc: "Quickly generate MIDI ideas",
  },
  {
    img: "Musician.png",
    title: "For Musicians",
    desc: "Use AI to build melodies & chords",
  },
  {
    img: "Beginner.png",
    title: "For Beginners",
    desc: "Learn MIDI editing in an easy way",
  },
];

const UserTypes: React.FC = () => {
  return (
    <section className="text-center py-16">
      {/* Heading */}
      <h2 className=" text-[40px] sm:text-[52px] font-semibold">
        Who is this for<span className="text-[#ff5200]">?</span>
      </h2>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 max-w-5xl mx-auto">
        {people.map((p) => (
          <div key={p.title} className="flex flex-col items-center">
            <img
              src={p.img}
              alt={p.title}
              className="w-120 h-120 object-contain"
              style={{
                filter: "drop-shadow(0 0 40px rgba(255, 82, 0, 0.5))",
              }}
            />
            <h3 className="text-[20px] font-semibold mb-2">{p.title}</h3>
            <p className="text-black/70 text-[15px] max-w-[200px]">{p.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default UserTypes;
