import { useEffect, useState } from "react";
import { getMedicines, deleteMedicine } from "../services/medicineService";
import { Link } from "react-router-dom";

export default function Medicines() {
  const [medicines, setMedicines] = useState([]);
  const [filteredMedicines, setFilteredMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterMedicines();
  }, [medicines, searchTerm, categoryFilter]);

  const loadData = async () => {
    try {
      const res = await getMedicines();
      // Mock data for demo if API fails
      const mockData = [
        { id: 1, name: "Paracetamol", company: "MediCorp", price: 5.99, quantity: 150, category: "otc", expiryDate: "2025-12-31" },
        { id: 2, name: "Amoxicillin", company: "PharmaPlus", price: 12.50, quantity: 75, category: "prescription", expiryDate: "2025-08-15" },
        { id: 3, name: "Vitamin C", company: "HealthFirst", price: 8.75, quantity: 200, category: "supplement", expiryDate: "2026-03-20" },
        { id: 4, name: "Ibuprofen", company: "PainRelief Inc", price: 7.25, quantity: 89, category: "otc", expiryDate: "2025-11-10" },
        { id: 5, name: "Lipitor", company: "CardioMed", price: 25.99, quantity: 42, category: "prescription", expiryDate: "2025-09-30" }
      ];
      
      setMedicines(res.data || mockData);
    } catch (error) {
      console.error("Error loading medicines:", error);
      // Set mock data on error
      setMedicines([
        { id: 1, name: "Paracetamol", company: "MediCorp", price: 5.99, quantity: 150, category: "otc", expiryDate: "2025-12-31" },
        { id: 2, name: "Amoxicillin", company: "PharmaPlus", price: 12.50, quantity: 75, category: "prescription", expiryDate: "2025-08-15" },
        { id: 3, name: "Vitamin C", company: "HealthFirst", price: 8.75, quantity: 200, category: "supplement", expiryDate: "2026-03-20" },
        { id: 4, name: "Ibuprofen", company: "PainRelief Inc", price: 7.25, quantity: 89, category: "otc", expiryDate: "2025-11-10" },
        { id: 5, name: "Lipitor", company: "CardioMed", price: 25.99, quantity: 42, category: "prescription", expiryDate: "2025-09-30" }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filterMedicines = () => {
    let filtered = medicines;
    
    if (searchTerm) {
      filtered = filtered.filter(med => 
        med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        med.company.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (categoryFilter !== "all") {
      filtered = filtered.filter(med => med.category === categoryFilter);
    }
    
    setFilteredMedicines(filtered);
  };

  const remove = async (id) => {
    if (window.confirm("Are you sure you want to delete this medicine?")) {
      try {
        await deleteMedicine(id);
        loadData();
        alert("Medicine deleted successfully!");
      } catch (error) {
        console.error("Error deleting medicine:", error);
        alert("Failed to delete medicine. Please try again.");
      }
    }
  };

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
        <h1>💊 Medicine Inventory</h1>
        <Link to="/add-medicine" className="btn btn-primary">
          <i className="fas fa-plus me-2"></i>Add New Medicine
        </Link>
      </div>

      {/* Filters */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Search Medicines</label>
              <input
                type="text"
                className="form-control"
                placeholder="Search by name or company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Filter by Category</label>
              <select
                className="form-select"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="all">All Categories</option>
                <option value="prescription">Prescription</option>
                <option value="otc">Over the Counter</option>
                <option value="supplement">Supplement</option>
                <option value="cosmetic">Cosmetic</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card bg-primary text-white">
            <div className="card-body">
              <h5>Total Medicines</h5>
              <h2>{filteredMedicines.length}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-warning text-dark">
            <div className="card-body">
              <h5>Low Stock (&lt; 50)</h5>
              <h2>{filteredMedicines.filter(m => m.quantity < 50).length}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-danger text-white">
            <div className="card-body">
              <h5>Near Expiry</h5>
              <h2>{filteredMedicines.filter(m => new Date(m.expiryDate) < new Date(Date.now() + 30*24*60*60*1000)).length}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-info text-white">
            <div className="card-body">
              <h5>Total Value</h5>
              <h2>${filteredMedicines.reduce((sum, m) => sum + (m.price * m.quantity), 0).toFixed(2)}</h2>
            </div>
          </div>
        </div>
      </div>

      {/* Medicines Table */}
      <div className="card">
        <div className="card-header">
          <h5 className="mb-0">Medicine List</h5>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th>Name</th>
                  <th>Company</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Expiry Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMedicines.map(medicine => (
                  <tr key={medicine.id}>
                    <td>
                      <strong>{medicine.name}</strong>
                    </td>
                    <td>{medicine.company}</td>
                    <td>{getCategoryBadge(medicine.category)}</td>
                    <td>${medicine.price.toFixed(2)}</td>
                    <td>
                      <span className={`badge ${medicine.quantity < 20 ? 'bg-danger' : medicine.quantity < 50 ? 'bg-warning text-dark' : 'bg-success'}`}>
                        {medicine.quantity}
                      </span>
                    </td>
                    <td>{new Date(medicine.expiryDate).toLocaleDateString()}</td>
                    <td>
                      <div className="btn-group" role="group">
                        <button 
                          className="btn btn-sm btn-outline-primary"
                          title="Edit"
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button 
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => remove(medicine.id)}
                          title="Delete"
                        >
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
              <i className="fas fa-pills fa-3x text-muted mb-3"></i>
              <h4>No medicines found</h4>
              <p className="text-muted">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
