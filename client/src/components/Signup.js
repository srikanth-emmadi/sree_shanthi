import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./../styles/Login.css"; // reuse same styles

function Signup() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ phone: "", password: "" });
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validatePhone = (value) => {
    if (!/^\d{10}$/.test(value)) {
      return "Phone number must be exactly 10 digits";
    }
    return "";
  };

  const validatePassword = (value) => {
    if (value.length < 6) {
      return "Password must be at least 6 characters";
    }
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const phoneError = validatePhone(phone);
    const passwordError = validatePassword(password);

    if (phoneError || passwordError) {
      setErrors({ phone: phoneError, password: passwordError });
      setSuccess("");
      if (phoneError) alert("Phone number must be exactly 10 digits.");
      return;
    }

    setLoading(true);
    setErrors({ phone: "", password: "" });
    setSuccess("");

    try {
      const response = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Signup successful! Redirecting to login...");
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
      } else {
        setErrors({ phone: "", password: data.message || "Signup failed" });
      }
    } catch (err) {
      setErrors({ phone: "", password: "Server error. Try again later." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <header className="login-header">
        <h1>Sree Shanthi Nagar Society</h1>
      </header>

      <div className="login-card">
        <h2>Create Account</h2>
        <form onSubmit={handleSubmit}>
          {/* Phone Number */}
          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => {
                const onlyDigits = e.target.value.replace(/\D/g, "");
                setPhone(onlyDigits);
                setErrors({ ...errors, phone: validatePhone(onlyDigits) });
              }}
              placeholder="Enter your 10-digit phone number"
              maxLength="10"
              required
              title="Must be exactly 10 digits"
              className={
                errors.phone
                  ? "input-error"
                  : phone.length === 10
                  ? "input-success"
                  : ""
              }
            />
            {errors.phone && <small className="error">{errors.phone}</small>}
          </div>

          {/* Password with Show/Hide toggle */}
          <div className="form-group password-group">
            <label htmlFor="password">Password</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrors({
                    ...errors,
                    password: validatePassword(e.target.value),
                  });
                }}
                placeholder="Enter your password"
                required
                title="Must be at least 6 characters"
                className={
                  errors.password
                    ? "input-error"
                    : password.length >= 6
                    ? "input-success"
                    : ""
                }
              />
              <button
                type="button"
                className="toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            {errors.password && (
              <small className="error">{errors.password}</small>
            )}
          </div>

          {/* Signup Button with Spinner */}
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? <span className="spinner"></span> : "Signup"}
          </button>
        </form>

        {success && <p className="success">{success}</p>}

        {/* Links */}
        <div className="login-links">
          <span>
            <Link to="/login">Already have an account? Login</Link>
          </span>
          <span>
            <Link to="/" className="home-link">Home</Link>
          </span>
        </div>
      </div>

      <footer className="login-footer">
        <small>© 2026 Sree Shanthi Nagar Society</small>
      </footer>
    </div>
  );
}

export default Signup;
