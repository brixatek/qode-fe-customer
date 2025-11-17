# Qode Customer Onboarding Frontend

A beautiful and interactive customer onboarding frontend built with React and TypeScript, featuring a multi-step registration wizard with modern UI/UX design.

## Features

- **Multi-step Registration Wizard**: 3-step onboarding process with progress tracking
- **Beautiful UI**: Modern design with Poppins font and gradient backgrounds
- **Form Validation**: Real-time validation with error handling
- **Responsive Design**: Mobile-friendly interface
- **API Integration**: Connected to Qode onboarding API endpoints
- **Email Verification**: Built-in email verification flow
- **Login System**: Secure authentication system
- **KYC Document Management**: Upload, view, and manage KYC documents
- **Admin Dashboard**: Complete backoffice management system

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
├── components/          # React components
│   ├── OnboardingForm.tsx
│   ├── OnboardingForm.css
│   ├── LoginForm.tsx
│   ├── LoginForm.css
│   ├── EmailVerification.tsx
│   └── EmailVerification.css
├── services/           # API service layer
│   └── api.ts
├── types/             # TypeScript type definitions
│   └── api.ts
├── App.tsx            # Main application component
├── App.css
├── index.tsx          # Application entry point
└── index.css          # Global styles
```

## Registration Flow

1. **Step 1: Personal Information**
   - First Name, Last Name
   - Email Address
   - Password

2. **Step 2: Company & Contact**
   - Company Name
   - Country Selection
   - Phone Code & Mobile Number

3. **Step 3: Business Details**
   - Role Selection
   - Business Sector
   - Referral Source
   - Privacy Policy Acceptance

4. **Step 4: Success & Email Verification**
   - Registration confirmation
   - Email verification prompt

## Features

- **Interactive Progress Bar**: Visual progress tracking through registration steps
- **Real-time Validation**: Immediate feedback on form inputs
- **Responsive Design**: Optimized for desktop and mobile devices
- **Loading States**: User feedback during API calls
- **Error Handling**: Comprehensive error messages and recovery options
- **Modern Animations**: Smooth transitions and hover effects

## API Configuration

The application connects to the Qode onboarding API at:
```
Base URL: https://onboarding.zephapay.com/api/v1
```

## Build for Production

```bash
npm run build
```

This builds the app for production to the `build` folder.