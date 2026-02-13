export type DimensionId = "length" | "weight" | "volume" | "temperature";

export interface Dimension {
  id: DimensionId;
  name: string;
  units: Unit[];
  conversions?: Record<string, number>;
}

export interface Unit {
  id: string;
  name: string;
  symbol: string;
}

export interface Measurement {
  value: number;
  unit: string;
  timestamp: Date;
}

export interface HistoryItem {
  id: string;
  numericValue: number;
  selectedUnit: string;
  convertedValue: number;
  targetUnit: string;
  aiDescription: string;
  dimension: DimensionId;
  timestamp: number;
}

export interface Point {
  x: number;
  y: number;
}

export interface MeasurementLine {
  start: Point;
  end: Point;
  distanceCm: number;
}

export interface CalibrationData {
  pixelsPerCm: number;
  timestamp: Date;
}
