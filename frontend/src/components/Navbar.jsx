import { Link } from "react-router-dom";

function Navbar() {
  return (
    <div>
      <Link to="/dashboard">Dashboard</Link> |
      <Link to="/medicines">Medicines</Link> |
      <Link to="/suppliers">Suppliers</Link> |
      <Link to="/customers">Customers</Link> |
      <Link to="/sales-history">Sales</Link>
    </div>
  );
}

export default Navbar;
