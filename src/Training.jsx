import React, { useState, useEffect } from 'react';
import './Training.css';
import { 
  FaBook, FaCheckCircle, FaClock, FaPlay, FaRegClock, 
  FaRegCheckCircle, FaSpinner, FaCertificate, FaChartLine,
  FaSearch, FaFilter, FaChevronDown, FaChevronUp,
  FaStar, FaRegStar, FaBookOpen, FaUserGraduate, FaCode,
  FaDatabase, FaServer, FaCloud, FaShieldAlt, FaMobile,
  FaRobot, FaBrain, FaNetworkWired, FaLock
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const Training = () => {
  // State for trainings data
  const [trainings, setTrainings] = useState([
    {
      id: 1,
      title: 'Advanced React Patterns',
      type: 'Online Course',
      duration: '8h',
      deadline: '30/06/2025',
      status: 'Completed',
      completedDate: '28/06/2025',
      certificateLink: '#',
      progress: 100,
      category: 'Frontend',
      level: 'Advanced',
      rating: 4,
      lastAccessed: 'Completed',
      modules: [
        { name: 'Introduction to Advanced Patterns', duration: '45m', completed: true },
        { name: 'Render Props & HOCs', duration: '2h', completed: true },
        { name: 'Context API Deep Dive', duration: '1.5h', completed: true },
        { name: 'State Management with Redux Toolkit', duration: '3h', completed: true },
        { name: 'Performance Optimization', duration: '2h 15m', completed: true }
      ]
    },
    {
      id: 2,
      title: 'AWS Solutions Architect Professional',
      type: 'Certification',
      duration: '40h',
      deadline: '15/08/2025',
      status: 'In Progress',
      progress: 60,
      category: 'Cloud',
      level: 'Expert',
      rating: null,
      lastAccessed: '2 days ago',
      modules: [
        { name: 'Cloud Concepts & Architecture', duration: '5h', completed: true },
        { name: 'Advanced EC2 & VPC Configurations', duration: '8h', completed: true },
        { name: 'S3 & Storage Solutions', duration: '6h', completed: true },
        { name: 'Serverless Architectures with Lambda', duration: '7h', completed: false },
        { name: 'Security & Compliance', duration: '8h', completed: false },
        { name: 'Migration Strategies', duration: '6h', completed: false }
      ]
    }
  ]);

  // State for available courses
  const [availableCourses, setAvailableCourses] = useState([
    { 
      id: 3, 
      name: 'Microservices Architecture with Kubernetes', 
      category: 'Backend', 
      level: 'Advanced', 
      duration: '15h',
      rating: 4.8,
      enrolled: 2245,
      instructor: 'Jane Smith',
      description: 'Design, build, and deploy scalable microservices architectures using Kubernetes, Docker, and service mesh technologies. Learn patterns for service discovery, circuit breaking, and distributed tracing.',
      icon: <FaServer />
    },
    { 
      id: 4, 
      name: 'Advanced Docker & Kubernetes', 
      category: 'DevOps', 
      level: 'Advanced', 
      duration: '18h',
      rating: 4.7,
      enrolled: 1587,
      instructor: 'Mike Johnson',
      description: 'Master advanced container orchestration with Kubernetes in production environments. Covers Helm charts, operators, autoscaling, and multi-cluster management.',
      icon: <FaCloud />
    },
    { 
      id: 5, 
      name: 'GraphQL Advanced Concepts', 
      category: 'Frontend', 
      level: 'Advanced', 
      duration: '10h',
      rating: 4.6,
      enrolled: 1256,
      instructor: 'Sarah Williams',
      description: 'Advanced GraphQL topics including schema stitching, federation, caching strategies, and performance optimization for large-scale applications.',
      icon: <FaDatabase />
    },
    { 
      id: 6, 
      name: 'Advanced CI/CD with GitOps', 
      category: 'DevOps', 
      level: 'Advanced', 
      duration: '12h',
      rating: 4.7,
      enrolled: 1423,
      instructor: 'David Chen',
      description: 'Implement GitOps workflows with ArgoCD, advanced pipeline automation, security scanning, and progressive delivery techniques.',
      icon: <FaCode />
    },
    { 
      id: 7, 
      name: 'Cloud Security Expert', 
      category: 'Security', 
      level: 'Expert', 
      duration: '20h',
      rating: 4.9,
      enrolled: 987,
      instructor: 'Alex Morgan',
      description: 'Advanced cloud security patterns including zero-trust architectures, identity federation, encryption strategies, and compliance automation.',
      icon: <FaShieldAlt />
    },
    { 
      id: 8, 
      name: 'Advanced Mobile Architecture', 
      category: 'Mobile', 
      level: 'Advanced', 
      duration: '14h',
      rating: 4.5,
      enrolled: 876,
      instructor: 'Taylor Swift',
      description: 'Build scalable mobile apps with clean architecture, offline-first strategies, and advanced state management solutions.',
      icon: <FaMobile />
    },
    { 
      id: 9, 
      name: 'Machine Learning Engineering', 
      category: 'AI/ML', 
      level: 'Advanced', 
      duration: '25h',
      rating: 4.8,
      enrolled: 1345,
      instructor: 'Sam Altman',
      description: 'Production-grade ML systems covering model serving, monitoring, drift detection, and continuous training pipelines.',
      icon: <FaRobot />
    },
    { 
      id: 10, 
      name: 'Blockchain Development', 
      category: 'Web3', 
      level: 'Advanced', 
      duration: '18h',
      rating: 4.6,
      enrolled: 1123,
      instructor: 'Vitalik Buterin',
      description: 'Build decentralized applications with Ethereum, smart contract security, and Layer 2 scaling solutions.',
      icon: <FaNetworkWired />
    },
    { 
      id: 11, 
      name: 'Advanced Cybersecurity', 
      category: 'Security', 
      level: 'Expert', 
      duration: '22h',
      rating: 4.9,
      enrolled: 765,
      instructor: 'Kevin Mitnick',
      description: 'Offensive security techniques, advanced penetration testing, and blue team defense strategies for enterprise environments.',
      icon: <FaLock />
    },
    { 
      id: 12, 
      name: 'Neural Networks Deep Dive', 
      category: 'AI/ML', 
      level: 'Expert', 
      duration: '20h',
      rating: 4.7,
      enrolled: 987,
      instructor: 'Andrew Ng',
      description: 'Advanced neural network architectures, optimization techniques, and deployment strategies for production systems.',
      icon: <FaBrain />
    }
  ]);

  // UI state
  const [successMessage, setSuccessMessage] = useState('');
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedTraining, setExpandedTraining] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [activeTab, setActiveTab] = useState('myTrainings');
  const [sortBy, setSortBy] = useState('recent');

  // Simulate loading data
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Get random status for new enrollments
  const getRandomStatus = () => {
    const statuses = ['Pending Approval', 'In Progress', 'Completed'];
    return statuses[Math.floor(Math.random() * statuses.length)];
  };

  // Handle course enrollment
  const handleEnroll = (course) => {
    setIsLoading(true);
    
    setTimeout(() => {
      const newStatus = getRandomStatus();

      const newTraining = {
        id: Date.now(),
        title: course.name,
        type: 'Online Course',
        duration: course.duration,
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB'),
        status: newStatus,
        progress: newStatus === 'In Progress' ? Math.floor(Math.random() * 30) : undefined,
        category: course.category,
        level: course.level,
        rating: null,
        lastAccessed: 'Just now',
        modules: generateCourseModules(course.duration)
      };

      setTrainings(prev => [...prev, newTraining]);
      setAvailableCourses(prev => prev.filter(c => c.id !== course.id));
      setSuccessMessage(`✅ Successfully enrolled in "${course.name}"`);
      setIsLoading(false);

      setTimeout(() => setSuccessMessage(''), 4000);
    }, 1000);
  };

  // Generate random modules for a course
  const generateCourseModules = (duration) => {
    const totalHours = parseInt(duration);
    const moduleCount = Math.floor(Math.random() * 5) + 3;
    const modules = [];
    let remainingHours = totalHours;
    
    for (let i = 0; i < moduleCount; i++) {
      let moduleHours;
      if (i === moduleCount - 1) {
        moduleHours = remainingHours;
      } else {
        moduleHours = Math.min(Math.floor(Math.random() * (remainingHours / 2)) + 1, remainingHours);
      }
      
      const minutes = Math.floor((moduleHours % 1) * 60);
      const displayDuration = minutes > 0 
        ? `${Math.floor(moduleHours)}h ${minutes}m` 
        : `${moduleHours}h`;
      
      modules.push({
        name: `Module ${i + 1}: ${getRandomModuleTopic()}`,
        duration: displayDuration,
        completed: false
      });
    }
    
    return modules;
  };

  // Random module topics
  const getRandomModuleTopic = () => {
    const topics = [
      'Introduction', 'Fundamentals', 'Core Concepts', 'Advanced Techniques',
      'Best Practices', 'Case Studies', 'Hands-on Lab', 'Project Work',
      'Troubleshooting', 'Performance', 'Security', 'Deployment',
      'Architecture', 'Design Patterns', 'Optimization', 'Scaling',
      'Monitoring', 'Testing', 'Debugging', 'Integration'
    ];
    return topics[Math.floor(Math.random() * topics.length)];
  };

  // Toggle training details
  const toggleExpandTraining = (id) => {
    setExpandedTraining(expandedTraining === id ? null : id);
  };

  // Filter and sort courses
  const filteredCourses = availableCourses.filter(course => {
    const matchesFilter = filter === 'All' || course.category === filter;
    const matchesSearch = course.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Sort trainings
  const sortedTrainings = [...trainings].sort((a, b) => {
    if (sortBy === 'recent') {
      return new Date(b.deadline) - new Date(a.deadline);
    } else if (sortBy === 'progress') {
      return (b.progress || 0) - (a.progress || 0);
    } else {
      return a.title.localeCompare(b.title);
    }
  });

  // Status icon component
  const getStatusIcon = (status) => {
    switch (status) {
      case 'Completed': return <FaRegCheckCircle className="status-icon" />;
      case 'In Progress': return <FaSpinner className="status-icon spin" />;
      case 'Pending Approval': return <FaRegClock className="status-icon" />;
      default: return null;
    }
  };

  // Type icon component
  const getTypeIcon = (type) => {
    switch (type) {
      case 'Online Course': return <FaBookOpen className="type-icon" />;
      case 'Certification': return <FaCertificate className="type-icon" />;
      default: return null;
    }
  };

  // Category icon component
  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Frontend': return <FaCode />;
      case 'Backend': return <FaServer />;
      case 'DevOps': return <FaCloud />;
      case 'Cloud': return <FaCloud />;
      case 'Security': return <FaShieldAlt />;
      case 'Mobile': return <FaMobile />;
      case 'AI/ML': return <FaRobot />;
      case 'Web3': return <FaNetworkWired />;
      default: return <FaBook />;
    }
  };

  // Render star ratings
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} className="star filled" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<FaStar key={i} className="star half-filled" />);
      } else {
        stars.push(<FaRegStar key={i} className="star" />);
      }
    }
    
    return stars;
  };

  return (
    <motion.div 
      className="training-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="training-header">
        <h2><FaBook className="icon-heading" /> Training & Development</h2>
        
        <div className="header-controls">
          <div className="tabs">
            <button 
              className={`tab ${activeTab === 'myTrainings' ? 'active' : ''}`}
              onClick={() => setActiveTab('myTrainings')}
            >
              <FaUserGraduate /> My Trainings
            </button>
            <button 
              className={`tab ${activeTab === 'availableCourses' ? 'active' : ''}`}
              onClick={() => setActiveTab('availableCourses')}
            >
              <FaBookOpen /> Available Courses
            </button>
          </div>
          
          <div className="header-actions">
            <div className="search-box">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="filter-dropdown">
              <FaFilter className="filter-icon" />
              <select 
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="All">All Categories</option>
                <option value="Frontend">Frontend</option>
                <option value="Backend">Backend</option>
                <option value="DevOps">DevOps</option>
                <option value="Cloud">Cloud</option>
                <option value="Security">Security</option>
                <option value="AI/ML">AI/ML</option>
                <option value="Web3">Web3</option>
                <option value="Mobile">Mobile</option>
              </select>
              <FaChevronDown className="dropdown-arrow" />
            </div>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="loading-container">
          <FaSpinner className="loading-spinner" />
          <p>Loading your training dashboard...</p>
        </div>
      ) : (
        <>
          {activeTab === 'myTrainings' ? (
            <div className="training-section">
              <div className="section-header">
                <h3>My Current Trainings</h3>
                <div className="sort-options">
                  <span>Sort by:</span>
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="recent">Most Recent</option>
                    <option value="progress">Progress</option>
                    <option value="name">Name</option>
                    <option value="deadline">Deadline</option>
                  </select>
                </div>
              </div>
              
              <div className="training-cards">
                {sortedTrainings.length > 0 ? (
                  sortedTrainings.map(training => (
                    <motion.div 
                      key={training.id}
                      className={`training-card ${expandedTraining === training.id ? 'expanded' : ''}`}
                      whileHover={{ y: -5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div 
                        className="card-header"
                        onClick={() => toggleExpandTraining(training.id)}
                      >
                        <div className="training-info">
                          <div className="training-type">
                            {getTypeIcon(training.type)}
                            <span>{training.type}</span>
                          </div>
                          <h4>{training.title}</h4>
                          <div className="training-meta">
                            <span className="category">
                              {getCategoryIcon(training.category)}
                              {training.category}
                            </span>
                            <span className={`level ${training.level.toLowerCase()}`}>
                              {training.level}
                            </span>
                            <span className="duration"><FaClock /> {training.duration}</span>
                          </div>
                        </div>
                        
                        <div className="training-status">
                          <span className={`status-tag ${training.status.replace(/\s+/g, '').toLowerCase()}`}>
                            {getStatusIcon(training.status)}
                            {training.status}
                          </span>
                          {expandedTraining === training.id ? <FaChevronUp /> : <FaChevronDown />}
                        </div>
                      </div>
                      
                      <AnimatePresence>
                        {expandedTraining === training.id && (
                          <motion.div
                            className="training-details"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <div className="progress-section">
                              <div className="progress-container">
                                <div className="progress-header">
                                  <span>Progress</span>
                                  <span>{training.progress}%</span>
                                </div>
                                <div className="progress-bar">
                                  <motion.div
                                    className="progress-fill"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${training.progress}%` }}
                                    transition={{ duration: 1 }}
                                  />
                                </div>
                              </div>
                              
                              <div className="deadline">
                                <span className="label">Deadline:</span>
                                <span className="value">{training.deadline}</span>
                              </div>
                              
                              {training.rating && (
                                <div className="rating">
                                  <span className="label">Your Rating:</span>
                                  <div className="stars">
                                    {renderStars(training.rating)}
                                  </div>
                                </div>
                              )}
                            </div>
                            
                            <div className="modules-section">
                              <h5>Course Modules</h5>
                              <div className="modules-list">
                                {training.modules.map((module, index) => (
                                  <div key={index} className={`module ${module.completed ? 'completed' : ''}`}>
                                    <div className="module-info">
                                      <div className="checkbox">
                                        {module.completed ? (
                                          <FaCheckCircle className="completed-icon" />
                                        ) : (
                                          <div className="empty-checkbox" />
                                        )}
                                      </div>
                                      <span className="module-name">{module.name}</span>
                                      <span className="module-duration">{module.duration}</span>
                                    </div>
                                    {module.completed ? (
                                      <span className="completed-label">Completed</span>
                                    ) : (
                                      <button className="start-button">
                                        Start <FaPlay />
                                      </button>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                            
                            <div className="action-buttons">
                              {training.certificateLink && (
                                <a href={training.certificateLink} className="certificate-btn">
                                  <FaCertificate /> Download Certificate
                                </a>
                              )}
                              <button className="continue-btn">
                                {training.status === 'Completed' ? 'Review Course' : 'Continue Learning'}
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))
                ) : (
                  <div className="empty-state">
                    <div className="placeholder-image"></div>
                    <h4>No Active Trainings</h4>
                    <p>You haven't enrolled in any trainings yet. Browse available courses to get started.</p>
                    <button 
                      className="browse-btn"
                      onClick={() => setActiveTab('availableCourses')}
                    >
                      Browse Courses
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="courses-section">
              <div className="section-header">
                <h3>Available Courses</h3>
                <div className="results-count">
                  Showing {filteredCourses.length} of {availableCourses.length} courses
                </div>
              </div>
              
              <div className="courses-grid">
                {filteredCourses.length > 0 ? (
                  filteredCourses.map(course => (
                    <motion.div 
                      key={course.id}
                      className="course-card"
                      whileHover={{ y: -5, boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="course-image">
                        <div className="category-badge">
                          {getCategoryIcon(course.category)}
                          {course.category}
                        </div>
                        <div className="level-badge">
                          {course.level}
                        </div>
                        <div className="rating-badge">
                          {renderStars(course.rating)}
                          <span>{course.rating}</span>
                        </div>
                      </div>
                      
                      <div className="course-content">
                        <div className="course-header">
                          <h4>{course.name}</h4>
                        </div>
                        
                        <div className="course-meta">
                          <span className="instructor">
                            <FaUserGraduate /> {course.instructor}
                          </span>
                          <span className="duration">
                            <FaClock /> {course.duration}
                          </span>
                          <span className="enrolled">
                            {course.enrolled.toLocaleString()} enrolled
                          </span>
                        </div>
                        
                        <p className="description">{course.description}</p>
                        
                        <div className="course-actions">
                          <button 
                            className="details-btn"
                            onClick={() => setSelectedCourse(course)}
                          >
                            View Details
                          </button>
                          <button 
                            className="enroll-btn"
                            onClick={() => handleEnroll(course)}
                            disabled={isLoading}
                          >
                            {isLoading ? <FaSpinner className="spin" /> : 'Enroll Now'}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="empty-state">
                    <div className="placeholder-image"></div>
                    <h4>No Courses Match Your Search</h4>
                    <p>Try adjusting your filters or search term to find what you're looking for.</p>
                    <button 
                      className="clear-btn"
                      onClick={() => {
                        setFilter('All');
                        setSearchTerm('');
                      }}
                    >
                      Clear Filters
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}

      {/* Course Details Modal */}
      <AnimatePresence>
        {selectedCourse && (
          <motion.div 
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedCourse(null)}
          >
            <motion.div 
              className="modal-content"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                className="close-modal"
                onClick={() => setSelectedCourse(null)}
              >
                &times;
              </button>
              
              <div className="modal-header">
                <div className="course-category">
                  {getCategoryIcon(selectedCourse.category)}
                  {selectedCourse.category}
                </div>
                <h3>{selectedCourse.name}</h3>
                <div className="course-rating">
                  {renderStars(selectedCourse.rating)}
                  <span>{selectedCourse.rating} ({selectedCourse.enrolled.toLocaleString()} students)</span>
                </div>
              </div>
              
              <div className="modal-body">
                <div className="course-instructor">
                  <div className="instructor-avatar">
                    {selectedCourse.instructor.split(' ').map(name => name[0]).join('')}
                  </div>
                  <div className="instructor-info">
                    <span className="label">Instructor</span>
                    <span className="name">{selectedCourse.instructor}</span>
                  </div>
                </div>
                
                <div className="course-details">
                  <div className="detail-item">
                    <span className="label">Level</span>
                    <span className={`value level ${selectedCourse.level.toLowerCase()}`}>
                      {selectedCourse.level}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Duration</span>
                    <span className="value">{selectedCourse.duration}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Category</span>
                    <span className="value">
                      {getCategoryIcon(selectedCourse.category)}
                      {selectedCourse.category}
                    </span>
                  </div>
                </div>
                
                <div className="course-description">
                  <h4>About This Course</h4>
                  <p>{selectedCourse.description}</p>
                </div>
                
                <div className="course-syllabus">
                  <h4>What You'll Learn</h4>
                  <ul>
                    <li>Master core concepts of {selectedCourse.category}</li>
                    <li>Build real-world applications with industry best practices</li>
                    <li>Implement advanced patterns and architectures</li>
                    <li>Complete hands-on projects and case studies</li>
                    <li>Prepare for professional certification (if applicable)</li>
                    <li>Learn from production-grade examples and scenarios</li>
                  </ul>
                </div>
              </div>
              
              <div className="modal-footer">
                <button 
                  className="enroll-btn"
                  onClick={() => {
                    handleEnroll(selectedCourse);
                    setSelectedCourse(null);
                  }}
                  disabled={isLoading}
                >
                  {isLoading ? <FaSpinner className="spin" /> : 'Enroll Now'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Message */}
      <AnimatePresence>
        {successMessage && (
          <motion.div 
            className="enroll-success"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <FaCheckCircle className="success-icon" />
            {successMessage}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Training;