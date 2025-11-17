import { BackofficeLoginDto, BackofficeUser, CustomerSummary, DashboardMetrics, PendingReview, ApiResponse, PaginatedResponse } from '../types/admin';
import { adminService, adminTokenManager } from './api';

const BASE_URL = 'https://onboarding.zephapay.com/api/v1';
//const BASE_URL = 'https://localhost:7156/api/v1';


class AdminApiService {
  setToken(token: string) {
    adminTokenManager.setTokens(token, '');
  }

  getToken(): string | null {
    return adminTokenManager.getAccessToken();
  }

  clearToken() {
    adminTokenManager.clearTokens();
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${BASE_URL}${endpoint}`;
    const token = this.getToken();
    
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    };

    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  }

  // Authentication
  async login(credentials: BackofficeLoginDto): Promise<ApiResponse<{ token: string; user: BackofficeUser }>> {
    const response = await adminService.login(credentials);
    return response.data;
  }

  async logout(): Promise<void> {
    await adminService.logout();
  }

  // Dashboard metrics
  async getDashboardMetrics(): Promise<DashboardMetrics> {
    return this.request('/metrics/dashboard');
  }

  // Customer management
  async getCustomerSummaries(params: {
    pageNumber?: number;
    pageSize?: number;
    searchTerm?: string;
    sortBy?: string;
    sortDescending?: boolean;
  } = {}): Promise<PaginatedResponse<CustomerSummary>> {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });
    
    return this.request(`/backoffice/customer-summaries?${queryParams}`);
  }

  // Reviews
  async getPendingReviews(): Promise<PendingReview[]> {
    return this.request('/backoffice/pending-reviews');
  }

  async assignReview(reviewId: string, reviewerId: string): Promise<void> {
    return this.request(`/backoffice/reviews/${reviewId}/assign/${reviewerId}`, {
      method: 'PUT',
    });
  }

  // Backoffice users
  async getBackofficeUsers(params: {
    pageNumber?: number;
    pageSize?: number;
    searchTerm?: string;
  } = {}): Promise<PaginatedResponse<BackofficeUser>> {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });
    
    return this.request(`/backoffice/users?${queryParams}`);
  }
}

export const adminApi = new AdminApiService();