"use client";
import Dimension from "@/src/components/Dimension";
import InputMeasurement from "@/src/components/measurementInput";
import Result from "@/src/components/Result";
import { Camera, Ruler, RefreshCw, Info } from "lucide-react";
import { useState, useEffect } from "react";
import { DimensionId } from "@/src/types";
import { DIMENSIONS } from "@/src/lib/units";

export default function Home() {
  const [selectedDimension, setSelectedDimension] =
    useState<DimensionId>("length");

  const [selectedUnit, setSelectedUnit] = useState<string>("mm");

  const [targetResult, setTargetResult] = useState<string>("in");

  const targetUnits = DIMENSIONS[selectedDimension].units.filter(
    (unit) => unit.id !== selectedUnit,
  );

  useEffect(() => {
    if (!targetUnits.find((u) => u.id === targetResult)) {
      setTargetResult(targetUnits[0]?.id ?? "");
    }
  }, [selectedUnit, selectedDimension]);

  console.log("available units to be converted to", targetUnits);
  return (
    <div className="">
      <main>
        <header>
          <div className="flex items-center gap-1 mb-8">
            <Ruler size={24} className="text-[#2779FD]" />
            <h1 className="text-[1.75rem] font-bold italic text-[#2779FD]">
              TrueSize
            </h1>
          </div>
        </header>
        <Dimension
          setSelectedDimension={setSelectedDimension}
          selectedDimension={selectedDimension}
        />
        <InputMeasurement
          setSelectedDimension={setSelectedDimension}
          selectedDimension={selectedDimension}
          selectedUnit={selectedUnit}
          setSelectedUnit={setSelectedUnit}
        />
        <Result
          targetUnits={targetUnits}
          targetResult={targetResult}
          setTargetResult={setTargetResult}
        />

        <button className="w-full bg-[#2779fd] text-[#f3f3f3] rounded-[8px] px-4 py-3">
          Calculate
        </button>
      </main>
    </div>
  );
}
