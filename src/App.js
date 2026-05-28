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
  const [dry, setDry] = useState(1);
  const [result, setResult] = useState(null);
  const [offlineReady, setOfflineReady] = useState(false);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then(() => setOfflineReady(true))
        .catch(() => console.log("SW failed"));
    }
  }, []);

  const calculate = () => {
    if (!dry) return;

    const absorption = aggregates[selected].absorption;
    const moistureContent = ((wet - dry) / dry) * 100;
    const correctedMoisture = moistureContent - absorption;

    setResult({ moistureContent, correctedMoisture, absorption });
  };

  return (
    <div style={{ padding: 20, maxWidth: 500, margin: "auto" }}>
      <div
        style={{
          border: `2px solid ${burncoRed}`,
          borderRadius: 12,
          padding: 20,
        }}
      >
        <h1 style={{ color: burncoRed }}>Moisture Calculator</h1>

        <p>Works offline after first load ✅</p>

        {offlineReady && (
          <p style={{ color: "green" }}>Offline Mode Ready</p>
        )}

        <label>Aggregate Type</label>
        <select
