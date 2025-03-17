import React from "react";
import { Tooltip as ReactTooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";

interface TooltipProps {
  text: string;
  children: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ text, children }) => {
  return (
    <>
      <span data-tooltip-id="tooltip" data-tooltip-content={text}>
        {children}
      </span>
      <ReactTooltip id="tooltip" />
    </>
  );
};

export default Tooltip;
