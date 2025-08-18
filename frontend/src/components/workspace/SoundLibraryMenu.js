import { jsx as _jsx } from "react/jsx-runtime";
const SoundLibraryMenu = ({ onSelect, onUploadSound, }) => {
    const items = [
        { label: "Import sound…", action: onUploadSound },
    ];
    return (_jsx("div", { className: "mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg", children: items.map((item) => (_jsx("button", { onClick: () => {
                item.action();
                onSelect();
            }, className: "w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100", children: item.label }, item.label))) }));
};
export default SoundLibraryMenu;
