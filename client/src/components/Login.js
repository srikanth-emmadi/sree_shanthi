import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./../styles/Login.css";

function Login() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ phone: "", password: "" });
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const validatePhone = (value) => {
    if (value !== "admin" && !/^\d{10}$/.test(value)) {
      return "Phone number must be exactly 10 digits (or 'admin' for admin login)";
    }
    return "";
  };

  const validatePassword = (value) => {
    if (value.length < 6 && phone !== "admin") {
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
      return;
    }

    setLoading(true);
    setErrors({ phone: "", password: "" });
    setSuccess("");

    try {
      const response = await fetch("https://sree-shanthi.onrender.com/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Login successful! Redirecting...");
        localStorage.setItem("token", data.token); // ✅ store JWT
        // Optionally store role if backend sends it
        if (data.role) localStorage.setItem("role", data.role);

        setTimeout(() => {
          navigate("/dashboard");
        }, 1500);
      } else {
        setErrors({ phone: "", password: data.message || "Invalid credentials" });
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
        <h2>Welcome Back</h2>
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
                setPhone(e.target.value === "admin" ? "admin" : onlyDigits);
                setErrors({ ...errors, phone: validatePhone(e.target.value) });
              }}
              placeholder="Enter your 10-digit phone number or 'admin'"
              maxLength="10"
              required
              className={
                errors.phone
                  ? "input-error"
                  : phone.length === 10 || phone === "admin"
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
                className={
                  errors.password
                    ? "input-error"
                    : password.length >= 6 || phone === "admin"
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

          {/* Login Button with Spinner */}
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? <span className="spinner"></span> : "Login"}
          </button>
        </form>

        {success && <p className="success">{success}</p>}

        {/* Links */}
        <div className="login-links">
          <a href="/forgot-password">Forgot Password?</a>
          <span>
            <a href="/signup">Create Account</a>
            <span className="divider"> | </span>
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

export default Login;
