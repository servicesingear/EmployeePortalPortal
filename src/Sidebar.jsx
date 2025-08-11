
import React from 'react';
import './Sidebar.css';
import {
  FaTachometerAlt, FaCalendarAlt, FaClock, FaMoneyCheckAlt, FaChalkboardTeacher,
  FaPlane, FaUser, FaEdit, FaCheckCircle, FaUsers, FaChartLine, FaProjectDiagram
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ activePage, setActivePage, isVisible, role }) => {
  const navigate = useNavigate();

  const employeeItems = [
    { name: 'Dashboard', label: 'Dashboard', icon: <FaTachometerAlt /> },
    { name: 'Leave', label: 'Leave', icon: <FaCalendarAlt /> },
    { name: 'Attendance', label: 'Attendance', icon: <FaClock /> },
    { name: 'Payslip', label: 'Payslip', icon: <FaMoneyCheckAlt /> },
    { name: 'Training', label: 'Training', icon: <FaChalkboardTeacher /> },
    { name: 'Travel', label: 'Travel', icon: <FaPlane /> },
    { name: 'Profile', label: 'Profile', icon: <FaUser /> },
    { name: 'UpdateRequest', label: 'Update Request', icon: <FaEdit /> }
  ];

  const managerItems = [
    { name: 'Approvals', label: 'Approvals', icon: <FaCheckCircle /> },
    { name: 'TeamDashboard', label: 'Team Dashboard', icon: <FaUsers /> },
    { name: 'Performance', label: 'Performance', icon: <FaChartLine /> },
    { name: 'ProjectAssign', label: 'Project Assign', icon: <FaProjectDiagram /> }
  ];

  const handleClick = (name) => {
    setActivePage(name);
    navigate(`/${name.toLowerCase()}`);
  };

  return (
    <div className={`sidebar ${isVisible ? 'show' : 'hide'}`}>
      <div className="menu-box">
        {employeeItems.map((item, i) => (
          <div
            key={i}
            className={`menu-item ${activePage === item.name ? 'active' : ''}`}
            onClick={() => handleClick(item.name)}
          >
            <span className="icon">{item.icon}</span>
            <span className="label">{item.label}</span>
          </div>
        ))}
      </div>

      {role === "manager" && (
        <div className="menu-box">
          <div className="section-title">Manager Features</div>
          {managerItems.map((item, i) => (
            <div
              key={i}
              className={`menu-item ${activePage === item.name ? 'active' : ''}`}
              onClick={() => handleClick(item.name)}
            >
              <span className="icon">{item.icon}</span>
              <span className="label">{item.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Sidebar;

