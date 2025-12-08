// src/services/api.js
import axios from 'axios';

const BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:7000';

const api = axios.create({
  baseURL: BASE,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(cfg => {
  const key = import.meta.env.VITE_API_KEY;
  if (key) cfg.headers.Authorization = `Bearer ${key}`;
  return cfg;
}, err => Promise.reject(err));

export async function getIndustries() {
  // endpoint sesuai docs: GET /industries
  const resp = await api.get('/industries');
  return resp.data; // sesuaikan jika response wrapped { data: [...] }
}

// export juga fungsi lain di sini
export default api;
