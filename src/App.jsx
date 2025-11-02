import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import * as faceapi from 'face-api.js';

import CustomNavbar from './components/CustomNavbar';
import Sidebar from './components/Sidebar';

// Employee Pages
import Dashboard from './Dashboard';
import Leave from './Leave';
import Attendance from '/Attendance';
import Payslip from './Payslip';
import Training from './Training';
import Travel from './Travel';
import Profile from './Profile';
import UpdateRequest from './UpdateRequest';
import RemoteRequest from './RemoteRequest';
import Holidays from './Holidays';

// Manager Pages
import Approvals from './Approvals';
import TeamDashboard from './TeamDashboard';
import Performance from './Performance';
import ProjectAssign from './ProjectAssign';
import ManagerPerformance from './Managerperformance';

// Auth Pages
import Login from './Login';
import FaceRegister from './FaceRegister';

function App() {
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [loggedInUser, setLoggedInUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const handleToggleSidebar = () => {
    setIsSidebarVisible(prev => !prev);
  };

  const handleLogin = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setLoggedInUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setLoggedInUser(null);
  };

  const role = loggedInUser?.role;

  // Load Face API Models
  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = process.env.PUBLIC_URL + '/models';
      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(`${MODEL_URL}/tiny_face_detector`),
          faceapi.nets.faceLandmark68Net.loadFromUri(`${MODEL_URL}/face_landmark_68`),
          faceapi.nets.faceRecognitionNet.loadFromUri(`${MODEL_URL}/face_recognition`),
        ]);
        console.log('✅ Face API models loaded');
      } catch (err) {
        console.error('❌ Error loading FaceAPI models:', err);
      }
    };
    loadModels();
  }, []);

  return (
    <div className="app">
      <Router>
        {loggedInUser && (
          <CustomNavbar
            toggleSidebar={handleToggleSidebar}
            onLogout={handleLogout}
            loggedInUser={loggedInUser}
          />
        )}

        <div className="main-content">
          {loggedInUser && <Sidebar isVisible={isSidebarVisible} role={role} />}
          
          <div className="content-area">
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login onLogin={handleLogin} />} />
              <Route path="/register-face" element={<FaceRegister />} />

              {/* Protected Routes */}
              {loggedInUser ? (
                <>
                  <Route path="/" element={<Navigate to="/dashboard" />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/leave" element={<Leave />} />
                  <Route path="/attendance" element={<Attendance />} />
                  <Route path ="/holidays" element={<Holidays />} />
                  <Route path="/payslip" element={<Payslip />} />
                  <Route path="/training" element={<Training />} />
                  <Route path="/travel" element={<Travel />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/update-request" element={<UpdateRequest />} />
                  <Route path="/remote-request" element={<RemoteRequest />} />

                  {/* Only Manager Routes */}
                  {role === 'manager' && (
                    <>
                      <Route path="/approvals" element={<Approvals />} />
                      <Route path="/team-dashboard" element={<TeamDashboard />} />
                      <Route path="/performance" element={<Performance />} />
                      <Route path="/project-assign" element={<ProjectAssign />} />
                      <Route path="/manager/reviews" element={<ManagerPerformance />} />
                    </>
                  )}

                  {/* Redirect unauthorized employee trying to access manager pages */}
                  {role !== 'manager' && (
                    <>
                      <Route path="/approvals" element={<Navigate to="/dashboard" />} />
                      <Route path="/team-dashboard" element={<Navigate to="/dashboard" />} />
                      <Route path="/performance" element={<Navigate to="/dashboard" />} />
                      <Route path="/project-assign" element={<Navigate to="/dashboard" />} />
                      <Route path="/manager/reviews" element={<Navigate to="/dashboard" />} />
                    </>
                  )}
                </>
              ) : (
                <Route path="*" element={<Navigate to="/login" />} />
              )}
            </Routes>
          </div>
        </div>
      </Router>
    </div>
  );
}

export default App;
