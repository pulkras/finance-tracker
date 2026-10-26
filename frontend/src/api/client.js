import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

function getCookie(name) {
  const cookies = document.cookie ? document.cookie.split(";") : [];

  for (const cookie of cookies) {
    const trimmed = cookie.trim();

    if (trimmed.startsWith(`${name}=`)) {
      return decodeURIComponent(trimmed.slice(name.length + 1));
    }
  }

  return null;
}

api.interceptors.request.use((config) => {
  const method = (config.method || "get").toLowerCase();

  if (["post", "put", "patch", "delete"].includes(method)) {
    const csrfToken = getCookie("csrftoken");

    if (csrfToken) {
      config.headers["X-CSRFToken"] = csrfToken;
    }
  }

  return config;
});

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
