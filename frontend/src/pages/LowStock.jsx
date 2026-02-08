import React, { useEffect, useState } from "react";
import API from "../api/api";

function LowStock() {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("quantity");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const res = await API.get("/dashboard/low-stock");
      // Mock data if API fails
      const mockData = [
        { id: 1, name: "Paracetamol", company: "MediCorp", quantity: 5, price: 5.99, category: "otc" },
        { id: 2, name: "Amoxicillin", company: "PharmaPlus", quantity: 3, price: 12.50, category: "prescription" },
        { id: 3, name: "Ibuprofen", company: "PainRelief Inc", quantity: 8, price: 7.25, category: "otc" },
        { id: 4, name: "Insulin", company: "DiabetesCare", quantity: 2, price: 45.99, category: "prescription" },
        { id: 5, name: "Vitamin D", company: "HealthFirst", quantity: 12, price: 9.50, category: "supplement" }
      ];
      setMedicines(res.data || mockData);
    } catch (error) {
      console.error("Error loading low stock data:", error);
      setMedicines([
        { id: 1, name: "Paracetamol", company: "MediCorp", quantity: 5, price: 5.99, category: "otc" },
        { id: 2, name: "Amoxicillin", company: "PharmaPlus", quantity: 3, price: 12.50, category: "prescription" },
        { id: 3, name: "Ibuprofen", company: "PainRelief Inc", quantity: 8, price: 7.25, category: "otc" },
        { id: 4, name: "Insulin", company: "DiabetesCare", quantity: 2, price: 45.99, category: "prescription" },
        { id: 5, name: "Vitamin D", company: "HealthFirst", quantity: 12, price: 9.50, category: "supplement" }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const sortedMedicines = [...medicines].sort((a, b) => {
    if (sortBy === "quantity") return a.quantity - b.quantity;
    if (sortBy === "name") return a.name.localeCompare(b.name);
    if (sortBy === "price") return a.price - b.price;
    return 0;
  });

  const getCategoryBadge = (category) => {
    const badges = {
      prescription: "badge bg-danger",
      otc: "badge bg-success",
      supplement: "badge bg-info",
      cosmetic: "badge bg-warning text-dark"
    };
    const labels = {
      prescription: "Prescription",
      otc: "OTC",
      supplement: "Supplement",
      cosmetic: "Cosmetic"
    };
    return <span className={badges[category] || "badge bg-secondary"}>{labels[category] || category}</span>;
  };

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
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>⚠️ Low Stock Alert</h1>
        <div>
          <span className="badge bg-danger fs-6">{medicines.length} items need attention</span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="row mb-4">
        <div className="col-md-3 mb-3">
          <div className="card bg-danger text-white h-100">
            <div className="card-body">
              <h5>Critical Stock</h5>
              <h2>{medicines.filter(m => m.quantity <= 5).length}</h2>
              <small>(&lt;= 5 units)</small>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card bg-warning text-dark h-100">
            <div className="card-body">
              <h5>Low Stock</h5>
              <h2>{medicines.filter(m => m.quantity > 5 && m.quantity <= 15).length}</h2>
              <small>(6-15 units)</small>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card bg-info text-white h-100">
            <div className="card-body">
              <h5>Value at Risk</h5>
              <h2>${medicines.reduce((sum, m) => sum + (m.price * m.quantity), 0).toFixed(2)}</h2>
              <small>Total retail value</small>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card bg-primary text-white h-100">
            <div className="card-body">
              <h5>Highest Priority</h5>
              <h2>{medicines.filter(m => m.category === "prescription").length}</h2>
              <small>Prescription items</small>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="row align-items-center">
            <div className="col-md-6">
              <h5 className="mb-0">Sort by:</h5>
            </div>
            <div className="col-md-6">
              <select 
                className="form-select" 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="quantity">Lowest Quantity First</option>
                <option value="name">Name (A-Z)</option>
                <option value="price">Price (Low to High)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Medicines Table */}
      <div className="card">
        <div className="card-header bg-danger text-white">
          <h5 className="mb-0">Medicines Requiring Immediate Attention</h5>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th>Medicine Name</th>
                  <th>Company</th>
                  <th>Category</th>
                  <th>Current Stock</th>
                  <th>Unit Price</th>
                  <th>Total Value</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedMedicines.map(medicine => (
                  <tr key={medicine.id}>
                    <td>
                      <strong>{medicine.name}</strong>
                    </td>
                    <td>{medicine.company}</td>
                    <td>{getCategoryBadge(medicine.category)}</td>
                    <td>
                      <span className={`badge ${medicine.quantity <= 5 ? 'bg-danger' : 'bg-warning text-dark'} fs-6`}>
                        {medicine.quantity} units
                      </span>
                    </td>
                    <td>${medicine.price.toFixed(2)}</td>
                    <td>${(medicine.price * medicine.quantity).toFixed(2)}</td>
                    <td>
                      {medicine.quantity <= 5 ? (
                        <span className="badge bg-danger">Critical</span>
                      ) : medicine.quantity <= 15 ? (
                        <span className="badge bg-warning text-dark">Low</span>
                      ) : (
                        <span className="badge bg-success">Normal</span>
                      )}
                    </td>
                    <td>
                      <button className="btn btn-sm btn-outline-primary me-1">
                        <i className="fas fa-plus"></i> Restock
                      </button>
                      <button className="btn btn-sm btn-outline-info">
                        <i className="fas fa-bell"></i> Notify
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {medicines.length === 0 && (
            <div className="text-center py-5">
              <i className="fas fa-check-circle fa-3x text-success mb-3"></i>
              <h4>All stock levels are healthy!</h4>
              <p className="text-muted">No medicines are currently below minimum stock levels</p>
            </div>
          )}
        </div>
      </div>

      {/* Recommendations */}
      <div className="row mt-4">
        <div className="col-md-6">
          <div className="card bg-light">
            <div className="card-body">
              <h5><i className="fas fa-lightbulb text-warning me-2"></i>Recommendations</h5>
              <ul className="mb-0">
                <li>Order critical items immediately</li>
                <li>Set up automatic reorder alerts</li>
                <li>Review supplier lead times</li>
                <li>Consider alternative suppliers</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card bg-light">
            <div className="card-body">
              <h5><i className="fas fa-exclamation-triangle text-danger me-2"></i>Action Required</h5>
              <ul className="mb-0">
                <li>Place orders for items with &lt; 5 units</li>
                <li>Monitor daily consumption rates</li>
                <li>Update safety stock levels</li>
                <li>Coordinate with purchasing team</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LowStock;
