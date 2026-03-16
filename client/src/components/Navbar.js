import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./../styles/Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
    setMenuOpen(false); // close menu after logout
  };

  return (
    <nav className="navbar">
      <h1 className="navbar-title">Sree Shanthi Nagar Society</h1>

      <ul className={`navbar-links ${menuOpen ? "open" : ""}`}>
        <li><Link to="/" onClick={() => setMenuOpen(false)}>Home</Link></li>
        <li><Link to="/about" onClick={() => setMenuOpen(false)}>About</Link></li>

        {token && (
          <li><Link to="/dashboard" onClick={() => setMenuOpen(false)}>Dashboard</Link></li>
        )}

        {!token ? (
          <li><Link to="/login" onClick={() => setMenuOpen(false)}>Login</Link></li>
        ) : (
          <li>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
