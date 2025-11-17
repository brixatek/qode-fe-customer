import React, { useState, useEffect } from 'react';
import { CustomerCreateDto, Country, CountryPhoneCode, Role, Sector, Referral } from '../types/api';
import { customerService, referenceDataService } from '../services/api.ts';
import './OnboardingForm.css';

const OnboardingForm: React.FC = () => {
  const [formData, setFormData] = useState<CustomerCreateDto>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    mobileNo: '',
    company: '',
    companyWebsite: '',
    companySize: 0,
    businessAddress: '',
    businessPhone: '',
    businessDescription: '',
    primaryContactName: '',
    primaryContactEmail: '',
    primaryContactRole: '',
    countryId: '',
    roleId: '',
    otherRoleSpecification: '',
    sectorId: '',
    otherSectorSpecification: '',
    referralId: '',
    otherReferralSpecification: '',
    countryPhoneCodeId: '',
    recieveNewsletter: false,
    acceptPrivacyPolicy: false,
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [countries, setCountries] = useState<Country[]>([]);
  const [phoneCodes, setPhoneCodes] = useState<CountryPhoneCode[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    loadReferenceData();
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const loadReferenceData = async () => {
    try {
      console.log('Loading reference data...');
      const [countriesRes, phoneCodesRes, rolesRes, sectorsRes, referralsRes] = await Promise.all([
        referenceDataService.getCountries(),
        referenceDataService.getCountryPhoneCodes(),
        referenceDataService.getRoles(),
        referenceDataService.getSectors(),
        referenceDataService.getReferrals(),
      ]);

      console.log('Countries response:', countriesRes);
      console.log('Phone codes response:', phoneCodesRes);
      
      const countriesData = countriesRes?.data?.data?.data || [];
      const phoneCodesData = phoneCodesRes?.data?.data?.data || [];
      const rolesData = rolesRes?.data?.data?.data || [];
      const sectorsData = sectorsRes?.data?.data?.data || [];
      const referralsData = referralsRes?.data?.data?.data || [];
      
      console.log('Setting countries:', countriesData);
      console.log('Setting phone codes:', phoneCodesData);
      
      setCountries(countriesData);
      setPhoneCodes(phoneCodesData);
      setRoles(rolesData);
      setSectors(sectorsData);
      setReferrals(referralsData);
    } catch (error) {
      console.error('Failed to load reference data:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    let updatedFormData = {
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
              name === 'companySize' ? parseInt(value) : value
    };
    
    // Auto-populate phone code when country is selected
    if (name === 'countryId' && value && Array.isArray(phoneCodes)) {
      const phoneCode = phoneCodes.find(code => code.countryId === value);
      if (phoneCode) {
        updatedFormData.countryPhoneCodeId = phoneCode.id;
      }
    }
    
    setFormData(updatedFormData);
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateStep = (currentStep: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 1) {
      if (!formData.firstName) newErrors.firstName = 'First name is required';
      if (!formData.lastName) newErrors.lastName = 'Last name is required';
      if (!formData.email) newErrors.email = 'Email is required';
      if (!formData.password || formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
      if (!confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
      if (formData.password && confirmPassword && formData.password !== confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    if (currentStep === 2) {
      if (!formData.company) newErrors.company = 'Company is required';
      if (!formData.businessAddress) newErrors.businessAddress = 'Business address is required';
      if (!formData.businessPhone) newErrors.businessPhone = 'Business phone is required';
      if (!formData.businessDescription) newErrors.businessDescription = 'Business description is required';
      if (!formData.primaryContactName) newErrors.primaryContactName = 'Primary contact name is required';
      if (!formData.primaryContactEmail) newErrors.primaryContactEmail = 'Primary contact email is required';
      if (!formData.primaryContactRole) newErrors.primaryContactRole = 'Primary contact role is required';
      if (!formData.mobileNo) newErrors.mobileNo = 'Mobile number is required';
      if (!formData.countryId) newErrors.countryId = 'Country is required';
      if (!formData.countryPhoneCodeId) newErrors.countryPhoneCodeId = 'Phone code is required';
    }

    if (currentStep === 3) {
      if (!formData.roleId) newErrors.roleId = 'Role is required';
      if (!formData.sectorId) newErrors.sectorId = 'Sector is required';
      if (!formData.referralId) newErrors.referralId = 'Referral source is required';
      
      // Check if "Other" is selected and specification is required
      const selectedRole = roles.find(r => r.id === formData.roleId);
      if (selectedRole?.name === 'Other' && !formData.otherRoleSpecification) {
        newErrors.otherRoleSpecification = 'Please specify your role';
      }
      
      const selectedSector = sectors.find(s => s.id === formData.sectorId);
      if (selectedSector?.name === 'Other' && !formData.otherSectorSpecification) {
        newErrors.otherSectorSpecification = 'Please specify your sector';
      }
      
      const selectedReferral = referrals.find(r => r.id === formData.referralId);
      if (selectedReferral?.name === 'Other' && !formData.otherReferralSpecification) {
        newErrors.otherReferralSpecification = 'Please specify how you heard about us';
      }
      
      if (!formData.acceptPrivacyPolicy) newErrors.acceptPrivacyPolicy = 'You must accept the privacy policy';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      const nextStep = step + 1;
      setStep(nextStep);
      
      // Load reference data when entering step 2 or 3
      if (nextStep === 2 && (countries.length === 0 || phoneCodes.length === 0)) {
        loadReferenceData();
      }
      if (nextStep === 3 && (roles.length === 0 || sectors.length === 0 || referrals.length === 0)) {
        loadReferenceData();
      }
    }
  };

  const handlePrevious = () => {
    setStep(prev => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(3)) return;

    setLoading(true);
    try {
      await customerService.create(formData);
      setStep(4); // Success step
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
      setErrors({ submit: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="step-content-modern">
      <div className="step-header">
        <h2 className="step-title">Personal Information</h2>
      </div>
      
      <div className="form-row-modern">
        <div className="form-group-modern">
          <label className="form-label-modern">First Name *</label>
          <div className="input-container-modern">
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              className={`input-modern ${errors.firstName ? 'error' : ''}`}
            />
            <div className="input-glow"></div>
          </div>
          {errors.firstName && <span className="error-text-modern">{errors.firstName}</span>}
        </div>
        <div className="form-group-modern">
          <label className="form-label-modern">Last Name *</label>
          <div className="input-container-modern">
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              className={`input-modern ${errors.lastName ? 'error' : ''}`}
            />
            <div className="input-glow"></div>
          </div>
          {errors.lastName && <span className="error-text-modern">{errors.lastName}</span>}
        </div>
      </div>
      
      <div className="form-group-modern">
        <label className="form-label-modern">Email Address *</label>
        <div className="input-container-modern">
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className={`input-modern ${errors.email ? 'error' : ''}`}
          />
          <div className="input-glow"></div>
        </div>
        {errors.email && <span className="error-text-modern">{errors.email}</span>}
      </div>
      
      <div className="form-group-modern">
        <label className="form-label-modern">Password *</label>
        <div className="input-container-modern">
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className={`input-modern ${errors.password ? 'error' : ''}`}
          />
          <button
            type="button"
            className="password-toggle-modern"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? '👁️' : '👁️🗨️'}
          </button>
          <div className="input-glow"></div>
        </div>
        {errors.password && <span className="error-text-modern">{errors.password}</span>}
      </div>
      
      <div className="form-group-modern">
        <label className="form-label-modern">Confirm Password *</label>
        <div className="input-container-modern">
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            name="confirmPassword"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              if (errors.confirmPassword) {
                setErrors(prev => ({ ...prev, confirmPassword: '' }));
              }
            }}
            className={`input-modern ${errors.confirmPassword ? 'error' : ''}`}
          />
          <button
            type="button"
            className="password-toggle-modern"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? '👁️' : '👁️🗨️'}
          </button>
          <div className="input-glow"></div>
        </div>
        {errors.confirmPassword && <span className="error-text-modern">{errors.confirmPassword}</span>}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="step-content-modern">
      <div className="step-header">
        <h2 className="step-title">Company & Contact</h2>
      </div>
      <div className="form-row-modern">
        <div className="form-group-modern">
          <label className="form-label-modern">Company Name *</label>
          <div className="input-container-modern">
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleInputChange}
              className={`input-modern ${errors.company ? 'error' : ''}`}
            />
            <div className="input-glow"></div>
          </div>
          {errors.company && <span className="error-text-modern">{errors.company}</span>}
        </div>
        <div className="form-group-modern">
          <label className="form-label-modern">Company Website</label>
          <div className="input-container-modern">
            <input
              type="url"
              name="companyWebsite"
              value={formData.companyWebsite}
              onChange={handleInputChange}
              placeholder="https://company.com"
              className="input-modern"
            />
            <div className="input-glow"></div>
          </div>
        </div>
      </div>
      <div className="form-group-modern">
        <label className="form-label-modern">Company Size *</label>
        <div className="input-container-modern">
          <select
            name="companySize"
            value={formData.companySize}
            onChange={handleInputChange}
            className="input-modern"
          >
            <option value={0}>1-10 employees</option>
            <option value={1}>11-50 employees</option>
            <option value={2}>51-200 employees</option>
            <option value={3}>201-500 employees</option>
            <option value={4}>500+ employees</option>
          </select>
          <div className="input-glow"></div>
        </div>
      </div>
      <div className="form-group-modern">
        <label className="form-label-modern">Business Address *</label>
        <div className="input-container-modern">
          <textarea
            name="businessAddress"
            value={formData.businessAddress}
            onChange={handleInputChange}
            placeholder="Business address"
            className={`input-modern ${errors.businessAddress ? 'error' : ''}`}
            rows={3}
          />
          <div className="input-glow"></div>
        </div>
        {errors.businessAddress && <span className="error-text-modern">{errors.businessAddress}</span>}
      </div>
      <div className="form-group-modern">
        <label className="form-label-modern">Business Description *</label>
        <div className="input-container-modern">
          <textarea
            name="businessDescription"
            value={formData.businessDescription}
            onChange={handleInputChange}
            placeholder="Describe your business activities"
            className={`input-modern ${errors.businessDescription ? 'error' : ''}`}
            rows={3}
          />
          <div className="input-glow"></div>
        </div>
        {errors.businessDescription && <span className="error-text-modern">{errors.businessDescription}</span>}
      </div>
      <div className="form-row-modern">
        <div className="form-group-modern">
          <label className="form-label-modern">Business Phone *</label>
          <div className="input-container-modern">
            <input
              type="tel"
              name="businessPhone"
              value={formData.businessPhone}
              onChange={handleInputChange}
              placeholder="Business phone"
              className={`input-modern ${errors.businessPhone ? 'error' : ''}`}
            />
            <div className="input-glow"></div>
          </div>
          {errors.businessPhone && <span className="error-text-modern">{errors.businessPhone}</span>}
        </div>
        <div className="form-group-modern">
          <label className="form-label-modern">Mobile Number *</label>
          <div className="input-container-modern">
            <input
              type="tel"
              name="mobileNo"
              value={formData.mobileNo}
              onChange={handleInputChange}
              className={`input-modern ${errors.mobileNo ? 'error' : ''}`}
            />
            <div className="input-glow"></div>
          </div>
          {errors.mobileNo && <span className="error-text-modern">{errors.mobileNo}</span>}
        </div>
      </div>
      <div className="form-row-modern">
        <div className="form-group-modern">
          <label className="form-label-modern">Country *</label>
          <div className="input-container-modern">
            <select
              name="countryId"
              value={formData.countryId}
              onChange={handleInputChange}
              className={`input-modern ${errors.countryId ? 'error' : ''}`}
            >
              <option value="">Select Country</option>
              {Array.isArray(countries) && countries.map(country => (
                <option key={country.id} value={country.id}>{country.name}</option>
              ))}
            </select>
            <div className="input-glow"></div>
          </div>
          {errors.countryId && <span className="error-text-modern">{errors.countryId}</span>}
        </div>
        <div className="form-group-modern">
          <label className="form-label-modern">Phone Code *</label>
          <div className="input-container-modern">
            <input
              type="text"
              name="countryPhoneCodeId"
              value={Array.isArray(phoneCodes) ? phoneCodes.find(code => code.id === formData.countryPhoneCodeId)?.phoneCode || '' : ''}
              readOnly
              className={`input-modern readonly ${errors.countryPhoneCodeId ? 'error' : ''}`}
              placeholder="Select country first"
            />
            <div className="input-glow"></div>
          </div>
          {errors.countryPhoneCodeId && <span className="error-text-modern">{errors.countryPhoneCodeId}</span>}
        </div>
      </div>
      <h3 className="step-title" style={{fontSize: '20px', marginTop: '32px', marginBottom: '24px'}}>Primary Contact</h3>
      <div className="form-row-modern">
        <div className="form-group-modern">
          <label className="form-label-modern">Contact Name *</label>
          <div className="input-container-modern">
            <input
              type="text"
              name="primaryContactName"
              value={formData.primaryContactName}
              onChange={handleInputChange}
              placeholder="Primary contact name"
              className={`input-modern ${errors.primaryContactName ? 'error' : ''}`}
            />
            <div className="input-glow"></div>
          </div>
          {errors.primaryContactName && <span className="error-text-modern">{errors.primaryContactName}</span>}
        </div>
        <div className="form-group-modern">
          <label className="form-label-modern">Contact Role *</label>
          <div className="input-container-modern">
            <input
              type="text"
              name="primaryContactRole"
              value={formData.primaryContactRole}
              onChange={handleInputChange}
              placeholder="Primary contact role"
              className={`input-modern ${errors.primaryContactRole ? 'error' : ''}`}
            />
            <div className="input-glow"></div>
          </div>
          {errors.primaryContactRole && <span className="error-text-modern">{errors.primaryContactRole}</span>}
        </div>
      </div>
      <div className="form-group-modern">
        <label className="form-label-modern">Contact Email *</label>
        <div className="input-container-modern">
          <input
            type="email"
            name="primaryContactEmail"
            value={formData.primaryContactEmail}
            onChange={handleInputChange}
            placeholder="Primary contact email"
            className={`input-modern ${errors.primaryContactEmail ? 'error' : ''}`}
          />
          <div className="input-glow"></div>
        </div>
        {errors.primaryContactEmail && <span className="error-text-modern">{errors.primaryContactEmail}</span>}
      </div>
    </div>
  );

  const renderStep3 = () => {
    const selectedRole = roles.find(r => r.id === formData.roleId);
    const selectedSector = sectors.find(s => s.id === formData.sectorId);
    const selectedReferral = referrals.find(r => r.id === formData.referralId);
    
    return (
      <div className="step-content-modern">
        <div className="step-header">
          <h2 className="step-title">Business Details</h2>
        </div>
        <div className="form-group-modern">
          <label className="form-label-modern">Role *</label>
          <div className="input-container-modern">
            <select
              name="roleId"
              value={formData.roleId}
              onChange={handleInputChange}
              className={`input-modern ${errors.roleId ? 'error' : ''}`}
            >
              <option value="">Select Role</option>
              {Array.isArray(roles) && roles.map(role => (
                <option key={role.id} value={role.id}>{role.name}</option>
              ))}
            </select>
            <div className="input-glow"></div>
          </div>
          {errors.roleId && <span className="error-text-modern">{errors.roleId}</span>}
        </div>
        {selectedRole?.name === 'Other' && (
          <div className="form-group-modern">
            <label className="form-label-modern">Please specify your role *</label>
            <div className="input-container-modern">
              <input
                type="text"
                name="otherRoleSpecification"
                value={formData.otherRoleSpecification}
                onChange={handleInputChange}
                placeholder="Please specify your role"
                className={`input-modern ${errors.otherRoleSpecification ? 'error' : ''}`}
              />
              <div className="input-glow"></div>
            </div>
            {errors.otherRoleSpecification && <span className="error-text-modern">{errors.otherRoleSpecification}</span>}
          </div>
        )}
        <div className="form-group-modern">
          <label className="form-label-modern">Sector *</label>
          <div className="input-container-modern">
            <select
              name="sectorId"
              value={formData.sectorId}
              onChange={handleInputChange}
              className={`input-modern ${errors.sectorId ? 'error' : ''}`}
            >
              <option value="">Select Sector</option>
              {Array.isArray(sectors) && sectors.map(sector => (
                <option key={sector.id} value={sector.id}>{sector.name}</option>
              ))}
            </select>
            <div className="input-glow"></div>
          </div>
          {errors.sectorId && <span className="error-text-modern">{errors.sectorId}</span>}
        </div>
        {selectedSector?.name === 'Other' && (
          <div className="form-group-modern">
            <label className="form-label-modern">Please specify your sector *</label>
            <div className="input-container-modern">
              <input
                type="text"
                name="otherSectorSpecification"
                value={formData.otherSectorSpecification}
                onChange={handleInputChange}
                placeholder="Please specify your sector"
                className={`input-modern ${errors.otherSectorSpecification ? 'error' : ''}`}
              />
              <div className="input-glow"></div>
            </div>
            {errors.otherSectorSpecification && <span className="error-text-modern">{errors.otherSectorSpecification}</span>}
          </div>
        )}
        <div className="form-group-modern">
          <label className="form-label-modern">How did you hear about us? *</label>
          <div className="input-container-modern">
            <select
              name="referralId"
              value={formData.referralId}
              onChange={handleInputChange}
              className={`input-modern ${errors.referralId ? 'error' : ''}`}
            >
              <option value="">Select Source</option>
              {Array.isArray(referrals) && referrals.map(referral => (
                <option key={referral.id} value={referral.id}>{referral.name}</option>
              ))}
            </select>
            <div className="input-glow"></div>
          </div>
          {errors.referralId && <span className="error-text-modern">{errors.referralId}</span>}
        </div>
        {selectedReferral?.name === 'Other' && (
          <div className="form-group-modern">
            <label className="form-label-modern">Please specify how you heard about us *</label>
            <div className="input-container-modern">
              <input
                type="text"
                name="otherReferralSpecification"
                value={formData.otherReferralSpecification}
                onChange={handleInputChange}
                placeholder="Please specify how you heard about us"
                className={`input-modern ${errors.otherReferralSpecification ? 'error' : ''}`}
              />
              <div className="input-glow"></div>
            </div>
            {errors.otherReferralSpecification && <span className="error-text-modern">{errors.otherReferralSpecification}</span>}
          </div>
        )}
        <div className="checkbox-group-modern">
          <label className="checkbox-label-modern">
            <input
              type="checkbox"
              name="recieveNewsletter"
              checked={formData.recieveNewsletter}
              onChange={handleInputChange}
            />
            <span className="checkbox-text">I would like to receive newsletters and updates</span>
          </label>
        </div>
        <div className="checkbox-group-modern">
          <label className="checkbox-label-modern">
            <input
              type="checkbox"
              name="acceptPrivacyPolicy"
              checked={formData.acceptPrivacyPolicy}
              onChange={handleInputChange}
            />
            <span className="checkbox-text">I accept the Privacy Policy and Terms of Service *</span>
          </label>
          {errors.acceptPrivacyPolicy && <span className="error-text-modern">{errors.acceptPrivacyPolicy}</span>}
        </div>
      </div>
    );
  };

  const renderStep4 = () => (
    <div className="step-content-modern success">
      <div className="success-animation">
        <div className="success-icon-modern">✓</div>
        <div className="success-particles">
          <div className="particle particle-1"></div>
          <div className="particle particle-2"></div>
          <div className="particle particle-3"></div>
          <div className="particle particle-4"></div>
        </div>
      </div>
      <h2 className="success-title">Welcome to Qode! 🎉</h2>
      <p className="success-description">
        Your account has been created successfully. We've sent a verification email to your inbox.
      </p>
      <div className="success-actions">
        <button 
          className="btn-success-primary" 
          onClick={() => window.location.href = '/?login=true'}
        >
          <span>Continue to Login</span>
          <div className="btn-shine"></div>
        </button>
      </div>
    </div>
  );

  return (
    <div className="onboarding-modern">
      {/* Background Elements */}
      <div className="onboarding-bg-elements">
        <div className="floating-orb orb-1"></div>
        <div className="floating-orb orb-2"></div>
        <div className="floating-orb orb-3"></div>
      </div>

      {/* Floating Elements */}
      <div className="floating-elements">
        <div 
          className="element-card card-step" 
          style={{ transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)` }}
        >
          <div className="card-icon">🚀</div>
          <div className="card-text">Step {step} of 3</div>
        </div>
        <div 
          className="element-card card-progress" 
          style={{ transform: `translate(${mousePosition.x * -0.015}px, ${mousePosition.y * 0.025}px)` }}
        >
          <div className="card-icon">🎯</div>
          <div className="card-text">{Math.round((step / 4) * 100)}% Complete</div>
        </div>
      </div>

      <div className="onboarding-container-modern">
        <div className="onboarding-card-modern">
          {/* Logo */}
          <div className="logo-section">
            <div className="logo-modern">
              <div className="logo-icon-modern">
                <div className="logo-gradient">Q</div>
                <div className="logo-pulse"></div>
              </div>
              <span className="logo-text-modern">Qode</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="progress-bar-modern">
            <div className="progress-steps-modern">
              {[1, 2, 3].map(num => (
                <div key={num} className={`step-modern ${step >= num ? 'active' : ''} ${step > num ? 'completed' : ''}`}>
                  <div className="step-circle">
                    {step > num ? '✓' : num}
                  </div>
                  <div className="step-label">
                    {num === 1 ? 'Personal' : num === 2 ? 'Company' : 'Business'}
                  </div>
                </div>
              ))}
            </div>
            <div className="progress-line-modern" style={{ width: `${((step - 1) / 2) * 100}%` }}></div>
          </div>

          <form onSubmit={handleSubmit} className="onboarding-form-modern">
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
            {step === 4 && renderStep4()}

            {step < 4 && (
              <div className="form-actions-modern">
                {step > 1 && (
                  <button type="button" className="btn-secondary-modern" onClick={handlePrevious}>
                    <span>← Previous</span>
                  </button>
                )}
                {step < 3 ? (
                  <button type="button" className="btn-primary-modern" onClick={handleNext}>
                    <span>Next →</span>
                    <div className="btn-shine"></div>
                  </button>
                ) : (
                  <button type="submit" className="btn-primary-modern" disabled={loading}>
                    <span>{loading ? 'Creating Account...' : 'Create Account 🎉'}</span>
                    {!loading && <div className="btn-shine"></div>}
                    {loading && <div className="btn-loading"></div>}
                  </button>
                )}
              </div>
            )}

            {errors.submit && (
              <div className="error-modern">
                <div className="error-icon">⚠️</div>
                <span>{errors.submit}</span>
              </div>
            )}
          </form>

          {step < 4 && (
            <div className="onboarding-footer-modern">
              <div className="divider-modern">
                <span>Already have an account?</span>
              </div>
              <button 
                type="button" 
                className="btn-login-link" 
                onClick={() => window.location.href = '/?login=true'}
              >
                <span>Sign In</span>
                <div className="link-arrow">→</div>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingForm;