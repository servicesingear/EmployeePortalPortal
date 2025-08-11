import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';

function Login({ onLogin }) {
  const videoRef = useRef(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('Please look into the camera...');
  const [faceMatcher, setFaceMatcher] = useState(null);

  useEffect(() => {
    const loadModelsAndFace = async () => {
      const MODEL_URL = process.env.PUBLIC_URL + '/models';
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
      ]);

      const image = await faceapi.fetchImage('/known-faces/ruthu.jpg');
      const detection = await faceapi
        .detectSingleFace(image)
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!detection) {
        setMessage('❌ Known face not detected');
        return;
      }

      const matcher = new faceapi.FaceMatcher(
        new faceapi.LabeledFaceDescriptors('Ruthu', [detection.descriptor])
      );
      setFaceMatcher(matcher);
      startVideo();
    };

    loadModelsAndFace();
  }, []);

  const startVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        videoRef.current.srcObject = stream;
      })
      .catch((err) => {
        setMessage('❌ Allow camera access to continue');
      });
  };

  const handleLogin = async () => {
    if (!username || !password) {
      setMessage('❌ Enter username and password');
      return;
    }

    if (username !== 'Ruthu' || password !== '1234') {
      setMessage('❌ Invalid credentials');
      return;
    }

    const result = await faceapi
      .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!result) {
      setMessage('❌ Face not detected on webcam');
      return;
    }

    const match = faceMatcher.findBestMatch(result.descriptor);
    console.log('Match result:', match);

    if (match.label === 'Ruthu') {
      setMessage('✅ Face matched. Logging in...');
      onLogin(username);
    } else {
      setMessage('❌ Face does not match');
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '30px' }}>
      <h2>Login with Face + Credentials</h2>
      <input
        type="text"
        placeholder="Enter Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={{ padding: '8px', margin: '5px' }}
      />
      <br />
      <input
        type="password"
        placeholder="Enter Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ padding: '8px', margin: '5px' }}
      />
      <br />
      <video
        ref={videoRef}
        width="400"
        height="300"
        autoPlay
        muted
        style={{ marginTop: '10px', borderRadius: '10px' }}
      />
      <br />
      <button onClick={handleLogin} style={{ padding: '10px', marginTop: '10px' }}>
        Login
      </button>
      <p>{message}</p>
    </div>
  );
}

export default Login;
