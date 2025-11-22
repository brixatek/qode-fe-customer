import React, { useState, useEffect } from 'react';
import { dashboardService, walletService, tokenManager, customerService } from '../services/api.ts';
import { WalletResponse, WalletTransactionResponse } from '../types/api.ts';
import KycDocuments from './KycDocuments.tsx';
import WalletModal from './WalletModal.tsx';
import './Dashboard.css';

// Add styles for table components with better color blending
const tableStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
  
  * {
    font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  }
  
  .light {
    --table-bg: #ffffff;
    --table-header-bg: #f8fafc;
    --table-border: #e2e8f0;
    --table-border-light: #f1f5f9;
    --table-text-primary: #1e293b;
    --table-text-secondary: #64748b;
    --table-text-muted: #94a3b8;
    --table-hover-bg: #f8fafc;
  }
  .dark {
    --table-bg: #0f172a;
    --table-header-bg: #1e293b;
    --table-border: #334155;
    --table-border-light: #475569;
    --table-text-primary: #f1f5f9;
    --table-text-secondary: #cbd5e1;
    --table-text-muted: #94a3b8;
    --table-hover-bg: #1e293b;
  }
  
  .table-header {
    padding: 20px 24px;
    border-bottom: 1px solid var(--table-border);
    background-color: var(--table-bg);
  }
  .table-title {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: var(--table-text-primary);
  }
  .table-subtitle {
    margin: 4px 0 0 0;
    font-size: 14px;
    color: var(--table-text-secondary);
  }
  .modern-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 14px;
    background-color: var(--table-bg);
  }
  .table-header-row {
    background-color: var(--table-header-bg);
    border-bottom: 1px solid var(--table-border);
  }
  .table-header-cell {
    padding: 12px 16px;
    text-align: left;
    font-weight: 600;
    color: var(--table-text-secondary);
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  .table-row {
    border: 1px solid var(--table-border);
    transition: background-color 0.15s ease;
  }
  .table-row:nth-child(even) {
    background-color: var(--table-header-bg);
  }
  .table-row:nth-child(odd) {
    background-color: var(--table-bg);
  }
  .table-row:hover {
    background-color: var(--table-hover-bg);
  }
  .table-cell {
    padding: 16px;
    color: var(--table-text-primary);
  }
  .text-right { text-align: right; }
  .text-center { text-align: center; }
  .font-medium { font-weight: 500; }
  .font-semibold { font-weight: 600; }
  .text-muted {
    color: var(--table-text-muted);
  }
  .monospace {
    font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
    font-size: 13px;
  }
  .amount.credit {
    color: #10b981;
  }
  .amount.debit {
    color: #ef4444;
  }
  .dark .amount.credit {
    color: #34d399;
  }
  .dark .amount.debit {
    color: #f87171;
  }
  .transaction-badge {
    padding: 4px 8px;
    border-radius: 6px;
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    border: 1px solid transparent;
  }
  .transaction-badge.credit {
    background-color: #dcfce7;
    color: #166534;
    border-color: #bbf7d0;
  }
  .transaction-badge.debit {
    background-color: #fef2f2;
    color: #991b1b;
    border-color: #fecaca;
  }
  .dark .transaction-badge.credit {
    background-color: #052e16;
    color: #86efac;
    border-color: #166534;
  }
  .dark .transaction-badge.debit {
    background-color: #450a0a;
    color: #fca5a5;
    border-color: #991b1b;
  }
  .date-primary {
    color: var(--table-text-primary);
    font-weight: 500;
  }
  .date-secondary {
    font-size: 12px;
    color: var(--table-text-muted);
    margin-top: 2px;
  }
  .empty-state-cell {
    text-align: center;
    padding: 60px 20px;
    background-color: var(--table-bg);
  }
  .empty-state-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
  }
  .empty-state-icon {
    font-size: 48px;
    opacity: 0.4;
    filter: grayscale(0.3);
  }
  .empty-state-title {
    color: var(--table-text-secondary);
    font-size: 16px;
    font-weight: 500;
  }
  .empty-state-subtitle {
    font-size: 14px;
    color: var(--table-text-muted);
  }
  .pagination-cell {
    padding: 16px 24px;
    border-top: 1px solid var(--table-border);
    background-color: var(--table-header-bg);
  }
  .pagination-container {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 24px;
  }
  .pagination-info {
    font-size: 14px;
    color: var(--table-text-secondary);
    font-weight: 500;
    min-width: 120px;
    text-align: center;
  }
  .table-container {
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
  .dark .table-container {
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  }
  
  /* Enhanced Sidebar Styles */
  .sidebar {
    background: linear-gradient(180deg, #1e293b 0%, #0f172a 100%);
    box-shadow: 2px 0 12px rgba(0, 0, 0, 0.1);
  }
  .light .sidebar {
    background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
    box-shadow: 2px 0 12px rgba(0, 0, 0, 0.05);
  }
  .sidebar-header {
    padding: 24px 20px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
  .light .sidebar-header {
    border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  }
  .logo {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 24px;
  }
  .logo-icon {
    width: 40px;
    height: 40px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    font-weight: 700;
    color: white;
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  }
  .logo h1 {
    font-size: 20px;
    font-weight: 600;
    margin: 0;
    color: white;
  }
  .light .logo h1 {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .user-profile {
    padding: 12px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  .user-profile:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
  }
  .light .user-profile {
    background: rgba(0, 0, 0, 0.03);
  }
  .light .user-profile:hover {
    background: rgba(0, 0, 0, 0.06);
  }
  .user-avatar {
    width: 40px;
    height: 40px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 14px;
    color: white;
  }
  .user-name {
    font-weight: 600;
    font-size: 14px;
    color: rgba(255, 255, 255, 0.9);
  }
  .user-email {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.7);
  }
  .light .user-name {
    color: rgba(0, 0, 0, 0.9);
  }
  .light .user-email {
    color: rgba(0, 0, 0, 0.6);
  }
  .sidebar-nav {
    padding: 20px 12px;
  }
  .nav-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    margin-bottom: 4px;
    border-radius: 10px;
    border: none;
    background: transparent;
    color: rgba(255, 255, 255, 0.7);
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    width: 100%;
    text-align: left;
  }
  .nav-item:hover {
    background: rgba(255, 255, 255, 0.08);
    color: white;
    transform: translateX(4px);
  }
  .nav-item.active {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  }
  .light .nav-item {
    color: rgba(0, 0, 0, 0.6);
  }
  .light .nav-item:hover {
    background: rgba(0, 0, 0, 0.05);
    color: rgba(0, 0, 0, 0.9);
  }
  .light .nav-item.active {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
  }
  .nav-icon {
    font-size: 18px;
    width: 24px;
    text-align: center;
  }
  .sidebar-footer {
    padding: 20px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }
  .light .sidebar-footer {
    border-top: 1px solid rgba(0, 0, 0, 0.08);
  }
  .theme-toggle-sidebar {
    width: 100%;
    padding: 12px 16px;
    margin-bottom: 12px;
    border-radius: 10px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(255, 255, 255, 0.05);
    color: rgba(255, 255, 255, 0.9);
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .theme-toggle-sidebar:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
  }
  .light .theme-toggle-sidebar {
    border: 1px solid rgba(0, 0, 0, 0.1);
    background: rgba(0, 0, 0, 0.03);
    color: rgba(0, 0, 0, 0.8);
  }
  .light .theme-toggle-sidebar:hover {
    background: rgba(0, 0, 0, 0.06);
  }
  .btn-logout {
    width: 100%;
    padding: 12px 16px;
    border-radius: 10px;
    border: none;
    background: rgba(239, 68, 68, 0.1);
    color: #ef4444;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    gap: 8px;
    justify-content: center;
  }
  .btn-logout:hover {
    background: rgba(239, 68, 68, 0.2);
    transform: translateY(-2px);
  }
  
  /* Enhanced Profile Styles */
  .profile-container {
    max-width: 1200px;
    margin: 0 auto;
  }
  .profile-header {
    margin-bottom: 32px;
  }
  .profile-banner {
    height: 180px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 16px;
    position: relative;
    margin-bottom: 60px;
  }
  .profile-avatar-large {
    width: 120px;
    height: 120px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 48px;
    font-weight: 700;
    color: white;
    position: absolute;
    bottom: -60px;
    left: 32px;
    border: 6px solid var(--table-bg);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  }
  .profile-info-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 32px;
  }
  .profile-name {
    font-size: 32px;
    font-weight: 700;
    margin: 0;
    color: var(--table-text-primary);
  }
  .profile-email {
    font-size: 16px;
    color: var(--table-text-secondary);
    margin: 4px 0 0 0;
  }
  .status-badge-large {
    padding: 10px 20px;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 600;
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }
  .status-badge-large.verified {
    background: #dcfce7;
    color: #166534;
  }
  .status-badge-large.pending {
    background: #fef3c7;
    color: #92400e;
  }
  .dark .status-badge-large.verified {
    background: #052e16;
    color: #86efac;
  }
  .dark .status-badge-large.pending {
    background: #451a03;
    color: #fcd34d;
  }
  .profile-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: 24px;
    margin-bottom: 24px;
  }
  .profile-card {
    background: var(--table-bg);
    border: 1px solid var(--table-border);
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
  .dark .profile-card {
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  }
  .profile-card-header {
    padding: 24px;
    border-bottom: 1px solid var(--table-border);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .profile-card-header h3 {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: var(--table-text-primary);
  }
  .profile-card-content {
    padding: 24px;
  }
  .info-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 0;
    border-bottom: 1px solid var(--table-border-light);
  }
  .info-item:last-child {
    border-bottom: none;
  }
  .info-label {
    font-size: 14px;
    font-weight: 500;
    color: var(--table-text-secondary);
  }
  .info-value {
    font-size: 14px;
    font-weight: 600;
    color: var(--table-text-primary);
  }
  .security-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 0;
    border-bottom: 1px solid var(--table-border-light);
  }
  .security-item:last-child {
    border-bottom: none;
  }
  .security-info h4 {
    margin: 0 0 4px 0;
    font-size: 16px;
    font-weight: 600;
    color: var(--table-text-primary);
  }
  .security-info p {
    margin: 0;
    font-size: 14px;
    color: var(--table-text-secondary);
  }
