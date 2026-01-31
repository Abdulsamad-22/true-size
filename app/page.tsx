"use client";
import Dimension from "@/src/components/Dimension";
import InputMeasurement from "@/src/components/measurementInput";
import Result from "@/src/components/Result";
import { Camera, Ruler, RefreshCw, Info } from "lucide-react";
import { useState } from "react";

export default function Home() {
  const [selectedDimension, setSelectedDimension] = useState("length");
  const [selectedUnit, setSelectedUnit] = useState([]);
  const [targetUnit, setTargetUnit] = useState("in");
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
        <Result />

        <button className="w-full bg-[#2779fd] text-[#f3f3f3] rounded-[8px] px-4 py-3">
          Calculate
        </button>
      </main>
    </div>
  );
}
