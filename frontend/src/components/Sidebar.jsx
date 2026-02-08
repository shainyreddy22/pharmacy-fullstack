import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Sidebar() {
  const location = useLocation();
  const { user, logout } = useAuth();

  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: "📊" },
    { path: "/medicines", label: "Medicines", icon: "💊" },
    { path: "/add-medicine", label: "Add Medicine", icon: "➕" },
    { path: "/suppliers", label: "Suppliers", icon: "🚚" },
    { path: "/customers", label: "Customers", icon: "👥" },
    { path: "/create-sale", label: "Create Sale", icon: "🛒" },
    { path: "/sales-history", label: "Sales History", icon: "📋" },
    { path: "/low-stock", label: "Low Stock", icon: "⚠️" },
    { path: "/expiry-report", label: "Expiry Report", icon: "📅" }
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="sidebar d-flex flex-column vh-100 text-white" style={{ width: "250px" }}>
      {/* Logo/Header */}
      <div className="p-4 border-bottom" style={{ borderColor: 'rgba(255,255,255,0.1)!important' }}>
        <h4 className="mb-1 fw-bold">🏥 Pharmacy</h4>
        <small className="opacity-75">Management System</small>
      </div>

      {/* User Info */}
      <div className="p-4 border-bottom" style={{ borderColor: 'rgba(255,255,255,0.1)!important' }}>
        <div className="d-flex align-items-center">
          <div className="bg-gradient rounded-circle d-flex align-items-center justify-content-center me-3 shadow" style={{ width: "48px", height: "48px", background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' }}>
            <span className="text-white fw-bold fs-5">{user?.name?.charAt(0) || 'A'}</span>
          </div>
          <div>
            <div className="fw-bold mb-1">{user?.name || 'Admin User'}</div>
            <small className="opacity-75 text-uppercase" style={{ fontSize: '0.7rem', letterSpacing: '0.5px' }}>{user?.role || 'Administrator'}</small>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="flex-grow-1 overflow-auto px-3 py-2">
        <nav className="nav flex-column">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-link text-white d-flex align-items-center px-3 py-3 mb-1 ${isActive(item.path) ? 'active' : ''}`}
            >
              <span className="me-3 fs-5">{item.icon}</span>
              <span className="fw-medium">{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Logout Button */}
      <div className="p-4 border-top" style={{ borderColor: 'rgba(255,255,255,0.1)!important' }}>
        <button 
          className="btn btn-outline-light w-100 py-3 fw-medium d-flex align-items-center justify-content-center"
          onClick={handleLogout}
          style={{ borderRadius: '10px', borderWidth: '2px' }}
        >
          <span className="me-2 fs-5">🚪</span>
          Logout
        </button>
      </div>
    </div>
  );
}

export default Sidebar;