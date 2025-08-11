import React, { useRef, useEffect, useState } from "react";
import "./CustomNavbar.css";
import { FaBars, FaUserCircle, FaSignInAlt, FaSignOutAlt, FaHome } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const CustomNavbar = ({ toggleSidebar, loggedInUser, onLogout }) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownVisible(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = (e) => {
    e.preventDefault();
    setDropdownVisible((prev) => !prev);
  };

  return (
    <div className="navbar">
      <div className="left-section">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="hamburger-btn"
          onClick={toggleSidebar}
        >
          <FaBars />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate("/dashboard")}
        >
          <FaHome />
        </motion.button>
      </div>

      <div className="center-section">
        <h1>Employee Portal</h1>
      </div>

      <div className="right-section" ref={dropdownRef}>
        <motion.button
          className={`user-section ${dropdownVisible ? "active" : ""}`}
          onClick={toggleDropdown}
        >
          <FaUserCircle />
          <span>{loggedInUser || "Guest"}</span>
        </motion.button>

        <AnimatePresence>
          {dropdownVisible && (
            <motion.div
              className="dropdown-menu"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {loggedInUser ? (
                <button className="dropdown-item logout-btn" onClick={onLogout}>
                  <FaSignOutAlt /> Logout
                </button>
              ) : (
                <button className="dropdown-item" onClick={() => navigate("/login")}>
                  <FaSignInAlt /> Login
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CustomNavbar;
