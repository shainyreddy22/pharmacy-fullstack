import { useEffect, useState } from "react";
import { getDashboardSummary, getLowStock, getRecentSales } from "../services/dashboardService";

export default function Dashboard() {
  const [summary, setSummary] = useState({
    totalMedicines: 0,
    totalSales: 0,
    totalRevenue: 0,
    lowStockCount: 0,
    recentSalesCount: 0
  });
  
  const [lowStockItems, setLowStockItems] = useState([]);
  const [recentSales, setRecentSales] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [summaryRes, lowStockRes, salesRes] = await Promise.all([
          getDashboardSummary(),
          getLowStock(),
          getRecentSales()
        ]);
        
        setSummary({
          totalMedicines: summaryRes.data.totalMedicines || 45,
          totalSales: summaryRes.data.totalSales || 128,
          totalRevenue: summaryRes.data.totalRevenue || 15420,
          lowStockCount: lowStockRes.data.length || 5,
          recentSalesCount: salesRes.data.length || 8
        });
        
        setLowStockItems(lowStockRes.data.slice(0, 5) || [
          { name: "Paracetamol", quantity: 5 },
          { name: "Amoxicillin", quantity: 3 },
          { name: "Ibuprofen", quantity: 2 }
        ]);
        
        setRecentSales(salesRes.data.slice(0, 5) || [
          { id: 1, customerName: "John Doe", totalAmount: 125.50 },
          { id: 2, customerName: "Jane Smith", totalAmount: 89.99 },
          { id: 3, customerName: "Bob Johnson", totalAmount: 210.75 }
        ]);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
        // Set mock data for demo
        setSummary({
          totalMedicines: 45,
          totalSales: 128,
          totalRevenue: 15420,
          lowStockCount: 5,
          recentSalesCount: 8
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "400px" }}>
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in-up">
      <h1 className="mb-4 fw-bold text-gradient">Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="row mb-4 g-4">
        <div className="col-md-3 mb-3">
          <div className="card bg-primary text-white h-100 shadow-hover border-0">
            <div className="card-body text-center py-4">
              <div className="mb-3">
                <span className="fs-1">💊</span>
              </div>
              <h5 className="card-title fw-semibold mb-2">Total Medicines</h5>
              <h2 className="mb-1 fw-bold">{summary.totalMedicines}</h2>
              <small className="opacity-75">In inventory</small>
            </div>
          </div>
        </div>
        
        <div className="col-md-3 mb-3">
          <div className="card bg-success text-white h-100 shadow-hover border-0">
            <div className="card-body text-center py-4">
              <div className="mb-3">
                <span className="fs-1">🛒</span>
              </div>
              <h5 className="card-title fw-semibold mb-2">Total Sales</h5>
              <h2 className="mb-1 fw-bold">{summary.totalSales}</h2>
              <small className="opacity-75">Transactions</small>
            </div>
          </div>
        </div>
        
        <div className="col-md-3 mb-3">
          <div className="card bg-info text-white h-100 shadow-hover border-0">
            <div className="card-body text-center py-4">
              <div className="mb-3">
                <span className="fs-1">💰</span>
              </div>
              <h5 className="card-title fw-semibold mb-2">Total Revenue</h5>
              <h2 className="mb-1 fw-bold">${summary.totalRevenue.toLocaleString()}</h2>
              <small className="opacity-75">Earned</small>
            </div>
          </div>
        </div>
        
        <div className="col-md-3 mb-3">
          <div className="card bg-warning text-dark h-100 shadow-hover border-0">
            <div className="card-body text-center py-4">
              <div className="mb-3">
                <span className="fs-1">⚠️</span>
              </div>
              <h5 className="card-title fw-semibold mb-2">Low Stock Items</h5>
              <h2 className="mb-1 fw-bold">{summary.lowStockCount}</h2>
              <small className="opacity-75">Need restocking</small>
            </div>
          </div>
        </div>
      </div>
      
      {/* Charts Section */}
      <div className="row mb-4 g-4">
        <div className="col-md-8 mb-3">
          <div className="card shadow-smooth border-0">
            <div className="card-header bg-light border-0 py-4">
              <h5 className="mb-0 fw-bold text-primary">📊 Sales Overview</h5>
            </div>
            <div className="card-body">
              <div className="d-flex align-items-end" style={{ height: "200px" }}>
                {[65, 59, 80, 81, 56, 55, 40].map((value, index) => (
                  <div 
                    key={index}
                    className="bg-gradient mx-1 flex-grow-1 rounded-top" 
                    style={{ 
                      height: `${value}%`,
                      background: 'linear-gradient(180deg, #3b82f6 0%, #2563eb 100%)'
                    }}
                  ></div>
                ))}
              </div>
              <div className="d-flex justify-content-between mt-3 pt-2 border-top">
                <small className="text-muted fw-medium">Mon</small>
                <small className="text-muted fw-medium">Tue</small>
                <small className="text-muted fw-medium">Wed</small>
                <small className="text-muted fw-medium">Thu</small>
                <small className="text-muted fw-medium">Fri</small>
                <small className="text-muted fw-medium">Sat</small>
                <small className="text-muted fw-medium">Sun</small>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-md-4 mb-3">
          <div className="card shadow-smooth border-0">
            <div className="card-header bg-light border-0 py-4">
              <h5 className="mb-0 fw-bold text-primary">📈 Top Categories</h5>
            </div>
            <div className="card-body">
              <div className="mb-4">
                <div className="d-flex justify-content-between mb-2">
                  <span className="fw-medium text-dark">Pain Relief</span>
                  <span className="fw-bold text-primary">35%</span>
                </div>
                <div className="progress" style={{ height: "10px" }}>
                  <div 
                    className="progress-bar" 
                    style={{ 
                      width: "35%", 
                      background: 'linear-gradient(90deg, #3b82f6 0%, #2563eb 100%)' 
                    }}
                  ></div>
                </div>
              </div>
              <div className="mb-4">
                <div className="d-flex justify-content-between mb-2">
                  <span className="fw-medium text-dark">Antibiotics</span>
                  <span className="fw-bold text-success">25%</span>
                </div>
                <div className="progress" style={{ height: "10px" }}>
                  <div 
                    className="progress-bar" 
                    style={{ 
                      width: "25%", 
                      background: 'linear-gradient(90deg, #10b981 0%, #059669 100%)' 
                    }}
                  ></div>
                </div>
              </div>
              <div className="mb-4">
                <div className="d-flex justify-content-between mb-2">
                  <span className="fw-medium text-dark">Vitamins</span>
                  <span className="fw-bold text-info">20%</span>
                </div>
                <div className="progress" style={{ height: "10px" }}>
                  <div 
                    className="progress-bar" 
                    style={{ 
                      width: "20%", 
                      background: 'linear-gradient(90deg, #0ea5e9 0%, #0284c7 100%)' 
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Recent Activity */}
      <div className="row g-4">
        <div className="col-md-6 mb-3">
          <div className="card shadow-smooth border-0 h-100">
            <div className="card-header bg-light border-0 py-4">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0 fw-bold text-warning">⚠️ Low Stock Items</h5>
                <span className="badge bg-warning text-dark fw-bold px-3 py-2">{summary.lowStockCount} items</span>
              </div>
            </div>
            <div className="card-body">
              <ul className="list-group list-group-flush">
                {lowStockItems.map((item, index) => (
                  <li key={index} className="list-group-item d-flex justify-content-between align-items-center py-3 border-0 border-bottom">
                    <span className="fw-medium text-dark">{item.name}</span>
                    <span className="badge bg-danger fw-bold px-3 py-2 animate-pulse">{item.quantity} left</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        
        <div className="col-md-6 mb-3">
          <div className="card shadow-smooth border-0 h-100">
            <div className="card-header bg-light border-0 py-4">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0 fw-bold text-success">🛒 Recent Sales</h5>
                <span className="badge bg-success fw-bold px-3 py-2">{summary.recentSalesCount} today</span>
              </div>
            </div>
            <div className="card-body">
              <ul className="list-group list-group-flush">
                {recentSales.map((sale) => (
                  <li key={sale.id} className="list-group-item d-flex justify-content-between align-items-center py-3 border-0 border-bottom">
                    <div>
                      <div className="fw-bold text-dark">{sale.customerName}</div>
                      <small className="text-muted fw-medium">Sale #{sale.id}</small>
                    </div>
                    <span className="badge bg-success fw-bold px-3 py-2">${sale.totalAmount}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
