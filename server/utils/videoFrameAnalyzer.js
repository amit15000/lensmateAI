import cv from "opencv4nodejs";
import path from "path";

/**
 * Analyze extracted frames for motion and objects.
 */
export const analyzeFrameLocally = async (frames) => {
  let prevGray = null;
  const analysis = [];

  for (const framePath of frames) {
    const frame = cv.imread(framePath);
    const gray = frame.bgrToGray();

    // Motion detection via frame diff
    let motionScore = 0;
    if (prevGray) {
      const diff = gray.absdiff(prevGray);
      motionScore = diff.countNonZero();
    }
    prevGray = gray;

    // Simple object detection (faces as subjects)
    const classifier = new cv.CascadeClassifier(cv.HAAR_FRONTALFACE_ALT2);
    const faces = classifier.detectMultiScale(gray).objects.length;

    analysis.push({
      frame: path.basename(framePath),
      motion: motionScore,
      facesDetected: faces,
    });
  }

  return {
    avgMotion: analysis.reduce((sum, a) => sum + a.motion, 0) / analysis.length,
    totalFaces: analysis.reduce((sum, a) => sum + a.facesDetected, 0),
    frameDetails: analysis,
  };
};
