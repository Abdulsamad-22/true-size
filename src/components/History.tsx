"use client";
import { HistoryItem } from "../types";

import { useEffect } from "react";
import formattedValue from "./utils/FormatValues";

interface HistoryProps {
  history: HistoryItem[];
}

export default function ConverSionHistory({ history }: HistoryProps) {
  useEffect(() => {
    localStorage.setItem("conversion-history", JSON.stringify(history));
  }, [history]);

  return (
    <div className="space-y-4 mt-8">
      <h2>History</h2>
      {history.map((item) => (
        <div key={item.id} className="rounded-lg border p-4 bg-white shadow-sm">
          <div className="text-sm text-gray-600">
            {formattedValue(item.numericValue)} {item.selectedUnit} →{" "}
            {new Intl.NumberFormat("en-NG", {
              maximumFractionDigits: 2,
            }).format(item.convertedValue)}{" "}
            {item.targetUnit}
          </div>

          <p className="mt-1 text-gray-800 text-sm">{item.aiDescription}</p>
        </div>
      ))}
    </div>
  );
}
