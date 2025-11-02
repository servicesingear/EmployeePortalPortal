import React, { useState, useEffect } from "react";
import "./Leave.css";

// ✅ Replace with your deployed Google Apps Script Web App URL
const SHEET_URL =
  "https://script.google.com/macros/s/AKfycbzFlOKXgtAIC8YFNwP9dnvemu7dA5zTv1iPXL1GMoVYYQmtYb3BQJm5INzefajcEZbvLQ/exec";

const Leave = () => {
  const username = localStorage.getItem("loggedInUser");

  const [leaveBalance, setLeaveBalance] = useState({
    sickLeave: 0,
    earnedLeave: 0,
    casualLeave: 0,
    maternityLeave: 0,
  });

  const [leaveRequests, setLeaveRequests] = useState([]);
  const [formData, setFormData] = useState({
    type: "",
    startDate: "",
    endDate: "",
    reason: "",
  });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const leaveTypes = [
    { name: "Sick Leave", icon: "🤒", color: "#FF9800" },
    { name: "Earned Leave", icon: "🏖️", color: "#4CAF50" },
    { name: "Casual Leave", icon: "☕", color: "#2196F3" },
    { name: "Maternity Leave", icon: "👶", color: "#E91E63" },
  ];

  const leaveKeyMap = {
    "Sick Leave": "sickLeave",
    "Earned Leave": "earnedLeave",
    "Casual Leave": "casualLeave",
    "Maternity Leave": "maternityLeave",
  };

  // 🔹 Load user leave data from Google Sheet
  useEffect(() => {
    const loadLeaveData = async () => {
      if (!username) return;
      setInitialLoading(true);
      try {
        const res = await fetch(`${SHEET_URL}?action=getLeaveData&username=${username}`);
        const data = await res.json();

        if (data.success) {
          setLeaveBalance(data.leaveBalance);
          setLeaveRequests(data.requests);
        } else {
          alert("Error loading leave data: " + data.message);
        }
      } catch (err) {
        console.error("Error fetching leave data:", err);
        alert("Error connecting to the server");
      } finally {
        setInitialLoading(false);
      }
    };

    loadLeaveData();
  }, [username]);

  // 🔹 Handle input changes
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // 🔹 Submit new leave request
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { type, startDate, endDate, reason } = formData;
    if (!type || !startDate || !endDate) {
      alert("Please fill all required fields");
      return;
    }

    const days =
      (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24) + 1;

    setLoading(true);

    try {
      const formBody = new URLSearchParams();
      formBody.append("action", "addLeave"); // ✅ must match Apps Script
      formBody.append("username", username);
      formBody.append("type", type);
      formBody.append("startDate", startDate);
      formBody.append("endDate", endDate);
      formBody.append("reason", reason);
      formBody.append("days", days);

      const res = await fetch(SHEET_URL, {
        method: "POST",
        body: formBody,
      });

      const data = await res.json();
      alert(data.message);

      if (data.success) {
        // Reload latest data from Google Sheets
        const updatedRes = await fetch(`${SHEET_URL}?action=getLeaveData&username=${username}`);
        const updatedData = await updatedRes.json();

        if (updatedData.success) {
          setLeaveBalance(updatedData.leaveBalance);
          setLeaveRequests(updatedData.requests);
          setFormData({ type: "", startDate: "", endDate: "", reason: "" });
        }
      }
    } catch (err) {
      console.error("Error submitting leave:", err);
      alert("Error submitting leave request");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) return <p style={{ textAlign: "center" }}>Loading leave data...</p>;

  return (
    <div className="leave-container">
      <h2>Leave Management</h2>

      {/* Leave Balances */}
      <div className="leave-balance-grid">
        {leaveTypes.map((lt) => (
          <div
            key={lt.name}
            className="leave-card"
            style={{ borderLeft: `6px solid ${lt.color}` }}
          >
            <div className="leave-icon">{lt.icon}</div>
            <div>
              <h4>{lt.name}</h4>
              <p>{leaveBalance[leaveKeyMap[lt.name]]} days left</p>
            </div>
          </div>
        ))}
      </div>

      {/* Apply for Leave Form */}
      <div className="leave-form">
        <h3>Apply for Leave</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Leave Type</label>
            <select name="type" value={formData.type} onChange={handleChange} required>
              <option value="">Select Type</option>
              {leaveTypes.map((lt) => (
                <option key={lt.name} value={lt.name}>
                  {lt.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Start Date</label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>End Date</label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Reason</label>
            <textarea
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              placeholder="Enter reason..."
            />
          </div>

          <button className="apply-btn" type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>

      {/* Leave Requests Table */}
      <div className="leave-table">
        <h3>My Leave Requests</h3>
        {leaveRequests.length === 0 ? (
          <p>No leave requests yet.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Type</th>
                <th>Dates</th>
                <th>Days</th>
                <th>Reason</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {leaveRequests.map((req, i) => (
                <tr key={i}>
                  <td>{req.type}</td>
                  <td>
                    {req.startDate} → {req.endDate}
                  </td>
                  <td>{req.days}</td>
                  <td>{req.reason}</td>
                  <td>{req.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Leave;
