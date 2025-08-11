import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaPlane, FaCar, FaCalendarAlt, FaMapMarkerAlt,
  FaExternalLinkAlt, FaHotel, FaTrain, FaShip,
  FaCheckCircle, FaClock, FaTimesCircle, FaPlus,
  FaSearch, FaFilter, FaFileDownload, FaInfoCircle
} from 'react-icons/fa';
import './Travel.css';

const Travel = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [expandedPolicy, setExpandedPolicy] = useState(null);
  const [tripData, setTripData] = useState({
    upcoming: [],
    past: [],
    policies: []
  });
  const navigate = useNavigate();

  // Simulate API call with useEffect
  useEffect(() => {
    setLoading(true);
    // In a real app, this would be an API call
    setTimeout(() => {
      setTripData({
        upcoming: [
          {
            id: 1,
            purpose: 'AWS re:Invent Conference',
            destination: 'Las Vegas, USA',
            date: '2025-11-30 to 2025-12-04',
            status: 'Approved',
            type: 'flight',
            budget: '$3,800',
            details: {
              flight: 'DL 2456 (Business)',
              hotel: 'The Venetian Resort',
              agenda: 'Day 1: Keynotes | Day 2-3: Workshops | Day 4: Networking'
            }
          },
          {
            id: 2,
            purpose: 'Client Security Review',
            destination: 'Berlin, Germany',
            date: '2025-09-15 to 2025-09-18',
            status: 'Pending Approval',
            type: 'flight',
            budget: '$2,900',
            details: {
              flight: 'LH 430 (Premium Economy)',
              hotel: 'InterContinental Berlin',
              agenda: 'Client meetings at HQ | Security audit | Team dinner'
            }
          },
          {
            id: 4,
            purpose: 'Regional Team Offsite',
            destination: 'Chicago, USA',
            date: '2025-10-10 to 2025-10-12',
            status: 'Draft',
            type: 'train',
            budget: '$1,200',
            details: {
              transport: 'Amtrak Acela Express',
              hotel: 'Chicago Marriott Downtown',
              agenda: 'Team building | Strategy planning | Social events'
            }
          }
        ],
        past: [
          {
            id: 3,
            purpose: 'Product Launch Support',
            destination: 'New York, USA',
            date: '2025-03-10 to 2025-03-15',
            status: 'Completed',
            type: 'flight',
            budget: '$2,100',
            details: {
              flight: 'UA 1582 (Economy Plus)',
              hotel: 'The Roosevelt Hotel',
              agenda: 'Press conference | Client demos | Post-launch party',
              expenses: '$2,087.50 (under budget)'
            }
          },
          {
            id: 5,
            purpose: 'Tech Conference',
            destination: 'San Francisco, USA',
            date: '2024-11-05 to 2024-11-08',
            status: 'Completed',
            type: 'flight',
            budget: '$2,500',
            details: {
              flight: 'AA 342 (Economy)',
              hotel: 'Marriott Marquis',
              agenda: 'Keynotes | Breakout sessions | Networking',
              expenses: '$2,420.30 (under budget)'
            }
          }
        ],
        policies: [
          {
            id: 1,
            title: "Advance Approval",
            content: "All international trips require 30-day advance approval. Domestic trips require 14-day advance approval.",
            important: true
          },
          {
            id: 2,
            title: "Booking Process",
            content: "Use corporate travel code: ITDEPT2025 when booking through our preferred providers.",
            important: false
          },
          {
            id: 3,
            title: "Preferred Airlines",
            content: "Preferred airlines: Delta, United, Lufthansa. Business class allowed for flights over 6 hours.",
            important: false
          },
          {
            id: 4,
            title: "Accommodation Standards",
            content: "Max $250/night for hotels in major cities ($200 in secondary markets). Airbnb allowed with prior approval.",
            important: true
          },
          {
            id: 5,
            title: "Meal Allowances",
            content: "$75/day meal allowance (keep receipts). Alcohol not reimbursable unless with clients.",
            important: false
          },
          {
            id: 6,
            title: "Ground Transportation",
            content: "Uber Business is the preferred transport. Rental cars require additional insurance.",
            important: false
          }
        ]
      });
      setLoading(false);
    }, 800);
  }, []);

  const handleTabClick = (tab) => {
    setLoading(true);
    setTimeout(() => {
      setActiveTab(tab);
      setLoading(false);
    }, 400);
  };

  const handleNewTripRequest = () => {
    navigate('/travel/new');
  };

  const handleViewTripDetails = (tripId) => {
    navigate(`/travel/details/${tripId}`);
  };

  const handleExternalLink = (url) => {
    const fullUrl = url.startsWith('http') ? url : `https://${url}`;
    try {
      window.open(fullUrl, '_blank', 'noopener,noreferrer');
    } catch (error) {
      alert('Invalid URL. Please contact IT support.');
    }
  };

  const togglePolicy = (policyId) => {
    setExpandedPolicy(expandedPolicy === policyId ? null : policyId);
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'approved':
      case 'completed':
        return <FaCheckCircle className="status-icon approved" />;
      case 'pending approval':
        return <FaClock className="status-icon pending" />;
      case 'draft':
        return <FaInfoCircle className="status-icon draft" />;
      default:
        return <FaTimesCircle className="status-icon rejected" />;
    }
  };

  const getTransportIcon = (type) => {
    switch (type) {
      case 'flight':
        return <FaPlane />;
      case 'car':
        return <FaCar />;
      case 'train':
        return <FaTrain />;
      case 'ship':
        return <FaShip />;
      default:
        return <FaHotel />;
    }
  };

  const filteredTrips = (trips) => {
    return trips.filter(trip => {
      const matchesSearch = trip.purpose.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          trip.destination.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'all' || 
                          trip.status.toLowerCase().replace(' ', '-') === filterStatus;
      return matchesSearch && matchesStatus;
    });
  };

  const downloadPolicyPDF = () => {
    alert('Downloading full travel policy PDF...');
    // In a real app, this would trigger a PDF download
  };

  return (
    <div className="travel-portal">
      <div className="travel-header">
        <div className="header-left">
          <h2><FaPlane /> IT Department Travel Portal</h2>
          <p className="subtitle">Manage your business trips and travel policies</p>
        </div>
        <button className="request-btn primary-btn" onClick={handleNewTripRequest}>
          <FaPlus /> New Trip Request
        </button>
      </div>

      <div className="travel-tabs">
        {['upcoming', 'past', 'policies'].map(tab => (
          <button
            key={tab}
            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
            onClick={() => handleTabClick(tab)}
          >
            {tab === 'upcoming' ? 'Upcoming Trips' :
             tab === 'past' ? 'Past Trips' : 'Travel Policies'}
            {tab === 'upcoming' && tripData.upcoming.length > 0 && (
              <span className="notification-badge">{tripData.upcoming.length}</span>
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading your travel data...</p>
        </div>
      ) : (
        <div className="travel-content">
          {['upcoming', 'past'].includes(activeTab) && (
            <div className="trip-controls">
              <div className="search-box">
                <FaSearch className="search-icon" />
                <input
                  type="text"
                  placeholder={`Search ${activeTab} trips...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="filter-dropdown">
                <FaFilter className="filter-icon" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  <option value="approved">Approved</option>
                  <option value="pending-approval">Pending</option>
                  <option value="draft">Draft</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <button className="export-btn" onClick={() => alert('Exporting trip data...')}>
                <FaFileDownload /> Export
              </button>
            </div>
          )}

          {activeTab === 'upcoming' && (
            <div className="trips-list">
              {filteredTrips(tripData.upcoming).length > 0 ? (
                filteredTrips(tripData.upcoming).map(trip => (
                  <div
                    key={trip.id}
                    className={`trip-card ${trip.status.toLowerCase().replace(' ', '-')}`}
                    onClick={() => handleViewTripDetails(trip.id)}
                  >
                    <div className="trip-icon">
                      {getTransportIcon(trip.type)}
                    </div>
                    <div className="trip-details">
                      <h3>{trip.purpose}</h3>
                      <p className="destination"><FaMapMarkerAlt /> {trip.destination}</p>
                      <p className="date"><FaCalendarAlt /> {trip.date}</p>
                      <div className="trip-meta">
                        <span className="status">
                          {getStatusIcon(trip.status)}
                          {trip.status}
                        </span>
                        <span className="budget">{trip.budget}</span>
                      </div>
                      {trip.details && trip.details.agenda && (
                        <p className="trip-agenda-preview">
                          {trip.details.agenda.split('|')[0].trim()}...
                        </p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-results">
                  <p>No upcoming trips found matching your criteria.</p>
                  <button className="primary-btn" onClick={() => {
                    setSearchTerm('');
                    setFilterStatus('all');
                  }}>
                    Clear filters
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'past' && (
            <div className="trips-list">
              {filteredTrips(tripData.past).length > 0 ? (
                filteredTrips(tripData.past).map(trip => (
                  <div
                    key={trip.id}
                    className="trip-card completed"
                    onClick={() => handleViewTripDetails(trip.id)}
                  >
                    <div className="trip-icon">
                      {getTransportIcon(trip.type)}
                    </div>
                    <div className="trip-details">
                      <h3>{trip.purpose}</h3>
                      <p className="destination"><FaMapMarkerAlt /> {trip.destination}</p>
                      <p className="date"><FaCalendarAlt /> {trip.date}</p>
                      <div className="trip-meta">
                        <span className="status">
                          {getStatusIcon(trip.status)}
                          {trip.status}
                        </span>
                        <span className="budget">{trip.budget}</span>
                      </div>
                      {trip.details && trip.details.expenses && (
                        <p className="expenses">{trip.details.expenses}</p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-results">
                  <p>No past trips found matching your criteria.</p>
                  <button className="primary-btn" onClick={() => {
                    setSearchTerm('');
                    setFilterStatus('all');
                  }}>
                    Clear filters
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'policies' && (
            <div className="policies-section">
              <div className="policies-header">
                <h3>IT Department Travel Policies</h3>
                <button className="download-btn" onClick={downloadPolicyPDF}>
                  <FaFileDownload /> Download Full Policy
                </button>
              </div>
              
              <div className="policies-list">
                {tripData.policies.map(policy => (
                  <div 
                    key={policy.id} 
                    className={`policy-item ${policy.important ? 'important' : ''}`}
                  >
                    <div 
                      className="policy-header" 
                      onClick={() => togglePolicy(policy.id)}
                    >
                      <h4>{policy.title}</h4>
                      <span className="toggle-icon">
                        {expandedPolicy === policy.id ? '−' : '+'}
                      </span>
                    </div>
                    {expandedPolicy === policy.id && (
                      <div className="policy-content">
                        <p>{policy.content}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="quick-links-section">
                <h4>Travel Resources</h4>
                <div className="quick-links-grid">
                  <div className="resource-card" onClick={() => handleExternalLink('https://www.booking.com')}>
                    <div className="resource-icon"><FaPlane /></div>
                    <h5>Corporate Travel Portal</h5>
                    <p>Book flights, hotels, and rental cars</p>
                    <span className="external-link">Visit <FaExternalLinkAlt /></span>
                  </div>

                  <div className="resource-card" onClick={() => handleExternalLink('https://www.expensify.com')}>
                    <div className="resource-icon"><FaFileDownload /></div>
                    <h5>Expense Reporting</h5>
                    <p>Submit travel receipts and expenses</p>
                    <span className="external-link">Visit <FaExternalLinkAlt /></span>
                  </div>

                  <div className="resource-card" onClick={() => handleExternalLink('https://www.visa.com')}>
                    <div className="resource-icon"><FaInfoCircle /></div>
                    <h5>Visa Assistance</h5>
                    <p>Visa and travel documentation help</p>
                    <span className="external-link">Visit <FaExternalLinkAlt /></span>
                  </div>

                  <div className="resource-card" onClick={() => handleExternalLink('https://www.travelinsurance.com')}>
                    <div className="resource-icon"><FaInfoCircle /></div>
                    <h5>Travel Insurance</h5>
                    <p>Coverage options and emergency contacts</p>
                    <span className="external-link">Visit <FaExternalLinkAlt /></span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Travel;