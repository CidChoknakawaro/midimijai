import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const EditMenu = ({ onUndo, onRedo, onCut, onCopy, onPaste, onDelete, onSelectAll, }) => {
    const items = [
        { label: "Undo", action: onUndo, shortcut: "Ctrl+Z" },
        { label: "Redo", action: onRedo, shortcut: "Ctrl+Y" },
        { separator: true },
        { label: "Cut", action: onCut, shortcut: "Ctrl+X" },
        { label: "Copy", action: onCopy, shortcut: "Ctrl+C" },
        { label: "Paste", action: onPaste, shortcut: "Ctrl+V" },
        { label: "Delete", action: onDelete },
        { separator: true },
        { label: "Select All", action: onSelectAll, shortcut: "Ctrl+A" },
    ];
    return (_jsx("div", { className: "rounded-md border border-gray-200 bg-white shadow", children: items.map((item, i) => "separator" in item ? (_jsx("div", { className: "my-1 border-t" }, `sep-${i}`)) : (_jsxs("button", { onClick: item.action, className: "flex w-full items-center justify-between px-3 py-1.5 text-left hover:bg-gray-50", children: [_jsx("span", { children: item.label }), item.shortcut && (_jsx("span", { className: "text-xs text-gray-400", children: item.shortcut }))] }, item.label))) }));
};
export default EditMenu;
