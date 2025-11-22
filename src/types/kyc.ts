export interface KycDocument {
  id: string;
  fileName: string;
  fileUrl: string;
  documentTypeId: string;
  uploadedAt: string;
  status: string;
  customerId: string;
  createdAt?: string;
  rejectionReason?: string;
  reviewNotes?: string;
  reviewedAt?: string;
}

export interface DocumentType {
  id: string;
  name: string;
}

export interface KycUploadRequest {
  file: File;
  documentTypeId: string;
}


export interface DocumentHistory {
  id: string;
  documentId: string;
  action: 'upload' | 'update' | 'delete';
  fileName: string;
  performedBy: string;
  performedAt: string;
  status?: string;
}
