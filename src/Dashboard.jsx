import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaCalendarAlt, FaUserClock, FaFileInvoiceDollar,
  FaChalkboardTeacher, FaPlaneDeparture, FaUser,
  FaSyncAlt, FaCheckCircle, FaUsers, FaChartLine,
  FaProjectDiagram, FaTachometerAlt, FaEllipsisH,
  FaChevronRight,FaUmbrellaBeach
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import './Dashboard.css';

const Dashboard = ({ role = 'employee' }) => {
  const navigate = useNavigate();
  const [activeCard, setActiveCard] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [expandedCard, setExpandedCard] = useState(null);

  // Simulate data fetching
  useEffect(() => {
    const fetchData = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setStats({
        leaveDays: (3.2 + Math.random() * 0.4).toFixed(1),
        attendance: (95 + Math.random() * 2).toFixed(0),
        pendingRequests: Math.floor(Math.random() * 5)
      });
      setIsLoading(false);
    };

    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleCardClick = (path, title) => {
    setActiveCard(title);
    setTimeout(() => navigate(path), 300);
  };

  const handleQuickActionClick = (action, cardTitle, e) => {
    e.stopPropagation();
    e.preventDefault();
    
    const actionMap = {
      'Leave': {
        'Request Leave': '/leave/request',
        'View Balance': '/leave/balance'
      },
      'Attendance': {
        'View History': '/attendance/history',
        'Report Issue': '/attendance/report'
      },
      'Payslip': {
        'Download': '/payslip/download',
        'View History': '/payslip/history'
      },
      'Training': {
        'Browse Courses': '/training/courses',
        'My Progress': '/training/progress'
      },
      'Travel': {
        'New Request': '/travel/new',
        'Itinerary': '/travel/itinerary'
      },
      'Profile': {
        'Edit Profile': '/profile/edit',
        'Change Password': '/profile/password'
      },
      'Approvals': {
        'View All': '/approvals/all',
        'Process': '/approvals/process'
      },
      'Team Dashboard': {
        'Performance': '/team/performance',
        'Attendance': '/team/attendance'
      }
    };

    const path = actionMap[cardTitle]?.[action];
    if (path) {
      navigate(path);
    }
  };

  const toggleExpand = (title, e) => {
    e.stopPropagation();
    e.preventDefault();
    setExpandedCard(expandedCard === title ? null : title);
  };

  const features = {
    Task: [
      {
        title: 'Leave',
        icon: FaCalendarAlt,
        value: `${stats.leaveDays || '3.6'} Days Avg`,
        path: '/leave',
        highlight: false,
        iconClass: 'leave',
        description: 'Manage your leave requests and balance',
        quickActions: ['Request Leave', 'View Balance']
      },
      {
        title: 'Attendance',
        icon: FaUserClock,
        value: `${stats.attendance || '95'}% Present`,
        path: '/attendance',
        highlight: false,
        iconClass: 'attendance',
        description: 'View your attendance records',
        quickActions: ['View History', 'Report Issue']
      },
      // {
      //   title: 'Payslip',
      //   icon: FaFileInvoiceDollar,
      //   value: 'View Payslip',
      //   path: '/payslip',
      //   highlight: true,
      //   iconClass: 'payslip',
      //   description: 'Access salary details',
      //   quickActions: ['Download', 'View History']
      // },
      // {
      //   title: 'Training',
      //   icon: FaChalkboardTeacher,
      //   value: 'Email',
      //   path: '/training',
      //   highlight: true,
      //   iconClass: 'training',
      //   description: 'Explore training programs',
      //   quickActions: ['Browse Courses', 'My Progress']
      // },
      // {
      //   title: 'Travel',
      //   icon: FaPlaneDeparture,
      //   value: 'Apply Now',
      //   path: '/travel',
      //   highlight: true,
      //   iconClass: 'travel',
      //   description: 'Submit travel requests',
      //   quickActions: ['New Request', 'Itinerary']
      // },
      {
  title: 'Holidays',
  icon: FaUmbrellaBeach, // 🏖️ choose an icon that fits the theme
  value: 'View List',
  path: '/holidays',
  highlight: true,
  iconClass: 'holiday',
  description: 'View upcoming company holidays',
  quickActions: ['View Calendar', 'Download List']
},

      {
        title: 'Profile',
        icon: FaUser,
        value: 'View / Edit',
        path: '/profile',
        highlight: true,
        iconClass: 'profile',
        description: 'Update your details',
        quickActions: ['Edit Profile', 'Change Password']
      }
    ],
    'Manager Features': role === 'manager' ? [
      {
        title: 'Approvals',
        icon: FaCheckCircle,
        value: `${stats.pendingRequests || 0} Pending`,
        path: '/approvals',
        highlight: true,
        iconClass: 'approvals',
        description: 'Review team requests',
        quickActions: ['View All', 'Process']
      },
      {
        title: 'Team Dashboard',
        icon: FaUsers,
        value: 'View Team',
        path: '/team-dashboard',
        highlight: true,
        iconClass: 'team-dashboard',
        description: 'Monitor team performance',
        quickActions: ['Performance', 'Attendance']
      }
    ] : []
  };

  return (
    <div className="employee-portal">
      <div className="dashboard-content">
        <motion.h2 
          className="welcome-title"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          🚀 Welcome {role.charAt(0).toUpperCase() + role.slice(1)}!
        </motion.h2>

        {isLoading ? (
          <div className="loading-grid">
            {[...Array(7)].map((_, index) => (
              <motion.div
                key={index}
                className="loading-card"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="loading-shimmer"></div>
              </motion.div>
            ))}
          </div>
        ) : (
          <AnimatePresence>
            {Object.entries(features).map(([section, cards]) => (
              cards.length > 0 && (
                <motion.div
                  key={section}
                  className="dashboard-section"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <h3 className="section-title">
                    {section === 'Task' ? <FaTachometerAlt /> : <FaUsers />} {section}
                  </h3>
                  <div className="metrics-grid">
                    {cards.map((card, index) => (
                      <motion.div
                        key={`${section}-${index}`}
                        className={`metric-card ${card.highlight ? 'highlight-card' : ''} ${activeCard === card.title ? 'active' : ''} ${expandedCard === card.title ? 'expanded' : ''}`}
                        onClick={() => handleCardClick(card.path, card.title)}
                        title={card.description}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05, type: 'spring' }}
                        layout
                      >
                        <div className="metric-header">
                          <card.icon className={`metric-icon ${card.iconClass}`} />
                          <div className="metric-text">
                            <h3>{card.title}</h3>
                            <p className="metric-description">{card.description}</p>
                          </div>
                          <button 
                            className="expand-button"
                            onClick={(e) => toggleExpand(card.title, e)}
                          >
                            <FaChevronRight className={`expand-icon ${expandedCard === card.title ? 'expanded' : ''}`} />
                          </button>
                        </div>
                        <div className="metric-value">{card.value}</div>
                        
                        <AnimatePresence>
                          {expandedCard === card.title && (
                            <motion.div
                              className="quick-actions"
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                            >
                              {card.quickActions.map((action, i) => (
                                <motion.button
                                  key={i}
                                  className="quick-action"
                                  whileHover={{ x: 5 }}
                                  onClick={(e) => handleQuickActionClick(action, card.title, e)}
                                >
                                  {action}
                                </motion.button>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

