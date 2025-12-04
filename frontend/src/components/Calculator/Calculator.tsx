import React, { useState } from "react";
import "./Calculator.css";
import Display from "./Display";
import ButtonGrid from "./ButtonGrid";

export default function Calculator() {
  const [a, setA] = useState("0");
  const [b, setB] = useState("");
  const [operator, setOperator] = useState<string | null>(null);
  const [history, setHistory] = useState("");
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

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
    { label: "AC", color: "#444444" } 
  ];

  const opMap: Record<string, string> = {
    "+": "add", "−": "sub", "×": "mul", "÷": "div",
    "^": "pow", "pow": "pow", "%": "percent", "√": "sqrt", "x²": "pow",
  };

  function appendDigit(d: string) {
    setError(null);
    if (d === "−" && !operator && a === "0") { 
      setA("-"); 
      return;
    }
    if (result !== null && !operator) { setResult(null); setA("0"); setB(""); setHistory(""); }
    if (!operator) setA(prev => (prev === "0" ? d : prev + d));
    else setB(prev => { const val = prev === "" ? d : prev + d; setHistory(`${a} ${operator} ${val}`); return val; });
  }

  async function callBackend(opParam: string, aVal: string, bVal?: string) {
    let url = opParam === "sqrt"
      ? `http://localhost:8080/calc?op=${opParam}&a=${aVal}`
      : `http://localhost:8080/calc?op=${opParam}&a=${aVal}&b=${bVal ?? "2"}`;
    try {
      const res = await fetch(url);
      const data = await res.json();
      if (!res.ok) { setError(data.error); return null; }
      setResult(data.result); setA(String(data.result)); setB(""); setOperator(null);
      return data.result;
    } catch { setError("Server error"); return null; }
  }

  async function handleEquals() {
    if (!operator || !b) return setError(!b ? "Enter Second Parameter" : "");
    setHistory(`${a} ${operator} ${b}`);
    await callBackend(opMap[operator], a, b);
  }

  async function handleOperatorPress(label: string) {
    setError(null);
    if (label === "√" || label === "x²") {
      const base = (result ?? a).toString();
      if (!base || base === "-") return setError("Enter First Parameter");
      setHistory(label === "√" ? `√(${base})` : `${base}²`);
      await callBackend(label === "√" ? "sqrt" : "pow", base, label === "x²" ? "2" : undefined);
      return;
    }
    if (operator && b) {
      const r = await callBackend(opMap[operator], a, b);
      if (r === null) return;
      setOperator(label); setHistory(`${r} ${label}`); return;
    }
    setOperator(label); setHistory(`${a} ${label}`); setB("");
  }

  function handleButton(label: string) {
    if (!isNaN(Number(label)) || label === "−") return appendDigit(label);
    if (label === ".") return appendDigit(".");
    if (label === "AC") { setA("0"); setB(""); setOperator(null); setResult(null); setHistory(""); return; }
    if (label === "⌫") { if (operator && b) setB(b.slice(0,-1)); else setA(a.slice(0,-1)||"0"); return; }
    if (label === "=") return handleEquals();
    if (opMap[label]) return handleOperatorPress(label);
  }

  const displayValue = result ?? (operator ? b || "0" : a);

  return (
    <div className="calc-root">
      <div className="calc-container">
        <Display history={history} value={displayValue} error={error} />
        <ButtonGrid buttons={buttons} onClick={handleButton} />
      </div>
    </div>
  );
}
