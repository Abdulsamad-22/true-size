import { Point3D, ARAnchor, ARMeasurement } from "@/src/types";

// Calculate 3D distance between two points

export function calculate3DDistance(p1: Point3D, p2: Point3D): number {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const dz = p2.z - p1.z;

  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

// Convert meters to centimeters

export function metersToCm(meters: number): number {
  return meters * 100;
}

// Convert meters to inches

export function metersToInches(meters: number): number {
  return meters * 39.3701;
}

// Create AR measurement from two anchors

export function createARMeasurement(
  start: ARAnchor,
  end: ARAnchor,
): ARMeasurement {
  const distanceMeters = calculate3DDistance(start.position, end.position);

  return {
    id: `measure-${Date.now()}`,
    startAnchor: start,
    endAnchor: end,
    distanceMeters,
    distanceCm: metersToCm(distanceMeters),
    distanceInches: metersToInches(distanceMeters),
    timestamp: new Date(),
  };
}

// Format measurement for display

export function formatARMeasurement(
  measurement: ARMeasurement,
  unit: "cm" | "in" | "m" = "cm",
): string {
  const value =
    unit === "cm"
      ? measurement.distanceCm
      : unit === "in"
        ? measurement.distanceInches
        : measurement.distanceMeters;

  const decimals = unit === "m" ? 2 : 1;

  return `${value.toFixed(decimals)} ${unit}`;
}

// Create anchor from position

export function createAnchor(position: Point3D): ARAnchor {
  return {
    id: `anchor-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    position,
    timestamp: new Date(),
  };
}
