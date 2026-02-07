"use client";
import { ChevronDown, RefreshCcw } from "lucide-react";
import { useState } from "react";
import { convert } from "../lib/units";
import { DimensionId } from "../types";
import { HistoryItem } from "../types";

type SetHistory = React.Dispatch<React.SetStateAction<HistoryItem[]>>;

interface descriptionProps {
  aiDescription: string;
  isLoadingAI: boolean;
  setIsLoadingAI: (u: boolean) => void;
  setAIDescription: (d: string) => void;
  selectedUnit: string;
  selectedDimension: DimensionId;
  targetResult: string;
  numericValue: number;
  setHistory: SetHistory;
}
export default function AIDescription({
  aiDescription,
  isLoadingAI,
  setIsLoadingAI,
  setAIDescription,
  selectedUnit,
  selectedDimension,
  targetResult,
  numericValue,
  setHistory,
}: descriptionProps) {
  const [openDescription, setOpenDescription] = useState<boolean>(false);
  const handleDescription = () => {
    setOpenDescription((prev) => !prev);
  };

  const handleRefreshDescription = async () => {
    const { result, baseValue } = convert(
      numericValue,
      selectedUnit,
      targetResult,
      selectedDimension,
    );
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

      setHistory((prev) =>
        prev.map((item) =>
          item.id
            ? {
                ...item,
                aiDescription: data.text,
                timestamp: Date.now(),
              }
            : item,
        ),
      );
    } catch (error) {
      console.error("AI ERROR:", error);
      setAIDescription("Unable to generate explanation right now.");
    } finally {
      setIsLoadingAI(false);
    }
  };

  return (
    <div className="border-[1px] border-[#C7D7F1] rounded-[12px] p-[1rem] mt-8">
      <div className="flex items-center justify-between">
        <div className="flex item-center gap-2">
          <div className="bg-[#338ADE] item-center py-[0.25rem] px-[0.5rem] rounded-[4px]">
            ✨
          </div>{" "}
          <h2 className="text-[#212121] text-[1rem] font-medium">
            AI Contextual Description
          </h2>
        </div>

        <ChevronDown
          onClick={handleDescription}
          className={`
  cursor-pointer
  transition-transform
  duration-500
  ease-[cubic-bezier(0.22,1,0.36,1)]
  active:scale-90
  ${openDescription ? "rotate-180" : "rotate-0"}
`}
        />
      </div>

      <div
        className={`
    grid transition-all duration-700
    ease-[cubic-bezier(0.22,1,0.36,1)]
    ${openDescription ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}
  `}
      >
        <div className="overflow-hidden">
          <div className="bg-[#338ADE] p-[0.625rem] rounded-[8px] mt-[1rem]">
            <RefreshCcw
              onClick={handleRefreshDescription}
              className={`
    text-[#f3f3f3]
    mb-2
    cursor-pointer
    transition-transform
    duration-300
    ${isLoadingAI ? "animate-spin [animation-duration:1.2s]" : ""}
  `}
              size={20}
            />

            {isLoadingAI && (
              <p className="text-sm text-[#f3f3f3] mt-2">
                Generating explanation…
              </p>
            )}

            {aiDescription === "" && !isLoadingAI && (
              <p className="text-[0.875rem] text-[#f3f3f3] leading-relaxed">
                There no descriptions now, make a conversion!
              </p>
            )}

            {aiDescription && !isLoadingAI && (
              <p className="text-[0.875rem] text-[#f3f3f3] leading-relaxed">
                {aiDescription}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
