"use client";

import { useRef, useState, useEffect } from "react";
import { Camera, X } from "lucide-react";
import { Point, CalibrationData, MeasurementLine } from "@/src/types";
import { createCalibration, createMeasurementLine } from "./measurementUtils";
import {
  requestCameraAccess,
  initializeVideo,
  stopCameraStream,
} from "./cameraUtils";

type Mode = "calibration" | "measuring";

export default function CameraMeasureMent() {
  const [error, setError] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [clickedPoints, setClickedPoints] = useState<Point[]>([]);
  const [mode, setMode] = useState<Mode>("calibration");
  const [calibration, setCalibration] = useState<CalibrationData | null>(null);
  const [calibrationPoints, setCalibrationPoints] = useState<Point[]>([]);

  const [measurements, setMeasurements] = useState<MeasurementLine[]>([]);
  const [currentPoints, setCurrentPoints] = useState<Point[]>([]);

  const DEBIT_CARD_WIDTH_CM = 8.56;

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();

    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);

    const newPoint: Point = { x, y };
    setClickedPoints([...clickedPoints, newPoint]);

    console.log("Clicked at:", newPoint);

    if (mode === "calibration") {
      handleCalibrationClick(newPoint);
    } else {
      handleMeasurementClick(newPoint);
    }
  };

  const handleCalibrationClick = (point: Point) => {
    const points = [...calibrationPoints, point];
    setCalibrationPoints(points);

    if (points.length === 2) {
      performCalibration(points[0], points[1]);
    }
  };

  const performCalibration = (p1: Point, p2: Point) => {
    const pixelWidth = Math.abs(p2.x - p1.x);

    const cal = createCalibration(DEBIT_CARD_WIDTH_CM, pixelWidth);
    setCalibration(cal);
    setMode("measuring");
    setCalibrationPoints([]);

    alert(`Calibrated! ${cal.pixelsPerCm.toFixed(1)} pixels per cm`);
  };

  const handleMeasurementClick = (point: Point) => {
    const points = [...currentPoints, point];
    setCurrentPoints(points);

    if (points.length === 2 && calibration) {
      const line = createMeasurementLine(points[0], points[1], calibration);
      setMeasurements([...measurements, line]);
      setCurrentPoints([]);

      console.log(`Measured: ${line.distanceCm.toFixed(1)} cm`);
    }
  };

  // Draw points on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw calibration points
    if (mode === "calibration") {
      ctx.strokeStyle = "#00FF00";
      ctx.lineWidth = 3;
      calibrationPoints.forEach((point, i) => {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 8, 0, Math.PI * 2);
        ctx.fill();

        if (i === 1) {
          // Draw line between two points
          ctx.beginPath();
          ctx.moveTo(calibrationPoints[0].x, calibrationPoints[0].y);
          ctx.lineTo(point.x, point.y);
          ctx.stroke();
        }
      });
    }

    // Draw measurement lines
    measurements.forEach((line) => {
      // Draw line
      ctx.strokeStyle = "#00D4FF";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(line.start.x, line.start.y);
      ctx.lineTo(line.end.x, line.end.y);
      ctx.stroke();

      // Draw points
      ctx.fillStyle = "#00D4FF";
      ctx.beginPath();
      ctx.arc(line.start.x, line.start.y, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(line.end.x, line.end.y, 6, 0, Math.PI * 2);
      ctx.fill();

      // Draw measurement label
      const midX = (line.start.x + line.end.x) / 2;
      const midY = (line.start.y + line.end.y) / 2;

      ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
      ctx.fillRect(midX - 40, midY - 15, 80, 30);

      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 14px monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(`${line.distanceCm.toFixed(1)} cm`, midX, midY);
    });

    // Draw current points
    ctx.fillStyle = "#FFD700";
    currentPoints.forEach((point) => {
      ctx.beginPath();
      ctx.arc(point.x, point.y, 8, 0, Math.PI * 2);
      ctx.fill();
    });
  }, [calibrationPoints, measurements, currentPoints, mode]);

  useEffect(() => {
    return () => {
      if (stream) stopCameraStream(stream);
    };
  }, [stream]);

  const handleStartCamera = async () => {
    const mediaStream = await requestCameraAccess();
    setStream(mediaStream);
    setIsActive(true);
  };

  useEffect(() => {
    if (stream && videoRef.current && isActive) {
      initializeVideo(videoRef.current, stream);
    }
  }, [stream, isActive]);

  const handleStopCamera = () => {
    if (stream) {
      stopCameraStream(stream);
      setStream(null);
    }
    setIsActive(false);
  };
  return (
    <div className="w-full h-full bg-black my-12">
      {!isActive ? (
        <div className="flex flex-col items-center justify-center min-h-[500px] p-8">
          <Camera size={64} className="mb-6 text-green-500" />
          <h2 className="text-2xl font-bold text-white mb-4">
            Camera Measurement
          </h2>

          {error && <p className="text-red-400 mb-4">{error}</p>}

          <button
            onClick={handleStartCamera}
            className="px-8 py-4 bg-green-500 text-white font-bold rounded-lg"
          >
            Start Camera
          </button>
        </div>
      ) : (
        <div className="relative">
          <video
            ref={videoRef}
            className="w-full h-auto"
            playsInline
            muted
            autoPlay
            style={{
              display: "block",
              width: "100%",
              maxWidth: "100%",
              backgroundColor: "black",
            }}
          />

          <canvas
            ref={canvasRef}
            onClick={handleCanvasClick}
            className="absolute top-0 left-0 w-full h-full cursor-crosshair"
          />

          <button
            onClick={handleStopCamera}
            className="absolute top-4 right-4 bg-red-500 p-3 rounded-lg z-50"
          >
            <X size={24} className="text-white" />
          </button>
        </div>
      )}
    </div>
  );
}
