import React from "react";

interface DisplayProps {
  history: string;
  value: string | number;
  error: string | null;
  small?: boolean; // burada ekledik
}

export default function Display({ history, value, error, small }: DisplayProps) {
  return (
    <div className={`calc-display ${small ? "display-small" : ""}`}>
      {history && <div className="history">{history}</div>}
      <div className="result">{value}</div>
      {error && <div className="error">{error}</div>}
    </div>
  );
}
