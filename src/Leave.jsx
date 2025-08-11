import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Leave.css';

const Leave = () => {
  const leaveTypes = [
    { name: 'Paid Leave', icon: '🏖️', color: '#4CAF50', description: 'Annual vacation days' },
    { name: 'Sick Leave', icon: '🤒', color: '#FF9800', description: 'For health-related absences' },
    { name: 'WFH Request', icon: '🏠', color: '#2196F3', description: 'Work from home days' },
    { name: 'Emergency Leave', icon: '🚨', color: '#F44336', description: 'Unexpected urgent matters' },
    { name: 'Maternity/Paternity', icon: '👶', color: '#E91E63', description: 'Parental leave' },
    { name: 'Project Off', icon: '📅', color: '#9C27B0', description: 'Project-specific holidays' }
  ];

  const [formData, setFormData] = useState({
    leaveType: 'Paid Leave',
    startDate: '',
    endDate: '',
    reason: '',
    contact: '',
    projectImpact: false,
    handoverPerson: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [daysCount, setDaysCount] = useState(0);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentRequest, setCurrentRequest] = useState(null);
  const formRef = useRef(null);
  const historyRef = useRef(null);

  // Initialize leave balance and history from localStorage
  const [leaveBalance, setLeaveBalance] = useState(() => {
    const defaultBalance = {
      paidLeave: 12,
      sickLeave: 8,
      wfh: 5,
      emergency: 3,
      maternity: 90,
      projectOff: 5
    };
    const storedBalance = localStorage.getItem('leaveBalance');
    return storedBalance ? JSON.parse(storedBalance) : defaultBalance;
  });

  const [leaveHistory, setLeaveHistory] = useState(() => {
    const storedHistory = localStorage.getItem('leaveHistory');
    return storedHistory ? JSON.parse(storedHistory) : [];
  });

  // Calculate days when dates change
  useEffect(() => {
    if (formData.startDate && formData.endDate) {
      const days = calculateLeaveDays();
      setDaysCount(days);
      
      // Validate dates
      const newErrors = {...formErrors};
      if (days <= 0) {
        newErrors.dateRange = 'End date must be after start date';
      } else {
        delete newErrors.dateRange;
      }
      setFormErrors(newErrors);
    }
  }, [formData.startDate, formData.endDate]);

  const calculateLeaveDays = () => {
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    const difference = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
    return difference > 0 ? difference : 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error when field is edited
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.startDate) errors.startDate = 'Start date is required';
    if (!formData.endDate) errors.endDate = 'End date is required';
    if (daysCount <= 0) errors.dateRange = 'Invalid date range';
    if (!formData.reason) errors.reason = 'Reason is required';
    if (formData.projectImpact && !formData.handoverPerson) {
      errors.handoverPerson = 'Handover person is required when project is impacted';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // Scroll to first error
      const firstError = Object.keys(formErrors)[0];
      if (firstError) {
        const element = document.querySelector(`[name="${firstError}"]`);
        element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const days = daysCount;
    const type = formData.leaveType;

    // Update balance
    const newBalance = { ...leaveBalance };
    const balanceKey = type.toLowerCase().replace(/ /g, '').replace(/\/.*/, '');
    
    if (balanceKey in newBalance) {
      newBalance[balanceKey] = Math.max(0, newBalance[balanceKey] - days);
      setLeaveBalance(newBalance);
      localStorage.setItem('leaveBalance', JSON.stringify(newBalance));
    }

    // Add to history
    const newEntry = {
      id: Date.now(),
      type,
      startDate: formData.startDate,
      endDate: formData.endDate,
      days,
      reason: formData.reason,
      status: 'Pending',
      submittedAt: new Date().toISOString(),
      contact: formData.contact,
      handoverPerson: formData.projectImpact ? formData.handoverPerson : null
    };

    const updatedHistory = [newEntry, ...leaveHistory];
    setLeaveHistory(updatedHistory);
    localStorage.setItem('leaveHistory', JSON.stringify(updatedHistory));

    setCurrentRequest(newEntry);
    setSubmitted(true);
    setIsSubmitting(false);
    
    // Reset form
    setFormData({
      leaveType: 'Paid Leave',
      startDate: '',
      endDate: '',
      reason: '',
      contact: '',
      projectImpact: false,
      handoverPerson: ''
    });
    setDaysCount(0);

    // Scroll to history after submission
    setTimeout(() => {
      historyRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 500);
  };

  const getLeaveTypeDetails = (typeName) => {
    return leaveTypes.find(type => type.name === typeName) || leaveTypes[0];
  };

  const handleLeaveTypeSelect = (type) => {
    setFormData(prev => ({ ...prev, leaveType: type }));
  };

  const cancelRequest = () => {
    setSubmitted(false);
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved': return '#4CAF50';
      case 'Rejected': return '#F44336';
      case 'Pending': return '#FFC107';
      default: return '#9E9E9E';
    }
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Auto-set end date if it's before start date
    if (name === 'startDate' && formData.endDate && new Date(value) > new Date(formData.endDate)) {
      setFormData(prev => ({ ...prev, endDate: value }));
    }
  };

  const cancelLeaveRequest = (id) => {
    const request = leaveHistory.find(item => item.id === id);
    if (!request || request.status !== 'Pending') return;

    if (window.confirm('Are you sure you want to cancel this leave request?')) {
      const updatedHistory = leaveHistory.map(item => 
        item.id === id ? { ...item, status: 'Cancelled' } : item
      );
      
      // Return balance if cancelled
      if (request.status === 'Pending') {
        const newBalance = { ...leaveBalance };
        const balanceKey = request.type.toLowerCase().replace(/ /g, '').replace(/\/.*/, '');
        
        if (balanceKey in newBalance) {
          newBalance[balanceKey] += request.days;
          setLeaveBalance(newBalance);
          localStorage.setItem('leaveBalance', JSON.stringify(newBalance));
        }
      }
      
      setLeaveHistory(updatedHistory);
      localStorage.setItem('leaveHistory', JSON.stringify(updatedHistory));
    }
  };

  return (
    <div className="leave-page">
      <motion.h2 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Leave Management
      </motion.h2>

      <div className="leave-container">
        {/* Leave Balance */}
        <motion.div 
          className="balance-card"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3>Your Leave Balance</h3>
          <div className="balance-grid">
            {leaveTypes.map((type, index) => {
              const balanceKey = type.name.toLowerCase().replace(/ /g, '').replace(/\/.*/, '');
              const balanceValue = leaveBalance[balanceKey] || 0;
              
              return (
                <motion.div
                  key={index}
                  className={`balance-item ${formData.leaveType === type.name ? 'selected' : ''}`}
                  style={{ borderLeft: `4px solid ${type.color}` }}
                  onClick={() => handleLeaveTypeSelect(type.name)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="balance-icon">{type.icon}</div>
                  <div className="balance-details">
                    <span className="balance-type">{type.name}</span>
                    <span className="balance-count">
                      {type.name === 'Maternity/Paternity' ? 
                        `${balanceValue} months` : 
                        `${balanceValue} days`}
                    </span>
                    <span className="balance-description">{type.description}</span>
                  </div>
                  {formData.leaveType === type.name && (
                    <motion.div 
                      className="selected-indicator"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring' }}
                    >
                      ✓
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* New Request Section */}
        <div className="section-container" ref={formRef}>
          <motion.h3
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            New Leave Request
          </motion.h3>

          <motion.div 
            className="form-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {submitted ? (
              <motion.div
                className="success-message"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="success-icon">✓</div>
                <h3>Leave Request Submitted</h3>
                <p>Your {currentRequest?.type} request for {currentRequest?.days} day{currentRequest?.days > 1 ? 's' : ''} has been received.</p>
                <p className="request-id">Request ID: IT-LEAVE-{currentRequest?.id.toString().slice(-6)}</p>
                
                <div className="request-details">
                  <div>
                    <span>Dates:</span>
                    <span>{new Date(currentRequest?.startDate).toLocaleDateString()} - {new Date(currentRequest?.endDate).toLocaleDateString()}</span>
                  </div>
                  <div>
                    <span>Reason:</span>
                    <span>{currentRequest?.reason}</span>
                  </div>
                  {currentRequest?.contact && (
                    <div>
                      <span>Contact:</span>
                      <span>{currentRequest?.contact}</span>
                    </div>
                  )}
                </div>
                
                <div className="success-actions">
                  <button className="print-btn">
                    Print Confirmation
                  </button>
                  <button 
                    className="new-request-btn" 
                    onClick={cancelRequest}
                  >
                    New Request
                  </button>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-header">
                  <div 
                    className="leave-type-display" 
                    style={{ backgroundColor: getLeaveTypeDetails(formData.leaveType).color }}
                  >
                    {getLeaveTypeDetails(formData.leaveType).icon} {formData.leaveType}
                  </div>
                </div>

                <div className="form-group">
                  <label>Leave Type *</label>
                  <select 
                    name="leaveType" 
                    value={formData.leaveType}
                    onChange={handleChange}
                    required
                  >
                    {leaveTypes.map((type, index) => (
                      <option key={index} value={type.name}>
                        {type.icon} {type.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="date-group">
                  <div className="form-group">
                    <label>Start Date *</label>
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleDateChange}
                      min={new Date().toISOString().split('T')[0]}
                      required
                      className={formErrors.startDate ? 'error' : ''}
                    />
                    {formErrors.startDate && (
                      <span className="error-message">{formErrors.startDate}</span>
                    )}
                  </div>
                  <div className="form-group">
                    <label>End Date *</label>
                    <input
                      type="date"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleDateChange}
                      min={formData.startDate || new Date().toISOString().split('T')[0]}
                      required
                      className={formErrors.endDate ? 'error' : ''}
                    />
                    {formErrors.endDate && (
                      <span className="error-message">{formErrors.endDate}</span>
                    )}
                  </div>
                  <AnimatePresence>
                    {daysCount > 0 && (
                      <motion.div 
                        className="days-counter"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                      >
                        {daysCount} day{daysCount > 1 ? 's' : ''}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                {formErrors.dateRange && (
                  <div className="form-error">
                    {formErrors.dateRange}
                  </div>
                )}

                <div className="form-group">
                  <label>Reason *</label>
                  <textarea
                    name="reason"
                    value={formData.reason}
                    onChange={handleChange}
                    placeholder="Briefly explain the reason for leave"
                    required
                    className={formErrors.reason ? 'error' : ''}
                  />
                  {formErrors.reason && (
                    <span className="error-message">{formErrors.reason}</span>
                  )}
                </div>

                <div className="form-group">
                  <label>Emergency Contact During Leave</label>
                  <input
                    type="text"
                    name="contact"
                    value={formData.contact}
                    onChange={handleChange}
                    placeholder="Phone number"
                  />
                </div>

                {formData.leaveType !== 'WFH Request' && (
                  <div className="form-group checkbox-group">
                    <input
                      type="checkbox"
                      id="projectImpact"
                      name="projectImpact"
                      checked={formData.projectImpact}
                      onChange={handleChange}
                    />
                    <label htmlFor="projectImpact">
                      This will impact any active project deadlines
                    </label>
                  </div>
                )}

                {formData.projectImpact && (
                  <div className="form-group">
                    <label>Handover To *</label>
                    <input
                      type="text"
                      name="handoverPerson"
                      value={formData.handoverPerson}
                      onChange={handleChange}
                      placeholder="Team member name"
                      required={formData.projectImpact}
                      className={formErrors.handoverPerson ? 'error' : ''}
                    />
                    {formErrors.handoverPerson && (
                      <span className="error-message">{formErrors.handoverPerson}</span>
                    )}
                  </div>
                )}

                <button 
                  type="submit" 
                  className="submit-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner"></span>
                      Submitting...
                    </>
                  ) : (
                    'Submit Leave Request'
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>

        {/* History Section */}
        <div className="section-container" ref={historyRef}>
          <motion.h3
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Leave History
          </motion.h3>

          <motion.div 
            className="history-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            {leaveHistory.length === 0 ? (
              <div className="no-data">
                <p>No leave requests yet.</p>
                <button 
                  className="new-request-btn" 
                  onClick={() => {
                    window.scrollTo({
                      top: formRef.current?.offsetTop,
                      behavior: 'smooth'
                    });
                  }}
                >
                  Create New Request
                </button>
              </div>
            ) : (
              <div className="history-table-container">
                <table className="history-table">
                  <thead>
                    <tr>
                      <th>Type</th>
                      <th>Dates</th>
                      <th>Duration</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaveHistory.map((entry) => {
                      const typeDetails = leaveTypes.find(t => t.name === entry.type) || leaveTypes[0];
                      return (
                        <motion.tr 
                          key={entry.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.3 }}
                          className={`status-${entry.status.toLowerCase()}`}
                        >
                          <td>
                            <span 
                              className="type-badge" 
                              style={{ backgroundColor: typeDetails.color }}
                            >
                              {typeDetails.icon} {entry.type}
                            </span>
                          </td>
                          <td>
                            {new Date(entry.startDate).toLocaleDateString()} - {' '}
                            {new Date(entry.endDate).toLocaleDateString()}
                          </td>
                          <td>{entry.days} day{entry.days > 1 ? 's' : ''}</td>
                          <td>
                            <span 
                              className="status-badge"
                              style={{ backgroundColor: getStatusColor(entry.status) }}
                            >
                              {entry.status}
                            </span>
                          </td>
                          <td>
                            <div className="action-buttons">
                              <button 
                                className="view-btn"
                                onClick={() => {
                                  setCurrentRequest(entry);
                                  setSubmitted(true);
                                  window.scrollTo({
                                    top: formRef.current?.offsetTop,
                                    behavior: 'smooth'
                                  });
                                }}
                              >
                                View
                              </button>
                              {entry.status === 'Pending' && (
                                <button 
                                  className="cancel-btn"
                                  onClick={() => cancelLeaveRequest(entry.id)}
                                >
                                  Cancel
                                </button>
                              )}
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Leave;