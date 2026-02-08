import React, { useEffect, useState } from "react";
import { getAllSales } from "../services/salesService";

function SalesHistory() {

  const [sales, setSales] = useState([]);

  useEffect(() => {
    getAllSales().then(res => setSales(res.data));
  }, []);

  return (
    <div className="container mt-4">
      <h3>Sales History</h3>

      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Customer</th>
            <th>Total</th>
          </tr>
        </thead>

        <tbody>
          {sales.map(s => (
            <tr key={s.id}>
              <td>{s.id}</td>
              <td>{s.customerName}</td>
              <td>{s.totalAmount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SalesHistory;
