const video = document.getElementById("video");
const startBtn = document.getElementById("startBtn");
const statusText = document.getElementById("status");

let detector;

async function setupCamera() {
  const stream = await navigator.mediaDevices.getUserMedia({
    video: {
      width: 640,
      height: 480
    }
  });

  video.srcObject = stream;

  return new Promise((resolve) => {
    video.onloadedmetadata = () => {
      resolve(video);
    };
  });
}

async function loadModel() {
  statusText.innerText = "Loading AI model...";
  detector = await faceLandmarksDetection.createDetector(
    faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh,
    {
      runtime: "mediapipe",
      solutionPath: "https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh"
    }
  );
  statusText.innerText = "Model Loaded ✅";
}

async function detectFace() {
  const faces = await detector.estimateFaces(video);

  if (faces.length > 0) {
    statusText.innerText = "Face Detected 😊";
  } else {
    statusText.innerText = "No Face Detected";
  }

  requestAnimationFrame(detectFace);
}

startBtn.onclick = async () => {
  await setupCamera();
  await loadModel();
  detectFace();
};