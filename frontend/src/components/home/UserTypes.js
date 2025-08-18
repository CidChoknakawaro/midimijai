import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const people = [
    {
        img: "Producer.png",
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
const UserTypes = () => {
    return (_jsxs("section", { className: "text-center py-12", children: [_jsxs("h2", { className: "mb-6 text-[40px] sm:text-[52px] font-semibold", children: ["Who is this for", _jsx("span", { className: "text-[#ff5200]", children: "?" })] }), _jsx("div", { className: "grid grid-cols-1 sm:grid-cols-3 max-w-7xl mx-auto gap-y-8", children: people.map((p) => (_jsxs("div", { className: "flex flex-col items-center", children: [_jsx("img", { src: p.img, alt: p.title, className: "w-120 h-120 object-contain", style: {
                                filter: "drop-shadow(0 0 40px rgba(255, 82, 0, 0.5))",
                            } }), _jsx("h3", { className: "text-[20px] font-semibold", children: p.title }), _jsx("p", { className: "text-black/70 text-[15px] max-w-[200px]", children: p.desc })] }, p.title))) })] }));
};
export default UserTypes;
