"use client";
import { DIMENSIONS } from "../lib/units";
import { useEffect, useState } from "react";
import { DimensionId } from "../types";
import { useConversion } from "./context/useConversion";
import { useAI } from "./context/useAI";

const dimensions = Object.values(DIMENSIONS);

export default function Dimension() {
  const {
    setSelectedDimension,
    selectedDimension,
    setSelectedUnit,
    setTargetResult,
    setConvertedValue,
  } = useConversion();
  const { setAIDescription } = useAI();
  const [activeIndex, setActiveIndex] = useState(0);
  useEffect(() => {
    const units = DIMENSIONS[selectedDimension].units;
    if (units.length < 2) return;

    setSelectedUnit(units[0].id);
    setTargetResult(units[1].id);
    setConvertedValue(0);
    setAIDescription("");
  }, [selectedDimension]);

  const handleSelection = (dimension: DimensionId, index: number) => {
    if (dimension) {
      setActiveIndex(index);
      setSelectedDimension(dimension);
    }
  };
  return (
    <div className="relative w-full bg-[#338ADE] flex items-center gap-4 rounded-[8px] p-3 mb-8 overflow-hidden">
      <div
        className="absolute top-3 bottom-3 bg-white rounded-[4px]
               transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{
          width: `calc((100% - 1rem * ${dimensions.length - 1}) / ${dimensions.length})`,
          transform: `translateX(${activeIndex * 100}%)`,
        }}
      />

      {dimensions.map((dim, index) => (
        <button
          key={dim.id}
          onClick={() => handleSelection(dim.id, index)}
          className="relative z-10 w-full text-[0.875rem] font-medium py-1"
        >
          <span
            className={`transition-colors duration-300 ease-out ${
              selectedDimension === dim.id ? "text-[#2779fd]" : "text-[#f3f3f3]"
            }`}
          >
            {dim.name}
          </span>
        </button>
      ))}
    </div>
  );
}
