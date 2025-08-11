import React, { useEffect, useState } from 'react';
import './Performance.css';
import { saveAs } from 'file-saver';
import {
  FaStar, FaUserTie, FaTasks, FaCommentDots,
  FaPlus, FaSave, FaEdit, FaTrash, FaShare
} from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const performanceData = [
  {
    id: 1,
    name: 'Sujatha',
    designation: 'Software Engineer',
    rating: 4.9,
    progress: 85,
    feedback: 'Excellent problem-solving and collaboration.'
  },
  {
    id: 2,
    name: 'Ruthu',
    designation: 'Frontend Developer',
    rating: 4.5,
    progress: 72,
    feedback: 'Good UI work. Needs improvement in testing.'
  },
  {
    id: 3,
    name: 'Sneha Sharma',
    designation: 'Backend Developer',
    rating: 3.8,
    progress: 90,
    feedback: 'Strong API skills and reliable delivery.'
  }
];

const Performance = () => {
  const [reviews, setReviews] = useState(() => {
    const submitted = JSON.parse(localStorage.getItem('submittedReviews')) || [];
    return submitted.length > 0 ? submitted : [
      { id: 1, name: '', employeeId: '', title: '', notes: '', editable: true, shared: false }
    ];
  });

  const [projectData, setProjectData] = useState(() => {
    return JSON.parse(localStorage.getItem('sixMonthProjects')) || [
      {
        id: Date.now(),
        name: '',
        duration: '',
        contributions: '',
        tools: '',
        results: ''
      }
    ];
  });

  useEffect(() => {
    const shared = JSON.parse(localStorage.getItem('sharedToManager')) || [];
    setReviews(prev =>
      prev.map(r => {
        const match = shared.find(s => s.id === r.id);
        return match ? { ...r, shared: true } : r;
      })
    );
  }, []);

  const handleInputChange = (id, field, value) => {
    setReviews(prev =>
      prev.map(r => r.id === id ? { ...r, [field]: value } : r)
    );
  };

  const handleSave = (id) => {
    setReviews(prev =>
      prev.map(r => r.id === id ? { ...r, editable: false } : r)
    );
    toast.success('Review saved!');
  };

  const handleEdit = (id) => {
    setReviews(prev =>
      prev.map(r => r.id === id ? { ...r, editable: true } : r)
    );
  };

  const handleDelete = (id) => {
    setReviews(prev => prev.filter(r => r.id !== id));
    const shared = JSON.parse(localStorage.getItem('sharedToManager')) || [];
    const updated = shared.filter(r => r.id !== id);
    localStorage.setItem('sharedToManager', JSON.stringify(updated));
    toast.info('Review deleted!');
  };

  const handleAddNew = () => {
    const newId = Date.now();
    setReviews(prev => [
      ...prev,
      { id: newId, name: '', employeeId: '', title: '', notes: '', editable: true, shared: false }
    ]);
  };

  const handleCheckbox = (id, checked) => {
    const updatedReviews = reviews.map(r =>
      r.id === id ? { ...r, shared: checked } : r
    );
    setReviews(updatedReviews);

    setTimeout(() => {
      const reviewToShare = updatedReviews.find(r => r.id === id);
      if (!reviewToShare) return;

      let sharedReviews = JSON.parse(localStorage.getItem('sharedToManager')) || [];

      if (checked) {
        const index = sharedReviews.findIndex(r => r.id === id);
        if (index !== -1) {
          sharedReviews[index] = reviewToShare;
        } else {
          sharedReviews.push(reviewToShare);
        }
      } else {
        sharedReviews = sharedReviews.filter(r => r.id !== id);
      }

      localStorage.setItem('sharedToManager', JSON.stringify(sharedReviews));
    }, 100);
  };

  const handleSubmit = () => {
    localStorage.setItem('submittedReviews', JSON.stringify(reviews));
    const shared = reviews.filter(r => r.shared);
    localStorage.setItem('sharedToManager', JSON.stringify(shared));
    toast.success('✅ Reviews submitted successfully!');
  };

  const updateProjectField = (id, field, value) => {
    setProjectData(prev =>
      prev.map(p => p.id === id ? { ...p, [field]: value } : p)
    );
  };

  const addNewProject = () => {
    setProjectData(prev => [
      ...prev,
      {
        id: Date.now(),
        name: '',
        duration: '',
        contributions: '',
        tools: '',
        results: ''
      }
    ]);
  };

  const removeProject = (id) => {
    setProjectData(prev => prev.filter(p => p.id !== id));
    toast.info('Project removed');
  };

  const saveProjects = () => {
    localStorage.setItem('sixMonthProjects', JSON.stringify(projectData));
    toast.success('📌 Project data saved!');
  };

  const exportCSV = () => {
    const reviewHeaders = ['Name', 'Employee ID', 'Review Title', 'Notes', 'Shared with Manager'];
    const reviewRows = reviews.map(r => [
      r.name,
      r.employeeId,
      r.title,
      r.notes.replace(/\n/g, ' '),
      r.shared ? 'Yes' : 'No'
    ]);

    const projectHeaders = ['Project Name', 'Duration', 'Contributions', 'Tools/Technologies', 'Outcome'];
    const projectRows = projectData.map(p => [
      p.name,
      p.duration,
      p.contributions.replace(/\n/g, ' '),
      p.tools,
      p.results.replace(/\n/g, ' ')
    ]);

    const allRows = [
      reviewHeaders,
      ...reviewRows,
      [],
      projectHeaders,
      ...projectRows
    ];

    const csvContent = allRows.map(row => row.map(field => `"${field}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'Employee_Performance_Data.csv');
    toast.info('📥 CSV downloaded!');
  };

  return (
    <div className="performance-container">
      <ToastContainer position="bottom-right" autoClose={2500} />

      <h2 className="performance-title">
        <FaTasks className="icon-title" /> Employee Performance Overview
      </h2>

      <div className="performance-grid">
        {performanceData.map((emp) => (
          <div key={emp.id} className="card">
            <div className="card-header">
              <FaUserTie className="user-icon" />
              <div>
                <h3>{emp.name}</h3>
                <p className="designation">{emp.designation}</p>
              </div>
            </div>
            <div className="card-body">
              <div className="progress-label">Goal Completion</div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${emp.progress}%` }}></div>
              </div>
              <div className="rating-section">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={i < Math.round(emp.rating) ? 'star filled' : 'star'}
                  />
                ))}
                <span className="rating-score">{emp.rating.toFixed(1)}</span>
              </div>
              <div className="feedback">
                <FaCommentDots className="feedback-icon" /> {emp.feedback}
              </div>
            </div>
          </div>
        ))}
      </div>

      <h2 className="performance-title">📝 Year-End Review Submission</h2>

      {reviews.map((rev) => (
        <div key={rev.id} className="review-card">
          <label>
            Name:
            <input
              type="text"
              value={rev.name}
              disabled={!rev.editable}
              onChange={(e) => handleInputChange(rev.id, 'name', e.target.value)}
            />
          </label>
          <label>
            Employee ID:
            <input
              type="text"
              value={rev.employeeId}
              disabled={!rev.editable}
              onChange={(e) => handleInputChange(rev.id, 'employeeId', e.target.value)}
            />
          </label>
          <label>
            Review Title:
            <input
              type="text"
              value={rev.title}
              disabled={!rev.editable}
              onChange={(e) => handleInputChange(rev.id, 'title', e.target.value)}
            />
          </label>
          <label>
            Notes:
            <textarea
              value={rev.notes}
              disabled={!rev.editable}
              onChange={(e) => handleInputChange(rev.id, 'notes', e.target.value)}
            />
          </label>

          <label className="checkbox-label">
            <FaShare /> Share with Manager:
            <input
              type="checkbox"
              checked={rev.shared}
              onChange={(e) => handleCheckbox(rev.id, e.target.checked)}
            />
          </label>

          <div className="review-actions">
            {rev.editable ? (
              <button onClick={() => handleSave(rev.id)}><FaSave /> Save</button>
            ) : (
              <button onClick={() => handleEdit(rev.id)}><FaEdit /> Edit</button>
            )}
            <button onClick={() => handleDelete(rev.id)}><FaTrash /> Delete</button>
          </div>
        </div>
      ))}

      <div className="review-controls">
        <button onClick={handleAddNew}><FaPlus /> Add New Review</button>
       
      </div>

      <h2 className="performance-title">📌 6-Month Project Contributions</h2>

      {projectData.map((proj) => (
        <div key={proj.id} className="project-card">
          <label>
            Project Name:
            <input
              type="text"
              value={proj.name}
              onChange={(e) => updateProjectField(proj.id, 'name', e.target.value)}
            />
          </label>
          <label>
            Duration:
            <input
              type="text"
              placeholder="e.g., Jan 2025 - Jun 2025"
              value={proj.duration}
              onChange={(e) => updateProjectField(proj.id, 'duration', e.target.value)}
            />
          </label>
          <label>
            Contributions:
            <textarea
              value={proj.contributions}
              onChange={(e) => updateProjectField(proj.id, 'contributions', e.target.value)}
            />
          </label>
          <label>
            Tools / Technologies Used:
            <input
              type="text"
              value={proj.tools}
              onChange={(e) => updateProjectField(proj.id, 'tools', e.target.value)}
            />
          </label>
          <label>
            Outcome / Results:
            <textarea
              value={proj.results}
              onChange={(e) => updateProjectField(proj.id, 'results', e.target.value)}
            />
          </label>

          <button onClick={() => removeProject(proj.id)} className="delete-project">
            <FaTrash /> Remove
          </button>
        </div>
      ))}

      <div className="review-controls">
        <button onClick={addNewProject}><FaPlus /> Add Project</button>
        <button onClick={saveProjects}><FaSave /> Save Projects</button>
         <button onClick={handleSubmit}>Submit All</button>
        <button onClick={exportCSV}>📥 Download CSV</button>
      </div>
    </div>
  );
};

export default Performance;
