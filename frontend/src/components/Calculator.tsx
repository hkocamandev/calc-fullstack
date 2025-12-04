import React, { useState } from "react";

export default function Calculator() {
  const [a, setA] = useState<string>("0");
  const [b, setB] = useState<string>("");
  const [operator, setOperator] = useState<string | null>(null);
  const [history, setHistory] = useState<string>("");
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  // BUTONLAR (AC sağ altta)
  const buttons = [
    { label: "", color: "transparent" },
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
    { label: "AC", color: "#444444" } // AC sağ altta
  ];

  const opMap: Record<string, string> = {
    "+": "add",
    "−": "sub",
    "×": "mul",
    "÷": "div",
    "^": "pow",
    "pow": "pow",
    "%": "percent",
    "√": "sqrt",
    "x²": "pow",
  };

  function appendDigit(d: string) {
    setError(null);
    if (result !== null && !operator) {
      setResult(null);
      setA("0");
      setB("");
      setHistory("");
    }
    if (!operator) {
      setA(prev => (prev === "0" ? d : prev + d));
      return;
    }
    setB(prev => {
      const val = prev === "" ? d : prev + d;
      setHistory(`${a} ${operator} ${val}`);
      return val;
    });
  }

  async function callBackend(opParam: string, aVal: string, bVal?: string) {
    let url = "";
    if (opParam === "sqrt") url = `http://localhost:8080/calc?op=${opParam}&a=${aVal}`;
    else if (opParam === "pow" && bVal === undefined) url = `http://localhost:8080/calc?op=${opParam}&a=${aVal}&b=2`;
    else url = `http://localhost:8080/calc?op=${opParam}&a=${aVal}&b=${bVal}`;

    try {
      const res = await fetch(url);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error);
        return null;
      }
      setResult(data.result);
      setA(String(data.result));
      setB("");
      setOperator(null);
      return data.result;
    } catch {
      setError("Server error");
      return null;
    }
  }

  async function handleEquals() {
    if (!operator) return;
    if (!b) return setError("B giriniz");
    setHistory(`${a} ${operator} ${b}`);
    const mapped = opMap[operator];
    await callBackend(mapped, a, b);
  }

  async function handleOperatorPress(label: string) {
    setError(null);
    if (label === "√" || label === "x²") {
      const base = result !== null ? String(result) : a;
      if (!base) return setError("A giriniz");
      setHistory(label === "√" ? `√(${base})` : `${base}²`);
      await callBackend(label === "√" ? "sqrt" : "pow", base, label === "x²" ? "2" : undefined);
      return;
    }
    if (operator && b) {
      const mapped = opMap[operator];
      const r = await callBackend(mapped, a, b);
      if (r === null) return;
      setOperator(label);
      setHistory(`${String(r)} ${label}`);
      return;
    }
    setOperator(label);
    setHistory(`${a} ${label}`);
    setB("");
  }

  function handleButton(label: string) {
    if (!isNaN(Number(label))) return appendDigit(label);
    if (label === ".") return appendDigit(".");
    if (label === "AC") {
      setA("0");
      setB("");
      setOperator(null);
      setResult(null);
      setHistory("");
      return;
    }
    if (label === "⌫") {
      if (operator && b) setB(b.slice(0, -1));
      else setA(a.slice(0, -1) || "0");
      return;
    }
    if (label === "=") return handleEquals();
    if (opMap[label]) return handleOperatorPress(label);
  }

  const displayValue = result !== null ? String(result) : operator ? (b || "0") : a;

  return (
    <div style={{
      width: 360,
      height: 720,
      background: "#0E0E0E",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontFamily: "Inter, sans-serif"
    }}>
      <div style={{
        width: 320,
        height: 620,
        background: "#1A1A1A",
        borderRadius: 24,
        padding: 20,
        display: "flex",
        flexDirection: "column"
      }}>
        {/* Display */}
        <div style={{
          width: "100%",
          minHeight: 80,
          maxHeight: 100,
          background: "#111",
          borderRadius: 20,
          padding: "12px 16px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          overflow: "hidden"
        }}>
          <div style={{
            textAlign: "right",
            fontSize: 18,
            color: "#8A8A8A",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis"
          }}>
            {history}
          </div>
          <div style={{
            textAlign: "right",
            fontSize: 46,
            fontWeight: "bold",
            color: "white",
            overflow: "hidden",
            textOverflow: "ellipsis"
          }}>
            {displayValue}
          </div>
        </div>

        {error && (
          <div style={{ color: "red", marginTop: 10, textAlign: "center" }}>
            {error}
          </div>
        )}

        {/* Buttons */}
        <div style={{
          marginTop: 20,
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 14
        }}>
          {buttons.map((btn) => (
            <button
              key={btn.label}
              onClick={() => handleButton(btn.label)}
              style={{
                width: "100%",
                height: 70,
                background: btn.color,
                border: "none",
                borderRadius: 16,
                fontSize: 22,
                color: "white",
                cursor: "pointer",
                fontWeight: "500"
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
