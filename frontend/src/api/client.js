import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    "http://127.0.0.1:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("access_token");

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

export const authApi = {
  register(data) {
    return api.post("/auth/register/", data);
  },

  login(data) {
    return api.post("/auth/token/", data);
  },

  getCurrentUser() {
    return api.get("/auth/me/");
  },
};

export const financeApi = {
  getCategories(params = {}) {
    return api.get("/categories/", { params });
  },

  getTransactions(params = {}) {
    return api.get("/transactions/", { params });
  },

  getTransaction(id) {
    return api.get(`/transactions/${id}/`);
  },

  createTransaction(data) {
    return api.post("/transactions/", data);
  },

  updateTransaction(id, data) {
    return api.patch(`/transactions/${id}/`, data);
  },

  deleteTransaction(id) {
    return api.delete(`/transactions/${id}/`);
  },

  getSummary() {
    return api.get("/summary/");
  },
};

export default api;