`;

// Inject styles only once
if (typeof document !== 'undefined' && !document.getElementById('table-styles')) {
  const styleElement = document.createElement('style');
  styleElement.id = 'table-styles';
  styleElement.textContent = tableStyles;
  document.head.appendChild(styleElement);
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  mobileNo: string;
  isEmailVerified: boolean;
  isActive: boolean;
  country: { id: string; name: string };
  role: { id: string; name: string };
  companyWebsite: string;
  companySize: number;
  businessDescription: string;
  businessAddress: string;
  businessPhone: string;
  primaryContactName: string;
  primaryContactEmail: string;
  primaryContactRole: string;
  sector: { id: string; name: string };
  referral: { id: string; name: string };
  countryPhoneCode: { id: string; name: string };
  recieveNewsletter: boolean;
  acceptPrivacyPolicy: boolean;
  acceptTermsOfService: boolean;
  interest: string;
  sendingFrequency: string;
  sendingVolume: string;
  sendingType: string;
  twoFactorEnabled: boolean;
  emailVerifiedAt: string | null;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  otherRoleSpecification: string | null;
  otherSectorSpecification: string | null;
  otherReferralSpecification: string | null;
}

interface ApiKey {
  id: string;
  keyName: string;
  keyType: number;
  status: number;
}

interface SenderRequest {
  id: string;
  senderId: string;
  status: number;
  createdAt: string;
  updatedAt?: string;
}

interface Campaign {
  id: string;
  name: string;
  status: 'pending' | 'active' | 'completed';
  delivered: number;
  failed: number;
  createdAt: string;
  description?: string;
  progress?: number;
  target?: number;
  type?: 'automated' | 'promotional' | 'seasonal';
}

const Dashboard: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [wallet, setWallet] = useState<WalletResponse | null>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [transactions, setTransactions] = useState<WalletTransactionResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('overview');
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });
  const [showCreateWallet, setShowCreateWallet] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState('NGN');
  const [creatingWallet, setCreatingWallet] = useState(false);
  const [walletExists, setWalletExists] = useState<boolean | null>(null);
  const [showFundWallet, setShowFundWallet] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [apiKeysPage, setApiKeysPage] = useState(1);
  const [sendersPage, setSendersPage] = useState(1);
  const itemsPerPage = 10;
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editedUser, setEditedUser] = useState<User | null>(null);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileLocked, setProfileLocked] = useState(false);
  const [kycDocuments, setKycDocuments] = useState<any[]>([]);
  const [showCreateKeyModal, setShowCreateKeyModal] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyType, setNewKeyType] = useState(1);
  const [creatingKey, setCreatingKey] = useState(false);
  const [viewingKey, setViewingKey] = useState<{id: string, name: string, key: string} | null>(null);
  const [confirmAction, setConfirmAction] = useState<{show: boolean, type: 'delete' | 'block' | 'unblock' | 'rotate', keyId: string, keyName: string}>({show: false, type: 'delete', keyId: '', keyName: ''});
  const [senderRequests, setSenderRequests] = useState<SenderRequest[]>([]);
  const [showCreateSenderModal, setShowCreateSenderModal] = useState(false);
  const [newSenderId, setNewSenderId] = useState('');
  const [creatingSender, setCreatingSender] = useState(false);
  const [confirmDeleteSender, setConfirmDeleteSender] = useState<{show: boolean, id: string, senderId: string}>({show: false, id: '', senderId: ''});
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [unlockPassword, setUnlockPassword] = useState('');
  const [unlocking, setUnlocking] = useState(false);
  const [showWrongPasswordModal, setShowWrongPasswordModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [validatingPayment, setValidatingPayment] = useState(false);
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
  const [showDocumentConfirm, setShowDocumentConfirm] = useState(false);
  const [showDocumentUpload, setShowDocumentUpload] = useState(false);
  const [uploadingDocument, setUploadingDocument] = useState(false);
  const [documentTypes, setDocumentTypes] = useState<any[]>([]);
  const [viewingDocument, setViewingDocument] = useState<{url: string, name: string} | null>(null);
  const [deleteDocumentConfirm, setDeleteDocumentConfirm] = useState<{show: boolean, docId: string, docName: string}>({show: false, docId: '', docName: ''});
  const REQUIRED_DOCUMENTS = 3; // Set the required number of documents
  const [showWelcomeGuide, setShowWelcomeGuide] = useState(false);

  useEffect(() => {
    if (!tokenManager.isAuthenticated()) {
      window.location.href = '/?login=true';
      return;
    }
    loadDashboardData();
    checkProfileLockStatus();
  }, []);

  useEffect(() => {
    // Load KYC documents and check if welcome guide should show
    if (user?.id && !loading) {
      loadKycDocuments().then(() => {
        // Show welcome guide if profile is incomplete or no documents
        if (!profileLocked) {
          const isProfileIncomplete = !user.interest || !user.sendingFrequency || !user.sendingVolume || !user.sendingType;
          if (isProfileIncomplete) {
            setTimeout(() => setShowWelcomeGuide(true), 1000);
          }
        }
      });
    }
  }, [user?.id, loading, profileLocked]);



  const checkProfileLockStatus = () => {
    const locked = localStorage.getItem('profileLocked');
    if (locked === 'true') {
      setProfileLocked(true);
    }
  };



  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  useEffect(() => {
    if (walletExists === true) {
      loadTransactions();
    }
  }, [currentPage]);

  useEffect(() => {
    if (activeSection === 'sender-ids' && user?.id) {
      loadSenderRequests();
    }
    if (activeSection === 'profile' && user?.id) {
      loadKycDocuments();
    }
  }, [activeSection, user?.id]);

  const loadTransactions = async () => {
    try {
      const transactionsRes = await walletService.getTransactionHistory(currentPage, 10);
      const responseData = transactionsRes.data?.data;
      setTransactions(Array.isArray(responseData?.data) ? responseData.data : []);
      setTotalPages(responseData?.totalPages || 1);
    } catch (error) {
      console.error('Failed to load transactions:', error);
    }
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleCreateWallet = async () => {
    setCreatingWallet(true);
    try {
      await walletService.createWallet(selectedCurrency);
      await walletService.activateWallet();
      setShowCreateWallet(false);
      setWalletExists(true);
      loadDashboardData();
    } catch (error) {
      console.error('Failed to create wallet:', error);
    } finally {
      setCreatingWallet(false);
    }
  };

  const handleCampaignAction = async (campaignId: string, action: 'play' | 'pause' | 'delete') => {
    try {
      if (action === 'pause') {
        await dashboardService.pauseCampaign(campaignId);
      } else if (action === 'play') {
        await dashboardService.resumeCampaign(campaignId);
      } else if (action === 'delete') {
        await dashboardService.deleteCampaign(campaignId);
      }
      loadDashboardData();
    } catch (error) {
      console.error(`Failed to ${action} campaign:`, error);
    }
  };

  const loadDashboardData = async () => {
    try {
      const [userRes, apiKeysRes] = await Promise.all([
        dashboardService.getCurrentUser(),
        dashboardService.getApiKeys(),
      ]);

      setUser(userRes.data.data);
      const keys = apiKeysRes.data?.data?.data || apiKeysRes.data?.data || [];
      setApiKeys(Array.isArray(keys) ? keys : []);
      
      setCampaigns([
        { 
          id: '1', 
          name: 'Welcome Campaign', 
          status: 'active', 
          delivered: 1250, 
          failed: 12, 
          createdAt: '2024-01-15',
          description: 'Onboarding messages for new customers',
          progress: 85,
          target: 1500,
          type: 'automated'
        },
        { 
          id: '2', 
          name: 'Product Launch', 
          status: 'completed', 
          delivered: 3400, 
          failed: 45, 
          createdAt: '2024-01-10',
          description: 'Announcing our latest product features',
          progress: 100,
          target: 3500,
          type: 'promotional'
        },
        { 
          id: '3', 
          name: 'Holiday Promo', 
          status: 'pending', 
          delivered: 0, 
          failed: 0, 
          createdAt: '2024-01-20',
          description: 'Special holiday offers and discounts',
          progress: 0,
          target: 2000,
          type: 'seasonal'
        },
      ]);

      try {
        const walletRes = await walletService.getWallet();
        setWallet(walletRes.data.data);
        setWalletExists(true);
        
        try {
          const transactionsRes = await walletService.getTransactionHistory(currentPage, 10);
          const responseData = transactionsRes.data?.data;
          setTransactions(Array.isArray(responseData?.data) ? responseData.data : []);
          setTotalPages(responseData?.totalPages || 2);
        } catch (transactionError) {
          console.error('Failed to load transactions:', transactionError);
        }
      } catch (error: any) {
        if (error.response?.status === 404) {
          setWalletExists(false);
          setWallet(null);
        }
        console.error('Failed to load wallet data:', error);
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await dashboardService.logout();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      localStorage.clear();
      window.location.href = '/?login=true';
    }
  };

  const handleValidatePayment = async () => {
    setValidatingPayment(true);
    try {
      await walletService.validatePayment();
      setShowFundWallet(false);
      setShowPaymentSuccess(true);
      
      const walletRes = await walletService.getWallet();
      setWallet(walletRes.data.data);
      
      const transactionsRes = await walletService.getTransactionHistory(currentPage, 10);
      const responseData = transactionsRes.data?.data;
      setTransactions(Array.isArray(responseData?.data) ? responseData.data : []);
      setTotalPages(responseData?.totalPages || 1);
      
      setTimeout(() => setShowPaymentSuccess(false), 3000);
    } catch (error) {
      console.error('Payment validation failed:', error);
      alert('Payment validation failed. Please try again or contact support.');
    } finally {
      setValidatingPayment(false);
    }
  };

  const handleCreateApiKey = async () => {
    if (!newKeyName.trim()) return;
    setCreatingKey(true);
    try {
      await dashboardService.createApiKey({ keyName: newKeyName, keyType: newKeyType });
      setShowCreateKeyModal(false);
      setNewKeyName('');
      setNewKeyType(0);
      loadDashboardData();
    } catch (error) {
      console.error('Failed to create API key:', error);
      alert('Failed to create API key');
    } finally {
      setCreatingKey(false);
    }
  };

  const handleBlockApiKey = async () => {
    try {
      await dashboardService.blockApiKey(confirmAction.keyId);
      setConfirmAction({show: false, type: 'delete', keyId: '', keyName: ''});
      loadDashboardData();
    } catch (error) {
      console.error('Failed to block API key:', error);
    }
  };

  const handleUnblockApiKey = async () => {
    try {
      await dashboardService.unblockApiKey(confirmAction.keyId);
      setConfirmAction({show: false, type: 'delete', keyId: '', keyName: ''});
      loadDashboardData();
    } catch (error) {
      console.error('Failed to unblock API key:', error);
    }
  };

  const handleDeleteApiKey = async () => {
    try {
      await dashboardService.deleteApiKey(confirmAction.keyId);
      setConfirmAction({show: false, type: 'delete', keyId: '', keyName: ''});
      loadDashboardData();
    } catch (error) {
      console.error('Failed to delete API key:', error);
    }
  };

  const handleRotateApiKey = async () => {
    try {
      await dashboardService.rotateApiKey(confirmAction.keyId);
      setConfirmAction({show: false, type: 'delete', keyId: '', keyName: ''});
      loadDashboardData();
    } catch (error) {
      console.error('Failed to rotate API key:', error);
    }
  };

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'wallet', label: 'Wallet', icon: '💰' },
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'kyc', label: 'Documents', icon: '📄' },
    { id: 'api-keys', label: 'Integration', icon: '🔑' },
    { id: 'sender-ids', label: 'Senders', icon: '📱' },
    { id: 'messages', label: 'Messages', icon: '💬' },
    { id: 'analytics', label: 'Analytics', icon: '📈' },
    { id: 'billing', label: 'Billing', icon: '💳' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  const renderOverview = () => (
    <div className="overview-container">
      <div className="overview-header">
        <div className="welcome-section">
          <h1 className="welcome-title">Welcome back, {user?.firstName}!</h1>
          <p className="welcome-subtitle">Here's your SMS platform overview and recent activity</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-outline">📊 View Reports</button>
          <button className="btn btn-primary" onClick={() => setActiveSection('messages')}>📤 Send SMS</button>
        </div>
      </div>

      <div className="metrics-grid">
        <div className="metric-card primary">
          <div className="metric-icon">📢</div>
          <div className="metric-content">
            <div className="metric-value">{campaigns.length}</div>
            <div className="metric-label">Total Campaigns</div>
            <div className="metric-trend positive">↗ +12% this month</div>
          </div>
        </div>

        <div className="metric-card success">
          <div className="metric-icon">📤</div>
          <div className="metric-content">
            <div className="metric-value">{campaigns.reduce((sum, c) => sum + c.delivered, 0).toLocaleString()}</div>
            <div className="metric-label">Messages Delivered</div>
            <div className="metric-trend positive">↗ +8% this month</div>
          </div>
        </div>

        <div className="metric-card warning">
          <div className="metric-icon">🔑</div>
          <div className="metric-content">
            <div className="metric-value">{apiKeys.length}</div>
            <div className="metric-label">API Keys</div>
            <div className="metric-trend neutral">{apiKeys.filter(k => k.isActive).length} active</div>
          </div>
        </div>

        <div className="metric-card info">
          <div className="metric-icon">💰</div>
          <div className="metric-content">
            <div className="metric-value">
              {wallet ? `${wallet.currency} ${wallet.balance.toLocaleString()}` : 'NGN 0'}
            </div>
            <div className="metric-label">Wallet Balance</div>
            <div className={`metric-trend ${wallet?.status === 1 ? 'positive' : 'negative'}`}>
              {wallet?.status === 1 ? '✓ Active' : '⚠ Inactive'}
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card campaigns-card">
          <div className="card-header-modern">
            <div className="card-title-section">
              <h3 className="card-title-modern">Recent Campaigns</h3>
              <p className="card-subtitle">Your latest SMS campaigns and their performance</p>
            </div>
            <button className="btn btn-text">View All →</button>
          </div>
          <div className="card-content-modern">
            {campaigns.length === 0 ? (
              <div className="empty-state-modern">
                <div className="empty-illustration">📢</div>
                <h4>No campaigns yet</h4>
                <p>Create your first SMS campaign to start reaching your audience</p>
                <button className="btn btn-primary btn-sm">Create Campaign</button>
              </div>
            ) : (
              <div className="campaigns-list-enhanced">
                {campaigns.slice(0, 3).map(campaign => (
                  <div key={campaign.id} className="campaign-card-enhanced">
                    <div className="campaign-header">
                      <div className="campaign-title-section">
                        <div className="campaign-name-enhanced">{campaign.name}</div>
                        <div className="campaign-description">{campaign.description}</div>
                      </div>
                      <div className="campaign-header-actions">
                        <div className="campaign-type-badge">
                          {campaign.type === 'automated' && '🤖'}
                          {campaign.type === 'promotional' && '🎉'}
                          {campaign.type === 'seasonal' && '🎄'}
                        </div>
                        <div className="campaign-actions">
                          {campaign.status === 'active' ? (
                            <button 
                              className="action-btn pause-btn" 
                              onClick={() => handleCampaignAction(campaign.id, 'pause')}
                              title="Pause Campaign"
                            >
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                              </svg>
                            </button>
                          ) : (
                            <button 
                              className="action-btn play-btn" 
                              onClick={() => handleCampaignAction(campaign.id, 'play')}
                              title="Resume Campaign"
                            >
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M8 5v14l11-7z"/>
                              </svg>
                            </button>
                          )}
                          <button 
                            className="action-btn delete-btn" 
                            onClick={() => handleCampaignAction(campaign.id, 'delete')}
                            title="Delete Campaign"
                          >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M3 6v18h18V6H3zm5 14c0 .553-.448 1-1 1s-1-.447-1-1V10c0-.553.448-1 1-1s1 .447 1 1v10zm6 0c0 .553-.448 1-1 1s-1-.447-1-1V10c0-.553.448-1 1-1s1 .447 1 1v10zm6 0c0 .553-.448 1-1 1s-1-.447-1-1V10c0-.553.448-1 1-1s1 .447 1 1v10zM19 3h-2.5l-.71-.71C15.44 1.94 15.02 1.81 14.59 1.81H9.41c-.43 0-.85.13-1.2.48L7.5 3H5c-.553 0-1 .447-1 1s.447 1 1 1h14c.553 0 1-.447 1-1s-.447-1-1-1z"/>
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="campaign-metrics">
                      <div className="metric-row">
                        <div className="metric-item">
                          <span className="metric-label">Delivered</span>
                          <span className="metric-value">{campaign.delivered.toLocaleString()}</span>
                        </div>
                        <div className="metric-item">
                          <span className="metric-label">Failed</span>
                          <span className="metric-value error">{campaign.failed}</span>
                        </div>
                        <div className="metric-item">
                          <span className="metric-label">Target</span>
                          <span className="metric-value">{campaign.target?.toLocaleString() || 'N/A'}</span>
                        </div>
                      </div>
                    </div>

                    {campaign.progress !== undefined && (
                      <div className="campaign-progress">
                        <div className="progress-header">
                          <span className="progress-label">Progress</span>
                          <span className="progress-percentage">{campaign.progress}%</span>
                        </div>
                        <div className="progress-bar">
                          <div 
                            className={`progress-fill ${campaign.status}`} 
                            style={{ width: `${campaign.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    <div className="campaign-footer">
                      <div className="campaign-date">
                        {new Date(campaign.createdAt).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </div>
                      <span className={`status-badge-enhanced ${campaign.status}`}>
                        <span className="status-indicator"></span>
                        {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="dashboard-card activity-card">
          <div className="card-header-modern">
            <div className="card-title-section">
              <h3 className="card-title-modern">Quick Actions</h3>
              <p className="card-subtitle">Common tasks and shortcuts</p>
            </div>
          </div>
          <div className="card-content-modern">
            <div className="quick-actions">
              <button className="quick-action-btn" onClick={() => setActiveSection('messages')}>
                <div className="action-icon">💬</div>
                <div className="action-content">
                  <div className="action-title">Send Message</div>
                  <div className="action-desc">Send SMS to contacts</div>
                </div>
              </button>
              <button className="quick-action-btn" onClick={() => setActiveSection('wallet')}>
                <div className="action-icon">💰</div>
                <div className="action-content">
                  <div className="action-title">Top Up Wallet</div>
                  <div className="action-desc">Add credits to wallet</div>
                </div>
              </button>
              <button className="quick-action-btn" onClick={() => setActiveSection('api-keys')}>
                <div className="action-icon">🔑</div>
                <div className="action-content">
                  <div className="action-title">API Keys</div>
                  <div className="action-desc">Manage integrations</div>
                </div>
              </button>
              <button className="quick-action-btn" onClick={() => setActiveSection('analytics')}>
                <div className="action-icon">📈</div>
                <div className="action-content">
                  <div className="action-title">View Analytics</div>
                  <div className="action-desc">Campaign insights</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderWallet = () => (
    <div className="wallet-container">
      <div className="wallet-header">
        <div className="wallet-title-section">
          <h1 className="wallet-title">Wallet Management</h1>
          <p className="wallet-subtitle">Monitor your SMS credits, balance, and transaction history</p>
        </div>
        <div className="wallet-actions">
          {wallet && (
            <button className="btn btn-primary" onClick={() => setShowFundWallet(true)}>💳 Add Funds</button>
          )}
        </div>
      </div>

      {walletExists === false ? (
        <div className="wallet-onboarding">
          <div className="onboarding-hero">
            <div className="hero-visual">
              <div className="wallet-illustration">
                <div className="wallet-card">
                  <div className="card-chip"></div>
                  <div className="card-number">**** **** **** ****</div>
                  <div className="card-holder">SMS WALLET</div>
                </div>
                <div className="floating-coins">
                  <div className="coin coin-1">💰</div>
                  <div className="coin coin-2">💰</div>
                  <div className="coin coin-3">💰</div>
                </div>
              </div>
            </div>
            <div className="hero-content">
              <h2 className="hero-title">Wallet Not Created</h2>
              <p className="hero-description">
                You haven't created a wallet yet. Create your secure wallet to manage SMS credits, track spending, and send messages to your customers worldwide.
              </p>
              <div className="hero-features">
                <div className="feature-grid">
                  <div className="feature-card">
                    <div className="feature-icon">🔒</div>
                    <div className="feature-text">
                      <h4>Secure & Safe</h4>
                      <p>Bank-level security for your credits</p>
                    </div>
                  </div>
                  <div className="feature-card">
                    <div className="feature-icon">📈</div>
                    <div className="feature-text">
                      <h4>Real-time Tracking</h4>
                      <p>Monitor usage and spending instantly</p>
                    </div>
                  </div>
                  <div className="feature-card">
                    <div className="feature-icon">🌍</div>
                    <div className="feature-text">
                      <h4>Global Reach</h4>
                      <p>Send SMS to 200+ countries</p>
                    </div>
                  </div>
                  <div className="feature-card">
                    <div className="feature-icon">⚡</div>
                    <div className="feature-text">
                      <h4>Instant Delivery</h4>
                      <p>Lightning-fast message delivery</p>
                    </div>
                  </div>
                </div>
              </div>
              <button className="btn btn-primary btn-hero" onClick={() => setShowCreateWallet(true)}>
                Create New Wallet →
              </button>
            </div>
          </div>
        </div>
      ) : walletExists === true && wallet ? (
        <>
          <div className="wallet-stats-grid">
            <div className="wallet-stat-card primary">
              <div className="stat-icon-modern">💰</div>
              <div className="stat-content-modern">
                <div className="stat-value-modern">{wallet.currency} {wallet.balance.toLocaleString()}</div>
                <div className="stat-label-modern">Available Balance</div>
                <div className={`stat-status ${wallet.status === 1 ? 'active' : 'inactive'}`}>
                  {wallet.status === 1 ? '🟢 Active' : '🔴 Inactive'}
                </div>
              </div>
            </div>

            <div className="wallet-stat-card success">
              <div className="stat-icon-modern">📈</div>
              <div className="stat-content-modern">
                <div className="stat-value-modern">{wallet.currency} 0</div>
                <div className="stat-label-modern">Total Spent</div>
                <div className="stat-period">This month</div>
              </div>
            </div>

            <div className="wallet-stat-card info">
              <div className="stat-icon-modern">📊</div>
              <div className="stat-content-modern">
                <div className="stat-value-modern">{transactions.length}</div>
                <div className="stat-label-modern">Total Transactions</div>
                <div className="stat-period">All time</div>
              </div>
            </div>

            <div className="wallet-stat-card warning">
              <div className="stat-icon-modern">⚡</div>
              <div className="stat-content-modern">
                <div className="stat-value-modern">{Math.floor(wallet.balance / 0.05)}</div>
                <div className="stat-label-modern">SMS Credits</div>
                <div className="stat-period">Approx. messages</div>
              </div>
            </div>
          </div>

          <div className="card" style={{ marginTop: '24px' }}>
            <div className="table-header">
              <h3 className="table-title">Transaction History</h3>
              <p className="table-subtitle">Recent wallet transactions and balance changes</p>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
                <colgroup>
                  <col style={{ width: '20%' }} />
                  <col style={{ width: '18%' }} />
                  <col style={{ width: '15%' }} />
                  <col style={{ width: '12%' }} />
                  <col style={{ width: '18%' }} />
                  <col style={{ width: '17%' }} />
                </colgroup>
                <thead>
                  <tr className="table-header-row">
                    <th className="table-header-cell">Description</th>
                    <th className="table-header-cell">Reference</th>
                    <th className="table-header-cell text-right">Amount</th>
                    <th className="table-header-cell text-center">Type</th>
                    <th className="table-header-cell text-right">Balance After</th>
                    <th className="table-header-cell">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="empty-state-cell">
                        <div className="empty-state-content">
                          <div className="empty-state-icon">📊</div>
                          <div className="empty-state-title">No transactions found</div>
                          <div className="empty-state-subtitle">Your transaction history will appear here</div>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    transactions.map((transaction, index) => (
                      <tr key={transaction.id} className={`table-row ${index === transactions.length - 1 ? 'last-row' : ''}`}>
                        <td className="table-cell font-medium">{transaction.description}</td>
                        <td className="table-cell text-muted monospace" style={{ fontSize: '12px' }}>{transaction.reference || '—'}</td>
                        <td className="table-cell text-right font-semibold">
                          <span className={`amount ${transaction.type === 0 ? 'credit' : 'debit'}`}>
                            {transaction.type === 0 ? '+' : '-'}{wallet?.currency} {transaction.amount.toLocaleString()}
                          </span>
                        </td>
                        <td className="table-cell text-center">
                          <span className={`transaction-badge ${transaction.type === 0 ? 'credit' : 'debit'}`}>
                            {transaction.type === 0 ? 'Credit' : 'Debit'}
                          </span>
                        </td>
                        <td className="table-cell text-right font-medium">
                          {wallet?.currency} {transaction.balanceAfter.toLocaleString()}
                        </td>
                        <td className="table-cell">
                          <div className="date-primary">
                            {new Date(transaction.createdAt).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric', 
                              year: 'numeric'
                            })}
                          </div>
                          <div className="date-secondary">
                            {new Date(transaction.createdAt).toLocaleTimeString('en-US', { 
                              hour: '2-digit', 
                              minute: '2-digit'
                            })}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
                {totalPages >= 1 && transactions.length > 0 && (
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
          </div>
        </>
      ) : null}
      
      <WalletModal
        show={showCreateWallet}
        onClose={() => setShowCreateWallet(false)}
        selectedCurrency={selectedCurrency}
        setSelectedCurrency={setSelectedCurrency}
        onCreateWallet={handleCreateWallet}
        creating={creatingWallet}
      />
      
      {showFundWallet && wallet && (
        <div className="wallet-modal-overlay" onClick={() => setShowFundWallet(false)}>
          <div className="wallet-modal" onClick={(e) => e.stopPropagation()}>
            <div className="wallet-modal-header">
              <h2>Fund Wallet</h2>
              <button className="close-btn" onClick={() => setShowFundWallet(false)}>×</button>
            </div>
            
            <div className="wallet-form">
              <div className="form-group">
                <label>Transfer to this account to fund your wallet:</label>
                <div className="account-details">
                  <div className="detail-item">
                    <span className="detail-label">Account Number:</span>
                    <span className="detail-value">{wallet.virtualAccountNumber}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Bank Name:</span>
                    <span className="detail-value">{wallet.bankName}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Account Name:</span>
                    <span className="detail-value">{wallet.accountName}</span>
                  </div>
                </div>
                <div style={{ marginTop: '20px', padding: '16px', background: '#fef3c7', borderRadius: '8px', border: '1px solid #fde68a' }}>
                  <p style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#92400e', fontWeight: '500' }}>
                    ⚠️ After making the transfer, click the button below to validate your payment.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="wallet-modal-footer">
              <button 
                className="btn btn-primary" 
                onClick={handleValidatePayment}
                disabled={validatingPayment}
                style={{ width: '100%' }}
              >
                {validatingPayment ? '⏳ Validating...' : '✓ I Have Made Payment'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showPaymentSuccess && (
        <div className="modal-overlay" onClick={() => setShowPaymentSuccess(false)}>
          <div className="delete-modal-content" onClick={(e) => e.stopPropagation()} style={{ position: 'relative', background: 'white', borderRadius: '20px', padding: '2rem', textAlign: 'center', maxWidth: '400px', width: '90%' }}>
            <div style={{ width: '80px', height: '80px', background: '#dcfce7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: '#166534', border: '4px solid #bbf7d0' }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/>
              </svg>
            </div>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.5rem', fontWeight: '700', color: '#1f2937' }}>
              Payment Validation Submitted
            </h3>
            <p style={{ margin: '0 0 2rem 0', color: '#6b7280', fontSize: '1rem' }}>
              Your payment is being validated. Your wallet will be credited once confirmed.
            </p>
            <button 
              onClick={() => setShowPaymentSuccess(false)}
              className="btn btn-primary"
              style={{ background: '#10b981' }}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const renderApiKeys = () => (
    <div className="integration-container">
      <div className="integration-header">
        <div className="integration-title-section">
          <h1 className="integration-title">Integration</h1>
          <p className="integration-subtitle">Manage your API keys and platform integrations</p>
        </div>
        <div className="integration-actions">
          <button className="btn btn-primary" onClick={() => setShowCreateKeyModal(true)}>
            🔐 Create API Key
          </button>
        </div>
      </div>

      <div className="integration-stats-grid">
        <div className="integration-stat-card primary">
          <div className="stat-icon-modern">🔑</div>
          <div className="stat-content-modern">
            <div className="stat-value-modern">{apiKeys.length}</div>
            <div className="stat-label-modern">Total API Keys</div>
          </div>
        </div>
        <div className="integration-stat-card success">
          <div className="stat-icon-modern">✅</div>
          <div className="stat-content-modern">
            <div className="stat-value-modern">{apiKeys.filter(k => k.status === 1).length}</div>
            <div className="stat-label-modern">Active Keys</div>
          </div>
        </div>
        <div className="integration-stat-card warning">
          <div className="stat-icon-modern">🔧</div>
          <div className="stat-content-modern">
            <div className="stat-value-modern">{apiKeys.filter(k => k.keyType === 1 || k.keyType === '1').length}</div>
            <div className="stat-label-modern">Development Keys</div>
          </div>
        </div>
        <div className="integration-stat-card info">
          <div className="stat-icon-modern">🚀</div>
          <div className="stat-content-modern">
            <div className="stat-value-modern">{apiKeys.filter(k => k.keyType === 2 || k.keyType === '2').length}</div>
            <div className="stat-label-modern">Production</div>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: '24px' }}>
        <div className="table-header">
          <h3 className="table-title">API Keys</h3>
          <p className="table-subtitle">View and manage your API keys</p>
        </div>
        {apiKeys.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🔑</div>
            <h4>No API Keys</h4>
            <p>Create your first API key to integrate with our platform</p>
          </div>
        ) : (
          <div className="table-container">
            <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
              <colgroup>
                <col style={{ width: '25%' }} />
                <col style={{ width: '20%' }} />
                <col style={{ width: '20%' }} />
                <col style={{ width: '15%' }} />
                <col style={{ width: '20%' }} />
              </colgroup>
              <thead>
                <tr className="table-header-row">
                  <th className="table-header-cell">Key Name</th>
                  <th className="table-header-cell">Type</th>
                  <th className="table-header-cell text-center">Status</th>
                  <th className="table-header-cell">Created</th>
                  <th className="table-header-cell text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {apiKeys.slice((apiKeysPage - 1) * itemsPerPage, apiKeysPage * itemsPerPage).map((key, index) => (
                  <tr key={key.id} className={`table-row ${index === apiKeys.length - 1 ? 'last-row' : ''}`}>
                    <td className="table-cell font-medium">{key.keyName}</td>
                    <td className="table-cell">
                      <span className={`transaction-badge ${key.keyType === 2 ? 'credit' : 'debit'}`}>
                        {key.keyType === 2 ? 'Production' : 'Development'}
                      </span>
                    </td>
                    <td className="table-cell text-center">
                      <span className={`transaction-badge ${key.status === 1 ? 'credit' : 'debit'}`}>
                        {key.status === 1 ? 'Active' : key.status === 2 ? 'Blocked' : 'Revoked'}
                      </span>
                    </td>
                    <td className="table-cell">
                      {key.createdAt ? (
                        <>
                          <div className="date-primary">
                            {new Date(key.createdAt).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric', 
                              year: 'numeric'
                            })}
                          </div>
                          <div className="date-secondary">
                            {new Date(key.createdAt).toLocaleTimeString('en-US', { 
                              hour: '2-digit', 
                              minute: '2-digit'
                            })}
                          </div>
                        </>
                      ) : 'N/A'}
                    </td>
                    <td className="table-cell text-center">
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                        <button 
                          onClick={() => setViewingKey({id: key.id, name: key.keyName, key: key.apiKey || key.id})}
                          title="View Key"
                          style={{ width: '32px', height: '32px', borderRadius: '8px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#dbeafe', color: '#1d4ed8' }}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                          </svg>
                        </button>
                        <button 
                          onClick={() => setConfirmAction({show: true, type: 'rotate', keyId: key.id, keyName: key.keyName})}
                          title="Rotate Key"
                          style={{ width: '32px', height: '32px', borderRadius: '8px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#e0e7ff', color: '#4f46e5' }}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 6v3l4-4-4-4v3c-4.42 0-8 3.58-8 8 0 1.57.46 3.03 1.24 4.26L6.7 14.8c-.45-.83-.7-1.79-.7-2.8 0-3.31 2.69-6 6-6zm6.76 1.74L17.3 9.2c.44.84.7 1.79.7 2.8 0 3.31-2.69 6-6 6v-3l-4 4 4 4v-3c4.42 0 8-3.58 8-8 0-1.57-.46-3.03-1.24-4.26z"/>
                          </svg>
                        </button>
                        <button 
                          onClick={() => setConfirmAction({show: true, type: key.status === 1 ? 'block' : 'unblock', keyId: key.id, keyName: key.keyName})}
                          title={key.status === 1 ? 'Block' : 'Unblock'}
                          style={{ width: '32px', height: '32px', borderRadius: '8px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', background: key.status === 1 ? '#fef3c7' : '#dcfce7', color: key.status === 1 ? '#d97706' : '#059669' }}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            {key.status === 1 ? (
                              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8 0-1.85.63-3.55 1.69-4.9L16.9 18.31C15.55 19.37 13.85 20 12 20zm6.31-3.1L7.1 5.69C8.45 4.63 10.15 4 12 4c4.42 0 8 3.58 8 8 0 1.85-.63 3.55-1.69 4.9z"/>
                            ) : (
                              <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/>
                            )}
                          </svg>
                        </button>
                        <button 
                          onClick={() => setConfirmAction({show: true, type: 'delete', keyId: key.id, keyName: key.keyName})}
                          title="Delete"
                          style={{ width: '32px', height: '32px', borderRadius: '8px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fee2e2', color: '#dc2626' }}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
              {apiKeys.length > 0 && (
                <tfoot>
                  <tr>
                    <td colSpan={5} className="pagination-cell">
                      <div className="pagination-container">
                        <button 
                          className="btn btn-secondary btn-sm"
                          onClick={() => setApiKeysPage(prev => Math.max(1, prev - 1))}
                          disabled={apiKeysPage === 1}
                        >
                          ← Previous
                        </button>
                        <span className="pagination-info">
                          Page {apiKeysPage} of {Math.ceil(apiKeys.length / itemsPerPage)}
                        </span>
                        <button 
                          className="btn btn-secondary btn-sm"
                          onClick={() => setApiKeysPage(prev => Math.min(Math.ceil(apiKeys.length / itemsPerPage), prev + 1))}
                          disabled={apiKeysPage === Math.ceil(apiKeys.length / itemsPerPage)}
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

      {showCreateKeyModal && (
        <div className="modal-overlay" onClick={() => setShowCreateKeyModal(false)}>
          <div className="create-wallet-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Create API Key</h2>
              <button className="modal-close" onClick={() => setShowCreateKeyModal(false)}>×</button>
            </div>
            <div className="modal-content">
              <div className="currency-selection">
                <label className="currency-label">Key Name</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Enter key name"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                />
              </div>
              <div className="currency-selection">
                <label className="currency-label">Environment</label>
                <div className="currency-options">
                  <div 
                    className={`currency-option ${newKeyType === 1 ? 'selected' : ''}`}
                    onClick={() => setNewKeyType(1)}
                  >
                    <div className="currency-info">
                      <span className="currency-code">Development</span>
                      <span className="currency-name">For testing and development</span>
                    </div>
                    <span className="currency-flag">🔧</span>
                  </div>
                  <div 
                    className={`currency-option ${newKeyType === 2 ? 'selected' : ''}`}
                    onClick={() => setNewKeyType(2)}
                  >
                    <div className="currency-info">
                      <span className="currency-code">Production</span>
                      <span className="currency-name">For live environment</span>
                    </div>
                    <span className="currency-flag">🚀</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowCreateKeyModal(false)}>Cancel</button>
              <button 
                className="btn btn-primary" 
                onClick={handleCreateApiKey}
                disabled={!newKeyName.trim() || creatingKey}
              >
                {creatingKey ? 'Creating...' : 'Create Key'}
              </button>
            </div>
          </div>
        </div>
      )}

      {viewingKey && (
        <div className="modal-overlay" onClick={() => setViewingKey(null)}>
          <div className="create-wallet-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">API Key Details</h2>
              <button className="modal-close" onClick={() => setViewingKey(null)}>×</button>
            </div>
            <div className="modal-content">
              <div className="currency-selection">
                <label className="currency-label">Key Name</label>
                <div style={{ padding: '12px', background: '#f9fafb', borderRadius: '8px', fontWeight: '600' }}>
                  {viewingKey.name}
                </div>
              </div>
              <div className="currency-selection">
                <label className="currency-label">API Key</label>
                <div style={{ padding: '12px', background: '#f9fafb', borderRadius: '8px', fontFamily: 'monospace', fontSize: '14px', wordBreak: 'break-all' }}>
                  {viewingKey.key}
                </div>
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn btn-primary" onClick={() => setViewingKey(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {confirmAction.show && (
        <div className="modal-overlay" onClick={() => setConfirmAction({show: false, type: 'delete', keyId: '', keyName: ''})}>
          <div className="delete-modal-content" onClick={(e) => e.stopPropagation()} style={{ position: 'relative', background: 'white', borderRadius: '20px', padding: '2rem', textAlign: 'center', maxWidth: '400px', width: '90%' }}>
            <div style={{ width: '80px', height: '80px', background: confirmAction.type === 'delete' ? '#fee2e2' : confirmAction.type === 'rotate' ? '#e0e7ff' : '#fef3c7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: confirmAction.type === 'delete' ? '#dc2626' : confirmAction.type === 'rotate' ? '#4f46e5' : '#d97706', border: `4px solid ${confirmAction.type === 'delete' ? '#fca5a5' : confirmAction.type === 'rotate' ? '#c7d2fe' : '#fde68a'}` }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                {confirmAction.type === 'delete' ? (
                  <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                ) : confirmAction.type === 'rotate' ? (
                  <path d="M12 6v3l4-4-4-4v3c-4.42 0-8 3.58-8 8 0 1.57.46 3.03 1.24 4.26L6.7 14.8c-.45-.83-.7-1.79-.7-2.8 0-3.31 2.69-6 6-6zm6.76 1.74L17.3 9.2c.44.84.7 1.79.7 2.8 0 3.31-2.69 6-6 6v-3l-4 4 4 4v-3c4.42 0 8-3.58 8-8 0-1.57-.46-3.03-1.24-4.26z"/>
                ) : (
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8 0-1.85.63-3.55 1.69-4.9L16.9 18.31C15.55 19.37 13.85 20 12 20zm6.31-3.1L7.1 5.69C8.45 4.63 10.15 4 12 4c4.42 0 8 3.58 8 8 0 1.85-.63 3.55-1.69 4.9z"/>
                )}
              </svg>
            </div>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.5rem', fontWeight: '700', color: '#1f2937' }}>
              {confirmAction.type === 'delete' ? 'Delete API Key' : confirmAction.type === 'rotate' ? 'Rotate API Key' : confirmAction.type === 'block' ? 'Block API Key' : 'Unblock API Key'}
            </h3>
            <p style={{ margin: '0 0 1rem 0', color: '#6b7280', fontSize: '1rem' }}>
              Are you sure you want to {confirmAction.type} <strong>{confirmAction.keyName}</strong>?
            </p>
            {confirmAction.type === 'delete' && (
              <p style={{ color: '#dc2626', fontWeight: '600', fontSize: '0.875rem', margin: '0 0 2rem 0' }}>
                This action cannot be undone.
              </p>
            )}
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
              <button 
                onClick={() => setConfirmAction({show: false, type: 'delete', keyId: '', keyName: ''})}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  if (confirmAction.type === 'delete') handleDeleteApiKey();
                  else if (confirmAction.type === 'rotate') handleRotateApiKey();
                  else if (confirmAction.type === 'block') handleBlockApiKey();
                  else handleUnblockApiKey();
                }}
                className="btn btn-primary"
                style={{ background: confirmAction.type === 'delete' ? '#dc2626' : confirmAction.type === 'rotate' ? '#4f46e5' : '#d97706' }}
              >
                {confirmAction.type === 'delete' ? 'Delete' : confirmAction.type === 'rotate' ? 'Rotate' : confirmAction.type === 'block' ? 'Block' : 'Unblock'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const handleEditProfile = () => {
    if (profileLocked) {
      setShowUnlockModal(true);
      return;
    }
    setEditedUser(user);
    setIsEditingProfile(true);
    loadKycDocuments();
  };

  const handleUnlockProfile = async () => {
    if (!unlockPassword.trim() || !user?.email || !user?.id) return;
    setUnlocking(true);
    try {
      const response = await customerService.login({ email: user.email, password: unlockPassword });
      if (response.data?.data?.accessToken) {
        await dashboardService.updateProfile(user.id, { ...user, isFinalizedLock: false });
        setProfileLocked(false);
        localStorage.removeItem('profileLocked');
        setShowUnlockModal(false);
        setUnlockPassword('');
        setEditedUser(user);
        setIsEditingProfile(true);
        loadKycDocuments();
        setTimeout(() => {
          const mainContent = document.querySelector('.main-content');
          if (mainContent) {
            mainContent.scrollTo({ top: mainContent.scrollHeight, behavior: 'smooth' });
          }
        }, 100);
      } else {
        setShowUnlockModal(false);
        setUnlockPassword('');
        setShowWrongPasswordModal(true);
      }
    } catch (error) {
      console.error('Failed to unlock profile:', error);
      setShowUnlockModal(false);
      setUnlockPassword('');
      setShowWrongPasswordModal(true);
    } finally {
      setUnlocking(false);
    }
  };

  const loadKycDocuments = async () => {
    if (!user?.id) return;
    try {
      const kycService = await import('../services/kycApi.ts');
      const [docsResponse, typesResponse] = await Promise.all([
        kycService.kycService.getCustomerDocuments(user.id),
        kycService.kycService.getDocumentTypes()
      ]);
      const docs = docsResponse.data?.data || docsResponse.data || [];
      setKycDocuments(Array.isArray(docs) ? docs : []);
      const types = typesResponse.data?.data?.data || [];
      setDocumentTypes(Array.isArray(types) ? types : []);
    } catch (error) {
      console.error('Failed to load KYC documents:', error);
      setKycDocuments([]);
    }
  };

  const handleCancelEdit = () => {
    setEditedUser(null);
    setIsEditingProfile(false);
  };

  const handleSaveProfile = async (isFinalSave: boolean = false) => {
    if (!editedUser || !user?.id) return;
    setSavingProfile(true);
    try {
      await dashboardService.updateProfile(user.id, { ...editedUser, isFinalizedLock: isFinalSave });
      setUser(editedUser);
      setIsEditingProfile(false);
      setEditedUser(null);
      
      if (isFinalSave) {
        setProfileLocked(true);
        localStorage.setItem('profileLocked', 'true');
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('Failed to save profile. Please try again.');
    } finally {
      setSavingProfile(false);
    }
  };

  const checkRequiredFields = () => {
    if (!editedUser) return false;
    return !!(editedUser.firstName && editedUser.lastName && editedUser.email && 
              editedUser.company && editedUser.mobileNo && editedUser.interest && 
              editedUser.sendingFrequency && editedUser.sendingVolume && editedUser.sendingType);
  };

  const checkKycDocuments = () => {
    return kycDocuments.length > 0 && kycDocuments.every(doc => doc.status === 1);
  };

  const canFinalSave = () => {
    return checkRequiredFields() && checkKycDocuments();
  };

  const canShowFinalize = () => {
    return checkRequiredFields();
  };

  const handleFinalize = () => {
    if (!checkKycDocuments()) {
      // If no documents at all, show upload modal
      if (kycDocuments.length === 0) {
        setShowDocumentUpload(true);
        return;
      }
      // If documents exist but not approved, proceed with save
      handleSaveProfile(true);
      return;
    }
    handleSaveProfile(true);
  };

  const handleDocumentUpload = async (file: File, documentTypeId: string) => {
    if (!user?.id) return;
    setUploadingDocument(true);
    try {
      const kycService = await import('../services/kycApi.ts');
      await kycService.kycService.uploadDocument({ file, documentTypeId });
      await loadKycDocuments();
      setShowDocumentUpload(false);
    } catch (error) {
      console.error('Failed to upload documents:', error);
      alert('Failed to upload documents. Please try again.');
    } finally {
      setUploadingDocument(false);
    }
  };

  const handleDocumentConfirm = (goToDocuments: boolean) => {
    setShowDocumentConfirm(false);
    if (goToDocuments) {
      setShowDocumentUpload(true);
    } else {
      handleSaveProfile(true);
    }
  };

  const handleFieldChange = (field: keyof User, value: any) => {
    if (editedUser) {
      setEditedUser({ ...editedUser, [field]: value });
    }
  };

  const interestOptions = [
    'Email', 'SMS', 'Lead', 'Reward',
    'Email & SMS', 'Email & Lead', 'Email & Reward',
    'SMS & Lead', 'SMS & Reward', 'Lead & Reward',
    'Email, SMS & Lead', 'Email, SMS & Reward', 'Email, Lead & Reward',
    'SMS, Lead & Reward', 'Email, SMS, Lead & Reward'
  ];

  const sendingFrequencyOptions = ['Daily', 'Weekly', 'Monthly', 'Occasionally'];
  const sendingVolumeOptions = ['Less than 1,000', '1,000 - 10,000', '10,000 - 100,000', 'More than 100,000'];
  const sendingTypeOptions = ['Transactional', 'Marketing', 'Both'];
  const companySizeOptions = ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'];

  const renderProfile = () => (
    <div className="profile-container">
      <div className="profile-header" style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <h1 style={{ fontSize: '28px', fontWeight: '700', margin: '0', color: 'var(--table-text-primary)' }}>Profile Information</h1>
              {profileLocked && (
                <>
                  <span style={{ padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: '600', background: '#dcfce7', color: '#166534', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    🔒 Locked
                  </span>
                  {!checkKycDocuments() ? (
                    <span style={{ padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: '600', background: '#fef3c7', color: '#92400e', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      ⏳ Pending Approval
                    </span>
                  ) : (
                    <span style={{ padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: '600', background: '#d1fae5', color: '#065f46', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      ✓ Approved
                    </span>
                  )}
                </>
              )}
            </div>
            <p style={{ fontSize: '14px', color: 'var(--table-text-secondary)', margin: '8px 0 0 0' }}>
              {profileLocked ? 
                (checkKycDocuments() ? 'Your profile is locked. All KYC documents have been approved.' : 'Your profile is locked. Pending Approval.') 
                : 'Manage your account details and preferences'
              }
            </p>
          </div>
          {!isEditingProfile && (
            <button 
              className="btn btn-primary" 
              onClick={handleEditProfile}
              disabled={profileLocked && !checkKycDocuments()}
              style={{
                opacity: profileLocked && !checkKycDocuments() ? 0.5 : 1,
                cursor: profileLocked && !checkKycDocuments() ? 'not-allowed' : 'pointer'
              }}
            >
              {profileLocked ? '🔓 Unlock Profile' : '✏️ Edit Profile'}
            </button>
          )}
        </div>
      </div>

      <div className="profile-card" style={{ marginBottom: '24px' }}>
        <div className="table-header">
          <h3 className="table-title">Personal & Contact Information</h3>
          <p className="table-subtitle">Your basic profile and contact details</p>
        </div>
        <div className="table-container">
          <table className="table modern-table">
            <tbody>
              <tr className="table-row">
                <td className="table-cell font-medium" style={{ width: '35%' }}>Full Name</td>
                <td className="table-cell">
                  {isEditingProfile ? (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input className="form-input" placeholder="First Name" value={editedUser?.firstName || ''} onChange={(e) => handleFieldChange('firstName', e.target.value)} disabled={profileLocked} />
                      <input className="form-input" placeholder="Last Name" value={editedUser?.lastName || ''} onChange={(e) => handleFieldChange('lastName', e.target.value)} disabled={profileLocked} />
                    </div>
                  ) : (
                    `${user?.firstName} ${user?.lastName}`
                  )}
                </td>
              </tr>
              <tr className="table-row">
                <td className="table-cell font-medium">Email</td>
                <td className="table-cell">{user?.email}</td>
              </tr>
              <tr className="table-row">
                <td className="table-cell font-medium">Mobile</td>
                <td className="table-cell">
                  {isEditingProfile ? (
                    <input className="form-input" value={editedUser?.mobileNo || ''} onChange={(e) => handleFieldChange('mobileNo', e.target.value)} disabled={profileLocked} />
                  ) : (
                    user?.mobileNo || 'Not provided'
                  )}
                </td>
              </tr>
              <tr className="table-row">
                <td className="table-cell font-medium">Country</td>
                <td className="table-cell">{user?.country?.name || 'Not specified'}</td>
              </tr>
              <tr className="table-row last-row">
                <td className="table-cell font-medium">Role</td>
                <td className="table-cell">{user?.role?.name || 'Not specified'}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="profile-card" style={{ marginBottom: '24px' }}>
        <div className="table-header">
          <h3 className="table-title">Company Information</h3>
          <p className="table-subtitle">Business and organization details</p>
        </div>
        <div className="table-container">
          <table className="table modern-table">
            <tbody>
              <tr className="table-row">
                <td className="table-cell font-medium" style={{ width: '35%' }}>Company</td>
                <td className="table-cell">
                  {isEditingProfile ? (
                    <input className="form-input" value={editedUser?.company || ''} onChange={(e) => handleFieldChange('company', e.target.value)} disabled={profileLocked} />
                  ) : (
                    user?.company
                  )}
                </td>
              </tr>
              <tr className="table-row">
                <td className="table-cell font-medium">Company Website</td>
                <td className="table-cell">
                  {isEditingProfile ? (
                    <input className="form-input" value={editedUser?.companyWebsite || ''} onChange={(e) => handleFieldChange('companyWebsite', e.target.value)} disabled={profileLocked} />
                  ) : (
                    user?.companyWebsite || 'Not provided'
                  )}
                </td>
              </tr>
              <tr className="table-row">
                <td className="table-cell font-medium">Company Size</td>
                <td className="table-cell">
                  {isEditingProfile ? (
                    <select className="form-input" value={editedUser?.companySize || ''} onChange={(e) => handleFieldChange('companySize', e.target.value)} disabled={profileLocked}>
                      <option value="">Select size</option>
                      {companySizeOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  ) : (
                    user?.companySize || 'Not provided'
                  )}
                </td>
              </tr>
              <tr className="table-row">
                <td className="table-cell font-medium">Business Address</td>
                <td className="table-cell">
                  {isEditingProfile ? (
                    <input className="form-input" value={editedUser?.businessAddress || ''} onChange={(e) => handleFieldChange('businessAddress', e.target.value)} disabled={profileLocked} />
                  ) : (
                    user?.businessAddress || 'Not provided'
                  )}
                </td>
              </tr>
              <tr className="table-row">
                <td className="table-cell font-medium">Business Phone</td>
                <td className="table-cell">
                  {isEditingProfile ? (
                    <input className="form-input" value={editedUser?.businessPhone || ''} onChange={(e) => handleFieldChange('businessPhone', e.target.value)} disabled={profileLocked} />
                  ) : (
                    user?.businessPhone || 'Not provided'
                  )}
                </td>
              </tr>
              <tr className="table-row last-row">
                <td className="table-cell font-medium">Sector</td>
                <td className="table-cell">{user?.sector?.name || 'Not specified'}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="profile-card" style={{ marginBottom: '24px' }}>
        <div className="table-header">
          <h3 className="table-title">Primary Contact</h3>
          <p className="table-subtitle">Main point of contact for your account</p>
        </div>
        <div className="table-container">
          <table className="table modern-table">
            <tbody>
              <tr className="table-row">
                <td className="table-cell font-medium" style={{ width: '35%' }}>Primary Contact</td>
                <td className="table-cell">
                  {isEditingProfile ? (
                    <input className="form-input" placeholder="Name (Role)" value={editedUser?.primaryContactName || ''} onChange={(e) => handleFieldChange('primaryContactName', e.target.value)} disabled={profileLocked} />
                  ) : (
                    user?.primaryContactName || 'Not provided'
                  )}
                </td>
              </tr>
              <tr className="table-row last-row">
                <td className="table-cell font-medium">Primary Contact Email</td>
                <td className="table-cell">
                  {isEditingProfile ? (
                    <input className="form-input" value={editedUser?.primaryContactEmail || ''} onChange={(e) => handleFieldChange('primaryContactEmail', e.target.value)} disabled={profileLocked} />
                  ) : (
                    user?.primaryContactEmail || 'Not provided'
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="profile-card">
        <div className="table-header">
          <h3 className="table-title">SMS Preferences</h3>
          <p className="table-subtitle">Configure your messaging preferences and requirements</p>
        </div>
        <div className="table-container">
          <table className="table modern-table">
            <tbody>
              <tr className="table-row">
                <td className="table-cell font-medium" style={{ width: '35%' }}>Interest</td>
                <td className="table-cell">
                  {isEditingProfile ? (
                    <select className="form-input" value={editedUser?.interest || ''} onChange={(e) => handleFieldChange('interest', e.target.value)} disabled={profileLocked}>
                      <option value="">Select interest</option>
                      {interestOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  ) : (
                    user?.interest || 'Not specified'
                  )}
                </td>
              </tr>
              <tr className="table-row">
                <td className="table-cell font-medium">Sending Frequency</td>
                <td className="table-cell">
                  {isEditingProfile ? (
                    <select className="form-input" value={editedUser?.sendingFrequency || ''} onChange={(e) => handleFieldChange('sendingFrequency', e.target.value)} disabled={profileLocked}>
                      <option value="">Select frequency</option>
                      {sendingFrequencyOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  ) : (
                    user?.sendingFrequency || 'Not specified'
                  )}
                </td>
              </tr>
              <tr className="table-row">
                <td className="table-cell font-medium">Sending Volume</td>
                <td className="table-cell">
                  {isEditingProfile ? (
                    <select className="form-input" value={editedUser?.sendingVolume || ''} onChange={(e) => handleFieldChange('sendingVolume', e.target.value)} disabled={profileLocked}>
                      <option value="">Select volume</option>
                      {sendingVolumeOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  ) : (
                    user?.sendingVolume || 'Not specified'
                  )}
                </td>
              </tr>
              <tr className="table-row last-row">
                <td className="table-cell font-medium">Sending Type</td>
                <td className="table-cell">
                  {isEditingProfile ? (
                    <select className="form-input" value={editedUser?.sendingType || ''} onChange={(e) => handleFieldChange('sendingType', e.target.value)} disabled={profileLocked}>
                      <option value="">Select type</option>
                      {sendingTypeOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  ) : (
                    user?.sendingType || 'Not specified'
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {(isEditingProfile && checkRequiredFields()) || profileLocked ? (
        <div className="profile-card" style={{ marginTop: '32px', marginBottom: '24px' }}>
          <div className="table-header">
            <h3 className="table-title">KYC Documents</h3>
            <p className="table-subtitle">Your uploaded verification documents</p>
          </div>
          <div className="table-container">
            {kycDocuments.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--table-text-secondary)' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📄</div>
              <p>No documents uploaded yet</p>
              <button className="btn btn-primary btn-sm" onClick={() => setShowDocumentUpload(true)} style={{ marginTop: '16px' }}>
                📄 Upload Documents
              </button>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr className="table-header-row">
                  <th className="table-header-cell" style={{ textAlign: 'left', paddingLeft: '20px' }}>DOCUMENT TYPE</th>
                  <th className="table-header-cell" style={{ textAlign: 'center' }}>STATUS</th>
                  <th className="table-header-cell" style={{ textAlign: 'center' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {kycDocuments.map((doc, index) => (
                  <tr key={doc.id} className={`table-row ${index === kycDocuments.length - 1 ? 'last-row' : ''}`}>
                    <td className="table-cell" style={{ textAlign: 'left', paddingLeft: '20px' }}>
                      {doc.documentTypeName || `Document ${index + 1}`}
                    </td>
                    <td className="table-cell" style={{ textAlign: 'center' }}>
                      <span className={`transaction-badge ${doc.status === 1 ? 'credit' : doc.status === 2 ? 'debit' : 'debit'}`}>
                        {doc.status === 1 ? 'APPROVED' : doc.status === 2 ? 'REJECTED' : 'PENDING'}
                      </span>
                    </td>
                    <td className="table-cell" style={{ textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                        <button 
                          onClick={() => setViewingDocument({url: doc.fileUrl, name: doc.documentTypeName || `Document ${index + 1}`})}
                          title="View"
                          style={{ width: '32px', height: '32px', borderRadius: '8px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#dbeafe', color: '#1d4ed8' }}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                          </svg>
                        </button>
                        {doc.status !== 1 && (
                          <button 
                            onClick={() => setDeleteDocumentConfirm({show: true, docId: doc.id, docName: doc.documentTypeName || `Document ${index + 1}`})}
                            title="Delete"
                            style={{ width: '32px', height: '32px', borderRadius: '8px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fee2e2', color: '#dc2626' }}
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                            </svg>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {kycDocuments.length > 0 && kycDocuments.length < documentTypes.length && (
            <div style={{ padding: '20px', textAlign: 'center', borderTop: '1px solid var(--table-border)' }}>
              <button className="btn btn-primary btn-sm" onClick={() => setShowDocumentUpload(true)}>
                📄 Upload More Documents
              </button>
            </div>
          )}
          </div>
        </div>
      ) : null}

      {isEditingProfile && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px', padding: '20px', background: 'var(--table-header-bg)', borderRadius: '12px', border: '1px solid var(--table-border)' }}>
          <div style={{ fontSize: '14px', color: 'var(--table-text-secondary)' }}>
            {!checkRequiredFields() && (
              <span style={{ color: '#ef4444' }}>⚠️ Complete all required fields to continue</span>
            )}
            {checkRequiredFields() && !checkKycDocuments() && (
              <span style={{ color: '#f59e0b' }}>
                {kycDocuments.length === 0 
                  ? '📄 Upload KYC documents to complete finalization'
                  : '⏳ KYC documents uploaded but not yet approved'
                }
              </span>
            )}
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn btn-secondary" onClick={handleCancelEdit} disabled={savingProfile}>Cancel</button>
            <button className="btn btn-primary" onClick={() => handleSaveProfile(false)} disabled={savingProfile || profileLocked}>
              {savingProfile ? 'Saving...' : '💾 Save Changes'}
            </button>
            {canShowFinalize() && (
              <button 
                className="btn btn-primary" 
                onClick={handleFinalize} 
                disabled={savingProfile || profileLocked}
                style={{ 
                  opacity: profileLocked ? 0.5 : 1,
                  cursor: profileLocked ? 'not-allowed' : 'pointer',
                  background: profileLocked ? '#94a3b8' : undefined
                }}
              >
                {savingProfile ? 'Finalizing...' : '🔒 Finalize & Lock'}
              </button>
            )}
          </div>
        </div>
      )}

      {showUnlockModal && (
        <div className="modal-overlay" onClick={() => setShowUnlockModal(false)}>
          <div className="create-wallet-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Unlock Profile</h2>
              <button className="modal-close" onClick={() => setShowUnlockModal(false)}>×</button>
            </div>
            <div className="modal-content">
              <div className="currency-selection">
                <label className="currency-label">Enter your password to unlock profile</label>
                <input 
                  type="password" 
                  className="form-input" 
                  placeholder="Enter password"
                  value={unlockPassword}
                  onChange={(e) => setUnlockPassword(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleUnlockProfile()}
                />
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowUnlockModal(false)}>Cancel</button>
              <button 
                className="btn btn-primary" 
                onClick={handleUnlockProfile}
                disabled={!unlockPassword.trim() || unlocking}
              >
                {unlocking ? 'Unlocking...' : '🔓 Unlock'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showWrongPasswordModal && (
        <div className="modal-overlay" onClick={() => setShowWrongPasswordModal(false)}>
          <div className="delete-modal-content" onClick={(e) => e.stopPropagation()} style={{ position: 'relative', background: 'white', borderRadius: '20px', padding: '2rem', textAlign: 'center', maxWidth: '400px', width: '90%' }}>
            <div style={{ width: '80px', height: '80px', background: '#fee2e2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: '#dc2626', border: '4px solid #fca5a5' }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
              </svg>
            </div>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.5rem', fontWeight: '700', color: '#1f2937' }}>
              Incorrect Password
            </h3>
            <p style={{ margin: '0 0 2rem 0', color: '#6b7280', fontSize: '1rem' }}>
              The password you entered is incorrect. Please try again.
            </p>
            <button 
              onClick={() => setShowWrongPasswordModal(false)}
              className="btn btn-primary"
              style={{ background: '#dc2626' }}
            >
              Close
            </button>
          </div>
        </div>
      )}



      {viewingDocument && (
        <div className="modal-overlay" onClick={() => setViewingDocument(null)}>
          <div className="create-wallet-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '90vw', maxHeight: '90vh', width: 'auto' }}>
            <div className="modal-header">
              <h2 className="modal-title">{viewingDocument.name}</h2>
              <button className="modal-close" onClick={() => setViewingDocument(null)}>×</button>
            </div>
            <div className="modal-content" style={{ padding: '20px', maxHeight: '80vh', overflow: 'auto', background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {viewingDocument.url.match(/\.(jpg|jpeg|png|gif|bmp|webp)$/i) ? (
                <img 
                  src={viewingDocument.url}
                  alt={viewingDocument.name}
                  style={{ maxWidth: '100%', maxHeight: '65vh', objectFit: 'contain' }}
                />
              ) : (
                <iframe 
                  src={viewingDocument.url}
                  style={{ width: '100%', height: '65vh', border: 'none' }}
                  title={viewingDocument.name}
                />
              )}
            </div>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setViewingDocument(null)}>Close</button>
              <button className="btn btn-primary" onClick={() => {
                const link = document.createElement('a');
                link.href = viewingDocument.url;
                link.download = viewingDocument.name;
                link.click();
              }}>Download</button>
            </div>
          </div>
        </div>
      )}

      {deleteDocumentConfirm.show && (
        <div className="modal-overlay" onClick={() => setDeleteDocumentConfirm({show: false, docId: '', docName: ''})}>
          <div className="delete-modal-content" onClick={(e) => e.stopPropagation()} style={{ position: 'relative', background: 'white', borderRadius: '20px', padding: '2rem', textAlign: 'center', maxWidth: '400px', width: '90%' }}>
            <div style={{ width: '80px', height: '80px', background: '#fee2e2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: '#dc2626', border: '4px solid #fca5a5' }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
              </svg>
            </div>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.5rem', fontWeight: '700', color: '#1f2937' }}>
              Delete Document
            </h3>
            <p style={{ margin: '0 0 1rem 0', color: '#6b7280', fontSize: '1rem' }}>
              Are you sure you want to delete <strong>{deleteDocumentConfirm.docName}</strong>?
            </p>
            <p style={{ color: '#dc2626', fontWeight: '600', fontSize: '0.875rem', margin: '0 0 2rem 0' }}>
              This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
              <button 
                onClick={() => setDeleteDocumentConfirm({show: false, docId: '', docName: ''})}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button 
                onClick={async () => {
                  try {
                    const kycService = await import('../services/kycApi.ts');
                    await kycService.kycService.deleteDocument(deleteDocumentConfirm.docId);
                    await loadKycDocuments();
                    setDeleteDocumentConfirm({show: false, docId: '', docName: ''});
                  } catch (error) {
                    console.error('Failed to delete document:', error);
                    alert('Failed to delete document');
                  }
                }}
                className="btn btn-primary"
                style={{ background: '#dc2626' }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {showDocumentUpload && (
        <div className="modal-overlay" onClick={() => setShowDocumentUpload(false)}>
          <div className="create-wallet-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '490px', width: '90%' }}>
            <div className="modal-header" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', padding: '24px' }}>
              <div>
                <h2 className="modal-title" style={{ color: 'white', margin: '0 0 4px 0', fontSize: '24px' }}>📄 Upload KYC Documents</h2>
                <p style={{ margin: '0', fontSize: '14px', opacity: '0.9' }}>Select document type and upload your verification files</p>
              </div>
              <button className="modal-close" onClick={() => setShowDocumentUpload(false)} style={{ color: 'white', opacity: '0.9' }}>×</button>
            </div>
            <div className="modal-content" style={{ maxHeight: '65vh', overflowY: 'auto', padding: '32px 24px' }}>
              {documentTypes.filter(type => !kycDocuments.find(doc => doc.documentTypeId === type.id)).length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                  <div style={{ width: '80px', height: '80px', background: '#dcfce7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: '40px' }}>✅</div>
                  <h4 style={{ margin: '0 0 12px 0', fontSize: '20px', fontWeight: '700', color: 'var(--table-text-primary)' }}>All Documents Uploaded</h4>
                  <p style={{ margin: '0', color: 'var(--table-text-secondary)', fontSize: '15px' }}>You have uploaded all required KYC documents.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {documentTypes
                    .filter(type => !kycDocuments.find(doc => doc.documentTypeId === type.id))
                    .map(type => {
                      const getDocIcon = (name: string) => {
                        if (name.includes('Passport')) return '🛂';
                        if (name.includes('License')) return '🪪';
                        if (name.includes('ID')) return '🆔';
                        if (name.includes('Tax')) return '📋';
                        if (name.includes('Business') || name.includes('Registration')) return '🏢';
                        return '📄';
                      };
                      return (
                        <div key={type.id} style={{ border: '2px solid var(--table-border)', borderRadius: '12px', padding: '20px', background: 'var(--table-bg)', transition: 'all 0.3s', cursor: 'pointer' }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#667eea'; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(102, 126, 234, 0.15)'; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--table-border)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
                          <div style={{ fontSize: '32px', textAlign: 'center', marginBottom: '12px' }}>{getDocIcon(type.name)}</div>
                          <h4 style={{ margin: '0 0 16px 0', fontSize: '15px', fontWeight: '600', color: 'var(--table-text-primary)', textAlign: 'center' }}>{type.name}</h4>
                          <input
                            type="file"
                            id={`file-${type.id}`}
                            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleDocumentUpload(file, type.id);
                            }}
                            disabled={uploadingDocument}
                            style={{ display: 'none' }}
                          />
                          <label 
                            htmlFor={`file-${type.id}`} 
                            style={{ 
                              display: 'flex', 
                              flexDirection: 'column', 
                              alignItems: 'center', 
                              padding: '24px 16px', 
                              border: '2px dashed #cbd5e1', 
                              borderRadius: '10px', 
                              cursor: uploadingDocument ? 'not-allowed' : 'pointer',
                              background: 'var(--table-header-bg)',
                              transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => !uploadingDocument && (e.currentTarget.style.borderColor = '#667eea', e.currentTarget.style.background = '#f0f4ff')}
                            onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#cbd5e1', e.currentTarget.style.background = 'var(--table-header-bg)')}
                          >
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginBottom: '12px', color: '#667eea' }}>
                              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
                            </svg>
                            <span style={{ fontSize: '13px', color: 'var(--table-text-primary)', fontWeight: '600', textAlign: 'center' }}>
                              {uploadingDocument ? '⏳ Uploading...' : 'Click to Upload'}
                            </span>
                            <span style={{ fontSize: '11px', color: 'var(--table-text-muted)', marginTop: '4px' }}>or drag and drop</span>
                          </label>
                          <p style={{ fontSize: '11px', color: 'var(--table-text-muted)', margin: '12px 0 0 0', textAlign: 'center' }}>PDF, JPG, PNG, DOC (Max 10MB)</p>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
            <div className="modal-actions" style={{ padding: '20px 24px', borderTop: '1px solid var(--table-border)' }}>
              <button className="btn btn-secondary" onClick={() => setShowDocumentUpload(false)} disabled={uploadingDocument}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const oldRenderProfile = () => (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-banner">
          <div className="profile-avatar-large">
            {user?.firstName?.[0]}{user?.lastName?.[0]}
          </div>
        </div>
        <div className="profile-info-header">
          <div>
            <h1 className="profile-name">{user?.firstName} {user?.lastName}</h1>
            <p className="profile-email">{user?.email}</p>
          </div>
          <span className={`status-badge-large ${user?.isEmailVerified ? 'verified' : 'pending'}`}>
            {user?.isEmailVerified ? '✓ Verified Account' : '⏳ Pending Verification'}
          </span>
        </div>
      </div>

      <div className="profile-grid">
        <div className="profile-card">
          <div className="profile-card-header">
            <h3>Personal Information</h3>
          </div>
          <div className="profile-card-content">
            <div className="info-item">
              <span className="info-label">First Name</span>
              <span className="info-value">{user?.firstName}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Last Name</span>
              <span className="info-value">{user?.lastName}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Email Address</span>
              <span className="info-value">{user?.email}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Mobile Number</span>
              <span className="info-value">{user?.mobileNo || 'Not provided'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Email Verified</span>
              <span className={`status-badge ${user?.isEmailVerified ? 'active' : 'pending'}`}>
                {user?.isEmailVerified ? 'Yes' : 'No'}
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">Account Status</span>
              <span className={`status-badge ${user?.isActive ? 'active' : 'inactive'}`}>
                {user?.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            {user?.createdAt && (
              <div className="info-item">
                <span className="info-label">Member Since</span>
                <span className="info-value">{new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
              </div>
            )}
          </div>
        </div>

        <div className="profile-card">
          <div className="profile-card-header">
            <h3>Company Information</h3>
          </div>
          <div className="profile-card-content">
            <div className="info-item">
              <span className="info-label">Company Name</span>
              <span className="info-value">{user?.company}</span>
            </div>
            {user?.companyWebsite && (
              <div className="info-item">
                <span className="info-label">Website</span>
                <span className="info-value">{user.companyWebsite}</span>
              </div>
            )}
            {user?.companySize && (
              <div className="info-item">
                <span className="info-label">Company Size</span>
                <span className="info-value">{user.companySize} employees</span>
              </div>
            )}
            <div className="info-item">
              <span className="info-label">Country</span>
              <span className="info-value">{user?.country?.name || 'Not specified'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Role</span>
              <span className="info-value">{user?.role?.name || 'Not specified'}</span>
            </div>
            {user?.sector && (
              <div className="info-item">
                <span className="info-label">Sector</span>
                <span className="info-value">{user.sector.name}</span>
              </div>
            )}
            {user?.referral && (
              <div className="info-item">
                <span className="info-label">Referral Source</span>
                <span className="info-value">{user.referral.name}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {(user?.businessDescription || user?.businessAddress || user?.businessPhone) && (
        <div className="profile-card">
          <div className="profile-card-header">
            <h3>Business Details</h3>
          </div>
          <div className="profile-card-content">
            {user?.businessDescription && (
              <div className="info-item">
                <span className="info-label">Description</span>
                <span className="info-value">{user.businessDescription}</span>
              </div>
            )}
            {user?.businessAddress && (
              <div className="info-item">
                <span className="info-label">Address</span>
                <span className="info-value">{user.businessAddress}</span>
              </div>
            )}
            {user?.businessPhone && (
              <div className="info-item">
                <span className="info-label">Phone</span>
                <span className="info-value">{user.businessPhone}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {(user?.primaryContactName || user?.primaryContactEmail || user?.primaryContactRole) && (
        <div className="profile-card">
          <div className="profile-card-header">
            <h3>Primary Contact</h3>
          </div>
          <div className="profile-card-content">
            {user?.primaryContactName && (
              <div className="info-item">
                <span className="info-label">Name</span>
                <span className="info-value">{user.primaryContactName}</span>
              </div>
            )}
            {user?.primaryContactEmail && (
              <div className="info-item">
                <span className="info-label">Email</span>
                <span className="info-value">{user.primaryContactEmail}</span>
              </div>
            )}
            {user?.primaryContactRole && (
              <div className="info-item">
                <span className="info-label">Role</span>
                <span className="info-value">{user.primaryContactRole}</span>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="profile-card">
        <div className="profile-card-header">
          <h3>SMS Preferences</h3>
        </div>
        <div className="profile-card-content">
          <div className="info-item">
            <span className="info-label">Interest</span>
            <span className="info-value">{user?.interest || 'Not specified'}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Sending Frequency</span>
            <span className="info-value">{user?.sendingFrequency || 'Not specified'}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Sending Volume</span>
            <span className="info-value">{user?.sendingVolume || 'Not specified'}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Sending Type</span>
            <span className="info-value">{user?.sendingType || 'Not specified'}</span>
          </div>
        </div>
      </div>

      <div className="profile-card">
        <div className="profile-card-header">
          <h3>Account Preferences</h3>
        </div>
        <div className="profile-card-content">
          <div className="info-item">
            <span className="info-label">Newsletter Subscription</span>
            <span className={`status-badge ${user?.recieveNewsletter ? 'active' : 'inactive'}`}>
              {user?.recieveNewsletter ? 'Subscribed' : 'Not Subscribed'}
            </span>
          </div>
          <div className="info-item">
            <span className="info-label">Privacy Policy</span>
            <span className={`status-badge ${user?.acceptPrivacyPolicy ? 'active' : 'inactive'}`}>
              {user?.acceptPrivacyPolicy ? 'Accepted' : 'Not Accepted'}
            </span>
          </div>
          <div className="info-item">
            <span className="info-label">Terms of Service</span>
            <span className={`status-badge ${user?.acceptTermsOfService ? 'active' : 'inactive'}`}>
              {user?.acceptTermsOfService ? 'Accepted' : 'Not Accepted'}
            </span>
          </div>
          <div className="info-item">
            <span className="info-label">Two-Factor Authentication</span>
            <span className={`status-badge ${user?.twoFactorEnabled ? 'active' : 'inactive'}`}>
              {user?.twoFactorEnabled ? 'Enabled' : 'Disabled'}
            </span>
          </div>
          {user?.emailVerifiedAt && (
            <div className="info-item">
              <span className="info-label">Email Verified At</span>
              <span className="info-value">{new Date(user.emailVerifiedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const loadSenderRequests = async () => {
    if (!user?.id) return;
    try {
      const response = await dashboardService.getCustomerSenderRequests(user.id);
      const data = response.data?.data || response.data || [];
      setSenderRequests(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load sender requests:', error);
      setSenderRequests([]);
    }
  };

  const handleCreateSender = async () => {
    if (!newSenderId.trim()) return;
    setCreatingSender(true);
    try {
      await dashboardService.createSenderRequest({ senderId: newSenderId });
      setShowCreateSenderModal(false);
      setNewSenderId('');
      loadSenderRequests();
    } catch (error) {
      console.error('Failed to create sender request:', error);
      alert('Failed to create sender request');
    } finally {
      setCreatingSender(false);
    }
  };

  const handleDeleteSender = async () => {
    try {
      await dashboardService.deleteSenderRequest(confirmDeleteSender.id);
      setConfirmDeleteSender({show: false, id: '', senderId: ''});
      loadSenderRequests();
    } catch (error) {
      console.error('Failed to delete sender request:', error);
    }
  };

  const getSenderStatusLabel = (status: number) => {
    switch(status) {
      case 11: return 'Pending';
      case 1: return 'Under Review';
      case 2: return 'Approved';
      case 3: return 'Rejected';
      case 4: return 'Suspended';
      default: return 'Unknown';
    }
  };

  const getSenderStatusClass = (status: number) => {
    switch(status) {
      case 11: return 'debit';
      case 1: return 'debit';
      case 2: return 'credit';
      case 3: return 'debit';
      case 4: return 'debit';
      default: return 'debit';
    }
  };

  const renderSenders = () => (
    <div className="integration-container">
      <div className="integration-header">
        <div className="integration-title-section">
          <h1 className="integration-title">Senders</h1>
          <p className="integration-subtitle">Manage your sender IDs and approval requests</p>
        </div>
        <div className="integration-actions">
          <button className="btn btn-primary" onClick={() => { setShowCreateSenderModal(true); loadSenderRequests(); }}>
            📱 Request Sender ID
          </button>
        </div>
      </div>

      <div className="integration-stats-grid">
        <div className="integration-stat-card primary">
          <div className="stat-icon-modern">📱</div>
          <div className="stat-content-modern">
            <div className="stat-value-modern">{senderRequests.length}</div>
            <div className="stat-label-modern">Total Requests</div>
          </div>
        </div>
        <div className="integration-stat-card warning">
          <div className="stat-icon-modern">⏳</div>
          <div className="stat-content-modern">
            <div className="stat-value-modern">{senderRequests.filter(s => s.status === 11).length}</div>
            <div className="stat-label-modern">Pending</div>
          </div>
        </div>
        <div className="integration-stat-card info">
          <div className="stat-icon-modern">🔍</div>
          <div className="stat-content-modern">
            <div className="stat-value-modern">{senderRequests.filter(s => s.status === 1).length}</div>
            <div className="stat-label-modern">Under Review</div>
          </div>
        </div>
        <div className="integration-stat-card success">
          <div className="stat-icon-modern">✅</div>
          <div className="stat-content-modern">
            <div className="stat-value-modern">{senderRequests.filter(s => s.status === 2).length}</div>
            <div className="stat-label-modern">Approved</div>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: '24px' }}>
        <div className="table-header">
          <h3 className="table-title">Sender ID Requests</h3>
          <p className="table-subtitle">View and manage your sender ID requests</p>
        </div>
        {senderRequests.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📱</div>
            <h4>No Sender IDs</h4>
            <p>Request your first sender ID to start sending messages</p>
          </div>
        ) : (
          <div className="table-container">
            <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
              <colgroup>
                <col style={{ width: '30%' }} />
                <col style={{ width: '20%' }} />
                <col style={{ width: '25%' }} />
                <col style={{ width: '15%' }} />
                <col style={{ width: '10%' }} />
              </colgroup>
              <thead>
                <tr className="table-header-row">
                  <th className="table-header-cell">Sender ID</th>
                  <th className="table-header-cell text-center">Status</th>
                  <th className="table-header-cell">Created</th>
                  <th className="table-header-cell">Updated</th>
                  <th className="table-header-cell text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {senderRequests.slice((sendersPage - 1) * itemsPerPage, sendersPage * itemsPerPage).map((request, index) => (
                  <tr key={request.id} className={`table-row ${index === senderRequests.length - 1 ? 'last-row' : ''}`}>
                    <td className="table-cell font-medium">{request.senderId}</td>
                    <td className="table-cell text-center">
                      <span className={`transaction-badge ${getSenderStatusClass(request.status)}`}>
                        {getSenderStatusLabel(request.status)}
                      </span>
                    </td>
                    <td className="table-cell">
                      <div className="date-primary">
                        {new Date(request.createdAt).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric'
                        })}
                      </div>
                      <div className="date-secondary">
                        {new Date(request.createdAt).toLocaleTimeString('en-US', { 
                          hour: '2-digit', 
                          minute: '2-digit'
                        })}
                      </div>
                    </td>
                    <td className="table-cell">
                      {request.updatedAt ? (
                        <div className="date-primary">
                          {new Date(request.updatedAt).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric', 
                            year: 'numeric'
                          })}
                        </div>
                      ) : 'N/A'}
                    </td>
                    <td className="table-cell text-center">
                      <button 
                        onClick={() => setConfirmDeleteSender({show: true, id: request.id, senderId: request.senderId})}
                        title="Delete"
                        style={{ width: '32px', height: '32px', borderRadius: '8px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fee2e2', color: '#dc2626', margin: '0 auto' }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              {senderRequests.length > 0 && (
                <tfoot>
                  <tr>
                    <td colSpan={5} className="pagination-cell">
                      <div className="pagination-container">
                        <button 
                          className="btn btn-secondary btn-sm"
                          onClick={() => setSendersPage(prev => Math.max(1, prev - 1))}
                          disabled={sendersPage === 1}
                        >
                          ← Previous
                        </button>
                        <span className="pagination-info">
                          Page {sendersPage} of {Math.ceil(senderRequests.length / itemsPerPage)}
                        </span>
                        <button 
                          className="btn btn-secondary btn-sm"
                          onClick={() => setSendersPage(prev => Math.min(Math.ceil(senderRequests.length / itemsPerPage), prev + 1))}
                          disabled={sendersPage === Math.ceil(senderRequests.length / itemsPerPage)}
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

      {showCreateSenderModal && (
        <div className="modal-overlay" onClick={() => setShowCreateSenderModal(false)}>
          <div className="create-wallet-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Request Sender ID</h2>
              <button className="modal-close" onClick={() => setShowCreateSenderModal(false)}>×</button>
            </div>
            <div className="modal-content">
              <div className="currency-selection">
                <label className="currency-label">Sender ID</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Enter sender ID (e.g., MYCOMPANY)"
                  value={newSenderId}
                  onChange={(e) => setNewSenderId(e.target.value.toUpperCase())}
                  maxLength={11}
                />
                <p style={{ fontSize: '12px', color: 'var(--table-text-muted)', marginTop: '8px' }}>
                  Maximum 11 characters. Only letters and numbers allowed.
                </p>
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowCreateSenderModal(false)}>Cancel</button>
              <button 
                className="btn btn-primary" 
                onClick={handleCreateSender}
                disabled={!newSenderId.trim() || creatingSender}
              >
                {creatingSender ? 'Submitting...' : 'Submit Request'}
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmDeleteSender.show && (
        <div className="modal-overlay" onClick={() => setConfirmDeleteSender({show: false, id: '', senderId: ''})}>
          <div className="delete-modal-content" onClick={(e) => e.stopPropagation()} style={{ position: 'relative', background: 'white', borderRadius: '20px', padding: '2rem', textAlign: 'center', maxWidth: '400px', width: '90%' }}>
            <div style={{ width: '80px', height: '80px', background: '#fee2e2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: '#dc2626', border: '4px solid #fca5a5' }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
              </svg>
            </div>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.5rem', fontWeight: '700', color: '#1f2937' }}>
              Delete Sender Request
            </h3>
            <p style={{ margin: '0 0 1rem 0', color: '#6b7280', fontSize: '1rem' }}>
              Are you sure you want to delete <strong>{confirmDeleteSender.senderId}</strong>?
            </p>
            <p style={{ color: '#dc2626', fontWeight: '600', fontSize: '0.875rem', margin: '0 0 2rem 0' }}>
              This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
              <button 
                onClick={() => setConfirmDeleteSender({show: false, id: '', senderId: ''})}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button 
                onClick={handleDeleteSender}
                className="btn btn-primary"
                style={{ background: '#dc2626' }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'overview': return renderOverview();
      case 'wallet': return renderWallet();
      case 'api-keys': return renderApiKeys();
      case 'sender-ids': return renderSenders();
      case 'kyc': return <KycDocuments />;
      case 'profile': return renderProfile();
      default: 
        return (
          <div className="section-content">
            <div className="card">
              <div className="card-content">
                <div className="empty-state">
                  <div className="empty-icon">🚧</div>
                  <h4>Coming Soon</h4>
                  <p>This feature is under development</p>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="dashboard" style={{ alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="loading-spinner" style={{ margin: '0 auto 1rem' }}></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`dashboard ${isDarkMode ? 'dark' : 'light'}`}>
      {showWelcomeGuide && (
        <div className="modal-overlay" style={{ background: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(4px)', zIndex: 9999 }} onClick={() => setShowWelcomeGuide(false)}>
          <div className="create-wallet-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px', width: '90%' }}>
            <div className="modal-header" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', padding: '32px 24px', position: 'relative' }}>
              <button onClick={() => setShowWelcomeGuide(false)} style={{ position: 'absolute', top: '16px', right: '16px', width: '32px', height: '32px', borderRadius: '50%', border: 'none', background: 'rgba(255, 255, 255, 0.2)', color: 'white', fontSize: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '64px', marginBottom: '16px' }}>👋</div>
                <h2 className="modal-title" style={{ color: 'white', margin: '0 0 8px 0', fontSize: '28px' }}>Welcome to Qode SMS!</h2>
                <p style={{ margin: '0', fontSize: '14px', opacity: '0.9' }}>Complete your onboarding to start sending SMS</p>
              </div>
            </div>
            <div className="modal-content" style={{ padding: '32px 24px' }}>
              <div style={{ background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)', padding: '24px', borderRadius: '12px', border: '2px solid rgba(102, 126, 234, 0.2)', marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                  <div style={{ fontSize: '32px', flexShrink: 0 }}>📋</div>
                  <div>
                    <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: '700', color: 'var(--table-text-primary)' }}>Complete Your Profile</h3>
                    <p style={{ margin: '0 0 12px 0', fontSize: '14px', color: 'var(--table-text-secondary)', lineHeight: '1.6' }}>Go to your <strong>Profile</strong> section and fill in all required fields including SMS preferences.</p>
                  </div>
                </div>
              </div>
              <div style={{ background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)', padding: '24px', borderRadius: '12px', border: '2px solid rgba(102, 126, 234, 0.2)' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                  <div style={{ fontSize: '32px', flexShrink: 0 }}>📄</div>
                  <div>
                    <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: '700', color: 'var(--table-text-primary)' }}>Upload KYC Documents</h3>
                    <p style={{ margin: '0', fontSize: '14px', color: 'var(--table-text-secondary)', lineHeight: '1.6' }}>Upload required verification documents. Once approved, you can finalize and lock your profile to start sending SMS.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-actions" style={{ padding: '20px 24px', borderTop: '1px solid var(--table-border)' }}>
              <button 
                onClick={() => { 
                  setShowWelcomeGuide(false);
                  setActiveSection('profile');
                }}
                className="btn btn-primary"
                style={{ width: '100%', padding: '14px', fontSize: '15px', fontWeight: '600' }}
              >
                Go to Profile →
              </button>
            </div>
          </div>
        </div>
      )}
      
      <button className="mobile-menu-toggle" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
        </svg>
      </button>
      <div className={`sidebar ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo">
            <div className="logo-icon">Q</div>
            <h1>Qode SMS</h1>
          </div>
          
          <div className="user-profile" onClick={() => setActiveSection('profile')}>
            <div className="user-avatar">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </div>
            <div className="user-info">
              <span className="user-name">{user?.firstName} {user?.lastName}</span>
              <span className="user-email">{user?.email}</span>
            </div>
          </div>
        </div>
        
        <nav className="sidebar-nav">
          {menuItems.map(item => (
            <button
              key={item.id}
              className={`nav-item ${activeSection === item.id ? 'active' : ''}`}
              onClick={() => { setActiveSection(item.id); setIsMobileMenuOpen(false); }}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="theme-toggle-sidebar" onClick={toggleTheme}>
            {isDarkMode ? '☀️' : '🌙'}
            <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
          <button onClick={handleLogout} className="btn-logout">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16 17v-3H9v-4h7V7l5 5-5 5M14 2a2 2 0 012 2v2h-2V4H4v16h10v-2h2v2a2 2 0 01-2 2H4a2 2 0 01-2-2V4a2 2 0 012-2h10z"/>
            </svg>
            Logout
          </button>
        </div>
      </div>

      <main className="main-content">
        {renderContent()}
      </main>
    </div>
  );
};

export default Dashboard;