import React, { useState } from "react";

export default function Calculator() {
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [op, setOp] = useState("add");
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState("");

  const callAPI = async () => {
    setError("");
    setResult(null);

    let url = `http://localhost:8080/calc?op=${op}&a=${a}&b=${b}`;

    const res = await fetch(url);

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Unknown backend error");
      return;
    }

    setResult(data.result);
  };

  return (
    <div style={{ padding: "20px", maxWidth: "300px" }}>
      <h2>Calculator</h2>

      <select value={op} onChange={(e) => setOp(e.target.value)}>
        <option value="add">Addition</option>
        <option value="sub">Subtraction</option>
        <option value="mul">Multiplication</option>
        <option value="div">Division</option>
        <option value="pow">Exponentiation</option>
        <option value="sqrt">Square Root</option>
        <option value="percent">Percentage</option>
      </select>

      <br /><br />

      <input
        type="number"
        placeholder="A"
        value={a}
        onChange={(e) => setA(e.target.value)}
      />

      <br /><br />

      <input
        type="number"
        placeholder="B"
        disabled={op === "sqrt"}
        value={b}
        onChange={(e) => setB(e.target.value)}
      />

      <br /><br />

      <button onClick={callAPI}>Calculate</button>

      {result !== null && (
        <p>Result: <strong>{result}</strong></p>
      )}

      {error && (
        <p style={{ color: "red" }}>{error}</p>
      )}
    </div>
  );
}
