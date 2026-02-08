import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";

function Signup() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear messages when user starts typing
    if (error) setError("");
    if (success) setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    
    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }
    
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }
    
    try {
      const response = await API.post("/auth/signup", {
        username: formData.username,
        email: formData.email,
        password: formData.password
      });
      
      setSuccess(response.data.message);
      
      // Auto redirect to login after 2 seconds
      setTimeout(() => {
        navigate("/login");
      }, 2000);
      
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100" style={{ background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)' }}>
      <div className="card shadow-lg animate-fade-in-up" style={{ width: "450px", borderRadius: '20px', border: 'none' }}>
        <div className="card-body p-5">
          <div className="text-center mb-4">
            <div className="mb-3">
              <span className="fs-1">🏥</span>
            </div>
            <h2 className="card-title fw-bold text-gradient mb-2">Create Account</h2>
            <p className="text-muted fw-medium">Join our pharmacy management system</p>
          </div>
          
          {error && (
            <div className="alert alert-danger alert-dismissible fade show" role="alert">
              {error}
              <button type="button" className="btn-close" onClick={() => setError("")}></button>
            </div>
          )}
          
          {success && (
            <div className="alert alert-success alert-dismissible fade show" role="alert">
              {success}
              <button type="button" className="btn-close" onClick={() => setSuccess("")}></button>
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="username" className="form-label fw-semibold">Username</label>
              <input
                type="text"
                className="form-control py-3 px-4 border-2"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                placeholder="Choose a username"
                style={{ borderRadius: '12px' }}
              />
            </div>
            
            <div className="mb-3">
              <label htmlFor="email" className="form-label fw-semibold">Email Address</label>
              <input
                type="email"
                className="form-control py-3 px-4 border-2"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter your email"
                style={{ borderRadius: '12px' }}
              />
            </div>
            
            <div className="mb-3">
              <label htmlFor="password" className="form-label fw-semibold">Password</label>
              <input
                type="password"
                className="form-control py-3 px-4 border-2"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Create a password"
                style={{ borderRadius: '12px' }}
                minLength="6"
              />
              <div className="form-text">Must be at least 6 characters long</div>
            </div>
            
            <div className="mb-4">
              <label htmlFor="confirmPassword" className="form-label fw-semibold">Confirm Password</label>
              <input
                type="password"
                className="form-control py-3 px-4 border-2"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="Confirm your password"
                style={{ borderRadius: '12px' }}
              />
            </div>
            
            <div className="d-grid mb-4">
              <button 
                type="submit" 
                className="btn btn-primary py-3 fw-bold" 
                disabled={loading}
                style={{ borderRadius: '12px', fontSize: '1.1rem' }}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Creating Account...
                  </>
                ) : (
                  "📝 Create Account"
                )}
              </button>
            </div>
          </form>
          
          <div className="text-center border-top pt-4">
            <p className="mb-0 text-muted">
              Already have an account?{' '}
              <Link to="/login" className="text-decoration-none fw-bold text-primary">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;