import React, { useState, useEffect } from 'react';
import { 
  FaUsers, 
  FaSearch, 
  FaCheckCircle, 
  FaChartLine, 
  FaTasks,
  FaPlus,
  FaMinus,
  FaEdit,
  FaTrash,
  FaCalendarAlt,
  FaUserClock
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import './TeamDashboard.css';

// Mock API Service
const fetchTeamData = () => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([
        { id: 1, name: 'Sujatha', role: 'Frontend Developer', status: 'present', tasks: 5, lastActive: '2023-06-15T09:30:00' },
        { id: 2, name: 'Ruthu', role: 'Backend Developer', status: 'leave', tasks: 3, leaveReason: 'Sick leave', leaveEnd: '2023-06-18' },
        { id: 3, name: 'Alice', role: 'UI/UX Designer', status: 'present', tasks: 4, lastActive: '2023-06-15T10:15:00' },
        { id: 4, name: 'Michael', role: 'QA Engineer', status: 'present', tasks: 6, lastActive: '2023-06-15T08:45:00' },
        { id: 5, name: 'Vinay', role: 'DevOps Engineer', status: 'leave', tasks: 2, leaveReason: 'Vacation', leaveEnd: '2023-06-20' },
        { id: 6, name: 'Madhukar', role: 'Product Manager', status: 'present', tasks: 7, lastActive: '2023-06-15T11:00:00' },
        { id: 7, name: 'Evan', role: 'Fullstack Developer', status: 'present', tasks: 4, lastActive: '2023-06-15T09:00:00' },
        { id: 8, name: 'Mayu', role: 'Scrum Master', status: 'present', tasks: 6, lastActive: '2023-06-15T10:30:00' },
        { id: 9, name: 'Aarav Patel', role: 'Data Analyst', status: 'leave', tasks: 1, leaveReason: 'Personal', leaveEnd: '2023-06-17' },
        { id: 10, name: 'Priya Nair', role: 'Business Analyst', status: 'present', tasks: 3, lastActive: '2023-06-15T09:45:00' }
      ]);
    }, 800); // Simulate network delay
  });
};

