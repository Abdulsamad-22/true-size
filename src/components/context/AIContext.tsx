"use client";

import { HistoryItem } from "@/src/types";
import { createContext, useState, useEffect } from "react";

const HISTORY_KEY = "conversion_history";
type SetHistory = React.Dispatch<React.SetStateAction<HistoryItem[]>>;
type AIDescriptionState = {
  aiDescription: string;
  isLoadingAI: boolean;
  history: HistoryItem[];
  setHistory: SetHistory;
  setAIDescription: (d: string) => void;
  setIsLoadingAI: (l: boolean) => void;
  clearHistory: () => void;
};
export const AIContext = createContext<AIDescriptionState | undefined>(
  undefined,
);

export default function AIContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [aiDescription, setAIDescription] = useState<string>("");
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  console.log(history);

  useEffect(() => {
    const stored = localStorage.getItem(HISTORY_KEY);
    if (stored) {
      try {
        setHistory(JSON.parse(stored));
      } catch {
        localStorage.removeItem(HISTORY_KEY);
      }
    }
  }, []);

  // Persist history on change
  useEffect(() => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  }, [history]);

  // Clear history
  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem(HISTORY_KEY);
  };
  return (
    <AIContext.Provider
      value={{
        history,
        aiDescription,
        isLoadingAI,
        setAIDescription,
        setHistory,
        setIsLoadingAI,
        clearHistory,
      }}
    >
      {children}
    </AIContext.Provider>
  );
}
