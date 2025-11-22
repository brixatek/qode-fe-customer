import React, { useState, useEffect } from 'react';
import { kycService } from '../services/kycApi.ts';
import { dashboardService } from '../services/api.ts';
import { KycDocument, DocumentType, DocumentHistory } from '../types/kyc';
import './KycDocuments.css';

const KycDocuments: React.FC = () => {
  const [documents, setDocuments] = useState<KycDocument[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<KycDocument[]>([]);
  const [documentTypes, setDocumentTypes] = useState<DocumentType[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [customerId, setCustomerId] = useState<string | null>(null);
  const [viewingDocument, setViewingDocument] = useState<{id: string, fileName: string, url: string, document: KycDocument} | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'status'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [deleteConfirm, setDeleteConfirm] = useState<{show: boolean, docId: string, docName: string}>({show: false, docId: '', docName: ''});
  const [showUpdateModal, setShowUpdateModal] = useState<{show: boolean, docId: string, docTypeId: string, docName: string} | null>(null);
  const [showHistoryModal, setShowHistoryModal] = useState<{show: boolean, docId: string, docName: string} | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [documentHistory, setDocumentHistory] = useState<DocumentHistory[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [userResponse, typesResponse] = await Promise.all([
        dashboardService.getCurrentUser(),
        kycService.getDocumentTypes()
      ]);
      
      const userId = userResponse.data.data.id;
      setCustomerId(userId);
      setCurrentUser(userResponse.data.data);
      
      console.log('Document types response:', typesResponse);
      const types = typesResponse.data?.data?.data || [];
      console.log('Processed types:', types);
      setDocumentTypes(Array.isArray(types) ? types : []);
      
      const documentsResponse = await kycService.getCustomerDocuments(userId);
      const docs = documentsResponse.data?.data || documentsResponse.data || [];
      const docsArray = Array.isArray(docs) ? docs : [];
      setDocuments(docsArray);
      setFilteredDocuments(docsArray);
    } catch (error) {
      console.error('Failed to load data:', error);
      setDocumentTypes([]);
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (file: File, documentTypeId: string) => {
    if (!customerId) return;
    setUploading(true);
    try {
      await kycService.uploadDocument({ file, documentTypeId });
      addToHistory(documentTypeId, 'upload', file.name);
      await loadDocuments();
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const addToHistory = (docId: string, action: 'upload' | 'update' | 'delete', fileName: string) => {
    const historyEntry: DocumentHistory = {
      id: Date.now().toString(),
      documentId: docId,
      action,
      fileName,
      performedBy: currentUser?.email || 'Unknown',
      performedAt: new Date().toISOString(),
    };
    const existingHistory = JSON.parse(localStorage.getItem('documentHistory') || '[]');
    existingHistory.unshift(historyEntry);
    localStorage.setItem('documentHistory', JSON.stringify(existingHistory));
  };

  const loadHistory = (docId: string) => {
    setLoadingHistory(true);
    try {
      const allHistory = JSON.parse(localStorage.getItem('documentHistory') || '[]');
      const filtered = allHistory.filter((h: DocumentHistory) => h.documentId === docId);
      setDocumentHistory(filtered);
    } catch (error) {
      console.error('Failed to load history:', error);
      setDocumentHistory([]);
    } finally {
      setLoadingHistory(false);
    }
  };

  const loadDocuments = async () => {
    if (!customerId) return;
    try {
      const response = await kycService.getCustomerDocuments(customerId);
      const docs = response.data.data || [];
      setDocuments(docs);
      setFilteredDocuments(docs);
    } catch (error) {
      console.error('Failed to load documents:', error);
    }
  };

  useEffect(() => {
    let filtered = documents.filter(doc => {
      const matchesStatus = statusFilter === 'all' || 
                           (typeof doc.status === 'number' ? 
                            (statusFilter === 'pending' && doc.status === 0) ||
                            (statusFilter === 'approved' && doc.status === 1) ||
                            (statusFilter === 'rejected' && doc.status === 2)
                            : doc.status?.toLowerCase() === statusFilter);
      return matchesStatus;
    });

    filtered.sort((a, b) => {
      let aVal, bVal;
      switch (sortBy) {
        case 'name':
          aVal = a.fileName.toLowerCase();
          bVal = b.fileName.toLowerCase();
          break;
        case 'status':
          aVal = typeof a.status === 'number' ? a.status : 0;
          bVal = typeof b.status === 'number' ? b.status : 0;
          break;
        case 'date':
        default:
          aVal = new Date(a.createdAt || 0).getTime();
          bVal = new Date(b.createdAt || 0).getTime();
          break;
      }
      return sortOrder === 'asc' ? (aVal > bVal ? 1 : -1) : (aVal < bVal ? 1 : -1);
    });

    setFilteredDocuments(filtered);
    setCurrentPage(1);
  }, [documents, statusFilter, sortBy, sortOrder, documentTypes]);

  const totalPages = Math.ceil(filteredDocuments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedDocuments = filteredDocuments.slice(startIndex, startIndex + itemsPerPage);

  const getStatusStats = () => {
    const stats = { pending: 0, approved: 0, rejected: 0, total: documents.length };
    documents.forEach(doc => {
      if (typeof doc.status === 'number') {
        switch (doc.status) {
          case 0: stats.pending++; break;
          case 1: stats.approved++; break;
          case 2: stats.rejected++; break;
        }
      }
    });
    return stats;
  };

  const handleView = (documentId: string, fileName: string) => {
    // Find the document in our existing documents array
    const document = documents.find(doc => doc.id === documentId);
    
    if (document && document.fileUrl) {
      console.log('Document status:', document.status, 'Rejection reason:', document.rejectionReason);
      setViewingDocument({ id: documentId, fileName, url: document.fileUrl, document });
    } else {
      console.error('Document not found or no fileUrl:', document);
      alert('Unable to view document. Please try downloading instead.');
    }
  };

  const handleDownload = async (documentId: string, fileName: string) => {
    try {
      const response = await kycService.downloadDocument(documentId);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const handleDelete = (documentId: string, fileName: string) => {
    setDeleteConfirm({show: true, docId: documentId, docName: fileName});
  };

  const confirmDelete = async () => {
    try {
      const doc = documents.find(d => d.id === deleteConfirm.docId);
      await kycService.deleteDocument(deleteConfirm.docId);
      if (doc) addToHistory(doc.documentTypeId, 'delete', doc.fileName);
      await loadDocuments();
      setDeleteConfirm({show: false, docId: '', docName: ''});
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  if (loading) return (
    <div className="dashboard-loading">
      <div className="spinner"></div>
      <p>Loading documents...</p>
    </div>
  );

  return (
    <div className="documents-container">
      <div className="documents-header">
        <div className="documents-title-section">
          <h1 className="documents-title">Documents</h1>
          <p className="documents-subtitle">Upload and manage your KYC verification documents</p>
        </div>
        <div className="documents-actions">
          <button 
            onClick={() => setShowUploadModal(true)}
            className="btn btn-primary"
          >
            📄 Upload Document
          </button>
        </div>
      </div>
      
      <div className="documents-stats-grid">
        {(() => {
          const stats = getStatusStats();
          return (
            <>
              <div className="document-stat-card primary">
                <div className="stat-icon-modern">📊</div>
                <div className="stat-content-modern">
                  <div className="stat-value-modern">{stats.total}</div>
                  <div className="stat-label-modern">Total Documents</div>
                </div>
              </div>
              <div className="document-stat-card warning">
                <div className="stat-icon-modern">⏳</div>
                <div className="stat-content-modern">
                  <div className="stat-value-modern">{stats.pending}</div>
                  <div className="stat-label-modern">Pending Review</div>
                </div>
              </div>
              <div className="document-stat-card success">
                <div className="stat-icon-modern">✅</div>
                <div className="stat-content-modern">
                  <div className="stat-value-modern">{stats.approved}</div>
                  <div className="stat-label-modern">Approved</div>
                </div>
              </div>
              <div className="document-stat-card danger">
                <div className="stat-icon-modern">❌</div>
                <div className="stat-content-modern">
                  <div className="stat-value-modern">{stats.rejected}</div>
                  <div className="stat-label-modern">Rejected</div>
                </div>
              </div>
            </>
          );
        })()} 
      </div>
      
      <div className="card" style={{ marginTop: '24px' }}>
        <div className="table-header">
          <h3 className="table-title">Document List</h3>
          <p className="table-subtitle">View and manage your uploaded documents</p>
        </div>
        <div className="table-controls">
        <div className="search-filter-row">
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          
          <select 
            value={`${sortBy}-${sortOrder}`} 
            onChange={(e) => {
              const [field, order] = e.target.value.split('-');
              setSortBy(field as 'name' | 'date' | 'status');
              setSortOrder(order as 'asc' | 'desc');
            }}
            className="sort-select"
          >
            <option value="date-desc">Latest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="name-asc">Name A-Z</option>
            <option value="name-desc">Name Z-A</option>
            <option value="status-asc">Status ↑</option>
            <option value="status-desc">Status ↓</option>
          </select>
          </div>
        </div>
        
        {!Array.isArray(filteredDocuments) || filteredDocuments.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📄</div>
            <h4>No Documents Uploaded</h4>
            <p>Upload your KYC documents to complete verification</p>
          </div>
        ) : (
          <div className="table-container">
          <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
            <colgroup>
              <col style={{ width: '18%' }} />
              <col style={{ width: '15%' }} />
              <col style={{ width: '18%' }} />
              <col style={{ width: '15%' }} />
              <col style={{ width: '15%' }} />
              <col style={{ width: '19%' }} />
            </colgroup>
            <thead>
              <tr className="table-header-row">
                <th className="table-header-cell">Type</th>
                <th className="table-header-cell text-center">Status</th>
                <th className="table-header-cell">Uploaded By</th>
                <th className="table-header-cell">Upload Date</th>
                <th className="table-header-cell">Review Date</th>
                <th className="table-header-cell text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedDocuments.map((doc, index) => {
                const docType = documentTypes.find(type => type.id === doc.documentTypeId);
                const getFileIcon = (fileName: string) => {
                  const ext = fileName.split('.').pop()?.toLowerCase();
                  switch (ext) {
                    case 'pdf': return '📄';
                    case 'jpg': case 'jpeg': case 'png': return '🖼️';
                    case 'doc': case 'docx': return '📝';
                    default: return '📎';
                  }
                };
                
                const getStatusText = (status: any) => {
                  if (typeof status === 'number') {
                    switch (status) {
                      case 0: return 'Pending';
                      case 1: return 'Approved';
                      case 2: return 'Rejected';
                      default: return 'Pending';
                    }
                  }
                  return typeof status === 'string' ? status : 'Pending';
                };

                const getStatusClass = (status: any) => {
                  if (typeof status === 'number') {
                    switch (status) {
                      case 1: return 'credit';
                      case 2: return 'debit';
                      default: return 'debit';
                    }
                  }
                  return 'debit';
                };
                
                return (
                  <tr key={doc.id} className={`table-row ${index === paginatedDocuments.length - 1 ? 'last-row' : ''}`}>
                    <td className="table-cell font-medium">{docType?.name || 'Unknown'}</td>
                    <td className="table-cell text-center">
                      <span className={`transaction-badge ${getStatusClass(doc.status)}`}>
                        {getStatusText(doc.status)}
                      </span>
                    </td>
                    <td className="table-cell">
                      <div className="date-primary">{currentUser?.email || 'N/A'}</div>
                    </td>
                    <td className="table-cell">
                      {doc.createdAt ? (
                        <div className="date-primary">
                          {new Date(doc.createdAt).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric', 
                            year: 'numeric'
                          })}
                        </div>
                      ) : 'N/A'}
                    </td>
                    <td className="table-cell">
                      {doc.reviewedAt ? (
                        <div className="date-primary">
                          {new Date(doc.reviewedAt).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric', 
                            year: 'numeric'
                          })}
                        </div>
                      ) : '-'}
                    </td>
                    <td className="table-cell text-center">
                      <div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
                        <button 
                          onClick={() => handleView(doc.id, doc.fileName)}
                          title="View"
                          style={{ width: '28px', height: '28px', borderRadius: '6px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#dbeafe', color: '#1d4ed8' }}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                          </svg>
                        </button>
                        <button 
                          onClick={() => setShowUpdateModal({show: true, docId: doc.id, docTypeId: doc.documentTypeId, docName: docType?.name || 'Document'})}
                          title="Update"
                          style={{ width: '28px', height: '28px', borderRadius: '6px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fef3c7', color: '#d97706' }}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                          </svg>
                        </button>
                        <button 
                          onClick={() => handleDelete(doc.id, docType?.name || 'Document')}
                          title="Delete"
                          style={{ width: '28px', height: '28px', borderRadius: '6px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fee2e2', color: '#dc2626' }}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                          </svg>
                        </button>
                        <button 
                          onClick={() => {
                            loadHistory(doc.documentTypeId);
                            setShowHistoryModal({show: true, docId: doc.id, docName: docType?.name || 'Document'});
                          }}
                          title="History"
                          style={{ width: '28px', height: '28px', borderRadius: '6px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#e0e7ff', color: '#4f46e5' }}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            {filteredDocuments.length > 0 && (
              <tfoot>
                <tr>
                  <td colSpan={6} className="pagination-cell">
                    <div className="pagination-container">
                      <button 
                        className="btn btn-secondary btn-sm"
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                      >
                        ← Previous
                      </button>
                      <span className="pagination-info">
                        Page {currentPage} of {totalPages}
                      </span>
                      <button 
                        className="btn btn-secondary btn-sm"
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                      >
                        Next →
                      </button>
                    </div>
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
          </div>
        )}
      </div>
      
      {showUploadModal && (
        <div className="upload-modal">
          <div className="modal-backdrop" onClick={() => setShowUploadModal(false)}></div>
          <div className="modal-content">
            <div className="modal-header">
              <h3>Upload KYC Documents</h3>
              <button 
                className="close-btn"
                onClick={() => setShowUploadModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <p className="upload-description">Select document type and upload your files for KYC verification</p>
              {Array.isArray(documentTypes) && documentTypes.filter(type => !documents.find(doc => doc.documentTypeId === type.id)).length === 0 ? (
                <div className="all-uploaded">
                  <div className="success-icon">✅</div>
                  <h4>All Documents Uploaded</h4>
                  <p>You have uploaded all required KYC documents.</p>
                </div>
              ) : (
              <div className="upload-grid">
                {Array.isArray(documentTypes) && documentTypes
                  .filter(type => !documents.find(doc => doc.documentTypeId === type.id))
                  .map(type => (
                    <div key={type.id} className="upload-card">
                      <div className="upload-header">
                        <h4>{type.name}</h4>
                      </div>
                      
                      <div className="upload-area">
                        <input
                          type="file"
                          id={`file-${type.id}`}
                          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              handleFileUpload(file, type.id);
                              setShowUploadModal(false);
                            }
                          }}
                          disabled={uploading}
                          className="file-input"
                        />
                        <label htmlFor={`file-${type.id}`} className="upload-label">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                          </svg>
                          {uploading ? 'Uploading...' : 'Choose File'}
                        </label>
                        <p className="upload-hint">PDF, JPG, PNG, DOC, DOCX (Max 10MB)</p>
                      </div>
                    </div>
                  ))}
              </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {viewingDocument && (
        <div className="modal-overlay" onClick={() => {
          if (viewingDocument.url.startsWith('blob:')) {
            window.URL.revokeObjectURL(viewingDocument.url);
          }
          setViewingDocument(null);
        }}>
          <div className="create-wallet-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '450px', width: '90%', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
            <div className="modal-header">
              <h2 className="modal-title">Document Details</h2>
              <button className="modal-close" onClick={() => {
                if (viewingDocument.url.startsWith('blob:')) {
                  window.URL.revokeObjectURL(viewingDocument.url);
                }
                setViewingDocument(null);
              }}>×</button>
            </div>
            <div className="modal-content" style={{ overflowY: 'auto', flex: 1 }}>
              <div className="currency-selection">
                <label className="currency-label">File Name</label>
                <div className="doc-info-box">
                  {viewingDocument.fileName}
                </div>
              </div>
              <div className="currency-selection">
                <label className="currency-label">Document Information</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                  <div className="doc-info-box">
                    <div className="doc-info-label">Type</div>
                    <div className="doc-info-value">
                      {documentTypes.find(type => type.id === viewingDocument.document.documentTypeId)?.name || 'Unknown'}
                    </div>
                  </div>
                  <div className="doc-info-box">
                    <div className="doc-info-label">Status</div>
                    <span className={`transaction-badge ${viewingDocument.document.status === 1 || viewingDocument.document.status === '1' ? 'credit' : 'debit'}`}>
                      {viewingDocument.document.status === 0 || viewingDocument.document.status === '0' ? 'Pending' : 
                       viewingDocument.document.status === 1 || viewingDocument.document.status === '1' ? 'Approved' : 'Rejected'}
                    </span>
                  </div>
                  <div className="doc-info-box">
                    <div className="doc-info-label">Uploaded</div>
                    <div className="doc-info-value">
                      {viewingDocument.document.createdAt ? new Date(viewingDocument.document.createdAt).toLocaleDateString('en-US', { 
                        month: 'short', day: 'numeric', year: 'numeric'
                      }) : 'N/A'}
                    </div>
                  </div>
                  <div className="doc-info-box">
                    <div className="doc-info-label">Reviewed</div>
                    <div className="doc-info-value">
                      {viewingDocument.document.reviewedAt ? new Date(viewingDocument.document.reviewedAt).toLocaleDateString('en-US', { 
                        month: 'short', day: 'numeric', year: 'numeric'
                      }) : 'Pending'}
                    </div>
                  </div>
                </div>
              </div>
              {viewingDocument.document.reviewNotes && (
                <div className="currency-selection">
                  <label className="currency-label">Review Notes</label>
                  <div className="doc-notes-box doc-notes-info">
                    {viewingDocument.document.reviewNotes}
                  </div>
                </div>
              )}
              {((viewingDocument.document.status === 2 || viewingDocument.document.status === '2') && viewingDocument.document.rejectionReason) && (
                <div className="currency-selection">
                  <label className="currency-label">Rejection Reason</label>
                  <div className="doc-notes-box doc-notes-error">
                    {viewingDocument.document.rejectionReason}
                  </div>
                </div>
              )}
              <div className="currency-selection">
                <label className="currency-label">Document Preview</label>
                <div className="doc-preview-box">
                  {viewingDocument.fileName.toLowerCase().match(/\.(jpg|jpeg|png|gif|bmp|webp)$/) ? (
                    <img 
                      src={viewingDocument.url}
                      alt={viewingDocument.fileName}
                      style={{ width: '100%', height: 'auto', maxHeight: '500px', objectFit: 'contain', display: 'block' }}
                      onError={(e) => {
                        console.error('Image failed to load:', viewingDocument.url);
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : viewingDocument.fileName.toLowerCase().endsWith('.pdf') ? (
                    <iframe 
                      src={viewingDocument.url}
                      width="100%" 
                      height="500px" 
                      style={{ border: 'none', display: 'block' }}
                      title="PDF Viewer"
                      onError={() => console.error('PDF failed to load:', viewingDocument.url)}
                    />
                  ) : (
                    <div className="doc-preview-fallback">
                      <div style={{ fontSize: '48px', marginBottom: '12px' }}>📄</div>
                      <p className="doc-preview-fallback-text">Preview not available for this file type</p>
                    </div>
                  )}
                </div>
                <div style={{ marginTop: '12px', textAlign: 'center' }}>
                  <a 
                    href={viewingDocument.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn btn-outline"
                    style={{ display: 'inline-block' }}
                  >
                    🔗 Open in New Tab
                  </a>
                </div>
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn btn-primary" onClick={() => {
                if (viewingDocument.url.startsWith('blob:')) {
                  window.URL.revokeObjectURL(viewingDocument.url);
                }
                setViewingDocument(null);
              }}>Close</button>
            </div>
          </div>
        </div>
      )}
      
      {showUpdateModal && (
        <div className="upload-modal">
          <div className="modal-backdrop" onClick={() => setShowUpdateModal(null)}></div>
          <div className="modal-content" style={{ maxWidth: '500px' }}>
            <div className="modal-header">
              <h3>Update Document</h3>
              <button className="close-btn" onClick={() => setShowUpdateModal(null)}>×</button>
            </div>
            <div className="modal-body">
              <p className="upload-description">Upload a new file to replace the existing {showUpdateModal.docName}</p>
              <div className="upload-card">
                <div className="upload-area">
                  <input
                    type="file"
                    id="update-file"
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file && showUpdateModal) {
                        setUploading(true);
                        try {
                          const oldDoc = documents.find(d => d.id === showUpdateModal.docId);
                          await kycService.deleteDocument(showUpdateModal.docId);
                          await kycService.uploadDocument({ file, documentTypeId: showUpdateModal.docTypeId });
                          if (oldDoc) addToHistory(showUpdateModal.docTypeId, 'update', file.name);
                          await loadDocuments();
                          setShowUpdateModal(null);
                        } catch (error) {
                          console.error('Update failed:', error);
                          alert('Update failed. Please try again.');
                        } finally {
                          setUploading(false);
                        }
                      }
                    }}
                    disabled={uploading}
                    className="file-input"
                  />
                  <label htmlFor="update-file" className="upload-label">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                    </svg>
                    {uploading ? 'Uploading...' : 'Choose New File'}
                  </label>
                  <p className="upload-hint">PDF, JPG, PNG, DOC, DOCX (Max 10MB)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showHistoryModal && (
        <div className="modal-overlay" onClick={() => setShowHistoryModal(null)}>
          <div className="create-wallet-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px', width: '90%', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
            <div className="modal-header">
              <h2 className="modal-title">Document History - {showHistoryModal.docName}</h2>
              <button className="modal-close" onClick={() => setShowHistoryModal(null)}>×</button>
            </div>
            <div className="modal-content" style={{ overflowY: 'auto', flex: 1 }}>
              {loadingHistory ? (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                  <div className="spinner"></div>
                  <p>Loading history...</p>
                </div>
              ) : documentHistory.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📜</div>
                  <h4>No History Available</h4>
                  <p>No upload, update, or deletion history found for this document</p>
                </div>
              ) : (
                <div style={{ position: 'relative', paddingLeft: '40px' }}>
                  <div style={{ position: 'absolute', left: '20px', top: '0', bottom: '0', width: '2px', background: 'var(--border-color, #e5e7eb)' }}></div>
                  {documentHistory.map((history, index) => (
                    <div key={history.id} style={{ position: 'relative', paddingBottom: index === documentHistory.length - 1 ? '0' : '24px' }}>
                      <div style={{ position: 'absolute', left: '-28px', top: '4px', width: '16px', height: '16px', borderRadius: '50%', background: history.action === 'upload' ? '#10b981' : history.action === 'update' ? '#f59e0b' : '#ef4444', border: '3px solid var(--modal-bg, white)' }}></div>
                      <div className="doc-info-box" style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <span className={`transaction-badge ${
                            history.action === 'upload' ? 'credit' : 'debit'
                          }`}>
                            {history.action === 'upload' ? '📤 Upload' : 
                             history.action === 'update' ? '🔄 Update' : 
                             '🗑️ Delete'}
                          </span>
                          <span className="date-secondary">
                            {new Date(history.performedAt).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric', 
                              year: 'numeric'
                            })} at {new Date(history.performedAt).toLocaleTimeString('en-US', { 
                              hour: '2-digit', 
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                        <div className="doc-info-value" style={{ marginBottom: '4px', wordBreak: 'break-word' }}>{history.fileName}</div>
                        <div className="doc-info-label">by {history.performedBy}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="modal-actions">
              <button className="btn btn-primary" onClick={() => setShowHistoryModal(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {deleteConfirm.show && (
        <div className="delete-modal">
          <div className="modal-backdrop" onClick={() => setDeleteConfirm({show: false, docId: '', docName: ''})}></div>
          <div className="delete-modal-content">
            <div className="delete-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
              </svg>
            </div>
            <h3>Delete Document</h3>
            <p>Are you sure you want to delete <strong>{deleteConfirm.docName}</strong>?</p>
            <p className="warning-text">This action cannot be undone.</p>
            <div className="delete-actions">
              <button 
                onClick={() => setDeleteConfirm({show: false, docId: '', docName: ''})}
                className="cancel-btn"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                className="confirm-delete-btn"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KycDocuments;