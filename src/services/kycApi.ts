import axios from 'axios';
import { KycDocument, DocumentType, KycUploadRequest } from '../types/kyc';
//https://localhost:7156
const API_BASE_URL = 'https://onboarding.zephapay.com/api/v1';
//const API_BASE_URL = 'https://localhost:7156/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const kycService = {
  getDocumentTypes: () => api.get<DocumentType[]>('/document-types'),
  
  uploadDocument: (data: KycUploadRequest) => {
    const formData = new FormData();
    formData.append('File', data.file);
    formData.append('DocumentTypeId', data.documentTypeId);
    
    return api.post('/kyc-documents/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  getCustomerDocuments: (customerId: string) => 
    api.get<KycDocument[]>(`/kyc-documents/customer/${customerId}`),

  downloadDocument: (documentId: string) => 
    api.get(`/kyc-documents/${documentId}/download`, { responseType: 'blob' }),

  deleteDocument: (documentId: string) => 
    api.delete(`/kyc-documents/${documentId}`)
};