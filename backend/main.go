import { useState } from "react";

export default function Calculator() {
  const [a, setA] = useState<string>("");
  const [b, setB] = useState<string>("");
  const [enteringA, setEnteringA] = useState<boolean>(true);
  const [history, setHistory] = useState<string>("");
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentOp, setCurrentOp] = useState<string | null>(null);

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
    { label: "⌫", color: "#222222" }
  ];

  function backendOp(label: string) {
    switch (label) {
      case "+": return "add";
      case "−": return "sub";
      case "×": return "mul";
      case "÷": return "div";
      default: return null;
    }
  }

  function appendDigit(digit: string) {
    if (enteringA) {
      setA((prev) => prev + digit);
      setHistory(a + digit);
    } else {
      setB((prev) => prev + digit);

      if (currentOp) {
        setHistory(`${a} ${currentOp} ${b + digit}`);
      }
    }
  }

  async function callBackend(op: string, x: string, y: string) {
    try {
      const res = await fetch(
        `http://localhost:8080/calc?op=${op}&a=${x}&b=${y}`
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Unknown");
      return data.result;
    } catch {
      setError("Server error");
      return null;
    }
  }

  async function doEquals() {
    if (!currentOp || a === "" || b === "") return;

    const op = backendOp(currentOp);
    const r = await callBackend(op!, a, b);
    if (r === null) return;

    setResult(r);
    setHistory(`${a} ${currentOp} ${b} = ${r}`);

    // zincirleme hazırla
    setA(String(r));
    setB("");
    setEnteringA(false);
    setCurrentOp(null);
  }

  async function handleOperation(label: string) {
    const op = backendOp(label);
    if (!op) return;

    setError(null);

    // Eğer zaten A ve B dolu ise zincirleme işlemi yap
    if (a !== "" && b !== "" && currentOp) {
      const r = await callBackend(backendOp(currentOp)!, a, b);
      if (r === null) return;

      setA(String(r));
      setResult(r);
      setHistory(`${r} ${label}`);
    } else {
      // Normal işlem
      if (a !== "") {
        setHistory(`${a} ${label}`);
      }
    }

    // Yeni operasyona geç
    setCurrentOp(label);
    setEnteringA(false);
    setB(""); // işlem seçince b sıfırlanıyor
  }

  function handleButton(label: string) {
    if (label === "AC") {
      setA("");
      setB("");
      setResult(null);
      setError(null);
      setEnteringA(true);
      setHistory("");
      setCurrentOp(null);
      return;
    }

    if (label === "=") {
      doEquals();
      return;
    }

    // Operasyonlar
    if (["+","−","×","÷"].includes(label)) {
      handleOperation(label);
      return;
    }

    // Digit
    if (!isNaN(Number(label))) {
      appendDigit(label);
      return;
    }

    if (label === ".") {
      appendDigit(".");
      return;
    }

    if (label === "⌫") {
      if (enteringA) {
        setA(a.slice(0, -1));
        setHistory(a.slice(0, -1));
      } else {
        setB(b.slice(0, -1));
        setHistory(`${a} ${currentOp ?? ""} ${b.slice(0, -1)}`);
      }
      return;
    }
  }

  const displayValue =
    result !== null
      ? String(result)
      : enteringA
      ? a || "0"
      : b || "0";

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
