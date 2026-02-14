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

export interface Point3D {
  x: number;
  y: number;
  z: number;
}

export interface ARAnchor {
  id: string;
  position: Point3D;
  timestamp: Date;
}

export interface ARMeasurement {
  id: string;
  startAnchor: ARAnchor;
  endAnchor: ARAnchor;
  distanceMeters: number;
  distanceCm: number;
  distanceInches: number;
  timestamp: Date;
}

export type ARSession = "idle" | "starting" | "active" | "error";

export interface HitTestResult {
  position: Point3D;
  pose: XRPose;
}

export interface DetectedPlane {
  id: string;
  polygon: Point3D[]; // Corner points of detected surface
  center: Point3D;
  width: number; // meters
  height: number; // meters (depth)
  orientation: "horizontal" | "vertical";
  timestamp: Date;
}
