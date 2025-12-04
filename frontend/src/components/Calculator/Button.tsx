import React from "react";

interface ButtonProps {
  label: string;
  color: string;
  onClick: (label: string) => void;
  isOperator?: boolean;
}

const Button: React.FC<ButtonProps> = ({ label, color, onClick, isOperator = false }) => {
  return (
    <button
      onClick={() => onClick(label)}
      className={`btn ${isOperator ? "op" : ""}`}
      style={{ background: color }}
    >
      {label}
    </button>
  );
};

export default Button;
