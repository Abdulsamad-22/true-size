export async function requestCameraAccess(): Promise<MediaStream> {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: "environment",
        width: { ideal: 1920 },
        height: { ideal: 1080 },
      },
    });
    return stream;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Camera failed: ${error.message}`);
    }
    throw new Error("Camera access denied");
  }
}

export function stopCameraStream(stream: MediaStream | null): void {
  if (stream) {
    stream.getTracks().forEach((track) => track.stop());
  }
}

export function initializeVideo(
  videoElement: HTMLVideoElement,
  stream: MediaStream,
): Promise<void> {
  return new Promise((resolve, reject) => {
    videoElement.srcObject = stream;

    videoElement.onloadedmetadata = () => {
      videoElement
        .play()
        .then(() => resolve())
        .catch(reject);
    };
  });
}
