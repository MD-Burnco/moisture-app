import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function MoistureCalculator() {
  const burncoRed = "#c8102e";

  const aggregates = {
    sand: { label: "5mm Sand", absorption: 1.4 },
    rock14: { label: "14mm Washed Rock", absorption: 1.8 },
    rock20: { label: "20mm Washed Rock", absorption: 1.5 },
  };

  const [selected, setSelected] = useState("sand");
  const wet = 1; // locked to 1 kg
  const [dry, setDry] = useState(1);
  const [result, setResult] = useState(null);
  const [offlineReady, setOfflineReady] = useState(false);
  // Register service worker for offline use
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then(() => setOfflineReady(true))
        .catch(() => console.log("SW registration failed"));
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
    <div className="p-6 max-w-xl mx-auto">
      <Card className="rounded-2xl shadow-lg border-2" style={{ borderColor: burncoRed }}>
        <CardContent className="p-6 space-y-4">
          <h1 className="text-2xl font-bold" style={{ color: burncoRed }}>
            Aggregate Moisture Calculator
          </h1>


          <p className="text-sm text-gray-600">
            Works offline after first load ✅ (save to home screen for best use)
          </p>

          {offlineReady && (
            <p className="text-xs text-green-600 font-semibold">
              Offline Mode Ready
            </p>
          )}
          <div>
            <label className="font-semibold" style={{ color: burncoRed }}>Aggregate Type</label>
            <select
              className="w-full border rounded p-2"
              style={{ borderColor: burncoRed }}
              value={selected}
              onChange={(e) => setSelected(e.target.value)}
            >
              {Object.entries(aggregates).map(([key, agg]) => (
                <option key={key} value={key}>
                  {agg.label} ({agg.absorption}%)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-semibold" style={{ color: burncoRed }}>Wet (kg)</label>
            <Input type="number" value={wet} disabled />
          </div>

          <div>
            <label className="font-semibold" style={{ color: burncoRed }}>Dry (kg)</label>
            <Input
              type="number"
              value={dry}
              onChange={(e) => setDry(parseFloat(e.target.value))}
            />
          </div>

          <Button
            onClick={calculate}
            style={{ backgroundColor: burncoRed, color: "white" }}
          >
            Calculate
          </Button>


          {result && (
            <div
              className="mt-4 border p-4 rounded space-y-2"
              style={{ borderColor: burncoRed }}
            >
              <p className="font-semibold" style={{ color: burncoRed }}>
                {aggregates[selected].label}
              </p>
              <p>Uncorrected Moisture: {result.moistureContent.toFixed(2)}%</p>
              <p>Absorption: {result.absorption.toFixed(2)}%</p>
              <p className="text-2xl font-bold" style={{ color: burncoRed }}>
                Corrected Moisture: {result.correctedMoisture.toFixed(2)}%
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// --- SERVICE WORKER FILE (create as /public/sw.js) ---
// Copy this into a separate file named sw.js in your public folder

/*
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open("moisture-app-v1").then((cache) => {
      return cache.addAll(["/", "/index.html"]);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
*/