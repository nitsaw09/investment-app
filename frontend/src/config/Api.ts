import axios from 'axios';

axios.defaults.baseURL = import.meta.env.VITE_APP_BASE_API_URL;

const api = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authApi = {
  login: async (data: { email: string; password: string }) => {
    const response = await api.post('/api/v1/auth/login', data);
    return response.data;
  },
  signup: async (data: { name: string; email: string; password: string }) => {
    const response = await api.post('/api/v1/auth/signup', data);
    return response.data;
  },
  changePassword: async (data: { oldPassword: string, newPassword: string; confirmNewPassword: string }) => {
    const response = await api.post('/api/v1/auth/change-password', data);
    return response.data;
  }
};

export const cryptoApi = {
  getTopCoins: async () => {
    const response = await api.get('/api/v1/crypto/top-coins');
    return response.data;
  },
  getHistoricalData: async (symbol: string) => {
    const response = await api.get(`/api/v1/crypto/historical/${symbol}`);
    return response.data;
  }
}

export const portfolioApi = {
  getPortfolioValue: async (
    walletAddress: string, 
    params?: { page: number, limit: number, networkFilter: string, nativeFilter: string 
  }) => {
    const response = await api.get(`/api/v1/portfolio/${walletAddress}/value`, { params });
    return response.data;
  },
  updatePortfolio: async (walletAddress: string) => {
    const response = await api.put(`/api/v1/portfolio/${walletAddress}/update`);
    return response.data;
  }
}

