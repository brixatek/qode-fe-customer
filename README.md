# Qode Customer Onboarding Platform

A comprehensive customer onboarding and KYC management platform built with React and TypeScript. Features a modern landing page, multi-step registration wizard, customer dashboard with profile management, KYC document handling, and admin backoffice system.

## Features

### Customer Portal
- **Landing Page**: Modern hero section with features showcase and fixed navigation header
- **Multi-step Registration**: 3-step onboarding wizard with progress tracking
- **Email Verification**: Email verification flow with resend capability
- **Customer Login**: Secure authentication system
- **Customer Dashboard**: Complete profile management with editable fields
- **Profile Lock/Unlock**: Lock profile after document submission, unlock after approval
- **KYC Document Management**: Upload, view, download, and delete documents with status tracking
- **Document Status Tracking**: Pending, Approved, and Rejected status indicators
- **Dark/Light Mode**: Theme toggle with persistent preferences

### Admin Backoffice
- **Admin Login**: Separate authentication for administrators
- **Dashboard Metrics**: Overview of customer statistics and KYC reviews
- **Customer Management**: View and manage customer summaries
- **KYC Review Queue**: Review pending documents and approve/reject submissions
- **Sender ID Management**: Manage sender IDs for messaging services

## API Endpoints Integrated

### Customer Onboarding
- `POST /api/v1/customers` - Customer registration
- `POST /api/v1/identities/auth` - Customer login
- `POST /api/v1/email-verification/verify` - Email verification
- `POST /api/v1/email-verification/resend` - Resend verification

### KYC Document Management
- `POST /api/v1/kyc-documents/upload` - Upload single document
- `POST /api/v1/kyc-documents/upload-multiple` - Upload multiple documents
- `GET /api/v1/kyc-documents/customer/{customerId}` - Get customer documents
- `GET /api/v1/kyc-documents/{id}/download` - Download document
- `DELETE /api/v1/kyc-documents/{id}` - Delete document

### Admin/Backoffice
- `POST /api/v1/backoffice/auth/login` - Admin login
- `GET /api/v1/metrics/dashboard` - Dashboard metrics
- `GET /api/v1/backoffice/customer-summaries` - Customer summaries
- `GET /api/v1/backoffice/pending-reviews` - Pending KYC reviews

### Reference Data
- `GET /api/v1/countries` - Get countries list
- `GET /api/v1/countryphonecodes` - Get phone codes
- `GET /api/v1/roles` - Get user roles
- `GET /api/v1/sectors` - Get business sectors
- `GET /api/v1/referrals` - Get referral sources

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Project Structure

```
src/
├── components/
│   ├── LandingPage.tsx/css          # Landing page with hero section
│   ├── OnboardingForm.tsx/css       # Multi-step registration wizard
│   ├── LoginForm.tsx/css            # Customer login
│   ├── EmailVerification.tsx/css    # Email verification flow
│   ├── Dashboard.tsx/css            # Customer dashboard & profile
│   ├── KycDocuments.tsx/css         # KYC document management
│   ├── AdminApp.tsx                 # Admin application wrapper
│   ├── AdminLogin.tsx/css           # Admin authentication
│   ├── AdminDashboard.tsx/css       # Admin backoffice dashboard
│   ├── SenderIdList.tsx             # Sender ID management
│   ├── WalletModal.tsx/css          # Wallet management modal
│   ├── Logo.tsx/css                 # Reusable logo component
│   └── ErrorBoundary.tsx            # Error handling wrapper
├── services/
│   └── api.ts                       # API service layer
├── types/
│   └── api.ts                       # TypeScript type definitions
├── App.tsx                          # Main application router
├── App.css                          # Global application styles
├── index.tsx                        # Application entry point
└── index.css                        # Global CSS variables & styles
```

## User Flows

### Customer Registration & Onboarding
1. **Landing Page**: View features and navigate to registration
2. **Step 1 - Personal Info**: First name, last name, email, password
3. **Step 2 - Company & Contact**: Company name, country, phone number
4. **Step 3 - Business Details**: Role, sector, company size, referral source
5. **Email Verification**: Verify email address via verification link
6. **Dashboard Access**: Access customer dashboard after verification

### Profile & KYC Management
1. **View Profile**: See personal and company information
2. **Edit Profile**: Update editable fields (company website, size, etc.)
3. **Upload Documents**: Upload required KYC documents (passport, ID, business registration, etc.)
4. **Lock Profile**: Lock profile after document submission
5. **Document Review**: Wait for admin approval of documents
6. **Unlock Profile**: Unlock becomes available after document approval
7. **Manage Documents**: View, download, or delete non-approved documents

### Admin Workflow
1. **Admin Login**: Authenticate with admin credentials
2. **View Dashboard**: See metrics and pending reviews
3. **Review KYC Documents**: Approve or reject customer documents
4. **Manage Customers**: View customer summaries and details
5. **Manage Sender IDs**: Configure messaging sender IDs

## Key Features Implementation

- **Conditional Actions**: Delete button only shows for non-approved documents
- **Icon-based UI**: Eye icon for view, trash icon for delete
- **Profile Locking**: Unlock button disabled until documents are approved
- **Status Indicators**: Color-coded badges for document status (Pending/Approved/Rejected)
- **Theme Support**: Dark/light mode with CSS variables
- **Responsive Tables**: Mobile-friendly data tables with pagination
- **File Upload**: Drag-and-drop document upload with file type validation
- **Real-time Validation**: Form validation with immediate feedback
- **Error Handling**: Comprehensive error messages and recovery

## API Configuration

Base URL: `https://onboarding.zephapay.com/api/v1`

## Build for Production

```bash
npm run build
```

Builds the app for production to the `build` folder.