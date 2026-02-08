"use client";
import Dimension from "@/src/components/Dimension";
import InputMeasurement from "@/src/components/measurementInput";
import Result from "@/src/components/Result";
import { Ruler, History } from "lucide-react";
import { useState, useEffect } from "react";
import { DimensionId } from "@/src/types";
import { convert } from "@/src/lib/units";
import AIDescription from "@/src/components/AIDescription";
import { useConversion } from "@/src/components/context/useConversion";
import Link from "next/link";
import { useAI } from "@/src/components/context/useAI";

export default function Home() {
  const {
    inputValue,
    selectedDimension,
    selectedUnit,
    targetResult,
    targetUnits,
    setTargetResult,
    setConvertedValue,
  } = useConversion();
  const { setIsLoadingAI, setAIDescription, setHistory } = useAI();
  const [isCalculating, setIsCalculating] = useState(false);

  useEffect(() => {
    if (!targetUnits.some((u) => u.id === targetResult)) {
      setTargetResult(targetUnits[0]?.id ?? "");
    }
  }, [targetUnits]);
  const numericValue = Number(inputValue);
  console.log(numericValue, selectedDimension, selectedUnit, targetResult);
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

      console.log(
        "test buutton",
        numericValue,
        result,
        selectedDimension,
        selectedUnit,
        targetResult,
      );
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
            <Ruler size={24} className="text-[#338ADE]" />
            <h1 className="text-[1.75rem] font-bold italic text-[#338ADE]">
              TrueSize
            </h1>
          </div>

          <Link href="/history">
            <History className="text-[#898989]" size={24} />
          </Link>
        </header>
        <Dimension />
        <InputMeasurement />
        <Result />

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
        <AIDescription />
      </main>
    </div>
  );
}
