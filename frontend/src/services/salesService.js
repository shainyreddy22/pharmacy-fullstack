import API from "../api/api";

export const getAllSales = () => API.get("/sales");

export const createSale = (sale) =>
  API.post("/sales", sale);
