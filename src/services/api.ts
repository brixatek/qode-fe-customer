import axios from 'axios';
import { CustomerCreateDto, Country, CountryPhoneCode, Role, Sector, Referral, VerifyEmailDto, LoginRequest, Campaign, BusinessInformation, BusinessUpdateDto } from '../types/api';

// API_BASE_URL = 'https://onboarding.zephapay.com/api/v1';
const API_BASE_URL = 'https://onboarding.zephapay.com/api/v1';
//const API_BASE_URL = 'https://localhost:7156/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token management
const tokenManager = {
  getAccessToken: () => localStorage.getItem('accessToken'),
  getRefreshToken: () => localStorage.getItem('refreshToken'),
  setTokens: (accessToken: string, refreshToken: string) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('isLoggedIn', 'true');
  },
  clearTokens: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('isLoggedIn');
  },
  isTokenExpired: (token: string) => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  },
  isAuthenticated: () => {
    const token = tokenManager.getAccessToken();
    if (!token || tokenManager.isTokenExpired(token)) {
      tokenManager.clearTokens();
      return false;
    }
    return true;
  },
  autoLogout: () => {
    tokenManager.clearTokens();
    window.location.href = '/?login=true&expired=true';
  },
  startTokenExpirationCheck: () => {
    const checkInterval = setInterval(() => {
      const token = tokenManager.getAccessToken();
      if (token && tokenManager.isTokenExpired(token)) {
        clearInterval(checkInterval);
        tokenManager.autoLogout();
      }
    }, 60000); // Check every minute
    return checkInterval;
  },
};