const TeamDashboard = () => {
  const [teamData, setTeamData] = useState([]);
  const [filteredTeam, setFilteredTeam] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const [expandedMember, setExpandedMember] = useState(null);
  const [newTaskCount, setNewTaskCount] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMember, setNewMember] = useState({
    name: '',
    role: '',
    status: 'present',
    tasks: 0
  });

  // Fetch data on component mount
  useEffect(() => {
    loadTeamData();
  }, []);

  // Filter team data when search or filters change
  useEffect(() => {
    filterTeamData();
  }, [teamData, searchTerm, statusFilter]);

  const loadTeamData = async () => {
    setIsLoading(true);
    try {
      const data = await fetchTeamData();
      setTeamData(data);
    } catch (error) {
      console.error('Error loading team data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterTeamData = () => {
    let results = [...teamData];
    
    // Apply search filter
    if (searchTerm) {
      results = results.filter(member =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.role.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'All') {
      results = results.filter(member => member.status === statusFilter.toLowerCase());
    }
    
    setFilteredTeam(results);
  };

  const toggleExpandMember = (id) => {
    setExpandedMember(expandedMember === id ? null : id);
  };

  const handleAddTask = (id) => {
    if (!newTaskCount || isNaN(newTaskCount)) return;
    
    setTeamData(teamData.map(member =>
      member.id === id 
        ? { ...member, tasks: member.tasks + parseInt(newTaskCount) } 
        : member
    ));
    
    setNewTaskCount('');
    setExpandedMember(null);
  };

  const handleRemoveTask = (id) => {
    setTeamData(teamData.map(member =>
      member.id === id && member.tasks > 0
        ? { ...member, tasks: member.tasks - 1 } 
        : member
    ));
  };

  const handleDeleteMember = (id) => {
    setTeamData(teamData.filter(member => member.id !== id));
  };

  const handleAddMember = () => {
    if (!newMember.name || !newMember.role) return;
    
    const memberToAdd = {
      ...newMember,
      id: Math.max(...teamData.map(m => m.id), 0) + 1,
      tasks: parseInt(newMember.tasks) || 0,
      lastActive: new Date().toISOString()
    };
    
    setTeamData([...teamData, memberToAdd]);
    setNewMember({
      name: '',
      role: '',
      status: 'present',
      tasks: 0
    });
    setShowAddForm(false);
  };

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Calculate stats
  const presentCount = teamData.filter(m => m.status === 'present').length;
  const leaveCount = teamData.filter(m => m.status === 'leave').length;
  const totalTasks = teamData.reduce((sum, m) => sum + m.tasks, 0);
  const avgTasks = teamData.length > 0 ? (totalTasks / teamData.length).toFixed(1) : 0;

  return (
    <div className="team-dashboard">
      {/* Header */}
      <div className="header">
        <div className="header-content">
          <FaUsers className="icon" />
          <h2>Team Dashboard</h2>
          <button 
            className="refresh-btn"
            onClick={loadTeamData}
            disabled={isLoading}
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats">
        <motion.div 
          className="stat-card"
          whileHover={{ scale: 1.03 }}
        >
          <div className="stat-icon-container present">
            <FaCheckCircle className="stat-icon" />
          </div>
          <div>
            <h3>{presentCount}</h3>
            <p>Present Today</p>
          </div>
        </motion.div>
        
        <motion.div 
          className="stat-card"
          whileHover={{ scale: 1.03 }}
        >
          <div className="stat-icon-container leave">
            <FaUserClock className="stat-icon" />
          </div>
          <div>
            <h3>{leaveCount}</h3>
            <p>On Leave</p>
          </div>
        </motion.div>
        
        <motion.div 
          className="stat-card"
          whileHover={{ scale: 1.03 }}
        >
          <div className="stat-icon-container tasks">
            <FaTasks className="stat-icon" />
          </div>
          <div>
            <h3>{totalTasks}</h3>
            <p>Total Tasks</p>
          </div>
        </motion.div>
        
        <motion.div 
          className="stat-card"
          whileHover={{ scale: 1.03 }}
        >
          <div className="stat-icon-container avg">
            <FaChartLine className="stat-icon" />
          </div>
          <div>
            <h3>{avgTasks}</h3>
            <p>Avg Tasks</p>
          </div>
        </motion.div>
      </div>

      {/* Controls */}
      <div className="controls">
        <div className="search-bar">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search team member..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="filters">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Present">Present</option>
            <option value="Leave">On Leave</option>
          </select>
          
          <button 
            className="add-member-btn"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            <FaPlus /> {showAddForm ? 'Cancel' : 'Add Member'}
          </button>
        </div>
      </div>

      {/* Add Member Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            className="add-member-form"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <h3>Add New Team Member</h3>
            <div className="form-row">
              <input
                type="text"
                placeholder="Name"
                value={newMember.name}
                onChange={(e) => setNewMember({...newMember, name: e.target.value})}
              />
              <input
                type="text"
                placeholder="Role"
                value={newMember.role}
                onChange={(e) => setNewMember({...newMember, role: e.target.value})}
              />
            </div>
            <div className="form-row">
              <select
                value={newMember.status}
                onChange={(e) => setNewMember({...newMember, status: e.target.value})}
              >
                <option value="present">Present</option>
                <option value="leave">On Leave</option>
              </select>
              <input
                type="number"
                placeholder="Tasks"
                value={newMember.tasks}
                onChange={(e) => setNewMember({...newMember, tasks: e.target.value})}
                min="0"
              />
            </div>
            <button 
              className="submit-btn"
              onClick={handleAddMember}
            >
              Add Member
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Team Table */}
      <div className="team-table-container">
        {isLoading ? (
          <div className="loading-overlay">
            <div className="spinner"></div>
            <p>Loading team data...</p>
          </div>
        ) : filteredTeam.length === 0 ? (
          <div className="empty-state">
            <img src="/empty-team.svg" alt="No team members found" />
            <h3>No team members found</h3>
            <p>Try adjusting your search or filters</p>
          </div>
        ) : (
          <table className="team-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Role</th>
                <th>Status</th>
                <th>Tasks</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTeam.map((member) => (
                <React.Fragment key={member.id}>
                  <tr 
                    className="member-row"
                    onClick={() => toggleExpandMember(member.id)}
                  >
                    <td>
                      <div className="member-name">
                        <span className="avatar">{member.name.charAt(0)}</span>
                        {member.name}
                      </div>
                    </td>
                    <td>{member.role}</td>
                    <td>
                      <span className={`status ${member.status}`}>
                        {member.status}
                      </span>
                    </td>
                    <td>
                      <div className="task-count">
                        {member.tasks}
                        <span className={`task-trend ${member.tasks > 5 ? 'high' : member.tasks > 2 ? 'medium' : 'low'}`}>
                          {member.tasks > 5 ? '↑' : member.tasks > 2 ? '→' : '↓'}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="actions">
                        <button 
                          className="edit-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Implement edit functionality
                          }}
                        >
                          <FaEdit />
                        </button>
                        <button 
                          className="delete-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteMember(member.id);
                          }}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                  
                  {/* Expanded Row */}
                  <AnimatePresence>
                    {expandedMember === member.id && (
                      <motion.tr
                        className="expanded-row"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <td colSpan="5">
                          <div className="expanded-content">
                            <div className="details">
                              {member.status === 'present' ? (
                                <>
                                  <p>
                                    <strong>Last Active:</strong> 
                                    {formatDate(member.lastActive)}
                                  </p>
                                  <p>
                                    <strong>Current Tasks:</strong> {member.tasks}
                                  </p>
                                </>
                              ) : (
                                <>
                                  <p>
                                    <strong>Leave Reason:</strong> {member.leaveReason}
                                  </p>
                                  <p>
                                    <FaCalendarAlt /> 
                                    <strong>Return Date:</strong> {member.leaveEnd}
                                  </p>
                                </>
                              )}
                            </div>
                            
                            <div className="task-controls">
                              <div className="task-adjust">
                                <button 
                                  className="remove-task"
                                  onClick={() => handleRemoveTask(member.id)}
                                  disabled={member.tasks <= 0}
                                >
                                  <FaMinus />
                                </button>
                                <span className="task-count">{member.tasks}</span>
                                <button 
                                  className="add-task"
                                  onClick={() => handleAddTask(member.id)}
                                >
                                  <FaPlus />
                                </button>
                              </div>
                              
                              <div className="task-input">
                                <input
                                  type="number"
                                  placeholder="Add tasks..."
                                  value={newTaskCount}
                                  onChange={(e) => setNewTaskCount(e.target.value)}
                                  min="1"
                                />
                                <button 
                                  className="submit-task"
                                  onClick={() => handleAddTask(member.id)}
                                  disabled={!newTaskCount || isNaN(newTaskCount)}
                                >
                                  Add
                                </button>
                              </div>
                            </div>
                          </div>
                        </td>
                      </motion.tr>
                    )}
                  </AnimatePresence>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default TeamDashboard;