import React, { useState } from "react";

export default function Calculator() {
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState("");

  const callAddAPI = async () => {
    setError("");
    setResult(null);

    try {
      // Backend API çağrısı
      const res = await fetch("http://localhost:8080/add?a=" + a + "&b=" + b);
      if (!res.ok) {
        throw new Error("API error");
      }

      const data = await res.json();
      setResult(data.result);
    } catch (err) {
      setError("Backend error, please check server.");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "300px" }}>
      <h2>Calculator</h2>

      <input
        type="number"
        placeholder="First number"
        value={a}
        onChange={(e) => setA(e.target.value)}
      />

      <br /><br />

      <input
        type="number"
        placeholder="Second number"
        value={b}
        onChange={(e) => setB(e.target.value)}
      />

      <br /><br />

      <button onClick={callAddAPI}>Add</button>

      {result !== null && (
        <p>Result: <strong>{result}</strong></p>
      )}

      {error && (
        <p style={{ color: "red" }}>{error}</p>
      )}
    </div>
  );
}
