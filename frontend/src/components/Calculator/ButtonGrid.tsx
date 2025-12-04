import React from "react";
import Button from "./Button";

interface ButtonGridProps {
  buttons: { label: string, color: string }[];
  onClick: (label: string) => void;
}

const ButtonGrid: React.FC<ButtonGridProps> = ({ buttons, onClick }) => {
  return (
    <div className="grid">
      {buttons.map(btn => (
        <Button
          key={btn.label}
          label={btn.label}
          color={btn.color}
          onClick={onClick}
          isOperator={!!btn.label && isNaN(Number(btn.label))}
        />
      ))}
    </div>
  );
};

export default ButtonGrid;
