import React, { useState, useEffect } from "react";

export default function MoistureCalculator() {
  const burncoRed = "#c8102e";

  const aggregates = {
    sand: { label: "5mm Sand", absorption: 1.4 },
    rock14: { label: "14mm Washed Rock", absorption: 1.8 },
    rock20: { label: "20mm Washed Rock", absorption: 1.5 },
  };

  const [selected, setSelected] = useState("sand");
  const wet = 1;

  // ✅ Start at 0.000 and store as string for better input control
  const [dry, setDry] = useState("0.000");
  const [result, setResult] = useState(null);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js");
    }
  }, []);

  const handleDryChange = (e) => {
    let value = e.target.value;

    // ✅ Auto add leading zero for decimals
    if (value === ".") {
      value = "0.";
    } else if (value.startsWith(".")) {
      value = "0" + value;
    }

    setDry(value);
  };

  const handleBlur = () => {
    let num = parseFloat(dry);
    if (!isNaN(num)) {
      setDry(num.toFixed(3));
    } else {
      setDry("0.000");
    }
  };

  const calculate = () => {
    const dryNum = parseFloat(dry);
    if (!dryNum) return;

    const absorption = aggregates[selected].absorption;
    const moistureContent = ((wet - dryNum) / dryNum) * 100;
    const correctedMoisture = moistureContent - absorption;

    setResult({ moistureContent, correctedMoisture, absorption });
  };

  return (
    <div style={{ padding: 20, maxWidth: 500, margin: "auto", fontFamily: "sans-serif" }}>
      <div style={{ border: `2px solid ${burncoRed}`, borderRadius: 10, padding: 20 }}>
        <h2 style={{ color: burncoRed }}>Moisture Calculator</h2>

        <label>Aggregate</label>
        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          style={{ width: "100%", padding: 8 }}
        >
          {Object.entries(aggregates).map(([key, a]) => (
            <option key={key} value={key}>
              {a.label} ({a.absorption}%)
            </option>
          ))}
        </select>

        <br /><br />

        <label>Wet (kg)</label>
        <input value={wet} disabled style={{ width: "100%", padding: 8 }} />

        <br /><br />

        <label>Dry (kg)</label>
        <input
          type="number"
          step="0.001"                // ✅ Arrow increment
          min="0"
          value={dry}
          onChange={handleDryChange} // ✅ Custom input handling
          onBlur={handleBlur}        // ✅ Format to 3 decimals
          style={{ width: "100%", padding: 8 }}
        />

        <br /><br />

        <button
          onClick={calculate}
          style={{
            width: "100%",
            padding: 10,
            background: burncoRed,
            color: "white",
            border: "none",
          }}
        >
          Calculate
        </button>

        {result && (
          <div style={{ marginTop: 15 }}>
            <p>Uncorrected Moisture: {result.moistureContent.toFixed(2)}%</p>
            <p>Absorption: {result.absorption.toFixed(2)}%</p>
            <h3 style={{ color: burncoRed }}>
              Corrected Moisture: {result.correctedMoisture.toFixed(2)}%
            </h3>
          </div>
        )}
      </div>
    </div>
  );
}
