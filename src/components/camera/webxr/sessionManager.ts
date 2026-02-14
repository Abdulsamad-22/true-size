import { Point3D, DetectedPlane } from "@/src/types";

export class WebXRSessionManager {
  private session: XRSession | null = null;
  private referenceSpace: XRReferenceSpace | null = null;
  private hitTestSource: XRHitTestSource | null = null;
  private canvas: HTMLCanvasElement | null = null;
  private gl: WebGLRenderingContext | null = null;

  // Start AR session

  async startSession(canvas: HTMLCanvasElement): Promise<void> {
    if (!navigator.xr) {
      throw new Error("WebXR not supported");
    }

    this.canvas = canvas;

    // Create WebGL context
    this.gl = canvas.getContext("webgl", {
      xrCompatible: true,
    });

    if (!this.gl) {
      throw new Error("WebGL not supported");
    }

    try {
      // Request AR session
      this.session = await navigator.xr.requestSession("immersive-ar", {
        requiredFeatures: ["hit-test"],
        optionalFeatures: ["dom-overlay", "plane-detection"],
      });

      // Session end handler
      this.session.addEventListener("end", () => {
        this.cleanup();
      });

      // Get reference space (coordinate system)
      this.referenceSpace = await this.session.requestReferenceSpace("local");

      // Set up hit testing (detecting surfaces)
      try {
        const viewerSpace = await this.session.requestReferenceSpace("viewer");

        // Type assertion - tell TypeScript this method exists
        const hitTestSource = await (this.session as any).requestHitTestSource({
          space: viewerSpace,
        });

        this.hitTestSource = hitTestSource || null;
        console.log("Hit test source initialized");
      } catch (error) {
        console.warn("Hit test not supported:", error);
        this.hitTestSource = null;
      }

      // Configure WebGL layer
      const layer = new XRWebGLLayer(this.session, this.gl);
      await this.session.updateRenderState({
        baseLayer: layer,
      });

      console.log("AR session started");
    } catch (error) {
      console.error("Failed to start AR session:", error);
      this.cleanup();
      throw error;
    }
  }

  // End AR session

  async endSession(): Promise<void> {
    if (this.session) {
      try {
        await this.session.end();
      } catch (error) {
        console.error("Error ending session:", error);
      }
    }
    this.cleanup();
  }

  // Cleanup resources

  private cleanup(): void {
    this.session = null;
    this.referenceSpace = null;
    this.hitTestSource = null;
    this.gl = null;
    console.log("AR session cleaned up");
  }

  // Get hit test results (where user is pointing)

  getHitTestResults(frame: XRFrame): XRHitTestResult[] {
    if (!this.hitTestSource) {
      return [];
    }

    try {
      return frame.getHitTestResults(this.hitTestSource);
    } catch (error) {
      console.warn("Hit test failed:", error);
      return [];
    }
  }

  // Get 3D position from hit test result

  getPositionFromHit(hit: XRHitTestResult, frame: XRFrame): Point3D | null {
    if (!this.referenceSpace) return null;

    try {
      const pose = hit.getPose(this.referenceSpace);
      if (!pose) return null;

      const position = pose.transform.position;

      return {
        x: position.x,
        y: position.y,
        z: position.z,
      };
    } catch (error) {
      console.warn("Failed to get position from hit:", error);
      return null;
    }
  }

  // Get detected planes in current frame

  getDetectedPlanes(frame: XRFrame): XRPlane[] {
    if (!frame.detectedPlanes) {
      return [];
    }

    try {
      return Array.from(frame.detectedPlanes);
    } catch (error) {
      console.warn("Plane detection failed:", error);
      return [];
    }
  }

  // Convert XRPlane to our DetectedPlane format

  convertPlane(xrPlane: XRPlane, frame: XRFrame): DetectedPlane | null {
    if (!this.referenceSpace) return null;

    try {
      const pose = frame.getPose(xrPlane.planeSpace, this.referenceSpace);
      if (!pose) return null;

      // Get polygon points (corners of detected plane)
      const polygon: Point3D[] = Array.from(xrPlane.polygon).map((point) => ({
        x: point.x,
        y: point.y,
        z: point.z || 0, // Some implementations might not have z
      }));

      // Calculate center
      const center: Point3D = {
        x: pose.transform.position.x,
        y: pose.transform.position.y,
        z: pose.transform.position.z,
      };

      // Calculate dimensions
      const { width, height } = this.calculatePlaneDimensions(polygon);

      // Determine orientation
      const orientation =
        xrPlane.orientation === "horizontal" ? "horizontal" : "vertical";

      return {
        id: `plane-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        polygon,
        center,
        width,
        height,
        orientation,
        timestamp: new Date(),
      };
    } catch (error) {
      console.warn("Failed to convert plane:", error);
      return null;
    }
  }

  // Calculate plane dimensions from polygon

  private calculatePlaneDimensions(polygon: Point3D[]): {
    width: number;
    height: number;
  } {
    if (polygon.length < 3) return { width: 0, height: 0 };

    let minX = Infinity,
      maxX = -Infinity;
    let minZ = Infinity,
      maxZ = -Infinity;

    polygon.forEach((point) => {
      minX = Math.min(minX, point.x);
      maxX = Math.max(maxX, point.x);
      minZ = Math.min(minZ, point.z);
      maxZ = Math.max(maxZ, point.z);
    });

    return {
      width: Math.abs(maxX - minX),
      height: Math.abs(maxZ - minZ),
    };
  }

  // Request animation frame for rendering

  requestAnimationFrame(callback: XRFrameRequestCallback): number {
    if (!this.session) {
      console.warn("Cannot request animation frame: no active session");
      return 0;
    }
    return this.session.requestAnimationFrame(callback);
  }

  // Get reference space

  getReferenceSpace(): XRReferenceSpace | null {
    return this.referenceSpace;
  }

  getSession(): XRSession | null {
    return this.session;
  }

  isActive(): boolean {
    return this.session !== null;
  }
}
