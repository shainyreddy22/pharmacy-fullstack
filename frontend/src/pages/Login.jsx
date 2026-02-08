import React, { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const navigate = useNavigate();
  const { isAuthenticated, login } = useAuth();

  // If already authenticated, redirect to dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const result = await login(username, password);
      
      if (result.success) {
        navigate("/dashboard");
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError("Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100" style={{ background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)' }}>
      <div className="card shadow-lg animate-fade-in-up" style={{ width: "420px", borderRadius: '20px', border: 'none' }}>
        <div className="card-body p-5">
          <div className="text-center mb-5">
            <div className="mb-3">
              <span className="fs-1">🏥</span>
            </div>
            <h2 className="card-title fw-bold text-gradient mb-2">Pharmacy Management</h2>
            <p className="text-muted fw-medium">Sign in to your account</p>
          </div>
          
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}
          
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label htmlFor="username" className="form-label fw-semibold mb-2">Username</label>
              <input
                type="text"
                className="form-control py-3 px-4 border-2"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="Enter your username"
                style={{ borderRadius: '12px' }}
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="password" className="form-label fw-semibold mb-2">Password</label>
              <input
                type="password"
                className="form-control py-3 px-4 border-2"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
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
                    Signing in...
                  </>
                ) : (
                  "🔐 Sign In"
                )}
              </button>
            </div>
          </form>
          
          <div className="text-center border-top pt-4">
            <small className="text-muted fw-medium d-block mb-2">
              💡 <strong>Demo credentials:</strong> admin / admin123
            </small>
            <p className="mb-0 text-muted">
              Don't have an account?{' '}
              <a href="/signup" className="text-decoration-none fw-bold text-primary">
                Create one
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
