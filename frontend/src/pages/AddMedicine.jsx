import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addMedicine } from "../services/medicineService";

function AddMedicine() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    price: "",
    quantity: "",
    expiryDate: "",
    batchNumber: "",
    category: "prescription"
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = "Medicine name is required";
    if (!formData.company.trim()) newErrors.company = "Company is required";
    if (!formData.price || formData.price <= 0) newErrors.price = "Valid price is required";
    if (!formData.quantity || formData.quantity < 0) newErrors.quantity = "Valid quantity is required";
    if (!formData.expiryDate) newErrors.expiryDate = "Expiry date is required";
    if (!formData.batchNumber.trim()) newErrors.batchNumber = "Batch number is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      await addMedicine({
        ...formData,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity)
      });
      
      alert("Medicine added successfully!");
      navigate("/medicines");
    } catch (error) {
      console.error("Error adding medicine:", error);
      alert("Failed to add medicine. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow">
            <div className="card-header bg-primary text-white">
              <h3 className="mb-0">➕ Add New Medicine</h3>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Medicine Name *</label>
                    <input
                      type="text"
                      className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter medicine name"
                    />
                    {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                  </div>
                  
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Company *</label>
                    <input
                      type="text"
                      className={`form-control ${errors.company ? 'is-invalid' : ''}`}
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      placeholder="Enter company name"
                    />
                    {errors.company && <div className="invalid-feedback">{errors.company}</div>}
                  </div>
                </div>
                
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Price ($) *</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      className={`form-control ${errors.price ? 'is-invalid' : ''}`}
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      placeholder="0.00"
                    />
                    {errors.price && <div className="invalid-feedback">{errors.price}</div>}
                  </div>
                  
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Quantity *</label>
                    <input
                      type="number"
                      min="0"
                      className={`form-control ${errors.quantity ? 'is-invalid' : ''}`}
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleChange}
                      placeholder="Enter quantity"
                    />
                    {errors.quantity && <div className="invalid-feedback">{errors.quantity}</div>}
                  </div>
                </div>
                
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Expiry Date *</label>
                    <input
                      type="date"
                      className={`form-control ${errors.expiryDate ? 'is-invalid' : ''}`}
                      name="expiryDate"
                      value={formData.expiryDate}
                      onChange={handleChange}
                    />
                    {errors.expiryDate && <div className="invalid-feedback">{errors.expiryDate}</div>}
                  </div>
                  
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Batch Number *</label>
                    <input
                      type="text"
                      className={`form-control ${errors.batchNumber ? 'is-invalid' : ''}`}
                      name="batchNumber"
                      value={formData.batchNumber}
                      onChange={handleChange}
                      placeholder="Enter batch number"
                    />
                    {errors.batchNumber && <div className="invalid-feedback">{errors.batchNumber}</div>}
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="form-label">Category</label>
                  <select
                    className="form-select"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                  >
                    <option value="prescription">Prescription</option>
                    <option value="otc">Over the Counter</option>
                    <option value="supplement">Supplement</option>
                    <option value="cosmetic">Cosmetic</option>
                  </select>
                </div>
                
                <div className="d-flex gap-2">
                  <button 
                    type="submit" 
                    className="btn btn-primary" 
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Adding...
                      </>
                    ) : (
                      "Add Medicine"
                    )}
                  </button>
                  
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={() => navigate('/medicines')}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddMedicine;
