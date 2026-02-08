import { useEffect, useState } from "react";
import { getSuppliers, addSupplier, deleteSupplier } from "../services/supplierService";

export default function Suppliers() {

  const [suppliers, setSuppliers] = useState([]);

  const [form, setForm] = useState({
    name: "",
    contact: "",
    email: "",
    address: ""
  });

  useEffect(() => {
    loadSuppliers();
  }, []);

  const loadSuppliers = () => {
    getSuppliers()
      .then(res => setSuppliers(res.data))
      .catch(err => console.log("API Error:", err));
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    addSupplier(form).then(() => {
      alert("Supplier Added Successfully");
      setForm({ name: "", contact: "", email: "", address: "" });
      loadSuppliers();
    });
  };

  const remove = (id) => {
    deleteSupplier(id).then(() => {
      alert("Supplier Deleted");
      loadSuppliers();
    });
  };

  return (
    <div className="container-fluid animate-fade-in-up suppliers-page">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="fw-bold text-gradient mb-0">🚚 Supplier Management</h1>
        <div className="badge bg-primary fw-bold px-3 py-2 fs-6">
          {suppliers.length} Suppliers
        </div>
      </div>

      <div className="row">
        {/* Add Supplier Form */}
        <div className="col-lg-4 mb-4">
          <div className="card shadow-smooth border-0 h-100">
            <div className="card-header bg-primary text-white py-4">
              <h3 className="mb-0 fw-bold">➕ Add New Supplier</h3>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-semibold mb-2">Supplier Name</label>
                  <input
                    name="name"
                    className="form-control py-3 border-2"
                    placeholder="Enter supplier name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    style={{ borderRadius: '12px' }}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold mb-2">📞 Contact Number</label>
                  <input
                    name="contact"
                    className="form-control py-3 border-2"
                    placeholder="Enter contact number"
                    value={form.contact}
                    onChange={handleChange}
                    required
                    style={{ borderRadius: '12px' }}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold mb-2">📧 Email Address</label>
                  <input
                    name="email"
                    type="email"
                    className="form-control py-3 border-2"
                    placeholder="Enter email address"
                    value={form.email}
                    onChange={handleChange}
                    required
                    style={{ borderRadius: '12px' }}
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold mb-2">📍 Address</label>
                  <textarea
                    name="address"
                    className="form-control py-3 border-2"
                    placeholder="Enter complete address"
                    value={form.address}
                    onChange={handleChange}
                    required
                    rows="3"
                    style={{ borderRadius: '12px' }}
                  />
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary w-100 py-3 fw-bold"
                  style={{ borderRadius: '12px', fontSize: '1.1rem' }}
                >
                  <i className="fas fa-plus-circle me-2"></i>
                  Add Supplier
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Supplier List */}
        <div className="col-lg-8">
          <div className="card shadow-smooth border-0">
            <div className="card-header bg-light border-0 py-4">
              <div className="d-flex justify-content-between align-items-center">
                <h3 className="mb-0 fw-bold text-primary">📋 Supplier Directory</h3>
                <div className="d-flex gap-2">
                  <button className="btn btn-outline-primary btn-sm">
                    <i className="fas fa-download me-1"></i> Export
                  </button>
                  <button className="btn btn-outline-secondary btn-sm">
                    <i className="fas fa-filter me-1"></i> Filter
                  </button>
                </div>
              </div>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="py-4">Supplier Name</th>
                      <th className="py-4">Contact</th>
                      <th className="py-4">Email</th>
                      <th className="py-4">Address</th>
                      <th className="py-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {suppliers.map(s => (
                      <tr key={s.id} className="border-bottom">
                        <td className="py-4">
                          <div className="d-flex align-items-center">
                            <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-3 supplier-avatar" style={{ width: "40px", height: "40px" }}>
                              <span className="text-white fw-bold">{s.name.charAt(0)}</span>
                            </div>
                            <div>
                              <div className="fw-bold text-dark">{s.name}</div>
                              <small className="text-muted">Supplier ID: {s.id}</small>
                            </div>
                          </div>
                        </td>
                        <td className="py-4">
                          <div className="d-flex align-items-center">
                            <i className="fas fa-phone-alt text-primary me-2"></i>
                            <span className="fw-medium">{s.contact}</span>
                          </div>
                        </td>
                        <td className="py-4">
                          <div className="d-flex align-items-center">
                            <i className="fas fa-envelope text-success me-2"></i>
                            <span className="fw-medium">{s.email}</span>
                          </div>
                        </td>
                        <td className="py-4">
                          <div className="d-flex align-items-start">
                            <i className="fas fa-map-marker-alt text-danger me-2 mt-1"></i>
                            <span className="text-muted" style={{ maxWidth: '200px' }}>{s.address}</span>
                          </div>
                        </td>
                        <td className="py-4 text-center">
                          <div className="btn-group" role="group">
                            <button 
                              className="btn btn-sm btn-outline-primary me-1" 
                              title="Edit supplier"
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                            <button 
                              className="btn btn-sm btn-outline-info me-1" 
                              title="View details"
                            >
                              <i className="fas fa-eye"></i>
                            </button>
                            <button 
                              className="btn btn-sm btn-outline-danger" 
                              onClick={() => remove(s.id)}
                              title="Delete supplier"
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
              
              {suppliers.length === 0 && (
                <div className="text-center py-5">
                  <div className="mb-3">
                    <i className="fas fa-truck fa-3x text-muted"></i>
                  </div>
                  <h4 className="text-muted">No suppliers found</h4>
                  <p className="text-muted">Add your first supplier using the form on the left</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}