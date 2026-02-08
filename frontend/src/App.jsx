import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Medicines from "./pages/Medicines";
import AddMedicine from "./pages/AddMedicine";
import Suppliers from "./pages/Suppliers";
import Customers from "./pages/Customers";
import CreateSale from "./pages/CreateSale";
import SalesHistory from "./pages/SalesHistory";
import LowStock from "./pages/LowStock";
import ExpiryReport from "./pages/ExpiryReport";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Protected Routes */}
          <Route path="/" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="medicines" element={<Medicines />} />
            <Route path="add-medicine" element={<AddMedicine />} />
            <Route path="suppliers" element={<Suppliers />} />
            <Route path="customers" element={<Customers />} />
            <Route path="create-sale" element={<CreateSale />} />
            <Route path="sales-history" element={<SalesHistory />} />
            <Route path="low-stock" element={<LowStock />} />
            <Route path="expiry-report" element={<ExpiryReport />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
