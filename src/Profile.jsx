import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { 
  FaEdit, FaSave, FaPlus, FaTimes, FaLinkedin, 
  FaGithub, FaCertificate, FaEye, FaDownload, 
  FaTrash, FaExternalLinkAlt, FaProjectDiagram,
  FaUserTie, FaCode, FaGraduationCap, FaShareAlt,
  FaStar, FaRegStar, FaChevronDown, FaChevronUp,
  FaEllipsisH, FaPaperclip, FaCalendarAlt
} from 'react-icons/fa';
import Modal from 'react-modal';
import { motion, AnimatePresence } from 'framer-motion';
import './Profile.css';

Modal.setAppElement('#root');

const Profile = () => {
  const [editMode, setEditMode] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [newCertification, setNewCertification] = useState({
    name: '',
    issuer: '',
    date: new Date().toISOString().split('T')[0],
    attachment: null
  });
  const [newProject, setNewProject] = useState({ 
    name: '', 
    description: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    technologies: [],
    newTech: ''
  });
  const [showCertForm, setShowCertForm] = useState(false);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [certModal, setCertModal] = useState({ isOpen: false, cert: null });
  const [skillRatings, setSkillRatings] = useState({});
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedSections, setExpandedSections] = useState({
    skills: true,
    certifications: true,
    projects: true,
    social: true
  });
  const [isDragging, setIsDragging] = useState(false);

  const [profile, setProfile] = useState({
    name: 'Ruthu',
    position: 'Senior Software Engineer',
    department: 'Product Development',
    skills: ['React', 'Node.js', 'AWS', 'Python', 'Docker'],
    joiningDate: '2020-03-15',
    contact: '+91 9876543210',
    email: 'ruthu@company.com',
    certifications: [
      { 
        name: 'AWS Certified Developer', 
        date: '2022-05-10', 
        issuer: 'Amazon Web Services',
        attachment: 'aws_cert.pdf'
      },
      { 
        name: 'React Professional', 
        date: '2021-11-15', 
        issuer: 'React Training',
        attachment: 'react_cert.pdf'
      }
    ],
    socialLinks: {
      linkedin: 'https://linkedin.com/in/ruthu',
      github: 'https://github.com/ruthu'
    },
    projects: [
      { 
        name: 'E-commerce Platform', 
        description: 'Built a scalable e-commerce solution with React and Node.js', 
        technologies: ['React', 'Node.js', 'MongoDB'],
        startDate: '2023-01-15',
        endDate: '2023-06-30'
      },
      { 
        name: 'Internal Tools Dashboard', 
        description: 'Developed admin dashboard for internal operations', 
        technologies: ['Vue.js', 'Firebase'],
        startDate: '2022-09-01',
        endDate: '2022-12-15'
      }
    ],
    bio: 'Experienced software engineer with 5+ years in web development. Passionate about creating efficient and scalable applications.'
  });

  // Initialize skill ratings
  useEffect(() => {
    const initialRatings = {};
    profile.skills.forEach(skill => {
      initialRatings[skill] = Math.floor(Math.random() * 5) + 1;
    });
    setSkillRatings(initialRatings);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSocialLinkChange = (platform, value) => {
    setProfile(prev => ({
      ...prev,
      socialLinks: { ...prev.socialLinks, [platform]: value }
    }));
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !profile.skills.includes(newSkill.trim())) {
      setProfile(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setSkillRatings(prev => ({ ...prev, [newSkill.trim()]: 3 }));
      toast.success('Skill added!');
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setProfile(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
    const newRatings = { ...skillRatings };
    delete newRatings[skillToRemove];
    setSkillRatings(newRatings);
    toast.info('Skill removed');
  };

  const handleCertificationChange = (e) => {
    const { name, value } = e.target;
    setNewCertification(prev => ({ ...prev, [name]: value }));
  };

  const handleAddCertification = () => {
    if (newCertification.name.trim() && !profile.certifications.some(c => c.name === newCertification.name.trim())) {
      setProfile(prev => ({
        ...prev,
        certifications: [...prev.certifications, {
          name: newCertification.name.trim(),
          issuer: newCertification.issuer.trim(),
          date: newCertification.date,
          attachment: newCertification.attachment
        }]
      }));
      toast.success('Certification added!');
      setNewCertification({
        name: '',
        issuer: '',
        date: new Date().toISOString().split('T')[0],
        attachment: null
      });
      setShowCertForm(false);
    }
  };

  const handleRemoveCertification = (certToRemove) => {
    setProfile(prev => ({
      ...prev,
      certifications: prev.certifications.filter(cert => cert.name !== certToRemove)
    }));
    toast.info('Certification removed');
  };

  const handleProjectChange = (e) => {
    const { name, value } = e.target;
    setNewProject(prev => ({ ...prev, [name]: value }));
  };

  const handleAddTech = () => {
    if (newProject.newTech.trim() && !newProject.technologies.includes(newProject.newTech.trim())) {
      setNewProject(prev => ({
        ...prev,
        technologies: [...prev.technologies, newProject.newTech.trim()],
        newTech: ''
      }));
    }
  };

  const handleRemoveTech = (techToRemove) => {
    setNewProject(prev => ({
      ...prev,
      technologies: prev.technologies.filter(tech => tech !== techToRemove)
    }));
  };

  const handleAddProject = () => {
    if (newProject.name.trim()) {
      setProfile(prev => ({
        ...prev,
        projects: [...prev.projects, {
          name: newProject.name.trim(),
          description: newProject.description.trim(),
          technologies: newProject.technologies,
          startDate: newProject.startDate,
          endDate: newProject.endDate
        }]
      }));
      toast.success('Project added!');
      setNewProject({ 
        name: '', 
        description: '',
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        technologies: [],
        newTech: ''
      });
      setShowProjectForm(false);
    }
  };

  const handleViewCertification = (certification) => {
    setCertModal({ isOpen: true, cert: certification });
  };

  const handleDownloadCertification = (certification) => {
    toast(`Downloading: ${certification.name}`);
    // Simulate download
    setTimeout(() => {
      toast.success(`Downloaded ${certification.name}`);
    }, 1500);
  };

  const handleSave = () => {
    toast.success('Profile saved successfully!');
    setEditMode(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Present';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleRatingChange = (skill, rating) => {
    setSkillRatings(prev => ({
      ...prev,
      [skill]: rating
    }));
  };

  const StarRating = ({ initialValue, onClick, editable = false }) => {
    return (
      <div className="star-rating">
        {[1, 2, 3, 4, 5].map((star) => (
          <motion.span 
            key={star}
            onClick={() => editable && onClick(star)}
            whileHover={editable ? { scale: 1.2 } : {}}
            whileTap={editable ? { scale: 0.9 } : {}}
            style={{ cursor: editable ? 'pointer' : 'default' }}
          >
            {star <= initialValue ? <FaStar /> : <FaRegStar />}
          </motion.span>
        ))}
      </div>
    );
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/pdf') {
      setNewCertification(prev => ({
        ...prev,
        attachment: file.name
      }));
      toast.success('PDF file added');
    } else {
      toast.error('Please upload a PDF file');
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setNewCertification(prev => ({
        ...prev,
        attachment: file.name
      }));
      toast.success('PDF file added');
    } else {
      toast.error('Please upload a PDF file');
    }
  };

  return (
    <div className="profile-portal">
      <ToastContainer 
        position="top-right" 
        autoClose={3000}
        toastStyle={{
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}
      />
      
      <Modal 
        isOpen={certModal.isOpen}
        onRequestClose={() => setCertModal({ isOpen: false, cert: null })}
        className="cert-modal"
        overlayClassName="cert-modal-overlay"
        closeTimeoutMS={300}
      >
        {certModal.cert && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <h3>{certModal.cert.name}</h3>
            <div className="cert-details">
              <p><strong>Issuer:</strong> {certModal.cert.issuer}</p>
              <p><strong>Date Earned:</strong> {formatDate(certModal.cert.date)}</p>
              {certModal.cert.attachment && (
                <p className="attachment">
                  <FaPaperclip /> {certModal.cert.attachment}
                </p>
              )}
            </div>
            <div className="modal-actions">
              {certModal.cert.attachment && (
                <motion.button 
                  className="download-btn"
                  onClick={() => handleDownloadCertification(certModal.cert)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaDownload /> Download Certificate
                </motion.button>
              )}
              <motion.button 
                className="close-btn"
                onClick={() => setCertModal({ isOpen: false, cert: null })}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Close
              </motion.button>
            </div>
          </motion.div>
        )}
      </Modal>

      <motion.div 
        className="profile-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="header-content">
          <h2><FaUserTie /> Employee Profile</h2>
          <p className="profile-subtitle">View and manage your professional profile</p>
        </div>
        <motion.button 
          className={`edit-btn ${editMode ? 'save' : ''}`}
          onClick={editMode ? handleSave : () => setEditMode(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {editMode ? <><FaSave /> Save Profile</> : <><FaEdit /> Edit Profile</>}
        </motion.button>
      </motion.div>

      <div className="profile-tabs">
        {['overview', 'skills', 'projects'].map(tab => (
          <motion.button
            key={tab}
            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {tab === 'overview' ? 'Overview' : 
             tab === 'skills' ? 'Skills & Certifications' : 'Projects'}
          </motion.button>
        ))}
      </div>

      <div className="profile-content">
        {(activeTab === 'overview' || activeTab === 'all') && (
          <motion.div 
            className="profile-section"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="profile-card basic-info">
              <div className="card-header">
                <h3><FaUserTie /> Basic Information</h3>
                {editMode && (
                  <motion.button 
                    className="edit-section-btn"
                    whileHover={{ rotate: 90 }}
                  >
                    <FaEdit />
                  </motion.button>
                )}
              </div>
              {editMode ? (
                <motion.div 
                  className="edit-form"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="form-group">
                    <label>Full Name</label>
                    <input type="text" name="name" value={profile.name} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label>Position</label>
                    <input type="text" name="position" value={profile.position} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label>Department</label>
                    <input type="text" name="department" value={profile.department} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label>Contact Number</label>
                    <input type="tel" name="contact" value={profile.contact} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input type="email" name="email" value={profile.email} onChange={handleChange} disabled />
                  </div>
                  <div className="form-group">
                    <label>Bio</label>
                    <textarea name="bio" value={profile.bio} onChange={handleChange} rows="4" />
                  </div>
                </motion.div>
              ) : (
                <div className="profile-details">
                  <div className="info-row">
                    <span className="info-label">Name:</span>
                    <span className="info-value">{profile.name}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Position:</span>
                    <span className="info-value">{profile.position}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Department:</span>
                    <span className="info-value">{profile.department}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Contact:</span>
                    <span className="info-value">{profile.contact}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Email:</span>
                    <span className="info-value">{profile.email}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Joining Date:</span>
                    <span className="info-value">{formatDate(profile.joiningDate)}</span>
                  </div>
                  {profile.bio && (
                    <div className="bio-section">
                      <h4>About Me</h4>
                      <p>{profile.bio}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {(activeTab === 'skills' || activeTab === 'all') && (
          <>
            <motion.div 
              className="profile-section"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <div 
                className="section-header" 
                onClick={() => toggleSection('skills')}
              >
                <h3><FaCode /> Technical Skills</h3>
                {expandedSections.skills ? <FaChevronUp /> : <FaChevronDown />}
              </div>
              <AnimatePresence>
                {expandedSections.skills && (
                  <motion.div
                    className="profile-card skills-card"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="skills-container">
                      {profile.skills.map((skill, index) => (
                        <motion.div 
                          key={index} 
                          className="skill-item"
                          whileHover={{ scale: 1.02 }}
                          transition={{ type: 'spring', stiffness: 300 }}
                        >
                          <div className="skill-info">
                            <span className="skill-name">{skill}</span>
                            {!editMode && (
                              <div className="skill-rating">
                                <StarRating 
                                  initialValue={skillRatings[skill]} 
                                  editable={false}
                                />
                              </div>
                            )}
                          </div>
                          {editMode && (
                            <div className="skill-actions">
                              <StarRating
                                initialValue={skillRatings[skill]}
                                onClick={(rate) => handleRatingChange(skill, rate)}
                                editable={true}
                              />
                              <motion.button 
                                className="remove-btn"
                                onClick={() => handleRemoveSkill(skill)}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <FaTrash />
                              </motion.button>
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                    {editMode && (
                      <motion.div 
                        className="add-skill"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <input 
                          type="text" 
                          value={newSkill} 
                          onChange={(e) => setNewSkill(e.target.value)} 
                          placeholder="Add new skill" 
                          onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()} 
                        />
                        <motion.button 
                          className="add-btn"
                          onClick={handleAddSkill}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <FaPlus /> Add
                        </motion.button>
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            <motion.div 
              className="profile-section"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <div 
                className="section-header" 
                onClick={() => toggleSection('certifications')}
              >
                <h3><FaGraduationCap /> Certifications</h3>
                {expandedSections.certifications ? <FaChevronUp /> : <FaChevronDown />}
              </div>
              <AnimatePresence>
                {expandedSections.certifications && (
                  <motion.div
                    className="profile-card certifications-card"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ul className="certifications-list">
                      {profile.certifications.map((cert, index) => (
                        <motion.li 
                          key={index} 
                          className="certification-item"
                          whileHover={{ x: 5 }}
                          transition={{ type: 'spring', stiffness: 300 }}
                        >
                          <div className="cert-info">
                            <h4>{cert.name}</h4>
                            <p className="cert-meta">
                              <span>{cert.issuer}</span>
                              <span>{formatDate(cert.date)}</span>
                            </p>
                          </div>
                          <div className="cert-actions">
                            <motion.button 
                              className="action-btn view-btn"
                              onClick={() => handleViewCertification(cert)}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <FaEye /> View
                            </motion.button>
                            {cert.attachment && (
                              <motion.button 
                                className="action-btn download-btn"
                                onClick={() => handleDownloadCertification(cert)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <FaDownload /> Download
                              </motion.button>
                            )}
                            {editMode && (
                              <motion.button 
                                className="action-btn remove-btn"
                                onClick={() => handleRemoveCertification(cert.name)}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <FaTrash />
                              </motion.button>
                            )}
                          </div>
                        </motion.li>
                      ))}
                    </ul>
                    {editMode && (
                      <div className="add-certification-section">
                        {showCertForm ? (
                          <motion.div 
                            className="certification-form"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            transition={{ duration: 0.3 }}
                          >
                            <div className="form-group">
                              <label>Certification Name</label>
                              <input 
                                type="text" 
                                name="name"
                                value={newCertification.name} 
                                onChange={handleCertificationChange} 
                                placeholder="Enter certification name" 
                              />
                            </div>
                            <div className="form-group">
                              <label>Issuer</label>
                              <input 
                                type="text" 
                                name="issuer"
                                value={newCertification.issuer} 
                                onChange={handleCertificationChange} 
                                placeholder="Enter issuer name" 
                              />
                            </div>
                            <div className="form-group">
                              <label>Date Earned</label>
                              <input 
                                type="date" 
                                name="date"
                                value={newCertification.date} 
                                onChange={handleCertificationChange} 
                              />
                            </div>
                            <div 
                              className={`file-upload ${isDragging ? 'dragging' : ''}`}
                              onDragOver={handleDragOver}
                              onDragLeave={handleDragLeave}
                              onDrop={handleDrop}
                            >
                              <input 
                                type="file" 
                                id="cert-file"
                                accept=".pdf"
                                onChange={handleFileChange}
                                style={{ display: 'none' }}
                              />
                              <label htmlFor="cert-file">
                                {newCertification.attachment ? (
                                  <div className="file-info">
                                    <FaPaperclip /> {newCertification.attachment}
                                  </div>
                                ) : (
                                  <div className="upload-prompt">
                                    <p>Drag & drop PDF certificate here or click to browse</p>
                                    <p className="hint">(Only PDF files accepted)</p>
                                  </div>
                                )}
                              </label>
                            </div>
                            <div className="form-actions">
                              <motion.button 
                                className="save-btn"
                                onClick={handleAddCertification}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <FaSave /> Save
                              </motion.button>
                              <motion.button 
                                className="cancel-btn"
                                onClick={() => setShowCertForm(false)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <FaTimes /> Cancel
                              </motion.button>
                            </div>
                          </motion.div>
                        ) : (
                          <motion.button 
                            className="add-certification-btn"
                            onClick={() => setShowCertForm(true)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <FaPlus /> Add Certification
                          </motion.button>
                        )}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            <motion.div 
              className="profile-section"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <div 
                className="section-header" 
                onClick={() => toggleSection('social')}
              >
                <h3><FaShareAlt /> Social Profiles</h3>
                {expandedSections.social ? <FaChevronUp /> : <FaChevronDown />}
              </div>
              <AnimatePresence>
                {expandedSections.social && (
                  <motion.div
                    className="profile-card social-card"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {editMode ? (
                      <div className="social-links-edit">
                        <div className="form-group">
                          <FaLinkedin className="social-icon" />
                          <input 
                            type="url" 
                            placeholder="LinkedIn URL" 
                            value={profile.socialLinks.linkedin} 
                            onChange={(e) => handleSocialLinkChange('linkedin', e.target.value)} 
                          />
                        </div>
                        <div className="form-group">
                          <FaGithub className="social-icon" />
                          <input 
                            type="url" 
                            placeholder="GitHub URL" 
                            value={profile.socialLinks.github} 
                            onChange={(e) => handleSocialLinkChange('github', e.target.value)} 
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="social-links-view">
                        {profile.socialLinks.linkedin ? (
                          <motion.a 
                            href={profile.socialLinks.linkedin} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="social-link"
                            whileHover={{ x: 5 }}
                          >
                            <FaLinkedin /> LinkedIn Profile <FaExternalLinkAlt />
                          </motion.a>
                        ) : (
                          <p className="no-link">No LinkedIn profile added</p>
                        )}
                        {profile.socialLinks.github ? (
                          <motion.a 
                            href={profile.socialLinks.github} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="social-link"
                            whileHover={{ x: 5 }}
                          >
                            <FaGithub /> GitHub Profile <FaExternalLinkAlt />
                          </motion.a>
                        ) : (
                          <p className="no-link">No GitHub profile added</p>
                        )}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </>
        )}

        {(activeTab === 'projects' || activeTab === 'all') && (
          <motion.div 
            className="profile-section"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <div 
              className="section-header" 
              onClick={() => toggleSection('projects')}
            >
              <h3><FaProjectDiagram /> Recent Projects</h3>
              {expandedSections.projects ? <FaChevronUp /> : <FaChevronDown />}
            </div>
            <AnimatePresence>
              {expandedSections.projects && (
                <motion.div
                  className="profile-card projects-card"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="projects-list">
                    {profile.projects.map((project, index) => (
                      <motion.div 
                        key={index} 
                        className="project-item"
                        whileHover={{ scale: 1.01 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                      >
                        <h4>{project.name}</h4>
                        <div className="project-dates">
                          <span>
                            <FaCalendarAlt /> {formatDate(project.startDate)}
                          </span>
                          <span> - </span>
                          <span>
                            <FaCalendarAlt /> {formatDate(project.endDate)}
                          </span>
                        </div>
                        <p className="project-description">{project.description}</p>
                        {project.technologies && project.technologies.length > 0 && (
                          <div className="project-technologies">
                            {project.technologies.map((tech, i) => (
                              <motion.span 
                                key={i} 
                                className="tech-tag"
                                whileHover={{ scale: 1.1 }}
                              >
                                {tech}
                              </motion.span>
                            ))}
                          </div>
                        )}
                        {editMode && (
                          <motion.button 
                            className="remove-project-btn"
                            onClick={() => {}}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <FaTrash /> Remove
                          </motion.button>
                        )}
                      </motion.div>
                    ))}
                  </div>
                  {editMode && (
                    <div className="add-project-section">
                      {showProjectForm ? (
                        <motion.div 
                          className="project-form"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="form-group">
                            <label>Project Name</label>
                            <input 
                              type="text" 
                              name="name"
                              value={newProject.name} 
                              onChange={handleProjectChange} 
                              placeholder="Enter project name" 
                            />
                          </div>
                          <div className="form-group">
                            <label>Description</label>
                            <textarea 
                              name="description"
                              value={newProject.description} 
                              onChange={handleProjectChange} 
                              placeholder="Enter project description" 
                              rows="3"
                            />
                          </div>
                          <div className="form-row">
                            <div className="form-group">
                              <label>Start Date</label>
                              <input 
                                type="date" 
                                name="startDate"
                                value={newProject.startDate} 
                                onChange={handleProjectChange} 
                              />
                            </div>
                            <div className="form-group">
                              <label>End Date</label>
                              <input 
                                type="date" 
                                name="endDate"
                                value={newProject.endDate} 
                                onChange={handleProjectChange} 
                              />
                            </div>
                          </div>
                          <div className="form-group">
                            <label>Technologies</label>
                            <div className="tech-input">
                              <input 
                                type="text" 
                                value={newProject.newTech} 
                                onChange={(e) => setNewProject({...newProject, newTech: e.target.value})} 
                                placeholder="Add technology" 
                                onKeyPress={(e) => e.key === 'Enter' && handleAddTech()} 
                              />
                              <motion.button 
                                className="add-tech-btn"
                                onClick={handleAddTech}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <FaPlus />
                              </motion.button>
                            </div>
                            <div className="tech-tags">
                              {newProject.technologies.map((tech, i) => (
                                <span key={i} className="tech-tag">
                                  {tech}
                                  <button 
                                    className="remove-tech"
                                    onClick={() => handleRemoveTech(tech)}
                                  >
                                    <FaTimes />
                                  </button>
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="form-actions">
                            <motion.button 
                              className="save-btn"
                              onClick={handleAddProject}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <FaSave /> Save Project
                            </motion.button>
                            <motion.button 
                              className="cancel-btn"
                              onClick={() => setShowProjectForm(false)}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <FaTimes /> Cancel
                            </motion.button>
                          </div>
                        </motion.div>
                      ) : (
                        <motion.button 
                          className="add-project-btn"
                          onClick={() => setShowProjectForm(true)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <FaPlus /> Add Project
                        </motion.button>
                      )}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Profile;