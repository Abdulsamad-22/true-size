"use client";

import { useContext, useState, createContext, useMemo } from "react";
import { DimensionId, HistoryItem, Unit } from "@/src/types";
import { DIMENSIONS } from "@/src/lib/units";

type ConversionState = {
  selectedDimension: DimensionId;
  selectedUnit: string;
  targetUnits: Unit[];
  targetResult: string;
  inputValue: string;
  convertedValue: number;

  setSelectedDimension: (d: DimensionId) => void;
  setSelectedUnit: (u: string) => void;
  setTargetResult: (u: string) => void;
  setInputValue: (v: string) => void;
  setConvertedValue: (c: number) => void;
};

export const ConversionContext = createContext<ConversionState | undefined>(
  undefined,
);

export default function ConversionContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [selectedDimension, setSelectedDimension] =
    useState<DimensionId>("length");
  const [inputValue, setInputValue] = useState("");
  const [convertedValue, setConvertedValue] = useState<number>(0);
  const [selectedUnit, setSelectedUnit] = useState<string>("mm");
  const [targetResult, setTargetResult] = useState<string>("cm");

  const targetUnits = useMemo(() => {
    return DIMENSIONS[selectedDimension].units.filter(
      (u) => u.id !== selectedUnit,
    );
  }, [selectedDimension, selectedUnit]);
  return (
    <ConversionContext.Provider
      value={{
        inputValue,
        setInputValue,
        convertedValue,
        setConvertedValue,
        selectedDimension,
        setSelectedDimension,
        selectedUnit,
        setSelectedUnit,
        targetResult,
        setTargetResult,
        targetUnits,
      }}
    >
      {children}
    </ConversionContext.Provider>
  );
}
