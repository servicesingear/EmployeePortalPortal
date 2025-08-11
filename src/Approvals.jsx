import React, { useState, useEffect } from 'react';
import { 
  FaCheckCircle, 
  FaTimesCircle, 
  FaSearch, 
  FaFilter, 
  FaBell, 
  FaSyncAlt,
  FaChevronDown,
  FaChevronUp,
  FaComment,
  FaPaperclip
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import './Approvals.css';

// Mock API Service
const fetchRequests = () => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([
        {
          id: 1,
          name: 'John Doe',
          type: 'Leave',
          reason: 'Fever - needs 2 days off',
          status: 'Pending',
          date: new Date().toISOString(),
          department: 'Engineering',
          priority: 'High',
          comments: [],
          attachments: ['medical_certificate.pdf']
        },
        {
          id: 2,
          name: 'Ravi Kumar',
          type: 'Travel',
          reason: 'Client Visit - Mumbai',
          status: 'Pending',
          date: new Date(Date.now() - 86400000).toISOString(),
          department: 'Sales',
          priority: 'Medium',
          comments: [
            { text: 'Which client?', author: 'Manager', date: new Date().toISOString() }
          ],
          attachments: ['itinerary.pdf']
        },
        {
          id: 3,
          name: 'Priya Sharma',
          type: 'Expense',
          reason: 'Conference tickets reimbursement',
          status: 'Pending',
          date: new Date(Date.now() - 172800000).toISOString(),
          department: 'Marketing',
          priority: 'Low',
          comments: [],
          attachments: []
        }
      ]);
    }, 800); // Simulate network delay
  });
};

