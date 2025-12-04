import React from "react";

interface DisplayProps {
  history: string;
  value: string | number;
  error: string | null;
}

const Display: React.FC<DisplayProps> = ({ history, value, error }) => {
  return (
    <>
      <div className="calc-display">
        <div className="history">{history}</div>
        <div className="result">{value}</div>
      </div>
      {error && <div className="error">{error}</div>}
    </>
  );
};

export default Display;
