import React from "react";
import Button from "../shared/Button";

const NewFolderButton: React.FC = () => {
  return (
    <Button text="+ Create new folder" onClick={() => alert("New folder placeholder")} />
  );
};

export default NewFolderButton;