"use client";

import { useContext } from "react";
import { ConversionContext } from "./ConversionContext";

export function useConversion() {
  const context = useContext(ConversionContext);
  if (!context) {
    throw new Error("useConversion must be used within provider");
  }
  return context;
}
