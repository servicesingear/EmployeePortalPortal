import React, { useState } from "react";
import "./LoginForm.css";

// ✅ Replace with your deployed Google Apps Script Web App URL (ending with /exec)
const SHEET_URL =
"https://script.google.com/macros/s/AKfycbzFlOKXgtAIC8YFNwP9dnvemu7dA5zTv1iPXL1GMoVYYQmtYb3BQJm5INzefajcEZbvLQ/exec";

const LoginForm = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isChanging, setIsChanging] = useState(false);
  const [loading, setLoading] = useState(false);

  // 🔹 Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${SHEET_URL}?action=getEmployees`);
      const data = await res.json();

      if (!data.success) {
        alert("Error fetching employee data");
        return;
      }

      const user = data.employees.find(
        (u) => u.username === username && u.password === password
      );

      if (user) {
        localStorage.setItem("loggedInUser", user.username);
        localStorage.setItem("userRole", user.role);
        onLogin(user.username, user.role);
      } else {
        alert("Invalid username or password");
      }
    } catch (err) {
      console.error(err);
      alert("Error connecting to the server");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Handle Password Change
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new URLSearchParams();
      formData.append("action", "changePassword"); // ✅ required for Apps Script
      formData.append("username", username.trim());
      formData.append("oldPassword", oldPassword.trim());
      formData.append("newPassword", newPassword.trim());

      const res = await fetch(SHEET_URL, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      alert(data.message);

      if (data.success) {
        setIsChanging(false);
        setOldPassword("");
        setNewPassword("");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>{isChanging ? "Change Password" : "Employee Login"}</h2>

        {!isChanging ? (
          <form onSubmit={handleLogin}>
            <div className="input-group">
              <label>Username</label>
              <input
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>

            <div className="extra-actions">
              <button
                type="button"
                className="btn-link"
                onClick={() => setIsChanging(true)}
              >
                Change Password
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleChangePassword}>
            <div className="input-group">
              <label>Username</label>
              <input
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label>Old Password</label>
              <input
                type="password"
                placeholder="Enter old password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label>New Password</label>
              <input
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Updating..." : "Update Password"}
            </button>

            <div className="extra-actions">
              <button
                type="button"
                className="btn-link"
                onClick={() => setIsChanging(false)}
              >
                ← Back to Login
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginForm;
