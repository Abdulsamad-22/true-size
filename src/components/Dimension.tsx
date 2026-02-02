"use client";
import { DIMENSIONS } from "../lib/units";
import { useEffect } from "react";
import { DimensionId } from "../types";

interface DimensionProps {
  selectedDimension: DimensionId;
  setSelectedDimension: (d: DimensionId) => void;
  setTargetResult: (u: string) => void;
  setSelectedUnit: (u: string) => void;
  setConvertedValue: (u: number) => void;
}

const dimensions = Object.values(DIMENSIONS);

export default function Dimension({
  selectedDimension,
  setSelectedDimension,
  setSelectedUnit,
  setTargetResult,
  setConvertedValue,
}: DimensionProps) {
  useEffect(() => {
    const units = DIMENSIONS[selectedDimension].units;
    if (units.length < 2) return;

    setSelectedUnit(units[0].id);
    setTargetResult(units[1].id);
    setConvertedValue(0);
  }, [selectedDimension]);

  const handleSelection = (dimension: DimensionId) => {
    if (dimension) {
      setSelectedDimension(dimension);
    }
  };
  return (
    <div className="w-full bg-[#338ADE] flex items-center gap-4 rounded-[8px] p-3 mb-8">
      {dimensions.map((dim) => (
        <button
          key={dim.id}
          onClick={() => handleSelection(dim.id)}
          className={`w-full text-[0.875rem] ${selectedDimension === dim.id ? "bg-[#fff] text-[#2779fd]  p-1" : "text-[#f3f3f3]"} font-medium rounded-[4px]`}
        >
          {dim.name}
        </button>
      ))}
    </div>
  );
}
