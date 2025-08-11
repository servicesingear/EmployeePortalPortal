// ManagerPerformance.jsx
import React, { useEffect, useState } from 'react';
import './ManagerPerformance.css';
import { FaUserCheck, FaFileAlt } from 'react-icons/fa';

const ManagerPerformance = () => {
  const [sharedReviews, setSharedReviews] = useState([]);

  useEffect(() => {
    const data = localStorage.getItem('sharedToManager');
    if (data) {
      try {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) {
          setSharedReviews(parsed);
        } else {
          console.error('Invalid data structure in localStorage');
        }
      } catch (e) {
        console.error('Error parsing sharedToManager data:', e);
      }
    }
  }, []);

  return (
    <div className="manager-container">
      <h2 className="manager-title">
        <FaUserCheck className="icon-title" /> Reviews Shared by Employees
      </h2>

      {sharedReviews.length === 0 ? (
        <p className="no-data">No reviews shared yet.</p>
      ) : (
        <div className="shared-grid">
          {sharedReviews.map((review) => (
            <div key={review.id || review.employeeId} className="shared-card">
              <h3>{review.name || 'Unnamed Employee'}</h3>
              <p><strong>Employee ID:</strong> {review.employeeId || 'N/A'}</p>
              <p><strong>Title:</strong> {review.title || 'Not provided'}</p>
              <p><strong>Notes:</strong> {review.notes || 'No notes added.'}</p>
              <div className="shared-icon"><FaFileAlt /></div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManagerPerformance;
