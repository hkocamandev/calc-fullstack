import { useState } from "react";

export default function Calculator() {
  const [a, setA] = useState<string>("");
  const [b, setB] = useState<string>("");
  const [enteringA, setEnteringA] = useState<boolean>(true); 
  const [history, setHistory] = useState<string>("");
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const buttons = [
    { label: "AC", color: "#222222" },
    { label: "√", color: "#3B82F6" },
    { label: "%", color: "#3B82F6" },
    { label: "÷", color: "#3B82F6" },
    { label: "x²", color: "#3B82F6" },
    { label: "^", color: "#3B82F6" },
    { label: "pow", color: "#3B82F6" },
    { label: "×", color: "#3B82F6" },
    { label: "7", color: "#222222" },
    { label: "8", color: "#222222" },
    { label: "9", color: "#222222" },
    { label: "−", color: "#3B82F6" },
    { label: "4", color: "#222222" },
    { label: "5", color: "#222222" },
    { label: "6", color: "#222222" },
    { label: "+", color: "#3B82F6" },
    { label: "1", color: "#222222" },
    { label: "2", color: "#222222" },
    { label: "3", color: "#222222" },
    { label: "=", color: "#3B82F6" },
    { label: "0", color: "#222222" },
    { label: ".", color: "#222222" },
    { label: "⌫", color: "#222222" },
    { label: "op", color: "#3B82F6" },
  ];

  function appendDigit(digit: string) {
    if (enteringA) {
      setA(a + digit); 
    } else {
      setB(b + digit);
    }
  }

  async function doAdd() {
    setError(null);

    if (!a || !b) {
      setError("A ve B girilmelidir");
      return;
    }

    setHistory(`${a} + ${b}`);

    try {
      const res = await fetch(
        `http://localhost:8080/calc?op=add&a=${a}&b=${b}`
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Unknown error");
        return;
      }

      setResult(data.result);
    } catch {
      setError("Server error");
    }
  }

  function handleButton(label: string) {
    // AC
    if (label === "AC") {
      setA("");
      setB("");
      setResult(null);
      setError(null);
      setEnteringA(true);
      setHistory("");
      return;
    }

    // "="
    if (label === "=") {
      doAdd(); 
      return;
    }

    
    if (label === "+") {
      if (a === "") return; 
      setEnteringA(false);
      return;
    }

    
    if (!isNaN(Number(label))) {
      appendDigit(label);
      return;
    }

    
    if (label === ".") {
      appendDigit(".");
      return;
    }

    
    if (label === "⌫") {
      if (enteringA) setA(a.slice(0, -1));
      else setB(b.slice(0, -1));
      return;
    }

  }

  const displayValue =
    result !== null ? String(result) : enteringA ? a || "0" : b || "0";

  return (
    <div
      style={{
        width: 360,
        height: 720,
        background: "#0E0E0E",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <div
        style={{
          width: 320,
          height: 620,
          background: "#1A1A1A",
          borderRadius: 24,
          padding: 20,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Display */}
        <div
          style={{
            width: 296,
            height: 80,
            background: "#111111",
            borderRadius: 20,
            padding: 16,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              textAlign: "right",
              fontSize: 16,
              color: "#7A7A7A",
            }}
          >
            {history}
          </div>

          <div
            style={{
              textAlign: "right",
              fontSize: 42,
              fontWeight: "bold",
              color: "white",
            }}
          >
            {displayValue}
          </div>
        </div>

        {error && (
          <div
            style={{
              color: "red",
              marginTop: 10,
              textAlign: "center",
            }}
          >
            {error}
          </div>
        )}

        {/* Buttons */}
        <div
          style={{
            marginTop: 20,
            display: "grid",
            gridTemplateColumns: "repeat(4, 70px)",
            gap: 12,
          }}
        >
          {buttons.map((btn) => (
            <button
              key={btn.label}
              onClick={() => handleButton(btn.label)}
              style={{
                width: 70,
                height: 70,
                background: btn.color,
                border: "none",
                borderRadius: 14,
                fontSize: 22,
                color: "white",
                cursor: "pointer",
              }}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
