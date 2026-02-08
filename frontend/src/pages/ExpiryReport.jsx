import React, { useEffect, useState } from "react";
import { getMedicines } from "../services/medicineService";

function ExpiryReport() {
  const [medicines, setMedicines] = useState([]);
  const [filteredMedicines, setFilteredMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, expired, near-expiry, safe
  const [daysThreshold, setDaysThreshold] = useState(30);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterMedicines();
  }, [medicines, filter, daysThreshold]);

  const loadData = async () => {
    try {
      const res = await getMedicines();
      // Mock data with expiry dates
      const mockData = [
        { id: 1, name: "Paracetamol", company: "MediCorp", batch: "PC2024001", expiryDate: "2025-12-31", quantity: 150, price: 5.99 },
        { id: 2, name: "Amoxicillin", company: "PharmaPlus", batch: "AM2024002", expiryDate: "2025-02-15", quantity: 75, price: 12.50 },
        { id: 3, name: "Vitamin C", company: "HealthFirst", batch: "VC2024003", expiryDate: "2024-12-20", quantity: 200, price: 8.75 },
        { id: 4, name: "Ibuprofen", company: "PainRelief Inc", batch: "IB2024004", expiryDate: "2026-03-10", quantity: 89, price: 7.25 },
        { id: 5, name: "Insulin", company: "DiabetesCare", batch: "IN2024005", expiryDate: "2024-11-30", quantity: 42, price: 45.99 },
        { id: 6, name: "Aspirin", company: "HeartHealth", batch: "AS2024006", expiryDate: "2025-01-10", quantity: 120, price: 3.50 },
        { id: 7, name: "Multivitamin", company: "NutriPlus", batch: "MV2024007", expiryDate: "2026-06-15", quantity: 95, price: 15.99 }
      ];
      setMedicines(res.data || mockData);
    } catch (error) {
      console.error("Error loading medicines:", error);
      setMedicines([
        { id: 1, name: "Paracetamol", company: "MediCorp", batch: "PC2024001", expiryDate: "2025-12-31", quantity: 150, price: 5.99 },
        { id: 2, name: "Amoxicillin", company: "PharmaPlus", batch: "AM2024002", expiryDate: "2025-02-15", quantity: 75, price: 12.50 },
        { id: 3, name: "Vitamin C", company: "HealthFirst", batch: "VC2024003", expiryDate: "2024-12-20", quantity: 200, price: 8.75 },
        { id: 4, name: "Ibuprofen", company: "PainRelief Inc", batch: "IB2024004", expiryDate: "2026-03-10", quantity: 89, price: 7.25 },
        { id: 5, name: "Insulin", company: "DiabetesCare", batch: "IN2024005", expiryDate: "2024-11-30", quantity: 42, price: 45.99 },
        { id: 6, name: "Aspirin", company: "HeartHealth", batch: "AS2024006", expiryDate: "2025-01-10", quantity: 120, price: 3.50 },
        { id: 7, name: "Multivitamin", company: "NutriPlus", batch: "MV2024007", expiryDate: "2026-06-15", quantity: 95, price: 15.99 }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filterMedicines = () => {
    const today = new Date();
    const thresholdDate = new Date();
    thresholdDate.setDate(today.getDate() + daysThreshold);
    
    let filtered = medicines.map(med => {
      const expiryDate = new Date(med.expiryDate);
      const daysUntilExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
      
      return {
        ...med,
        daysUntilExpiry,
        status: daysUntilExpiry < 0 ? 'expired' : 
                daysUntilExpiry <= daysThreshold ? 'near-expiry' : 'safe'
      };
    });
    
    if (filter !== "all") {
      filtered = filtered.filter(med => med.status === filter);
    }
    
    setFilteredMedicines(filtered);
  };

  const getStatusBadge = (status, days) => {
    if (status === 'expired') {
      return <span className="badge bg-danger">Expired {Math.abs(days)} days ago</span>;
    } else if (status === 'near-expiry') {
      return <span className="badge bg-warning text-dark">Expires in {days} days</span>;
    } else {
      return <span className="badge bg-success">Safe ({days} days)</span>;
    }
  };

  const getPriorityColor = (status) => {
    if (status === 'expired') return 'table-danger';
    if (status === 'near-expiry') return 'table-warning';
    return '';
  };

  const getStats = () => {
    const today = new Date();
    const thresholdDate = new Date();
    thresholdDate.setDate(today.getDate() + daysThreshold);
    
    const expired = medicines.filter(med => new Date(med.expiryDate) < today).length;
    const nearExpiry = medicines.filter(med => {
      const expiry = new Date(med.expiryDate);
      return expiry >= today && expiry <= thresholdDate;
    }).length;
    const safe = medicines.length - expired - nearExpiry;
    
    const totalValueAtRisk = medicines
      .filter(med => new Date(med.expiryDate) <= thresholdDate)
      .reduce((sum, med) => sum + (med.price * med.quantity), 0);
    
    return { expired, nearExpiry, safe, totalValueAtRisk };
  };

  const stats = getStats();

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
        <h1>📅 Expiry Report</h1>
        <div>
          <span className="badge bg-warning fs-6">{filteredMedicines.length} items matching criteria</span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="row mb-4">
        <div className="col-md-3 mb-3">
          <div className="card bg-danger text-white h-100">
            <div className="card-body">
              <h5>Expired</h5>
              <h2>{stats.expired}</h2>
              <small>Items past expiry date</small>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card bg-warning text-dark h-100">
            <div className="card-body">
              <h5>Near Expiry</h5>
              <h2>{stats.nearExpiry}</h2>
              <small>Within {daysThreshold} days</small>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card bg-success text-white h-100">
            <div className="card-body">
              <h5>Safe</h5>
              <h2>{stats.safe}</h2>
              <small>Beyond threshold</small>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card bg-info text-white h-100">
            <div className="card-body">
              <h5>Value at Risk</h5>
              <h2>${stats.totalValueAtRisk.toFixed(2)}</h2>
              <small>Retail value</small>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="row">
            <div className="col-md-4 mb-3">
              <label className="form-label">Filter Status</label>
              <select 
                className="form-select" 
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All Medicines</option>
                <option value="expired">Expired Only</option>
                <option value="near-expiry">Near Expiry Only</option>
                <option value="safe">Safe Only</option>
              </select>
            </div>
            <div className="col-md-4 mb-3">
              <label className="form-label">Alert Threshold (Days)</label>
              <input
                type="range"
                className="form-range"
                min="1"
                max="180"
                value={daysThreshold}
                onChange={(e) => setDaysThreshold(parseInt(e.target.value))}
              />
              <div className="text-center">{daysThreshold} days</div>
            </div>
            <div className="col-md-4 mb-3 d-flex align-items-end">
              <button className="btn btn-outline-primary w-100">
                <i className="fas fa-download me-2"></i>Export Report
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Medicines Table */}
      <div className="card">
        <div className="card-header bg-info text-white">
          <h5 className="mb-0">Medicine Expiry Details</h5>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th>Medicine Name</th>
                  <th>Company</th>
                  <th>Batch Number</th>
                  <th>Expiry Date</th>
                  <th>Days Until Expiry</th>
                  <th>Current Stock</th>
                  <th>Unit Price</th>
                  <th>Total Value</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMedicines.map(medicine => (
                  <tr key={medicine.id} className={getPriorityColor(medicine.status)}>
                    <td>
                      <strong>{medicine.name}</strong>
                    </td>
                    <td>{medicine.company}</td>
                    <td>{medicine.batch}</td>
                    <td>{new Date(medicine.expiryDate).toLocaleDateString()}</td>
                    <td>{getStatusBadge(medicine.status, medicine.daysUntilExpiry)}</td>
                    <td>{medicine.quantity} units</td>
                    <td>${medicine.price.toFixed(2)}</td>
                    <td>${(medicine.price * medicine.quantity).toFixed(2)}</td>
                    <td>
                      {medicine.status === 'expired' && (
                        <span className="badge bg-danger">Expired</span>
                      )}
                      {medicine.status === 'near-expiry' && (
                        <span className="badge bg-warning text-dark">Near Expiry</span>
                      )}
                      {medicine.status === 'safe' && (
                        <span className="badge bg-success">Safe</span>
                      )}
                    </td>
                    <td>
                      <div className="btn-group" role="group">
                        <button className="btn btn-sm btn-outline-primary" title="View Details">
                          <i className="fas fa-eye"></i>
                        </button>
                        <button className="btn btn-sm btn-outline-warning" title="Extend Expiry">
                          <i className="fas fa-calendar-plus"></i>
                        </button>
                        <button className="btn btn-sm btn-outline-danger" title="Dispose">
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredMedicines.length === 0 && (
            <div className="text-center py-5">
              <i className="fas fa-calendar-check fa-3x text-success mb-3"></i>
              <h4>No medicines match your criteria</h4>
              <p className="text-muted">Try adjusting your filter settings</p>
            </div>
          )}
        </div>
      </div>

      {/* Recommendations */}
      <div className="row mt-4">
        <div className="col-md-6">
          <div className="card bg-light">
            <div className="card-body">
              <h5><i className="fas fa-exclamation-circle text-danger me-2"></i>Immediate Actions</h5>
              <ul className="mb-0">
                <li>Remove expired medicines from shelves</li>
                <li>Mark near-expiry items for discount/sale</li>
                <li>Notify relevant departments</li>
                <li>Update inventory records</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card bg-light">
            <div className="card-body">
              <h5><i className="fas fa-chart-line text-success me-2"></i>Prevention Tips</h5>
              <ul className="mb-0">
                <li>Implement FIFO rotation system</li>
                <li>Set automated expiry alerts</li>
                <li>Regular monthly reviews</li>
                <li>Maintain proper storage conditions</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExpiryReport;
