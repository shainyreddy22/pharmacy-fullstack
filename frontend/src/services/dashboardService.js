import API from "./api";

export const getDashboardSummary = () => API.get("/dashboard/summary");

export const getLowStock = () => API.get("/dashboard/low-stock");

export const getRecentSales = () => API.get("/dashboard/recent-sales");
