import React, { useEffect, useState } from "react";
import "./Holidays.css";

const SHEET_URL =
  "https://script.google.com/macros/s/AKfycbzFlOKXgtAIC8YFNwP9dnvemu7dA5zTv1iPXL1GMoVYYQmtYb3BQJm5INzefajcEZbvLQ/exec";

const HolidayList = () => {
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHolidays = async () => {
      try {
        const res = await fetch(`${SHEET_URL}?action=getHolidays`);
        const data = await res.json();

        if (data.success) {
          setHolidays(data.holidays);
        } else {
          alert("Error loading holidays: " + data.message);
        }
      } catch (err) {
        console.error("Error fetching holidays:", err);
        alert("Could not connect to server");
      } finally {
        setLoading(false);
      }
    };
    fetchHolidays();
  }, []);

  if (loading) return <p style={{ textAlign: "center" }}>Loading holidays...</p>;

  return (
    <div className="holiday-container">
      <h2>Holiday List – 2026</h2>
      <table className="holiday-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Day</th>
            <th>Holiday</th>
          </tr>
        </thead>
        <tbody>
          {holidays.length === 0 ? (
            <tr>
              <td colSpan="3" style={{ textAlign: "center" }}>
                No holidays found
              </td>
            </tr>
          ) : (
            holidays.map((holiday, i) => (
              <tr key={i}>
                <td>{new Date(holiday.date).toLocaleDateString("en-GB")}</td>
                <td>{holiday.day}</td>
                <td>{holiday.name}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default HolidayList;
