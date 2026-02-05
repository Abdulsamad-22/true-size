"use client";
import Dimension from "@/src/components/Dimension";
import InputMeasurement from "@/src/components/measurementInput";
import Result from "@/src/components/Result";
import { Camera, Ruler, RefreshCw, Info, History } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { DimensionId } from "@/src/types";
import { convert, DIMENSIONS } from "@/src/lib/units";
import AIDescription from "@/src/components/AIDescription";

export default function Home() {
  const [selectedDimension, setSelectedDimension] =
    useState<DimensionId>("length");
  const [inputValue, setInputValue] = useState("");
  const [convertedValue, setConvertedValue] = useState<number>(0);
  const [selectedUnit, setSelectedUnit] = useState<string>("mm");
  const [targetResult, setTargetResult] = useState<string>("in");
  const [aiDescription, setAIDescription] = useState<string>("");
  const [isLoadingAI, setIsLoadingAI] = useState(false);

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
  async function test() {
    const testView = await fetch("/api/generate", { method: "POST" });
    console.log(testView);
  }

  const handleCalculation = async (
    numericValue: number,
    selectedUnit: string,
    targetResult: string,
    selectedDimension: DimensionId,
  ) => {
    if (!numericValue) return;

    // 1️⃣ Convert
    const { result, baseValue } = convert(
      numericValue,
      selectedUnit,
      targetResult,
      selectedDimension,
    );

    setConvertedValue(result);

    // 2️⃣ Call Groq API
    try {
      setIsLoadingAI(true);

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          numericValue,
          selectedUnit,
          targetResult,
          selectedDimension,
          convertedValue: result,
          baseValue,
        }),
      });

      if (!res.ok) throw new Error("AI request failed");

      const data = await res.json();
      setAIDescription(data.text);
    } catch (error) {
      console.error("AI ERROR:", error);
      setAIDescription("Unable to generate explanation right now.");
    } finally {
      setIsLoadingAI(false);
    }
  };

  return (
    <div className="">
      <main>
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-1">
            <Ruler size={24} className="text-[#2779FD]" />
            <h1 className="text-[1.75rem] font-bold italic text-[#2779FD]">
              TrueSize
            </h1>
          </div>
          <History size={24} />
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
        <AIDescription
          isLoadingAI={isLoadingAI}
          aiDescription={aiDescription}
        />

        {/* {isLoadingAI && (
          <p className="text-sm text-gray-500 mt-2">Generating explanation…</p>
        )}

        {aiDescription && !isLoadingAI && (
          <p className="mt-3 text-[0.9rem] text-[#4a4a4a] leading-relaxed">
            {aiDescription}
          </p>
        )} */}
      </main>
    </div>
  );
}
