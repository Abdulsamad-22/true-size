"use client";
import { DIMENSIONS } from "../lib/units";
// import { Dimension } from "../types";
import { useState } from "react";
import { DimensionId } from "../types";

interface DimensionProps {
  selectedDimension: DimensionId;
  setSelectedDimension: (d: DimensionId) => void;
}

// const dimensions: Dimensions[] = [
//   { id: "length", name: "Length" },
//   { id: "weight", name: "Weight" },
//   { id: "volume", name: "Volume" },
//   { id: "temp", name: "Temp" },
// ];

const dimensions = Object.values(DIMENSIONS);

export default function Dimension({
  selectedDimension,
  setSelectedDimension,
}: DimensionProps) {
  const handleSelection = (dimension: DimensionId) => {
    if (dimension) {
      setSelectedDimension(dimension);
    }
  };
  return (
    <div className="w-full bg-[#F3F8FF] flex items-center gap-4 rounded-[8px] p-4 mb-8">
      {dimensions.map((dim) => (
        <button
          key={dim.id}
          onClick={() => handleSelection(dim.id)}
          className={`w-full text-[0.875rem] ${selectedDimension === dim.id ? "bg-[#fff] text-[#2779fd]  p-2" : "text-[#212121]"} font-medium rounded-[4px]`}
        >
          {dim.name}
        </button>
      ))}
    </div>
  );
}
