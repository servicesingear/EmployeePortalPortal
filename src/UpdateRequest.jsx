import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './UpdateRequest.css';

const UpdateRequest = () => {
  const [requests, setRequests] = useState([]);
  const [formData, setFormData] = useState({
    requestType: '',
    description: '',
    attachments: null,
    priority: 'normal'
  });
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dragActive, setDragActive] = useState(false);
  const [notification, setNotification] = useState(null);
  const [activeTab, setActiveTab] = useState('new');
  const fileInputRef = useRef(null);
  const commentInputRef = useRef(null);

  // Simulate API call to load data
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setRequests([
        { id: 1, type: 'Personal Information Update', status: 'pending', date: new Date().toISOString().split('T')[0], description: 'Name change request', priority: 'high', attachmentName: 'document.pdf', comments: [] },
        { id: 2, type: 'Document Upload', status: 'approved', date: '2023-05-20', description: 'Degree certificate upload', priority: 'normal', attachmentName: 'degree.pdf', comments: [{ text: 'Approved by admin', date: '2023-05-21', author: 'Admin' }] },
        { id: 3, type: 'Access Request', status: 'rejected', date: '2023-04-10', description: 'Request for admin access', priority: 'low', attachmentName: null, comments: [{ text: 'Access level too high for your role', date: '2023-04-12', author: 'Admin' }] }
      ]);
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Handle drag events for file upload
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  // Handle file drop
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  // Handle file selection via click
  const handleFileChange = (file) => {
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      showNotification('File size exceeds 5MB limit', 'error');
      return;
    }
    setFormData(prev => ({
      ...prev,
      attachments: file
    }));
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle file input click
  const handleFileInputClick = () => {
    fileInputRef.current.click();
  };

  // Submit new request
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.requestType) {
      showNotification('Please select a request type', 'error');
      return;
    }
    
    if (!formData.description) {
      showNotification('Please enter a description', 'error');
      return;
    }

    if (formData.description.length > 500) {
      showNotification('Description must be 500 characters or less', 'error');
      return;
    }
    
    setSubmissionStatus('submitting');
    
    setTimeout(() => {
      const newRequest = {
        id: requests.length + 1,
        type: formData.requestType,
        status: 'pending',
        date: new Date().toISOString().split('T')[0],
        description: formData.description,
        priority: formData.priority,
        attachmentName: formData.attachments ? formData.attachments.name : null,
        comments: []
      };
      
      setRequests([newRequest, ...requests]);
      setFormData({
        requestType: '',
        description: '',
        attachments: null,
        priority: 'normal'
      });
      
      setSubmissionStatus('success');
      showNotification('Request submitted successfully!', 'success');
      setTimeout(() => setSubmissionStatus(null), 3000);
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }, 1500);
  };

  // Add comment to request
  const handleAddComment = (requestId) => {
    const commentText = commentInputRef.current.value.trim();
    if (!commentText) return;
    
    const updatedRequests = requests.map(request => {
      if (request.id === requestId) {
        return {
          ...request,
          comments: [
            ...request.comments,
            {
              text: commentText,
              date: new Date().toISOString().split('T')[0],
              author: 'You'
            }
          ]
        };
      }
      return request;
    });
    
    setRequests(updatedRequests);
    showNotification('Comment added!', 'success');
    commentInputRef.current.value = '';
    
    // Update the selected request to show the new comment
    if (selectedRequest && selectedRequest.id === requestId) {
      setSelectedRequest(updatedRequests.find(req => req.id === requestId));
    }
  };

  // Cancel a pending request
  const handleCancelRequest = (requestId) => {
    const updatedRequests = requests.map(request => {
      if (request.id === requestId && request.status === 'pending') {
        return { ...request, status: 'cancelled' };
      }
      return request;
    });
    
    setRequests(updatedRequests);
    setSelectedRequest(null);
    showNotification('Request cancelled!', 'info');
  };

  // Remove selected file
  const handleRemoveFile = () => {
    setFormData(prev => ({
      ...prev,
      attachments: null
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Show notification
  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Filter requests based on search and status
  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         request.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || request.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Get status color class
  const getStatusColor = (status) => {
    switch(status) {
      case 'approved': return 'status-approved';
      case 'rejected': return 'status-rejected';
      case 'cancelled': return 'status-cancelled';
      default: return 'status-pending';
    }
  };

  // Get priority color class
  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return 'priority-high';
      case 'low': return 'priority-low';
      default: return 'priority-normal';
    }
  };

  return (
    <div className="update-request-page">
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

      <h2>Update Request Center</h2>
      
      {/* Tabs */}
      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'new' ? 'active' : ''}`}
          onClick={() => setActiveTab('new')}
        >
          New Request
        </button>
        <button 
          className={`tab ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          Request History
        </button>
      </div>
      
      <div className="update-request-content">
        {/* Request Form - Only shown in new tab */}
        {activeTab === 'new' && (
          <motion.div 
            className="request-form"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h3>Submit a New Request</h3>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="requestType">Request Type *</label>
                <select 
                  id="requestType" 
                  name="requestType"
                  className="form-control"
                  value={formData.requestType}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select request type</option>
                  <option value="Personal Information Update">Personal Information Update</option>
                  <option value="Document Upload">Document Upload</option>
                  <option value="Access Request">Access Request</option>
                  <option value="Other Request">Other Request</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="priority">Priority</label>
                <div className="priority-options">
                  {['high', 'normal', 'low'].map(level => (
                    <label key={level} className={`priority-option ${getPriorityColor(level)}`}>
                      <input
                        type="radio"
                        name="priority"
                        value={level}
                        checked={formData.priority === level}
                        onChange={handleChange}
                      />
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="description">Description *</label>
                <textarea 
                  id="description" 
                  name="description"
                  className="form-control" 
                  rows="4"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Please describe your request in detail..."
                  maxLength="500"
                  required
                ></textarea>
                <div className="character-count">
                  {formData.description.length}/500
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="attachments">Attachments (Optional)</label>
                <div 
                  className={`file-upload-area ${dragActive ? 'drag-active' : ''}`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={handleFileInputClick}
                >
                  <input 
                    type="file" 
                    id="attachments" 
                    name="attachments"
                    className="file-input"
                    onChange={(e) => e.target.files[0] && handleFileChange(e.target.files[0])}
                    ref={fileInputRef}
                  />
                  {formData.attachments ? (
                    <div className="file-preview">
                      <div className="file-info">
                        <i className="fas fa-file-alt"></i>
                        <span>{formData.attachments.name}</span>
                        <button 
                          type="button" 
                          className="remove-file"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveFile();
                          }}
                        >
                          &times;
                        </button>
                      </div>
                      <div className="file-size">
                        {(formData.attachments.size / 1024).toFixed(2)} KB
                      </div>
                    </div>
                  ) : (
                    <div className="upload-prompt">
                      <i className="fas fa-cloud-upload-alt"></i>
                      <p>Drag & drop files here or click to browse</p>
                      <p className="hint">Supports: PDF, JPG, PNG (Max 5MB)</p>
                    </div>
                  )}
                </div>
              </div>
              
              <motion.button 
                type="submit" 
                className="submit-btn"
                disabled={submissionStatus === 'submitting'}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {submissionStatus === 'submitting' ? (
                  <>
                    <span className="spinner"></span> Processing...
                  </>
                ) : (
                  <>
                    <i className="fas fa-paper-plane"></i> Submit Request
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>
        )}
        
        {/* Request History - Only shown in history tab */}
        {activeTab === 'history' && (
          <motion.div 
            className="request-history"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="history-header">
              <h3>Your Request History</h3>
              
              <div className="history-controls">
                <div className="search-box">
                  <i className="fas fa-search"></i>
                  <input
                    type="text"
                    placeholder="Search requests..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <select
                  className="status-filter"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
            
            {isLoading ? (
              <div className="loading-spinner">
                <div className="spinner"></div>
                <p>Loading your requests...</p>
              </div>
            ) : filteredRequests.length === 0 ? (
              <div className="no-requests">
                <i className="fas fa-inbox"></i>
                <p>No requests found matching your criteria</p>
                <button 
                  className="clear-filters-btn"
                  onClick={() => {
                    setSearchTerm('');
                    setFilterStatus('all');
                  }}
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="history-list">
                <AnimatePresence>
                  {filteredRequests.map(request => (
                    <motion.div 
                      key={request.id}
                      className={`history-item ${selectedRequest?.id === request.id ? 'active' : ''}`}
                      onClick={() => setSelectedRequest(request)}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                      layout
                    >
                      <div className="request-header">
                        <div className="request-meta">
                          <span className="request-id">#{request.id}</span>
                          <span className={`priority-tag ${getPriorityColor(request.priority)}`}>
                            {request.priority}
                          </span>
                        </div>
                        <span className={`status-badge ${getStatusColor(request.status)}`}>
                          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </span>
                      </div>
                      <h4 className="request-title">{request.type}</h4>
                      <p className="request-description">
                        {request.description.length > 100 
                          ? `${request.description.substring(0, 100)}...` 
                          : request.description}
                      </p>
                      <div className="request-footer">
                        <span className="request-date">
                          <i className="far fa-calendar-alt"></i> {request.date}
                        </span>
                        {request.attachmentName && (
                          <span className="attachment-indicator">
                            <i className="fas fa-paperclip"></i> Attachment
                          </span>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* Request Detail Modal */}
      <AnimatePresence>
        {selectedRequest && (
          <motion.div 
            className="request-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedRequest(null)}
          >
            <motion.div 
              className="request-modal"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="close-modal" onClick={() => setSelectedRequest(null)}>
                &times;
              </button>
              
              <div className="modal-header">
                <h3>Request Details</h3>
                <div className="request-status">
                  <span className={`status-tag ${getStatusColor(selectedRequest.status)}`}>
                    {selectedRequest.status.charAt(0).toUpperCase() + selectedRequest.status.slice(1)}
                  </span>
                  <span className={`priority-tag ${getPriorityColor(selectedRequest.priority)}`}>
                    {selectedRequest.priority} priority
                  </span>
                </div>
              </div>
              
              <div className="modal-body">
                <div className="detail-section">
                  <div className="detail-row">
                    <span className="detail-label">Request ID:</span>
                    <span className="detail-value">#{selectedRequest.id}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Type:</span>
                    <span className="detail-value">{selectedRequest.type}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Submitted:</span>
                    <span className="detail-value">{selectedRequest.date}</span>
                  </div>
                </div>
                
                <div className="detail-section">
                  <h4>Description</h4>
                  <p>{selectedRequest.description}</p>
                </div>
                
                {selectedRequest.attachmentName && (
                  <div className="detail-section">
                    <h4>Attachment</h4>
                    <div className="attachment-preview">
                      <i className="fas fa-file-pdf"></i>
                      <div className="attachment-info">
                        <span>{selectedRequest.attachmentName}</span>
                        <button className="download-btn">
                          <i className="fas fa-download"></i> Download
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="detail-section">
                  <h4>Timeline</h4>
                  <div className="timeline">
                    <div className="timeline-item">
                      <div className="timeline-marker"></div>
                      <div className="timeline-content">
                        <p>Request submitted</p>
                        <small>{selectedRequest.date}</small>
                      </div>
                    </div>
                    {selectedRequest.status !== 'pending' && (
                      <div className="timeline-item">
                        <div className="timeline-marker"></div>
                        <div className="timeline-content">
                          <p>Request {selectedRequest.status}</p>
                          <small>{selectedRequest.date}</small>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {selectedRequest.comments.length > 0 && (
                  <div className="detail-section">
                    <h4>Comments</h4>
                    <div className="comments-list">
                      {selectedRequest.comments.map((comment, index) => (
                        <div key={index} className="comment">
                          <div className="comment-header">
                            <strong>{comment.author}</strong>
                            <small>{comment.date}</small>
                          </div>
                          <p>{comment.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {(selectedRequest.status === 'pending' || selectedRequest.comments.length > 0) && (
                  <div className="detail-section">
                    <h4>Add Comment</h4>
                    <div className="add-comment">
                      <textarea 
                        placeholder="Add a comment..." 
                        rows="2"
                        ref={commentInputRef}
                      ></textarea>
                      <button 
                        className="send-comment"
                        onClick={() => handleAddComment(selectedRequest.id)}
                      >
                        <i className="fas fa-paper-plane"></i>
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="modal-footer">
                {selectedRequest.status === 'pending' && (
                  <button 
                    className="cancel-request-btn"
                    onClick={() => handleCancelRequest(selectedRequest.id)}
                  >
                    <i className="fas fa-times"></i> Cancel Request
                  </button>
                )}
                <button 
                  className="close-modal-btn"
                  onClick={() => setSelectedRequest(null)}
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UpdateRequest;