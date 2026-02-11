import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createSale } from "../services/salesService";
import { getMedicines } from "../services/medicineService";

function CreateSale() {
  const navigate = useNavigate();
  
  const [customerName, setCustomerName] = useState("");
  const [medicines, setMedicines] = useState([]);
  const [cart, setCart] = useState([]);
  const [selectedMedicine, setSelectedMedicine] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadMedicines();
  }, []);

  const loadMedicines = async () => {
    try {
      const res = await getMedicines();
      // Mock data if API fails
      const mockData = [
        { id: 1, name: "Paracetamol", price: 5.99, quantity: 150 },
        { id: 2, name: "Amoxicillin", price: 12.50, quantity: 75 },
        { id: 3, name: "Vitamin C", price: 8.75, quantity: 200 },
        { id: 4, name: "Ibuprofen", price: 7.25, quantity: 89 }
      ];
      setMedicines(res.data || mockData);
    } catch (error) {
      console.error("Error loading medicines:", error);
      setMedicines([
        { id: 1, name: "Paracetamol", price: 5.99, quantity: 150 },
        { id: 2, name: "Amoxicillin", price: 12.50, quantity: 75 },
        { id: 3, name: "Vitamin C", price: 8.75, quantity: 200 },
        { id: 4, name: "Ibuprofen", price: 7.25, quantity: 89 }
      ]);
    }
  };

  const addToCart = () => {
    if (!selectedMedicine || quantity <= 0) return;
    
    const medicine = medicines.find(m => m.id === parseInt(selectedMedicine));
    if (!medicine) return;
    
    if (quantity > medicine.quantity) {
      alert(`Only ${medicine.quantity} units available in stock`);
      return;
    }
    
    const existingItem = cart.find(item => item.medicineId === medicine.id);
    
    if (existingItem) {
      // Update quantity if item already in cart
      setCart(cart.map(item => 
        item.medicineId === medicine.id 
          ? { ...item, quantity: item.quantity + quantity }
          : item
      ));
    } else {
      // Add new item to cart
      setCart([...cart, {
        medicineId: medicine.id,
        name: medicine.name,
        price: medicine.price,
        quantity: quantity
      }]);
    }
    
    // Reset form
    setSelectedMedicine("");
    setQuantity(1);
  };

  const removeFromCart = (medicineId) => {
    setCart(cart.filter(item => item.medicineId !== medicineId));
  };

  const updateCartItemQuantity = (medicineId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(medicineId);
      return;
    }
    
    const medicine = medicines.find(m => m.id === medicineId);
    if (newQuantity > medicine.quantity) {
      alert(`Only ${medicine.quantity} units available in stock`);
      return;
    }
    
    setCart(cart.map(item => 
      item.medicineId === medicineId 
        ? { ...item, quantity: newQuantity }
        : item
    ));
  };

  const getTotalAmount = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!customerName.trim()) newErrors.customerName = "Customer name is required";
    if (cart.length === 0) newErrors.cart = "Please add at least one medicine to the cart";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const saveSale = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      const data = {
        sale: {
          customerName: customerName,
          totalAmount: getTotalAmount(),
          saleDate: new Date().toISOString().split('T')[0]
        },
        items: cart.map(item => ({
          medicineId: item.medicineId,
          quantity: item.quantity,
          price: item.price
        }))
      };

      await createSale(data);
      alert("Sale created successfully!");
      navigate("/sales-history");
    } catch (error) {
      console.error("Error creating sale:", error);
      alert("Failed to create sale. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-lg-8">
          <div className="card shadow mb-4">
            <div className="card-header bg-success text-white">
              <h3 className="mb-0">🛒 Create New Sale</h3>
            </div>
            <div className="card-body">
              {/* Customer Information */}
              <div className="mb-4">
                <h5>Customer Information</h5>
                <div className="mb-3">
                  <label className="form-label">Customer Name *</label>
                  <input
                    type="text"
                    className={`form-control ${errors.customerName ? 'is-invalid' : ''}`}
                    placeholder="Enter customer name"
                    value={customerName}
                    onChange={(e) => {
                      setCustomerName(e.target.value);
                      if (errors.customerName) setErrors({...errors, customerName: ''});
                    }}
                  />
                  {errors.customerName && <div className="invalid-feedback">{errors.customerName}</div>}
                </div>
              </div>

              {/* Add Medicine Form */}
              <div className="mb-4">
                <h5>Add Medicines</h5>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Select Medicine</label>
                    <select
                      className="form-select"
                      value={selectedMedicine}
                      onChange={(e) => setSelectedMedicine(e.target.value)}
                    >
                      <option value="">Choose a medicine...</option>
                      {medicines.map(medicine => (
                        <option key={medicine.id} value={medicine.id}>
                          {medicine.name} - ${medicine.price.toFixed(2)} (Stock: {medicine.quantity})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">Quantity</label>
                    <input
                      type="number"
                      className="form-control"
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    />
                  </div>
                  <div className="col-md-3 d-flex align-items-end">
                    <button 
                      className="btn btn-primary w-100" 
                      onClick={addToCart}
                      disabled={!selectedMedicine || quantity <= 0}
                    >
                      <i className="fas fa-plus me-2"></i>Add
                    </button>
                  </div>
                </div>
              </div>

              {/* Cart Items */}
              <div className="mb-4">
                <h5>Cart Items ({cart.length})</h5>
                {cart.length === 0 ? (
                  <div className="text-center py-4 text-muted">
                    <i className="fas fa-shopping-cart fa-2x mb-2"></i>
                    <p>Your cart is empty</p>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Medicine</th>
                          <th>Price</th>
                          <th>Quantity</th>
                          <th>Total</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cart.map(item => (
                          <tr key={item.medicineId}>
                            <td>{item.name}</td>
                            <td>${item.price.toFixed(2)}</td>
                            <td>
                              <div className="input-group" style={{width: '120px'}}>
                                <button 
                                  className="btn btn-outline-secondary btn-sm" 
                                  type="button"
                                  onClick={() => updateCartItemQuantity(item.medicineId, item.quantity - 1)}
                                >
                                  -
                                </button>
                                <input 
                                  type="number" 
                                  className="form-control form-control-sm text-center" 
                                  value={item.quantity}
                                  min="1"
                                  onChange={(e) => updateCartItemQuantity(item.medicineId, parseInt(e.target.value) || 1)}
                                />
                                <button 
                                  className="btn btn-outline-secondary btn-sm" 
                                  type="button"
                                  onClick={() => updateCartItemQuantity(item.medicineId, item.quantity + 1)}
                                >
                                  +
                                </button>
                              </div>
                            </td>
                            <td>${(item.price * item.quantity).toFixed(2)}</td>
                            <td>
                              <button 
                                className="btn btn-danger btn-sm"
                                onClick={() => removeFromCart(item.medicineId)}
                              >
                                <i className="fas fa-trash"></i>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Total and Actions */}
              <div className="border-top pt-3">
                <div className="row">
                  <div className="col-md-6">
                    {errors.cart && <div className="alert alert-danger">{errors.cart}</div>}
                  </div>
                  <div className="col-md-6 text-end">
                    <div className="mb-3">
                      <h4>Total Amount: <span className="text-success">${getTotalAmount().toFixed(2)}</span></h4>
                    </div>
                    <div className="d-flex gap-2 justify-content-end">
                      <button 
                        className="btn btn-success" 
                        onClick={saveSale}
                        disabled={loading || cart.length === 0}
                      >
                        {loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                            Processing...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-check-circle me-2"></i>Complete Sale
                          </>
                        )}
                      </button>
                      <button 
                        className="btn btn-secondary"
                        onClick={() => navigate('/sales-history')}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Order Summary Sidebar */}
        <div className="col-lg-4">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">📋 Order Summary</h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <div className="d-flex justify-content-between">
                  <span>Items:</span>
                  <span className="fw-bold">{cart.length}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Subtotal:</span>
                  <span>${getTotalAmount().toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Tax (0%):</span>
                  <span>$0.00</span>
                </div>
                <hr/>
                <div className="d-flex justify-content-between">
                  <span><strong>Total:</strong></span>
                  <span className="fw-bold text-success">${getTotalAmount().toFixed(2)}</span>
                </div>
              </div>
              
              <div className="alert alert-info">
                <h6><i className="fas fa-info-circle me-2"></i>Quick Tips</h6>
                <ul className="mb-0 small">
                  <li>Select medicines from inventory</li>
                  <li>Adjust quantities as needed</li>
                  <li>Check stock availability</li>
                  <li>Review order before completing</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateSale;
