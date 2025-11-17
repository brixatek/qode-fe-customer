export interface BackofficeLoginDto {
  email: string;
  password: string;
}

export interface BackofficeUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: BackofficeRole;
}

export enum BackofficeRole {
  Admin = 1,
  Manager = 2,
  Reviewer = 3,
  Analyst = 4,
  Support = 5
}

export interface CustomerSummary {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  status: string;
  createdAt: string;
}

export interface DashboardMetrics {
  totalCustomers: number;
  pendingReviews: number;
  approvedCustomers: number;
  rejectedCustomers: number;
}

export interface PendingReview {
  id: string;
  customerId: string;
  customerName: string;
  priority: number;
  createdAt: string;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}