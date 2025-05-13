import React from "react";
import { Plus } from "lucide-react";

const NewFolderButton: React.FC = () => (
  <button
    onClick={() => alert("Create folder…")}
    className="
      flex items-center space-x-2
      px-6 py-3
      bg-teal-400 hover:bg-teal-500
      text-black font-semibold
      rounded-full shadow
      text-sm
    "
  >
    <div className="bg-white rounded-full p-1">
      <Plus className="w-4 h-4" />
    </div>
    <span>Create new folder</span>
  </button>
);

export default NewFolderButton;
