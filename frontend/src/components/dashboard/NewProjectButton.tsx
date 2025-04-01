import React from "react";
import Button from "../shared/Button";

const NewProjectButton: React.FC = () => {
  return (
    <Button text="+ Create new project" onClick={() => alert("New project placeholder")} />
  );
};

export default NewProjectButton;