// Start token expiration check when module loads
if (typeof window !== 'undefined' && tokenManager.getAccessToken()) {
  tokenManager.startTokenExpirationCheck();
}

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = tokenManager.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        }).catch(err => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = tokenManager.getRefreshToken();
      if (!refreshToken) {
        tokenManager.clearTokens();
        window.location.href = '/?login=true';
        return Promise.reject(error);
      }

      try {
        const response = await axios.post(`${API_BASE_URL}/identities/refresh-token`, {
          refreshToken
        });
        
        const { accessToken, refreshToken: newRefreshToken } = response.data;
        tokenManager.setTokens(accessToken, newRefreshToken);
        
        processQueue(null, accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        tokenManager.autoLogout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export const customerService = {
  create: (data: CustomerCreateDto) => api.post('/customers', data),
  login: (data: LoginRequest) => api.post('/identities/auth', data),
  verifyEmail: (data: VerifyEmailDto) => api.post('/email-verification/verify', data),
  resendVerification: (email: string) => api.post('/email-verification/resend', { email }),
};

export const referenceDataService = {
  getCountries: () => api.get<Country[]>('/countries'),
  getCountryPhoneCodes: () => api.get<CountryPhoneCode[]>('/countryphonecodes'),
  getRoles: () => api.get<Role[]>('/roles'),
  getSectors: () => api.get<Sector[]>('/sectors'),
  getReferrals: () => api.get<Referral[]>('/referrals'),
  getDocumentTypes: () => api.get('/document-types'),
};

export const dashboardService = {
  getCurrentUser: () => api.get('/identities/current-user'),
  getCustomerProfile: () => api.get('/customers/profile'),
  getBusinessInformation: () => api.get<BusinessInformation>('/business-information'),
  updateBusinessInformation: (data: BusinessUpdateDto) => api.put('/business-information', data),
  updateProfile: (customerId: string, data: any) => api.put(`/customers/${customerId}`, data),
  logout: async () => {
    try {
      await api.post('/identities/logout');
    } finally {
      tokenManager.clearTokens();
    }
  },
  getApiKeys: () => api.get('/ApiKeys'),
  createApiKey: (data: { keyName: string; keyType: number }) => api.post('/ApiKeys', data),
  deleteApiKey: (keyId: string) => api.delete(`/ApiKeys/${keyId}`),
  blockApiKey: (keyId: string) => api.patch(`/ApiKeys/${keyId}/block`),
  unblockApiKey: (keyId: string) => api.patch(`/ApiKeys/${keyId}/unblock`),
  rotateApiKey: (keyId: string) => api.post(`/ApiKeys/rotate`, { apiKeyId: keyId }),
  getSenderRequests: () => api.get('/sender-requests'),
  getSenderRequest: (id: string) => api.get(`/sender-requests/${id}`),
  getCustomerSenderRequests: (customerId: string) => api.get(`/sender-requests/customer/${customerId}`),
  createSenderRequest: (data: any) => api.post('/sender-requests', data),
  updateSenderRequest: (id: string, data: any) => api.put(`/sender-requests/${id}`, data),
  deleteSenderRequest: (id: string) => api.delete(`/sender-requests/${id}`),
  getCampaigns: () => api.get('/campaigns'),
  pauseCampaign: (campaignId: string) => api.patch(`/campaigns/${campaignId}/pause`),
  resumeCampaign: (campaignId: string) => api.patch(`/campaigns/${campaignId}/resume`),
  deleteCampaign: (campaignId: string) => api.delete(`/campaigns/${campaignId}`),
};

export const walletService = {
  createWallet: (currency: string) => api.post('/wallets', { currency }),
  getWallet: () => api.get('/wallets'),
  activateWallet: () => api.post('/wallets/activate'),
  getTransactionHistory: (pageNumber: number = 1, pageSize: number = 10) => api.get(`/wallets/transactions?pageNumber=${pageNumber}&pageSize=${pageSize}`),
  getTransactions: (pageNumber: number = 1, pageSize: number = 10) => api.get(`/wallets/transactions?pageNumber=${pageNumber}&pageSize=${pageSize}`),
  validatePayment: () => api.post('/wallets/validate-payment'),
};

// Admin token management
const adminTokenManager = {
  getAccessToken: () => localStorage.getItem('adminAccessToken'),
  getRefreshToken: () => localStorage.getItem('adminRefreshToken'),
  setTokens: (accessToken: string, refreshToken: string) => {
    localStorage.setItem('adminAccessToken', accessToken);
    localStorage.setItem('adminRefreshToken', refreshToken);
    localStorage.setItem('isAdminLoggedIn', 'true');
  },
  clearTokens: () => {
    localStorage.removeItem('adminAccessToken');
    localStorage.removeItem('adminRefreshToken');
    localStorage.removeItem('isAdminLoggedIn');
  },
  isAuthenticated: () => {
    const token = adminTokenManager.getAccessToken();
    return token && !tokenManager.isTokenExpired(token);
  },
};

// Admin API instance
const adminApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Admin request interceptor
adminApi.interceptors.request.use(
  (config) => {
    const token = adminTokenManager.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Admin response interceptor for token refresh
adminApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = adminTokenManager.getRefreshToken();
      if (!refreshToken) {
        adminTokenManager.clearTokens();
        window.location.href = '/admin';
        return Promise.reject(error);
      }

      try {
        const response = await axios.post(`${API_BASE_URL}/backoffice/auth/refresh`, {
          refreshToken
        });
        
        const { accessToken, refreshToken: newRefreshToken } = response.data.data;
        adminTokenManager.setTokens(accessToken, newRefreshToken);
        
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return adminApi(originalRequest);
      } catch (refreshError) {
        adminTokenManager.clearTokens();
        window.location.href = '/admin';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export const adminService = {
  login: (data: LoginRequest) => adminApi.post('/backoffice/auth/login', data),
  refreshToken: (refreshToken: string) => adminApi.post('/backoffice/auth/refresh', { refreshToken }),
  logout: async () => {
    try {
      await adminApi.post('/backoffice/auth/logout');
    } finally {
      adminTokenManager.clearTokens();
    }
  },
  logoutAll: async () => {
    try {
      await adminApi.post('/backoffice/auth/logout-all');
    } finally {
      adminTokenManager.clearTokens();
    }
  },
  getSessions: () => adminApi.get('/backoffice/auth/sessions'),
  getSenderRequests: () => adminApi.get('/backoffice/sender-requests'),
  updateSenderRequestStatus: (requestId: string, status: number) => 
    adminApi.patch(`/backoffice/sender-requests/${requestId}/status`, { status }),
};

export { tokenManager, adminTokenManager };