const Approvals = () => {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: 'All',
    type: 'All',
    priority: 'All'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [notification, setNotification] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedRequest, setExpandedRequest] = useState(null);
  const [newComment, setNewComment] = useState('');

  // Fetch data on component mount
  useEffect(() => {
    loadRequests();
  }, []);

  // Filter requests whenever search or filters change
  useEffect(() => {
    filterRequests();
  }, [requests, searchTerm, filters]);

  const loadRequests = async () => {
    setIsLoading(true);
    try {
      const data = await fetchRequests();
      setRequests(data);
    } catch (error) {
      showNotification('Failed to load requests', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const filterRequests = () => {
    let results = [...requests];
    
    // Apply search filter
    if (searchTerm) {
      results = results.filter(req => 
        req.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.department.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply status filter
    if (filters.status !== 'All') {
      results = results.filter(req => req.status === filters.status);
    }
    
    // Apply type filter
    if (filters.type !== 'All') {
      results = results.filter(req => req.type === filters.type);
    }
    
    // Apply priority filter
    if (filters.priority !== 'All') {
      results = results.filter(req => req.priority === filters.priority);
    }
    
    setFilteredRequests(results);
  };

  const handleApprove = async (id) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setRequests(requests.map(req => 
        req.id === id ? { ...req, status: 'Approved' } : req
      ));
      
      showNotification(`Request #${id} approved!`, 'success');
    } catch (error) {
      showNotification('Approval failed', 'error');
    }
  };

  const handleReject = async (id) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setRequests(requests.map(req => 
        req.id === id ? { ...req, status: 'Rejected' } : req
      ));
      
      showNotification(`Request #${id} rejected`, 'warning');
    } catch (error) {
      showNotification('Rejection failed', 'error');
    }
  };

  const handleReset = async (id) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setRequests(requests.map(req => 
        req.id === id ? { ...req, status: 'Pending' } : req
      ));
      
      showNotification(`Request #${id} reset to pending`, 'info');
    } catch (error) {
      showNotification('Reset failed', 'error');
    }
  };

  const handleAddComment = (requestId) => {
    if (!newComment.trim()) return;
    
    const updatedRequests = requests.map(req => {
      if (req.id === requestId) {
        return {
          ...req,
          comments: [
            ...req.comments,
            {
              text: newComment,
              author: 'Manager',
              date: new Date().toISOString()
            }
          ]
        };
      }
      return req;
    });
    
    setRequests(updatedRequests);
    setNewComment('');
    showNotification('Comment added!', 'success');
  };

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const toggleExpandRequest = (id) => {
    setExpandedRequest(expandedRequest === id ? null : id);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getPriorityColor = (priority) => {
    switch(priority.toLowerCase()) {
      case 'high': return 'priority-high';
      case 'medium': return 'priority-medium';
      default: return 'priority-low';
    }
  };

  return (
    <div className="approvals-container">
      {/* Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            className={`notification notification-${notification.type}`}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {notification.message}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="approvals-header">
        <h2 className="approvals-title">
          <FaBell className="header-icon" /> Approval Dashboard
          <span className="badge-count">
            {requests.filter(r => r.status === 'Pending').length}
          </span>
        </h2>
        
        <div className="controls">
          <div className={`search-bar ${showFilters ? 'expanded' : ''}`}>
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search requests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <button 
            className="filter-btn"
            onClick={() => setShowFilters(!showFilters)}
          >
            <FaFilter /> {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
          
          <button 
            className="refresh-btn"
            onClick={loadRequests}
            disabled={isLoading}
          >
            <FaSyncAlt className={isLoading ? 'spinning' : ''} />
          </button>
        </div>
      </div>

      {/* Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div 
            className="filters-panel"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="filter-group">
              <label>Status:</label>
              <select 
                value={filters.status} 
                onChange={(e) => setFilters({...filters, status: e.target.value})}
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
            
            <div className="filter-group">
              <label>Type:</label>
              <select 
                value={filters.type} 
                onChange={(e) => setFilters({...filters, type: e.target.value})}
              >
                <option value="All">All Types</option>
                <option value="Leave">Leave</option>
                <option value="Travel">Travel</option>
                <option value="Expense">Expense</option>
              </select>
            </div>
            
            <div className="filter-group">
              <label>Priority:</label>
              <select 
                value={filters.priority} 
                onChange={(e) => setFilters({...filters, priority: e.target.value})}
              >
                <option value="All">All Priorities</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
            
            <button 
              className="clear-filters"
              onClick={() => setFilters({
                status: 'All',
                type: 'All',
                priority: 'All'
              })}
            >
              Clear All
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading State */}
      {isLoading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
          <p>Loading requests...</p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredRequests.length === 0 && (
        <div className="empty-state">
          <img src="/empty-requests.svg" alt="No requests" />
          <h3>No requests found</h3>
          <p>Try adjusting your search or filters</p>
          <button 
            className="reset-btn"
            onClick={() => {
              setSearchTerm('');
              setFilters({
                status: 'All',
                type: 'All',
                priority: 'All'
              });
            }}
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Requests Grid */}
      {!isLoading && filteredRequests.length > 0 && (
        <div className="requests-grid">
          {filteredRequests.map((request) => (
            <motion.div
              key={request.id}
              className={`request-card ${request.status.toLowerCase()}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              whileHover={{ scale: 1.02 }}
            >
              <div 
                className="card-header"
                onClick={() => toggleExpandRequest(request.id)}
              >
                <div className="user-info">
                  <div className="avatar">{request.name.charAt(0)}</div>
                  <div>
                    <h3>{request.name}</h3>
                    <span className="department">{request.department}</span>
                  </div>
                </div>
                
                <div className="meta-info">
                  <span className={`priority ${getPriorityColor(request.priority)}`}>
                    {request.priority}
                  </span>
                  <span className="date">{formatDate(request.date)}</span>
                  <button className="expand-btn">
                    {expandedRequest === request.id ? <FaChevronUp /> : <FaChevronDown />}
                  </button>
                </div>
              </div>
              
              <div className="card-main">
                <span className={`badge ${request.type.toLowerCase()}`}>
                  {request.type}
                </span>
                <p className="reason">{request.reason}</p>
                <div className="status-container">
                  <span className={`status ${request.status.toLowerCase()}`}>
                    {request.status}
                  </span>
                </div>
              </div>

              <AnimatePresence>
                {expandedRequest === request.id && (
                  <motion.div
                    className="card-details"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    {/* Attachments */}
                    {request.attachments.length > 0 && (
                      <div className="attachments-section">
                        <h4>
                          <FaPaperclip /> Attachments
                        </h4>
                        <div className="attachments-list">
                          {request.attachments.map((file, index) => (
                            <a 
                              key={index} 
                              href="#" 
                              className="attachment"
                              onClick={(e) => e.preventDefault()}
                            >
                              {file}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Comments */}
                    <div className="comments-section">
                      <h4>
                        <FaComment /> Comments
                        <span className="count">({request.comments.length})</span>
                      </h4>
                      
                      {request.comments.length > 0 ? (
                        <div className="comments-list">
                          {request.comments.map((comment, index) => (
                            <div key={index} className="comment">
                              <div className="comment-header">
                                <strong>{comment.author}</strong>
                                <small>{formatDate(comment.date)}</small>
                              </div>
                              <p>{comment.text}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="no-comments">No comments yet</p>
                      )}
                      
                      <div className="add-comment">
                        <textarea
                          placeholder="Add your comment..."
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                        ></textarea>
                        <button 
                          className="send-btn"
                          onClick={() => handleAddComment(request.id)}
                        >
                          Send
                        </button>
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="action-buttons">
                      {request.status === 'Pending' ? (
                        <>
                          <motion.button
                            className="approve"
                            onClick={() => handleApprove(request.id)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <FaCheckCircle /> Approve
                          </motion.button>
                          <motion.button
                            className="reject"
                            onClick={() => handleReject(request.id)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <FaTimesCircle /> Reject
                          </motion.button>
                        </>
                      ) : (
                        <motion.button
                          className="reset"
                          onClick={() => handleReset(request.id)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <FaSyncAlt /> Reset to Pending
                        </motion.button>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Approvals;