"use client";

import { useState, useRef, useEffect } from "react";
import { Camera, X, Target, Zap } from "lucide-react";
import { WebXRSessionManager } from "./sessionManager";
import {
  createAnchor,
  createARMeasurement,
  formatARMeasurement,
} from "./measurementUtils";

import { ARAnchor, ARMeasurement, Point3D } from "@/src/types";

interface WebXRMeasurementProps {
  onComplete?: (distanceCm: number) => void;
  onClose?: () => void;
}

export default function WebXRMeasurement({
  onComplete,
  onClose,
}: WebXRMeasurementProps) {
  const [isActive, setIsActive] = useState(false);
  const [shouldStartAR, setShouldStartAR] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [anchors, setAnchors] = useState<ARAnchor[]>([]);
  const [measurements, setMeasurements] = useState<ARMeasurement[]>([]);
  const [currentHitPosition, setCurrentHitPosition] = useState<Point3D | null>(
    null,
  );
  const [isHitting, setIsHitting] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sessionManagerRef = useRef<WebXRSessionManager | null>(null);
  const animationFrameRef = useRef<number>(0);

  useEffect(() => {
    if (shouldStartAR && canvasRef.current && !isActive) {
      initializeAR();
    }
  }, [shouldStartAR, isActive]);

  useEffect(() => {
    return () => {
      handleStop();
    };
  }, []);

  const handleStartClick = async () => {
    try {
      setError(null);

      // Check WebXR support first
      if (!navigator.xr) {
        throw new Error("WebXR not supported. Use Chrome on Android.");
      }

      const supported = await navigator.xr.isSessionSupported("immersive-ar");

      if (!supported) {
        throw new Error("AR not supported on this device.");
      }

      setShouldStartAR(true);
    } catch (err) {
      console.error("AR check failed:", err);
      setError(
        err instanceof Error ? err.message : "Failed to check AR support",
      );
    }
  };

  const initializeAR = async () => {
    if (!canvasRef.current) {
      console.error("Canvas still not available!");
      return;
    }

    try {
      console.log("1. Creating session manager...");
      const manager = new WebXRSessionManager();
      sessionManagerRef.current = manager;

      console.log("2. Starting AR session...");
      await manager.startSession(canvasRef.current);

      console.log("AR session started!");
      setIsActive(true);

      // Start render loop
      startRenderLoop(manager);
    } catch (err) {
      console.error("AR initialization failed:", err);
      setError(err instanceof Error ? err.message : "Failed to start AR");
      setShouldStartAR(false);
    }
  };

  // Stop AR session
  const handleStop = async () => {
    if (sessionManagerRef.current) {
      await sessionManagerRef.current.endSession();
      sessionManagerRef.current = null;
    }

    if (animationFrameRef.current) {
      // Animation frame will stop when session ends
      animationFrameRef.current = 0;
    }

    setIsActive(false);
    setAnchors([]);
    setCurrentHitPosition(null);
    setIsHitting(false);

    if (onClose) {
      onClose();
    }
  };

  // Render loop - runs every frame
  const startRenderLoop = (manager: WebXRSessionManager) => {
    const onFrame = (time: number, frame: XRFrame) => {
      try {
        // Get hit test results (where user is pointing)
        const hitResults = manager.getHitTestResults(frame);

        if (hitResults.length > 0) {
          // Get position of first hit
          const position = manager.getPositionFromHit(hitResults[0], frame);

          if (position) {
            setCurrentHitPosition(position);
            setIsHitting(true);
          } else {
            setIsHitting(false);
          }
        } else {
          setIsHitting(false);
        }

        // Continue render loop if session is active
        if (manager.isActive()) {
          animationFrameRef.current = manager.requestAnimationFrame(onFrame);
        }
      } catch (err) {
        console.error("Frame error:", err);
      }
    };

    animationFrameRef.current = manager.requestAnimationFrame(onFrame);
  };

  // Handle screen tap to place point
  const handleTap = () => {
    if (!currentHitPosition || !isHitting) {
      console.log("No valid hit position");
      return;
    }

    // Create anchor at current hit position
    const newAnchor = createAnchor(currentHitPosition);
    const updatedAnchors = [...anchors, newAnchor];
    setAnchors(updatedAnchors);

    console.log(`Placed anchor ${updatedAnchors.length}:`, currentHitPosition);

    // If we have 2 anchors, create measurement
    if (updatedAnchors.length === 2) {
      const measurement = createARMeasurement(
        updatedAnchors[0],
        updatedAnchors[1],
      );

      setMeasurements([...measurements, measurement]);
      setAnchors([]); // Reset for next measurement

      console.log("Measured:", formatARMeasurement(measurement));

      // Call completion callback
      if (onComplete) {
        onComplete(measurement.distanceCm);
      }
    }
  };

  // Clear all measurements
  const handleClear = () => {
    setAnchors([]);
    setMeasurements([]);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black">
      {!shouldStartAR ? (
        // START SCREEN (before AR initiated)
        <div className="flex flex-col items-center justify-center min-h-screen p-8">
          <Camera size={64} className="mb-6 text-blue-500" />
          <h2 className="text-2xl font-bold text-white mb-2">AR Measurement</h2>
          <p className="text-gray-400 text-center mb-6 max-w-md">
            Use your device's AR to measure real-world distances with high
            accuracy.
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-lg max-w-md">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <div className="flex gap-3">
            {onClose && (
              <button
                onClick={onClose}
                className="px-6 py-3 bg-gray-600 text-white font-bold rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            )}
            <button
              onClick={handleStartClick}
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold rounded-lg hover:shadow-lg transition-all"
            >
              Start AR
            </button>
          </div>

          <div className="mt-8 p-4 bg-white/5 rounded-lg max-w-md">
            <h3 className="text-white font-bold mb-2 text-sm">Requirements:</h3>
            <ul className="text-gray-400 text-xs space-y-1">
              <li>✓ Android 7.0 or higher</li>
              <li>✓ Chrome or Edge browser</li>
              <li>✓ ARCore installed</li>
              <li>✓ HTTPS connection</li>
            </ul>
          </div>
        </div>
      ) : !isActive ? (
        // LOADING SCREEN (AR session initializing)
        <div className="flex flex-col items-center justify-center min-h-screen p-8">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mb-4" />
          <p className="text-white text-lg font-medium">Starting AR...</p>
          <p className="text-gray-400 text-sm mt-2">Please wait</p>
        </div>
      ) : (
        // AR VIEW (session active)
        <div className="relative w-full h-full">
          {/* WebXR Canvas */}
          <canvas
            ref={canvasRef}
            onClick={handleTap}
            className="absolute inset-0 w-full h-full"
            style={{ touchAction: "none" }}
          />

          {/* UI Overlay */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Top Bar */}
            <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-auto">
              <div className="bg-black/70 backdrop-blur-sm rounded-lg px-4 py-2">
                <div className="flex items-center gap-2">
                  {isHitting ? (
                    <>
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-white text-sm font-medium">
                        Surface Detected
                      </span>
                    </>
                  ) : (
                    <>
                      <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
                      <span className="text-white text-sm font-medium">
                        Searching for surface...
                      </span>
                    </>
                  )}
                </div>
              </div>

              <button
                onClick={handleStop}
                className="bg-red-500 p-3 rounded-lg hover:bg-red-600 transition-colors"
              >
                <X size={24} className="text-white" />
              </button>
            </div>

            {/* Center Reticle */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div
                className={`w-12 h-12 rounded-full border-4 transition-all ${
                  isHitting
                    ? "border-green-500 bg-green-500/20 animate-pulse"
                    : "border-gray-500 bg-gray-500/10"
                }`}
              >
                <Target className="w-full h-full p-2 text-white" />
              </div>
            </div>

            {/* Bottom Instructions & Measurements */}
            <div className="absolute bottom-4 left-4 right-4 pointer-events-auto">
              <div className="bg-black/80 backdrop-blur-sm rounded-xl p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      anchors.length === 0 ? "bg-blue-500" : "bg-purple-500"
                    } animate-pulse`}
                  />
                  <p className="text-white font-medium">
                    {anchors.length === 0
                      ? "Point at surface and tap to place first point"
                      : "Move and tap to place second point"}
                  </p>
                </div>

                {anchors.length > 0 && (
                  <div className="mb-3 p-2 bg-purple-500/20 border border-purple-500/30 rounded-lg">
                    <p className="text-purple-300 text-sm">
                      ✓ Point {anchors.length} placed
                    </p>
                  </div>
                )}

                {measurements.length > 0 && (
                  <div className="pt-3 border-t border-white/20">
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-gray-400 text-sm">Measurements:</p>
                      <button
                        onClick={handleClear}
                        className="text-xs text-red-400 hover:text-red-300"
                      >
                        Clear All
                      </button>
                    </div>
                    {measurements
                      .slice(-3)
                      .reverse()
                      .map((m) => (
                        <div
                          key={m.id}
                          className="flex items-center gap-2 mb-2"
                        >
                          <Zap size={16} className="text-green-500" />
                          <span className="text-white font-bold">
                            {formatARMeasurement(m, "cm")}
                          </span>
                          <span className="text-gray-400 text-sm">
                            ({formatARMeasurement(m, "in")})
                          </span>
                        </div>
                      ))}
                  </div>
                )}

                {currentHitPosition && (
                  <div className="mt-2 pt-2 border-t border-white/10">
                    <p className="text-gray-500 text-xs font-mono">
                      Hit: ({currentHitPosition.x.toFixed(2)},{" "}
                      {currentHitPosition.y.toFixed(2)},{" "}
                      {currentHitPosition.z.toFixed(2)})
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
