import React from "react";

export type SortKey = "created" | "name" | "modified";

interface SortTabsProps {
  selected: SortKey;
  onSelect: (key: SortKey) => void;
}

const Chip: React.FC<{
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}> = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`px-4 h-9 rounded-full text-sm tracking-wide transition
      ${active ? "bg-[#121633] text-white shadow" : "bg-[#121633] text-white/80 hover:text-white"}`}
    style={{ boxShadow: active ? "0 8px 18px -8px rgba(0,0,0,.45)" : undefined }}
  >
    {children}
  </button>
);

const SortTabs: React.FC<SortTabsProps> = ({ selected, onSelect }) => {
  return (
    <div className="flex items-center gap-2">
      <Chip active={selected === "created"} onClick={() => onSelect("created")}>Created</Chip>
      <Chip active={selected === "name"} onClick={() => onSelect("name")}>Name</Chip>
      <Chip active={selected === "modified"} onClick={() => onSelect("modified")}>Modified</Chip>
    </div>
  );
};

export default SortTabs;
