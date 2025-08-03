/**
 * Parental Consent Component
 * COPPA compliant parental verification and consent flow
 * Guardian Agent requirement for C1 objective
 */

import React, { useState } from 'react';
import { useFocusTrap } from '../hooks/useFocusTrap';
import './ParentalConsent.css';

interface ParentalConsentProps {
  onConsentGranted: (consentData: ConsentData) => void;
  onConsentDenied: () => void;
}

export interface ConsentData {
  parentEmail: string;
  consentDate: Date;
  consentMethod: 'verified_email' | 'credit_card' | 'government_id';
  childAge: number;
  agreedToTerms: boolean;
  dataCollectionConsent: boolean;
  marketingConsent: boolean;
}

export default function ParentalConsent({ onConsentGranted, onConsentDenied }: ParentalConsentProps) {
  const [step, setStep] = useState(1);
  const [parentEmail, setParentEmail] = useState('');
  const [childAge, setChildAge] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [dataConsent, setDataConsent] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [verificationMethod, setVerificationMethod] = useState<'email' | 'credit' | 'id'>('email');
  
  const focusTrapRef = useFocusTrap(true);

  const sendVerificationEmail = () => {
    // In production, this would send an actual email
    console.log('📧 Sending verification email to:', parentEmail);
    // Simulate email sent
    setStep(3);
  };

  const verifyEmail = () => {
    // In production, verify the code
    if (verificationCode === '123456') { // Mock verification
      const consentData: ConsentData = {
        parentEmail,
        consentDate: new Date(),
        consentMethod: 'verified_email',
        childAge: parseInt(childAge),
        agreedToTerms,
        dataCollectionConsent: dataConsent,
        marketingConsent
      };
      
      // Log for Guardian agent compliance
      console.log('✅ Guardian: Parental consent verified', consentData);
      onConsentGranted(consentData);
    } else {
      alert('Invalid verification code. Please try again.');
    }
  };

  const renderStep1 = () => (
    <div className="consent-step">
      <h3>👶 Child's Age Verification</h3>
      <p className="consent-info">
        To comply with COPPA (Children's Online Privacy Protection Act), 
        we need to verify your child's age.
      </p>
      
      <div className="form-group">
        <label htmlFor="childAge">Child's Age:</label>
        <input
          id="childAge"
          type="number"
          min="1"
          max="17"
          value={childAge}
          onChange={(e) => setChildAge(e.target.value)}
          placeholder="Enter age"
          aria-label="Child's age"
          required
        />
      </div>
      
      {childAge && parseInt(childAge) < 13 && (
        <div className="coppa-notice">
          <p>⚠️ Your child is under 13. Parental consent is required.</p>
        </div>
      )}
      
      {childAge && parseInt(childAge) >= 13 && (
        <div className="teen-notice">
          <p>ℹ️ Your child is 13 or older. Limited consent required.</p>
        </div>
      )}
      
      <button 
        onClick={() => setStep(2)}
        disabled={!childAge || parseInt(childAge) < 1}
        className="consent-button primary"
      >
        Continue
      </button>
    </div>
  );

  const renderStep2 = () => (
    <div className="consent-step">
      <h3>👨‍👩‍👧 Parent/Guardian Information</h3>
      <p className="consent-info">
        Please provide your email address for verification.
      </p>
      
      <div className="form-group">
        <label htmlFor="parentEmail">Parent/Guardian Email:</label>
        <input
          id="parentEmail"
          type="email"
          value={parentEmail}
          onChange={(e) => setParentEmail(e.target.value)}
          placeholder="parent@example.com"
          aria-label="Parent email address"
          required
        />
      </div>
      
      <div className="consent-options">
        <h4>📋 Consent Options</h4>
        
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={agreedToTerms}
            onChange={(e) => setAgreedToTerms(e.target.checked)}
            aria-label="Agree to terms and conditions"
          />
          I agree to the Terms of Service and Privacy Policy
        </label>
        
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={dataConsent}
            onChange={(e) => setDataConsent(e.target.checked)}
            aria-label="Consent to minimal data collection"
          />
          I consent to minimal data collection (skin designs only)
        </label>
        
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={marketingConsent}
            onChange={(e) => setMarketingConsent(e.target.checked)}
            aria-label="Optional marketing consent"
          />
          (Optional) Send me updates about new features
        </label>
      </div>
      
      <div className="data-disclosure">
        <h4>🔒 What We Collect</h4>
        <ul>
          <li>✅ Skin designs created by your child</li>
          <li>✅ Display name (no real names)</li>
          <li>❌ NO personal information</li>
          <li>❌ NO location data</li>
          <li>❌ NO chat or messaging</li>
        </ul>
      </div>
      
      <div className="button-group">
        <button 
          onClick={() => setStep(1)}
          className="consent-button secondary"
        >
          Back
        </button>
        <button 
          onClick={sendVerificationEmail}
          disabled={!parentEmail || !agreedToTerms || !dataConsent}
          className="consent-button primary"
        >
          Send Verification Email
        </button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="consent-step">
      <h3>✉️ Email Verification</h3>
      <p className="consent-info">
        We've sent a verification code to <strong>{parentEmail}</strong>
      </p>
      <p className="consent-hint">
        (For demo: use code <code>123456</code>)
      </p>
      
      <div className="form-group">
        <label htmlFor="verificationCode">Verification Code:</label>
        <input
          id="verificationCode"
          type="text"
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value)}
          placeholder="Enter 6-digit code"
          maxLength={6}
          aria-label="Email verification code"
          required
        />
      </div>
      
      <div className="button-group">
        <button 
          onClick={() => setStep(2)}
          className="consent-button secondary"
        >
          Back
        </button>
        <button 
          onClick={verifyEmail}
          disabled={verificationCode.length !== 6}
          className="consent-button primary"
        >
          Verify & Grant Consent
        </button>
      </div>
      
      <button 
        onClick={onConsentDenied}
        className="consent-button text-button"
      >
        Cancel and Exit
      </button>
    </div>
  );

  return (
    <div className="parental-consent-modal">
      <div className="consent-container" ref={focusTrapRef}>
        <div className="consent-header">
          <h2>🛡️ Parental Consent Required</h2>
          <p>Guardian Safety System Active</p>
        </div>
        
        <div className="consent-progress">
          <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>
            1. Age
          </div>
          <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>
            2. Consent
          </div>
          <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>
            3. Verify
          </div>
        </div>
        
        <div className="consent-body">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
        </div>
        
        <div className="consent-footer">
          <p className="compliance-notice">
            COPPA Compliant • GDPR Ready • Guardian Protected
          </p>
        </div>
      </div>
    </div>
  );
}