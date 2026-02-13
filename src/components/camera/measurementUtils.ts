import { Point, CalibrationData, MeasurementLine } from "@/src/types";

export function calculatePixelDistance(start: Point, end: Point): number {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  return Math.sqrt(dx * dx + dy * dy);
}

export function pixelsToCm(
  pixels: number,
  calibration: CalibrationData,
): number {
  return pixels / calibration.pixelsPerCm;
}

export function createCalibration(
  referenceWidthCm: number,
  detectedWidthPixels: number,
): CalibrationData {
  return {
    pixelsPerCm: detectedWidthPixels / referenceWidthCm,
    timestamp: new Date(),
  };
}

export function createMeasurementLine(
  start: Point,
  end: Point,
  calibration: CalibrationData,
): MeasurementLine {
  const pixels = calculatePixelDistance(start, end);
  const cm = pixelsToCm(pixels, calibration);
  return { start, end, distanceCm: cm };
}
