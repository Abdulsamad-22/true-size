"use client";
import Dimension from "@/src/components/Dimension";
import InputMeasurement from "@/src/components/measurementInput";
import Result from "@/src/components/Result";
import { Ruler, History } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { DimensionId, HistoryItem } from "@/src/types";
import { convert, DIMENSIONS } from "@/src/lib/units";
import AIDescription from "@/src/components/AIDescription";
import ConverSionHistory from "@/src/components/History";

export default function Home() {
  const [selectedDimension, setSelectedDimension] =
    useState<DimensionId>("length");
  const [inputValue, setInputValue] = useState("");
  const [convertedValue, setConvertedValue] = useState<number>(0);
  const [selectedUnit, setSelectedUnit] = useState<string>("mm");
  const [targetResult, setTargetResult] = useState<string>("in");
  const [aiDescription, setAIDescription] = useState<string>("");
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);

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

  const wait = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const handleCalculation = async (
    numericValue: number,
    selectedUnit: string,
    targetResult: string,
    selectedDimension: DimensionId,
  ) => {
    setIsCalculating(true);
    if (!numericValue) return;

    await wait(2000 + Math.random() * 1000);
    // Convert values
    const { result, baseValue } = convert(
      numericValue,
      selectedUnit,
      targetResult,
      selectedDimension,
    );

    setConvertedValue(result);

    try {
      // Call Groq API
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

      // Set conversion history
      setHistory((prev) => [
        {
          id: crypto.randomUUID(),
          numericValue,
          selectedUnit,
          convertedValue: result,
          targetUnit: targetResult,
          aiDescription: data.text,
          dimension: selectedDimension,
          timestamp: Date.now(),
        },
        ...prev,
      ]);
    } catch (error) {
      console.error("AI ERROR:", error);
      setAIDescription("Unable to generate explanation right now.");
    } finally {
      setIsLoadingAI(false);
      setIsCalculating(false);
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

          <History className="text-[#898989]" size={24} />
        </header>
        <Dimension
          setSelectedDimension={setSelectedDimension}
          selectedDimension={selectedDimension}
          setSelectedUnit={setSelectedUnit}
          setTargetResult={setTargetResult}
          setConvertedValue={setConvertedValue}
          setAIDescription={setAIDescription}
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
          className={`w-full text-[#f3f3f3] rounded-[8px] px-4 py-3 ${isCalculating ? "animate-bounce bg-[#7B7B7B]" : "bg-[#338ADE]"} transition-all duration-200`}
          disabled={isCalculating}
        >
          {isCalculating && (
            <span className="animate-spin inline-block mr-2">⏳</span>
          )}

          {isCalculating ? "Measuring…" : "Convert"}
        </button>
        <AIDescription
          isLoadingAI={isLoadingAI}
          aiDescription={aiDescription}
          setIsLoadingAI={setIsLoadingAI}
          setAIDescription={setAIDescription}
          setHistory={setHistory}
          targetResult={targetResult}
          selectedUnit={selectedUnit}
          selectedDimension={selectedDimension}
          numericValue={numericValue}
        />

        <ConverSionHistory history={history} />
      </main>
    </div>
  );
}
