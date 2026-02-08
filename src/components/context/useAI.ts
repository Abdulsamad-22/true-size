"use client";

import { useContext } from "react";
import { AIContext } from "./AIContext";

export function useAI() {
  const AI = useContext(AIContext);

  if (!AI) {
    throw new Error("useAi must be withing provider");
  }
  return AI;
}
