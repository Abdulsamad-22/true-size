"use client";
import Dimension from "@/src/components/Dimension";
import InputMeasurement from "@/src/components/measurementInput";
import Result from "@/src/components/Result";
import { Camera, Ruler, RefreshCw, Info } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { DimensionId } from "@/src/types";
import { convert, DIMENSIONS } from "@/src/lib/units";

export default function Home() {
  const [selectedDimension, setSelectedDimension] =
    useState<DimensionId>("length");
  const [inputValue, setInputValue] = useState("");
  const [convertedValue, setConvertedValue] = useState<number>(0);
  const [selectedUnit, setSelectedUnit] = useState<string>("mm");
  const [targetResult, setTargetResult] = useState<string>("in");

  const targetUnits = useMemo(() => {
    return DIMENSIONS[selectedDimension].units.filter(
      (u) => u.id !== selectedUnit,
    );
  }, [selectedDimension, selectedUnit]);

  useEffect(() => {
    if (!targetUnits.some((u) => u.id === targetResult)) {
      setTargetResult(targetUnits[0]?.id ?? "");
    }
  }, [targetUnits]);
  const numericValue = Number(inputValue);
  const handleCalculation = (
    numericValue: number,
    selectedUnit: string,
    targetResult: string,
    selectedDimension: DimensionId,
  ) => {
    const { result } = convert(
      numericValue,
      selectedUnit,
      targetResult,
      selectedDimension,
    );

    setConvertedValue(result);
  };

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
          setSelectedUnit={setSelectedUnit}
          setTargetResult={setTargetResult}
          setConvertedValue={setConvertedValue}
        />
        <InputMeasurement
          setSelectedDimension={setSelectedDimension}
          selectedDimension={selectedDimension}
          selectedUnit={selectedUnit}
          setSelectedUnit={setSelectedUnit}
          inputValue={inputValue}
          setInputValue={setInputValue}
        />
        <Result
          targetUnits={targetUnits}
          targetResult={targetResult}
          setTargetResult={setTargetResult}
          convertedValue={convertedValue}
        />

        <button
          onClick={() =>
            handleCalculation(
              numericValue,
              selectedUnit,
              targetResult,
              selectedDimension,
            )
          }
          className="w-full bg-[#2779fd] text-[#f3f3f3] rounded-[8px] px-4 py-3"
        >
          Calculate
        </button>
      </main>
    </div>
  );
}
