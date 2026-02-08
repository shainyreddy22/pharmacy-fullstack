import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

function Layout() {
  return (
    <div className="d-flex" style={{ height: "100vh" }}>
      <Sidebar />
      <div className="flex-grow-1 overflow-auto">
        <div className="p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Layout;