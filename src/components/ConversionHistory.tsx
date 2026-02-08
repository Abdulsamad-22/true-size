"use client";

import { useEffect } from "react";
import formattedValue from "./utils/FormatValues";
import { useAI } from "./context/useAI";
import { Rocket, BrushCleaning, ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function ConverSionHistory() {
  const { history, setHistory } = useAI();
  useEffect(() => {
    localStorage.setItem("conversion-history", JSON.stringify(history));
  }, [history]);

  const handleClearHistory = () => {
    setHistory([]);
  };

  return (
    <div className="space-y-4 mt-8">
      <div className="flex items-center justify-between">
        {" "}
        <div className="flex items-center gap-2">
          <Link href="/">
            <ChevronLeft className="text-[#212121]" size={24} />
          </Link>
          <h1 className="text-[#212121] text-[1.5rem] font-semibold">
            History
          </h1>{" "}
        </div>
        <BrushCleaning
          onClick={handleClearHistory}
          className="text-[#898989]"
          size={24}
        />
      </div>

      {history.length === 0 && (
        <div className="text-center mt-12">
          {" "}
          <Rocket className="w-24 h-24 text-[#338ADE] mx-auto mb-2 animate-bounce" />{" "}
          <p className="text-[#898989]">Oops! No conversion history yet.</p>
        </div>
      )}
      {history.map((item) => (
        <div
          key={item.id}
          className="rounded-[12px] border-[1px] border-[#C7D7F1] p-4 bg-[#f3f3f3]"
        >
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
