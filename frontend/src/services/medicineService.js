import API from "./api";

export const getMedicines = () => API.get("/medicines");

export const addMedicine = (data) => API.post("/medicines", data);

export const deleteMedicine = (id) => API.delete(`/medicines/${id}`);

