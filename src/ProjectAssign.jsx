import React, { useState, useEffect } from 'react';
import { 
  FaClipboardList, 
  FaUserPlus, 
  FaSearch, 
  FaEdit, 
  FaTrash, 
  FaCalendarAlt,
  FaUserTie,
  FaProjectDiagram,
  FaCheckCircle,
  FaTimesCircle
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import './ProjectAssign.css';

// Mock data for employees and projects
const mockEmployees = [
  { id: 'EMP001', name: 'Sujatha', role: 'Frontend Developer' },
  { id: 'EMP002', name: 'Ruthu', role: 'Backend Developer' },
  { id: 'EMP003', name: 'Alice', role: 'UI/UX Designer' },
  { id: 'EMP004', name: 'Michael', role: 'QA Engineer' },
  { id: 'EMP005', name: 'Vinay', role: 'DevOps Engineer' }
];

const mockProjects = [
  { id: 'PRJ001', name: 'CRM Redesign', status: 'active' },
  { id: 'PRJ002', name: 'E-commerce Platform', status: 'planning' },
  { id: 'PRJ003', name: 'Mobile App Development', status: 'active' },
  { id: 'PRJ004', name: 'Data Analytics Dashboard', status: 'completed' },
  { id: 'PRJ005', name: 'Internal Tools Upgrade', status: 'active' }
];

const ProjectAssign = () => {
  const [formData, setFormData] = useState({
    employeeId: '',
    projectId: '',
    startDate: '',
    endDate: '',
    role: 'Developer'
  });

  const [assignments, setAssignments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editIndex, setEditIndex] = useState(null);
  const [showEmployeeDropdown, setShowEmployeeDropdown] = useState(false);
  const [showProjectDropdown, setShowProjectDropdown] = useState(false);
  const [filteredEmployees, setFilteredEmployees] = useState(mockEmployees);
  const [filteredProjects, setFilteredProjects] = useState(mockProjects);
  const [notification, setNotification] = useState(null);

  // Filter employees and projects based on search
  useEffect(() => {
    setFilteredEmployees(
      mockEmployees.filter(emp => 
        emp.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setFilteredProjects(
      mockProjects.filter(proj => 
        proj.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        proj.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate dates
    if (new Date(formData.endDate) < new Date(formData.startDate)) {
      showNotification('End date must be after start date', 'error');
      return;
    }

    if (editIndex !== null) {
      // Update existing assignment
      const updatedAssignments = [...assignments];
      updatedAssignments[editIndex] = formData;
      setAssignments(updatedAssignments);
      showNotification('Assignment updated successfully', 'success');
      setEditIndex(null);
    } else {
      // Add new assignment
      setAssignments(prev => [...prev, {
        ...formData,
        employeeName: mockEmployees.find(e => e.id === formData.employeeId)?.name || '',
        projectName: mockProjects.find(p => p.id === formData.projectId)?.name || ''
      }]);
      showNotification('Project assigned successfully', 'success');
    }

    // Reset form
    setFormData({
      employeeId: '',
      projectId: '',
      startDate: '',
      endDate: '',
      role: 'Developer'
    });
  };

  const handleEdit = (index) => {
    setFormData(assignments[index]);
    setEditIndex(index);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (index) => {
    setAssignments(prev => prev.filter((_, i) => i !== index));
    showNotification('Assignment deleted', 'warning');
  };

  const selectEmployee = (employee) => {
    setFormData(prev => ({ ...prev, employeeId: employee.id }));
    setShowEmployeeDropdown(false);
  };

  const selectProject = (project) => {
    setFormData(prev => ({ ...prev, projectId: project.id }));
    setShowProjectDropdown(false);
  };

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getDaysRemaining = (endDate) => {
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = end - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const filteredAssignments = assignments.filter(assignment =>
    assignment.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    assignment.projectId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    assignment.employeeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    assignment.projectName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="project-assign-container">
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

      <h2 className="title">
        <FaClipboardList className="icon" /> Project Assignment
      </h2>

      <form className="assign-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label><FaUserTie /> Employee</label>
            <div className="dropdown-container">
              <input
                type="text"
                value={formData.employeeId}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, employeeId: e.target.value }));
                  setShowEmployeeDropdown(true);
                }}
                onClick={() => setShowEmployeeDropdown(!showEmployeeDropdown)}
                placeholder="Select employee"
                required
              />
              <AnimatePresence>
                {showEmployeeDropdown && (
                  <motion.div 
                    className="dropdown-list"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    {filteredEmployees.map(employee => (
                      <div
                        key={employee.id}
                        className="dropdown-item"
                        onClick={() => selectEmployee(employee)}
                      >
                        <span className="emp-id">{employee.id}</span>
                        <span className="emp-name">{employee.name}</span>
                        <span className="emp-role">{employee.role}</span>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="form-group">
            <label><FaProjectDiagram /> Project</label>
            <div className="dropdown-container">
              <input
                type="text"
                value={formData.projectId}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, projectId: e.target.value }));
                  setShowProjectDropdown(true);
                }}
                onClick={() => setShowProjectDropdown(!showProjectDropdown)}
                placeholder="Select project"
                required
              />
              <AnimatePresence>
                {showProjectDropdown && (
                  <motion.div 
                    className="dropdown-list"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    {filteredProjects.map(project => (
                      <div
                        key={project.id}
                        className="dropdown-item"
                        onClick={() => selectProject(project)}
                      >
                        <span className="proj-id">{project.id}</span>
                        <span className="proj-name">{project.name}</span>
                        <span className={`proj-status ${project.status}`}>
                          {project.status}
                        </span>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label><FaCalendarAlt /> Start Date</label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label><FaCalendarAlt /> End Date</label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Role in Project</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="Developer">Developer</option>
              <option value="Designer">Designer</option>
              <option value="QA Engineer">QA Engineer</option>
              <option value="Project Manager">Project Manager</option>
              <option value="Business Analyst">Business Analyst</option>
            </select>
          </div>
        </div>

        <button type="submit" className="assign-btn">
          <FaUserPlus /> {editIndex !== null ? 'Update Assignment' : 'Assign Project'}
        </button>
      </form>

      <div className="search-container">
        <div className="search-bar">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search assignments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="stats">
          <div className="stat-card">
            <h3>{assignments.length}</h3>
            <p>Total Assignments</p>
          </div>
          <div className="stat-card">
            <h3>
              {assignments.filter(a => new Date(a.endDate) > new Date()).length}
            </h3>
            <p>Active Assignments</p>
          </div>
        </div>
      </div>

      <h3 className="assigned-title">Assigned Projects</h3>
      
      {filteredAssignments.length === 0 ? (
        <div className="empty-state">
          <img src="/empty-assignments.svg" alt="No assignments found" />
          <p>No project assignments found</p>
        </div>
      ) : (
        <div className="assignment-grid">
          {filteredAssignments.map((assignment, index) => {
            const daysRemaining = getDaysRemaining(assignment.endDate);
            const isActive = daysRemaining > 0;
            
            return (
              <motion.div 
                key={index}
                className={`assignment-card ${isActive ? 'active' : 'completed'}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="card-header">
                  <h4>{assignment.projectName || 'Unknown Project'}</h4>
                  <span className={`status ${isActive ? 'active' : 'completed'}`}>
                    {isActive ? (
                      <>
                        <FaCheckCircle /> Active
                      </>
                    ) : (
                      <>
                        <FaTimesCircle /> Completed
                      </>
                    )}
                  </span>
                </div>
                
                <div className="card-body">
                  <div className="info-row">
                    <span className="label">Project ID:</span>
                    <span className="value">{assignment.projectId}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Assigned To:</span>
                    <span className="value">
                      {assignment.employeeName || 'Unknown Employee'} ({assignment.employeeId})
                    </span>
                  </div>
                  <div className="info-row">
                    <span className="label">Role:</span>
                    <span className="value">{assignment.role}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Duration:</span>
                    <span className="value">
                      {formatDate(assignment.startDate)} to {formatDate(assignment.endDate)}
                    </span>
                  </div>
                  {isActive && (
                    <div className="info-row">
                      <span className="label">Days Remaining:</span>
                      <span className={`value ${daysRemaining <= 7 ? 'warning' : ''}`}>
                        {daysRemaining} {daysRemaining === 1 ? 'day' : 'days'}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="card-actions">
                  <button 
                    className="edit-btn"
                    onClick={() => handleEdit(index)}
                  >
                    <FaEdit /> Edit
                  </button>
                  <button 
                    className="delete-btn"
                    onClick={() => handleDelete(index)}
                  >
                    <FaTrash /> Remove
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProjectAssign;