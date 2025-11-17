export interface CustomerCreateDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  mobileNo: string;
  company: string;
  companyWebsite: string;
  companySize: number;
  businessAddress: string;
  businessPhone: string;
  businessDescription: string;
  primaryContactName: string;
  primaryContactEmail: string;
  primaryContactRole: string;
  countryId: string;
  roleId: string;
  otherRoleSpecification: string;
  sectorId: string;
  otherSectorSpecification: string;
  referralId: string;
  otherReferralSpecification: string;
  countryPhoneCodeId: string;
  recieveNewsletter: boolean;
  acceptPrivacyPolicy: boolean;
}

export interface Country {
  id: string;
  name: string;
}

export interface CountryPhoneCode {
  id: string;
  countryId: string;
  phoneCode: string;
}

export interface Role {
  id: string;
  name: string;
}

export interface Sector {
  id: string;
  name: string;
}

export interface Referral {
  id: string;
  name: string;
}

export interface VerifyEmailDto {
  token: string;
  email: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  data: {
    accessToken: string;
    refreshToken: string;
    sessionId: string;
    expiresAt: string;
  };
  message: string;
  success: boolean;
  statusCode: number;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface WalletResponse {
  id: string;
  customerId: string;
  balance: number;
  currency: string;
  status: WalletStatus;
  activatedAt: string | null;
  virtualAccountNumber: string;
  bankName: string;
  accountName: string;
  createdAt: string;
}

export interface WalletTransactionResponse {
  id: string;
  amount: number;
  type: TransactionType;
  description: string;
  reference: string | null;
  balanceAfter: number;
  createdAt: string;
  status?: string;
}

export enum WalletStatus {
  Inactive = 0,
  Active = 1,
  Suspended = 2
}

export enum TransactionType {
  Credit = 0,
  Debit = 1
}

export interface Campaign {
  id: string;
  name: string;
  status: 'pending' | 'in-progress' | 'finished';
  contactList: string;
  createdAt: string;
  delivered: number;
  failed: number;
}

export interface BusinessInformation {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  mobileNo: string;
  company: string;
  companyWebsite: string;
  companySize: number;
  businessDescription: string;
  businessAddress: string;
  businessPhone: string;
  primaryContactName: string;
  primaryContactEmail: string;
  primaryContactRole: string;
  countryName: string;
  roleName: string;
  sectorName: string;
  interest: string;
  sendingFrequency: string;
  sendingVolume: string;
  sendingType: string;
  recieveNewsletter: boolean;
  acceptPrivacyPolicy: boolean;
  createdAt: string;
}

export interface BusinessUpdateDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  mobileNo: string;
  company: string;
  businessDescription: string;
  businessAddress: string;
  businessPhone: string;
  primaryContactName: string;
  primaryContactEmail: string;
  primaryContactRole: string;
  interest: string;
  sendingFrequency: string;
  sendingVolume: string;
  sendingType: string;
  countryId?: string;
  roleId?: string;
  sectorId?: string;
  referralId?: string;
  countryPhoneCodeId?: string;
  recieveNewsletter: boolean;
  acceptPrivacyPolicy: boolean;
  customerAccountStatus: number;
}