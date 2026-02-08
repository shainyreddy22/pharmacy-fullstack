import React, { useEffect, useState } from "react";
import { getCustomers, addCustomer } from "../services/customerService";

function Customers() {

  const [customers, setCustomers] = useState([]);
  const [name, setName] = useState("");

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = () => {
    getCustomers().then(res => setCustomers(res.data));
  };

  const save = () => {
    addCustomer({ name }).then(() => {
      alert("Customer Added");
      loadCustomers();
    });
  };

  return (
    <div className="container mt-4">
      <h3>Customers</h3>

      <input
        className="form-control"
        placeholder="Customer Name"
        onChange={(e) => setName(e.target.value)}
      />

      <button className="btn btn-success mt-2" onClick={save}>
        Add Customer
      </button>

      <table className="table mt-3">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
          </tr>
        </thead>

        <tbody>
          {customers.map(c => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Customers;
