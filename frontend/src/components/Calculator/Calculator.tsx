import React, { useState } from "react";
import "./calculator.css";
import Display from "./Display";
import Button from "./Button";

export default function Calculator() {
  // State variables for calculator logic
  const [a, setA] = useState("0");           // First operand
  const [b, setB] = useState("");            // Second operand
  const [operator, setOperator] = useState<string | null>(null); // Current operator
  const [history, setHistory] = useState(""); // Expression history
  const [result, setResult] = useState<number | null>(null); // Calculation result
  const [error, setError] = useState<string | null>(null);  // Error message
  const [sciMode, setSciMode] = useState(false);           // Scientific mode toggle

  // Normal calculator buttons (basic operations)
  const normalButtons = [
    { label: "SCI", color: "#FFA500" },
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
    { label: "-", color: "#3B82F6" },
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
    { label: "AC", color: "#444444" }
  ];

  // Scientific buttons for advanced operations
  const sciButtons = [
    { label: "sin", color: "#3B82F6" }, { label: "cos", color: "#3B82F6" },
    { label: "tan", color: "#3B82F6" }, { label: "ln", color: "#3B82F6" },
    { label: "log", color: "#3B82F6" }, { label: "π", color: "#3B82F6" },
    { label: "e", color: "#3B82F6" }, { label: "√", color: "#3B82F6" },
    { label: "%", color: "#3B82F6" }, { label: "x²", color: "#3B82F6" },
    { label: "^", color: "#3B82F6" }, { label: "pow", color: "#3B82F6" }
  ];

  // Map UI operators to backend operation names
  const opMap: Record<string, string> = {
    "+": "add",
    "-": "sub",          
    "×": "mul",
    "÷": "div",
    "^": "pow",
    "pow": "pow",
    "%": "percent",
    "√": "sqrt",
    "x²": "pow"
  };

  // Handle digit or special input
  function appendDigit(d: string) {
    setError(null);

    const isUnicodeMinus = d === "−";
    const isASCII = d === "-";

    // Handle negative number input at start
    if (!operator && (a === "0" || a === "")) {
      if (isASCII || isUnicodeMinus) {
        setA("-");
        return;
      }
    }

    // Extend negative number if first char is "-"
    if (!operator && a === "-" && /\d/.test(d)) {
      setA("-" + d);
      return;
    }

    // Reset calculator if starting new input after result
    if (result !== null && !operator) {
      setResult(null);
      setA("0");
      setB("");
      setHistory("");
    }

    // Update first operand
    if (!operator) {
      setA(prev => (prev === "0" ? d : prev + d));
      return;
    }

    // Update second operand
    setB(prev => {
      const val = prev === "" ? d : prev + d;
      setHistory(`${a} ${operator} ${val}`);
      return val;
    });
  }

  // Call backend API for calculation
  async function callBackend(opParam: string, aVal: string, bVal?: string) {
    const url = opParam === "sqrt"
      ? `http://localhost:8080/calc?op=${opParam}&a=${aVal}`
      : `http://localhost:8080/calc?op=${opParam}&a=${aVal}&b=${bVal ?? "2"}`;

    try {
      const res = await fetch(url);
      const data = await res.json();
      if (!res.ok) { setError(data.error); return null; }
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

  // Handle "=" button press
  async function handleEquals() {
    if (!operator) return setError("Select an operator");

    if (!b || b === "-" || b === "." || isNaN(Number(b))) {
      return setError("Enter Second Parameter");
    }

    setHistory(`${a} ${operator} ${b}`);
    await callBackend(opMap[operator], a, b);
  }

  // Handle operator buttons
  async function handleOperatorPress(label: string) {
    setError(null);

    // Unary operators
    if (label === "√" || label === "x²") {
      const base = (result ?? a).toString();
      if (!base || base === "-") return setError("Enter First Parameter");

      setHistory(label === "√" ? `√(${base})` : `${base}²`);
      await callBackend(label === "√" ? "sqrt" : "pow", base, "2");
      return;
    }

    // Chained calculation if second operand exists
    if (operator && b) {
      const r = await callBackend(opMap[operator], a, b);
      if (r === null) return;
      setOperator(label);
      setHistory(`${r} ${label}`);
      return;
    }

    setOperator(label);
    setHistory(`${a} ${label}`);
    setB("");
  }

  // Main button handler
  function handleButton(label: string) {
    if (label === "SCI") { setSciMode(!sciMode); return; }
    const isASCIIminus = label === "-";
    const isUnicodeMinus = label === "−";

    if (isUnicodeMinus) return appendDigit("−");

    if (isASCIIminus) {
      // Negative number input
      if (!operator && (a === "0" || a === "" || a === "-")) {
        return appendDigit("-");
      }
      // Subtraction operator
      return handleOperatorPress("-");
    }

    if (!isNaN(Number(label)) || label === "−") return appendDigit(label);
    if (label === ".") return appendDigit(".");
    if (label === "AC") { setA("0"); setB(""); setOperator(null); setResult(null); setHistory(""); return; }
    if (label === "⌫") { if (operator && b) setB(b.slice(0, -1)); else setA(a.slice(0, -1) || "0"); return; }
    if (label === "=") return handleEquals();
    if (opMap[label]) return handleOperatorPress(label);
  }

  // Display value logic
  const displayValue = result ?? (operator ? b || "0" : a);

  // Right column button layout for scientific mode
  const rightColumnButtons = [
    { label: "÷", color: "#3B82F6" },
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
    { label: "⌫", color: "#222222" },
    { label: "0", color: "#222222" },
    { label: "AC", color: "#444444" },
    { label: "SCI", color: "#FFA500" }
  ];

  return (
    <div className="calc-root">
      <div className={`calc-container ${sciMode ? "sci-mode" : ""}`}>
        {sciMode ? (
          // Scientific mode layout
          <div className="sci-layout">
            <div className="sci-left">
              <Display history={history} value={displayValue} error={error} />
            </div>
            <div className="sci-center">
              {sciButtons.map((btn, idx) => (
                <Button key={idx} label={btn.label} color={btn.color} onClick={handleButton} />
              ))}
            </div>
            <div className="sci-right">
              {rightColumnButtons.map((btn, idx) => (
                <Button key={idx} label={btn.label} color={btn.color} onClick={handleButton} />
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* Normal calculator layout */}
            <Display history={history} value={displayValue} error={error} />
            <div className="grid">
              {normalButtons.map((btn, idx) => (
                <Button key={idx} label={btn.label} color={btn.color} onClick={handleButton} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
