import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import './App.css';
import CustomNavbar from './CustomNavbar';
import Sidebar from './Sidebar';

import Dashboard from './Dashboard';
import Leave from './Leave';
import Attendance from './Attendance';
import Payslip from './Payslip';
import Training from './Training';
import Travel from './Travel';
import Profile from './Profile';
import UpdateRequest from './UpdateRequest';
import Approvals from './Approvals';
import TeamDashboard from './TeamDashboard';
import Performance from './Performance';
import ProjectAssign from './ProjectAssign';
import LoginForm from './LoginForm';

const AppContent = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [activePage, setActivePage] = useState('Dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [loggedInUser, setLoggedInUser] = useState(localStorage.getItem("loggedInUser") || null);
  const [role, setRole] = useState(localStorage.getItem("role") || null);

  useEffect(() => {
    const pathToPage = {
      '/': 'Dashboard',
      '/dashboard': 'Dashboard',
      '/leave': 'Leave',
      '/attendance': 'Attendance',
      '/payslip': 'Payslip',
      '/training': 'Training',
      '/travel': 'Travel',
      '/profile': 'Profile',
      '/update-request': 'UpdateRequest',
      '/approvals': 'Approvals',
      '/team-dashboard': 'TeamDashboard',
      '/performance': 'Performance',
      '/project-assign': 'ProjectAssign',
      '/login': 'Login'
    };
    const currentPage = pathToPage[location.pathname] || 'Dashboard';
    setActivePage(currentPage);
  }, [location]);

  const handleLogin = (username, role) => {
    setLoggedInUser(username);
    setRole(role);
    localStorage.setItem("loggedInUser", username);
    localStorage.setItem("role", role);
    navigate("/dashboard");
  };

  const handleLogout = () => {
    setLoggedInUser(null);
    setRole(null);
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("role");
    navigate("/login");
  };

  const pageComponents = {
    Dashboard: <Dashboard />,
    Leave: <Leave />,
    Attendance: <Attendance />,
    Payslip: <Payslip />,
    Training: <Training />,
    Travel: <Travel />,
    Profile: <Profile />,
    UpdateRequest: <UpdateRequest />,
    Approvals: <Approvals />,
    TeamDashboard: <TeamDashboard />,
    Performance: <Performance />,
    ProjectAssign: <ProjectAssign />
  };
const hideNavbar = location.pathname === "/login";
  return (
    <div className="app">
       {!hideNavbar && (
         <CustomNavbar
           toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
           loggedInUser={loggedInUser}
           onLogout={handleLogout}
         />
       )}
      <div className="main-content">
        {activePage !== 'Login' && (
          <Sidebar 
            activePage={activePage} 
            setActivePage={setActivePage} 
            isVisible={isSidebarOpen} 
            role={role} 
          />
        )}
        <div className="content-area">
          <Routes>
            <Route path="/login" element={<LoginForm onLogin={handleLogin} />} />
            {Object.keys(pageComponents).map((page) => (
              page !== "Login" && (
                <Route 
                  key={page} 
                  path={`/${page.toLowerCase()}`} 
                  element={pageComponents[page]} 
                />
              )
            ))}
            <Route path="/" element={<Dashboard />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};


function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
