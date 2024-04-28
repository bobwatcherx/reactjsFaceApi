import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import * as faceapi from "face-api.js";

const CameraComponent = () => {
  const webcamRef = useRef(null);
  const [isCameraOn, setIsCameraOn] = useState(false);

  useEffect(() => {
    const loadModels = async () => {
      await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
      await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
      await faceapi.nets.faceRecognitionNet.loadFromUri("/models");
      startCamera();
    };
    loadModels();
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      webcamRef.current.video.srcObject = stream;
      setIsCameraOn(true);
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  const handleDetectFaces = async () => {
    if (isCameraOn) {
      const video = webcamRef.current.video;
      const detections = await faceapi
        .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptors();
      console.log(detections);
    } else {
      console.error("Camera is not active");
    }
  };

  const handleTakeScreenshot = () => {
    if (isCameraOn) {
      const screenshot = webcamRef.current.getScreenshot();
      console.log(screenshot);
    } else {
      console.error("Camera is not active");
    }
  };

  return (
    <div>
      {isCameraOn ? (
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          width={640}
          height={480}
        />
      ) : (
        <p>Camera is not active</p>
      )}
      <button onClick={handleDetectFaces} disabled={!isCameraOn}>
        Detect Faces
      </button>
      <button onClick={handleTakeScreenshot} disabled={!isCameraOn}>
        Take Screenshot
      </button>
    </div>
  );
};

export default CameraComponent;
