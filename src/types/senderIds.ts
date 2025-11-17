export enum KycStatus {
  Pending = 11,
  UnderReview = 1,
  Approved = 2,
  Rejected = 3,
  Suspended = 4
}

export interface SenderIdRequest {
  id: string;
  senderId: string;
  senderIdType: number;
  useCase: number;
  sampleMessage: string;
  approvalLetterUrl: string;
  isActive: boolean;
  status: number;
  customerId: string;
  createdAt: string;
  createdBy: string | null;
}

export interface SenderIdResponse {
  data: {
    data: SenderIdRequest[];
    pageNumber: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    hasPrevious: boolean;
    hasNext: boolean;
  };
  message: string;
  success: boolean;
  statusCode: number;
}

export const getStatusLabel = (status: number): string => {
  switch (status) {
    case KycStatus.Pending:
      return 'Pending';
    case KycStatus.UnderReview:
      return 'Under Review';
    case KycStatus.Approved:
      return 'Approved';
    case KycStatus.Rejected:
      return 'Rejected';
    case KycStatus.Suspended:
      return 'Suspended';
    default:
      return 'Unknown';
  }
};

export const getStatusColor = (status: number): string => {
  switch (status) {
    case KycStatus.Approved:
      return '#28a745';
    case KycStatus.Rejected:
      return '#dc3545';
    case KycStatus.Pending:
      return '#ffc107';
    case KycStatus.UnderReview:
      return '#17a2b8';
    case KycStatus.Suspended:
      return '#6c757d';
    default:
      return '#6c757d';
  }
};