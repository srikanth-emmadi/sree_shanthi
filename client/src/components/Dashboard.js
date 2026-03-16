import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "./Dashboard.css";
import { API_URL } from './config';

function Dashboard() {
  const [notification, setNotification] = useState(null);

  const [notices, setNotices] = useState([]);
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);   // for admins
  const [user, setUser] = useState(null);   // for non-admins
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ name: "", phone: "", address: "", savings: "", role: "" });
  const [newUser, setNewUser] = useState({ name: "", phone: "", address: "", savings: "", role: "", password: "" });

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  const fetchJson = async (url, options = {}) => {
    const res = await fetch(url, options);
    if (!res.ok) throw new Error(await res.text() || "Request failed");
    return res.json();
  };

  // ✅ Fetch notices
  useEffect(() => {
    if (!token) return;
    fetchJson("${API_URL}/api/dashboard/notices", {
      headers: { Authorization: "Bearer " + token }
    }).then(setNotices).catch(err => console.error("❌ Notices error:", err.message));
  }, [token]);

  // ✅ Fetch events
  useEffect(() => {
    if (!token) return;
    fetchJson("${API_URL}/api/dashboard/events", {
      headers: { Authorization: "Bearer " + token }
    }).then(setEvents).catch(err => console.error("❌ Events error:", err.message));
  }, [token]);

  // ✅ Fetch users
  useEffect(() => {
    if (!token) return;
    const url = role === "admin" ? "${API_URL}/api/users" : "${API_URL}/api/users/me";
    fetchJson(url, { headers: { Authorization: "Bearer " + token } })
      .then(data => role === "admin" ? setUsers(data) : setUser(data))
      .catch(err => console.error("❌ Users error:", err.message));
  }, [token, role]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleNewChange = (e) => setNewUser({ ...newUser, [e.target.name]: e.target.value });

  const saveEdit = async () => {
    try {
      const endpoint = role === "admin"
        ? `${API_URL}/api/users/${editingUser}`
        : "${API_URL}/api/users/me";

      const data = await fetchJson(endpoint, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
        body: JSON.stringify(formData)
      });

      setNotification({ type: "success", message: "User updated successfully!" });

      setEditingUser(null);
      role === "admin" ? setUsers(users.map(u => u._id === data._id ? data : u)) : setUser(data);
    } catch (err) {
      setNotification({ type: "error", message: "❌ Update failed: " + err.message });

    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await fetchJson(`${API_URL}/api/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: "Bearer " + token }
      });
      setNotification({ type: "success", message: "User updated successfully!" });

      setUsers(users.filter(u => u._id !== id));
    } catch (err) {
      setNotification({ type: "error", message: "❌ Update failed: " + err.message });

    }
  };

  const addUser = async () => {
    try {
      const data = await fetchJson("${API_URL}/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
        body: JSON.stringify(newUser)
      });
      setNotification({ type: "success", message: "User updated successfully!" });

      setUsers([...users, data]);
      setNewUser({ name: "", phone: "", address: "", savings: "", role: "", password: "" });
    } catch (err) {
      setNotification({ type: "error", message: "❌ Update failed: " + err.message });

    }
  };

  return (
    <div className="dashboard-container">
      {notification && (
          <div className={`notification ${notification.type}`}>
            {notification.message}
            <button className="close-btn" onClick={() => setNotification(null)}>×</button>
          </div>
        )}

      <Navbar />
      <div className="dashboard-content">
        <h2>📢 Notices</h2>
        <ul>{notices.map(n => <li key={n._id}>{n.title} — {n.detail}</li>)}</ul>

        <h2>🎉 Events</h2>
        <ul>{events.map(e => <li key={e._id}>{e.name} at {e.location}</li>)}</ul>

        
        {role === "admin" ? (
          <>
            <h2>👥 Users</h2>
            <table className="users-table">
              <thead>
                <tr>
                  <th>Name</th><th>Phone</th><th>Address</th><th>Savings</th><th>Role</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u._id}>
                    <td>{u.name}</td><td>{u.phone}</td><td>{u.address}</td><td>{u.savings}</td><td>{u.role}</td>
                    <td>
                      <button className="edit-btn" onClick={() => {
                        setEditingUser(u._id);
                        setFormData({ name: u.name, phone: u.phone, address: u.address, savings: u.savings, role: u.role });
                      }}>Edit</button>
                      <button className="delete-btn" onClick={() => deleteUser(u._id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
          
        ) : (
          user && (
            <>
              <h2>👤 Welcome, {user.name}</h2>
              <div className="user-card">
                <p><strong>Name:</strong> {user.name}</p>
                <p><strong>Phone:</strong> {user.phone}</p>
                <p><strong>Address:</strong> {user.address}</p>
                <p><strong>Savings:</strong> {user.savings}</p>
                <p><strong>Role:</strong> {user.role}</p>
                
              </div>
            </>
            
          )
        )}

        {editingUser && (
          <div className="edit-form">
            <h3>Edit User</h3>
            <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name" />
            <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" />
            <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Address" />
            <input type="number" name="savings" value={formData.savings} onChange={handleChange} placeholder="Savings" />
            <input type="text" name="role" value={formData.role} onChange={handleChange} placeholder="Role" />
            <button className="save-btn" onClick={saveEdit}>Save</button>
            <button className="cancel-btn" onClick={() => setEditingUser(null)}>Cancel</button>
          </div>
        )}

        {role === "admin" && (
          <div className="add-form">
            <h3>Add New User</h3>
            <input type="text" name="name" value={newUser.name} onChange={handleNewChange} placeholder="Name" />
            <input type="text" name="phone" value={newUser.phone} onChange={handleNewChange} placeholder="Phone" />
            <input type="text" name="address" value={newUser.address} onChange={handleNewChange} placeholder="Address" />
            <input type="number" name="savings" value={newUser.savings} onChange={handleNewChange} placeholder="Savings" />
            <input type="text" name="role" value={newUser.role} onChange={handleNewChange} placeholder="Role" />
            <input type="password" name="password" value={newUser.password} onChange={handleNewChange} placeholder="Password" />
            <button className="save-btn" onClick={addUser}>Add User</button>
          </div>
        )}
      </div>

      <footer className="footer">
        <p>© {new Date().getFullYear()} My Housing Society Dashboard</p>
      </footer>
    </div>
  );
}

export default Dashboard;
