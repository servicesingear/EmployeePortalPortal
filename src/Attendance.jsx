import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaClock, FaCalendarAlt, FaLaptop, FaUserClock,
  FaChartLine, FaCalendarPlus, FaCheckCircle,
  FaTimesCircle, FaInfoCircle, FaSyncAlt,
  FaChevronDown, FaChevronUp, FaBell
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useSwipeable } from 'react-swipeable';
import './Attendance.css';

const Attendance = () => {
  const navigate = useNavigate();
  const [shiftMessage, setShiftMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [attendanceData, setAttendanceData] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [showRemoteModal, setShowRemoteModal] = useState(false);
  const [remoteRequest, setRemoteRequest] = useState({
    date: '',
    reason: '',
    duration: 'full-day'
  });
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedCard, setExpandedCard] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Swipe handlers for mobile
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => setActiveTab('logs'),
    onSwipedRight: () => setActiveTab('overview'),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true
  });

  // Simulate data fetching with more realistic data
  useEffect(() => {
    const fetchData = async () => {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const today = new Date();
      const recentLogs = [];
      
      // Generate 15 days of attendance data
      for (let i = 0; i < 15; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        
        const isWeekend = date.getDay() === 0 || date.getDay() === 6;
        const isLate = Math.random() > 0.7;
        const isRemote = Math.random() > 0.8 && !isWeekend;
        
        const log = {
          date: date.toISOString().split('T')[0],
          checkIn: isWeekend ? '--' : 
                   isLate ? `09:${Math.floor(15 + Math.random() * 45)}` : 
                   `08:${Math.floor(45 + Math.random() * 15)}`,
          checkOut: isWeekend ? '--' : `17:${Math.floor(30 + Math.random() * 30)}`,
          status: isWeekend ? 'Weekend' : 
                 isLate ? 'Late' : 
                 isRemote ? 'Remote' : 'On-time',
          overtime: isWeekend ? 0 : Math.random() > 0.7 ? (0.5 + Math.random() * 2).toFixed(1) : 0
        };
        
        recentLogs.push(log);
      }

      const data = {
        currentMonth: {
          attendanceRate: 96,
          lateArrivals: 2,
          remoteDays: 8,
          overtimeHours: 12.5,
          targetAttendance: 95,
          averageHours: 8.2
        },
        recentLogs,
        upcomingHolidays: [
          { date: '2023-07-04', name: 'Independence Day' },
          { date: '2023-09-04', name: 'Labor Day' }
        ],
        teamStats: {
          averageAttendance: 94,
          topPerformer: 'John D.',
          mostRemote: 'Sarah M.'
        }
      };
      
      setAttendanceData(data);
      setIsLoading(false);

      // Simulate notifications
      setTimeout(() => {
        setNotifications([
          { id: 1, message: 'Your late arrival on June 14 has been noted', type: 'warning', read: false },
          { id: 2, message: 'Remote work request for June 20 approved', type: 'success', read: false },
          { id: 3, message: 'Team attendance target achieved for May', type: 'info', read: true }
        ]);
      }, 1200);
    };

    fetchData();

    // Set up real-time updates
    const interval = setInterval(() => {
      setAttendanceData(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          currentMonth: {
            ...prev.currentMonth,
            attendanceRate: Math.min(100, prev.currentMonth.attendanceRate + (Math.random() > 0.5 ? 0.1 : -0.1))
          }
        };
      });
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleRemoteRequest = () => {
    setShowRemoteModal(true);
    setRemoteRequest({
      ...remoteRequest,
      date: new Date().toISOString().split('T')[0]
    });
  };

  const submitRemoteRequest = (e) => {
    e.preventDefault();
    // Simulate API call
    setTimeout(() => {
      setShiftMessage(`Remote work requested for ${new Date(remoteRequest.date).toLocaleDateString()}`);
      setShowRemoteModal(false);
      
      // Add to notifications
      const newNotification = {
        id: Date.now(),
        message: `Remote request submitted for ${remoteRequest.date}`,
        type: 'info',
        read: false
      };
      setNotifications(prev => [newNotification, ...prev]);
      
      setTimeout(() => setShiftMessage(''), 3000);
    }, 800);
  };

  const handleShiftRequest = (shiftType) => {
    // Simulate API call
    setIsLoading(true);
    setTimeout(() => {
      setShiftMessage(`${shiftType} shift requested successfully.`);
      setIsLoading(false);
      
      // Add to notifications
      const newNotification = {
        id: Date.now(),
        message: `${shiftType} shift approved`,
        type: 'success',
        read: false
      };
      setNotifications(prev => [newNotification, ...prev]);
      
      setTimeout(() => setShiftMessage(''), 3000);
    }, 800);
  };

  const markNotificationAsRead = (id) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? {...n, read: true} : n
    ));
  };

  const renderStatusBadge = (status) => {
    const statusClass = status.toLowerCase().replace('-', '');
    const icons = {
      'on-time': <FaCheckCircle className="status-icon" />,
      'late': <FaTimesCircle className="status-icon" />,
      'remote': <FaLaptop className="status-icon" />,
      'weekend': <FaCalendarAlt className="status-icon" />,
      'default': <FaInfoCircle className="status-icon" />
    };
    
    const icon = icons[statusClass] || icons['default'];
    
    return (
      <span className={`status ${statusClass}`}>
        {icon} {status}
      </span>
    );
  };

  const toggleCardExpand = (cardId) => {
    setExpandedCard(expandedCard === cardId ? null : cardId);
  };

  if (isLoading || !attendanceData) {
    return (
      <motion.div 
        className="attendance-page loading"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          animate={{ 
            rotate: 360,
            transition: { repeat: Infinity, duration: 1, ease: "linear" } 
          }}
        >
          <FaSyncAlt className="loading-icon" />
        </motion.div>
        <p>Loading your attendance data...</p>
      </motion.div>
    );
  }

  return (
    <div className="attendance-page" {...swipeHandlers}>
      {/* Header with Notifications */}
      <motion.div 
        className="dashboard-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="header-content">
          <h1><FaUserClock className="header-icon" /> Attendance Dashboard</h1>
          <div className="notification-bell-container">
            <button 
              className="notification-bell"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <FaBell />
              {notifications.some(n => !n.read) && (
                <span className="notification-badge"></span>
              )}
            </button>
            
            <AnimatePresence>
              {showNotifications && (
                <motion.div 
                  className="notification-dropdown"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  {notifications.length > 0 ? (
                    notifications.map(notification => (
                      <div 
                        key={notification.id} 
                        className={`notification-item ${notification.type} ${notification.read ? 'read' : ''}`}
                        onClick={() => markNotificationAsRead(notification.id)}
                      >
                        <div className="notification-message">{notification.message}</div>
                        <div className="notification-time">2h ago</div>
                      </div>
                    ))
                  ) : (
                    <div className="notification-empty">No new notifications</div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="dashboard-tabs">
          <button 
            className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`tab-btn ${activeTab === 'logs' ? 'active' : ''}`}
            onClick={() => setActiveTab('logs')}
          >
            Time Logs
          </button>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="dashboard-content">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' ? (
            <motion.div
              key="overview"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="tab-content"
            >
              {/* Overview Tab Content */}
              <div className="attendance-grid">
                {/* Performance Summary Card */}
                <motion.div 
                  className={`attendance-card primary ${expandedCard === 'performance' ? 'expanded' : ''}`}
                  whileHover={{ scale: expandedCard ? 1 : 1.02 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  onClick={() => toggleCardExpand('performance')}
                >
                  <div className="card-header">
                    <FaChartLine className="card-icon" />
                    <h3>Monthly Performance</h3>
                    <button className="expand-toggle">
                      {expandedCard === 'performance' ? <FaChevronUp /> : <FaChevronDown />}
                    </button>
                  </div>
                  
                  <div className="card-content">
                    <div className="metrics-row">
                      <div className="metric">
                        <span className="value">{attendanceData.currentMonth.attendanceRate}%</span>
                        <span className="label">Attendance Rate</span>
                        <div className="progress-bar">
                          <motion.div 
                            className="progress-fill"
                            initial={{ width: 0 }}
                            animate={{ 
                              width: `${(attendanceData.currentMonth.attendanceRate / attendanceData.currentMonth.targetAttendance) * 100}%`,
                              backgroundColor: attendanceData.currentMonth.attendanceRate >= attendanceData.currentMonth.targetAttendance 
                                ? '#4CAF50' 
                                : '#FFC107'
                            }}
                            transition={{ duration: 1, ease: "easeOut" }}
                          />
                        </div>
                        <small>Target: {attendanceData.currentMonth.targetAttendance}%</small>
                      </div>
                      
                      <div className="metric">
                        <span className="value">{attendanceData.currentMonth.overtimeHours}h</span>
                        <span className="label">Overtime</span>
                        <div className="sparkline">
                          {[1, 2, 3, 4, 5].map((_, i) => (
                            <motion.div 
                              key={i}
                              className="sparkline-bar"
                              initial={{ height: 0 }}
                              animate={{ 
                                height: `${10 + Math.random() * 90}%`,
                                backgroundColor: attendanceData.currentMonth.overtimeHours > 10 
                                  ? '#FF5722' 
                                  : '#4CAF50'
                              }}
                              transition={{ delay: i * 0.1, duration: 0.5 }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    {expandedCard === 'performance' && (
                      <motion.div
                        className="expanded-content"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <div className="metrics-row">
                          <div className="metric">
                            <span className="value">{attendanceData.currentMonth.lateArrivals}</span>
                            <span className="label">Late Arrivals</span>
                          </div>
                          <div className="metric">
                            <span className="value">{attendanceData.currentMonth.remoteDays}</span>
                            <span className="label">Remote Days</span>
                          </div>
                          <div className="metric">
                            <span className="value">{attendanceData.currentMonth.averageHours}h</span>
                            <span className="label">Avg. Daily Hours</span>
                          </div>
                        </div>
                        
                        {attendanceData.teamStats && (
                          <div className="team-comparison">
                            <h4>Team Comparison</h4>
                            <div className="comparison-metric">
                              <label>Team Average:</label>
                              <span>{attendanceData.teamStats.averageAttendance}%</span>
                            </div>
                            <div className="comparison-metric">
                              <label>Top Performer:</label>
                              <span>{attendanceData.teamStats.topPerformer}</span>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </div>
                </motion.div>

                {/* Remote Work Card */}
                <motion.div 
                  className={`attendance-card ${expandedCard === 'remote' ? 'expanded' : ''}`}
                  whileHover={{ scale: expandedCard ? 1 : 1.02 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  onClick={() => toggleCardExpand('remote')}
                >
                  <div className="card-header">
                    <FaLaptop className="card-icon" />
                    <h3>Remote Work</h3>
                    <button className="expand-toggle">
                      {expandedCard === 'remote' ? <FaChevronUp /> : <FaChevronDown />}
                    </button>
                  </div>
                  <div className="card-content">
                    <p>Request remote work days for server maintenance or on-call support</p>
                    <motion.button 
                      className="action-btn" 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoteRequest();
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FaCalendarPlus /> Request Remote Day
                    </motion.button>
                    
                    {expandedCard === 'remote' && (
                      <motion.div
                        className="expanded-content"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <div className="remote-stats">
                          <div className="stat-item">
                            <span className="stat-value">{attendanceData.currentMonth.remoteDays}</span>
                            <span className="stat-label">Remote Days This Month</span>
                          </div>
                          <div className="stat-item">
                            <span className="stat-value">3</span>
                            <span className="stat-label">Remaining Allowance</span>
                          </div>
                        </div>
                        
                        {attendanceData.upcomingHolidays.length > 0 && (
                          <div className="holiday-notice">
                            <h4>Upcoming Holidays:</h4>
                            <ul>
                              {attendanceData.upcomingHolidays.map((holiday, index) => (
                                <motion.li 
                                  key={index}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: index * 0.1 }}
                                >
                                  {new Date(holiday.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {holiday.name}
                                </motion.li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </div>
                </motion.div>

                {/* Flex Time Card */}
                <motion.div 
                  className={`attendance-card ${expandedCard === 'flex' ? 'expanded' : ''}`}
                  whileHover={{ scale: expandedCard ? 1 : 1.02 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  onClick={() => toggleCardExpand('flex')}
                >
                  <div className="card-header">
                    <FaCalendarAlt className="card-icon" />
                    <h3>Flex Time</h3>
                    <button className="expand-toggle">
                      {expandedCard === 'flex' ? <FaChevronUp /> : <FaChevronDown />}
                    </button>
                  </div>
                  <div className="card-content">
                    <p>Choose a flexible work shift for today</p>
                    <div className="flex-options">
                      <motion.button
                        className="action-btn secondary"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleShiftRequest('Early');
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Early Shift
                      </motion.button>
                      <motion.button
                        className="action-btn secondary"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleShiftRequest('Late');
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Late Shift
                      </motion.button>
                    </div>
                    
                    {expandedCard === 'flex' && (
                      <motion.div
                        className="expanded-content"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <div className="shift-info">
                          <h4>Shift Details</h4>
                          <p><strong>Early Shift:</strong> 7:00 AM - 3:30 PM</p>
                          <p><strong>Late Shift:</strong> 10:00 AM - 6:30 PM</p>
                          <p className="shift-note">Flex shifts must be requested by 5:00 PM the previous day</p>
                        </div>
                      </motion.div>
                    )}
                    
                    <AnimatePresence>
                      {shiftMessage && (
                        <motion.p 
                          className="shift-message"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                        >
                          {shiftMessage}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="logs"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="tab-content"
            >
              {/* Logs Tab Content */}
              <div className="logs-container">
                <div className="logs-header">
                  <h3><FaClock /> Your Time Logs</h3>
                  <div className="date-filter">
                    <label htmlFor="log-date">Filter by Date:</label>
                    <input 
                      type="date" 
                      id="log-date" 
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      max={new Date().toISOString().split('T')[0]}
                    />
                    {selectedDate && (
                      <button 
                        className="clear-filter"
                        onClick={() => setSelectedDate('')}
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="table-container">
                  <table className="log-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Check-In</th>
                        <th>Check-Out</th>
                        <th>Overtime</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendanceData.recentLogs
                        .filter(log => !selectedDate || log.date === selectedDate)
                        .map((log, index) => (
                          <motion.tr 
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className={log.status === 'Late' ? 'late-row' : ''}
                          >
                            <td>
                              {new Date(log.date).toLocaleDateString('en-US', { 
                                weekday: 'short', 
                                month: 'short', 
                                day: 'numeric' 
                              })}
                            </td>
                            <td>{log.checkIn}</td>
                            <td>{log.checkOut}</td>
                            <td>{log.overtime > 0 ? `${log.overtime}h` : '-'}</td>
                            <td>{renderStatusBadge(log.status)}</td>
                          </motion.tr>
                        ))}
                    </tbody>
                  </table>
                </div>
                
                {attendanceData.recentLogs.filter(log => !selectedDate || log.date === selectedDate).length === 0 && (
                  <div className="no-results">
                    No records found for selected date
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Remote Work Modal */}
      <AnimatePresence>
        {showRemoteModal && (
          <motion.div 
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowRemoteModal(false)}
          >
            <motion.div 
              className="modal-content"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3><FaLaptop /> Request Remote Work</h3>
              <form onSubmit={submitRemoteRequest}>
                <div className="form-group">
                  <label htmlFor="remote-date">Date:</label>
                  <input 
                    type="date" 
                    id="remote-date" 
                    value={remoteRequest.date}
                    onChange={(e) => setRemoteRequest({...remoteRequest, date: e.target.value})}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="remote-reason">Reason:</label>
                  <textarea 
                    id="remote-reason" 
                    value={remoteRequest.reason}
                    onChange={(e) => setRemoteRequest({...remoteRequest, reason: e.target.value})}
                    placeholder="Briefly explain why you need to work remotely..."
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="remote-duration">Duration:</label>
                  <select 
                    id="remote-duration" 
                    value={remoteRequest.duration}
                    onChange={(e) => setRemoteRequest({...remoteRequest, duration: e.target.value})}
                  >
                    <option value="full-day">Full Day</option>
                    <option value="morning">Morning Only</option>
                    <option value="afternoon">Afternoon Only</option>
                  </select>
                </div>
                <div className="form-actions">
                  <motion.button 
                    type="button" 
                    className="cancel-btn"
                    onClick={() => setShowRemoteModal(false)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button 
                    type="submit" 
                    className="submit-btn"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Submit Request
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Attendance;