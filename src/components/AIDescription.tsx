"use client";
import { ChevronUp, ChevronDown } from "lucide-react";
import { useState } from "react";

interface descriptionProps {
  aiDescription: string;
  isLoadingAI: boolean;
}
export default function AIDescription({
  aiDescription,
  isLoadingAI,
}: descriptionProps) {
  const [openDescription, setOpenDescription] = useState<boolean>(false);
  const handleDescription = () => {
    setOpenDescription(!openDescription);
  };
  return (
    <div className="border-[1px] border-[#C7D7F1] rounded-[12px] p-[1rem] mt-8">
      <div className="flex item-center justify-between">
        <h2 className="flex gap-2 text-[#212121] text-[1rem] font-medium mb-[1rem]">
          <div className="bg-[#338ADE] item-center py-[0.25rem] px-[0.5rem] rounded-[4px]">
            ✨
          </div>{" "}
          AI Contextual Description
        </h2>

        {openDescription === false ? (
          <ChevronDown onClick={handleDescription} size={20} />
        ) : (
          <ChevronUp onClick={handleDescription} size={20} />
        )}
      </div>

      {openDescription && (
        <div className="bg-[#338ADE] p-[0.625rem] rounded-[8px]">
          {isLoadingAI && (
            <p className="text-sm text-[#f3f3f3] mt-2">
              Generating explanation…
            </p>
          )}

          {aiDescription && !isLoadingAI && (
            <p className="text-[0.875rem] text-[#f3f3f3] leading-relaxed">
              {aiDescription}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
