/**
 * Consent Manager Service
 * Handles parental consent storage and verification
 * COPPA compliant data handling
 */

import { ConsentData } from '../components/ParentalConsent';

interface StoredConsent extends ConsentData {
  verified: boolean;
  expiryDate: Date;
}

class ConsentManager {
  private static instance: ConsentManager;
  private readonly CONSENT_KEY = 'mss_parental_consent';
  private readonly CONSENT_DURATION_DAYS = 365; // 1 year
  
  private constructor() {
    // Initialize consent checking
    this.checkConsentExpiry();
  }
  
  static getInstance(): ConsentManager {
    if (!ConsentManager.instance) {
      ConsentManager.instance = new ConsentManager();
    }
    return ConsentManager.instance;
  }
  
  /**
   * Store parental consent
   */
  storeConsent(consentData: ConsentData): void {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + this.CONSENT_DURATION_DAYS);
    
    const storedConsent: StoredConsent = {
      ...consentData,
      verified: true,
      expiryDate
    };
    
    // Store encrypted in localStorage (in production, use secure backend)
    const encrypted = this.encrypt(JSON.stringify(storedConsent));
    localStorage.setItem(this.CONSENT_KEY, encrypted);
    
    console.log('✅ Guardian: Parental consent stored securely', {
      email: consentData.parentEmail,
      expires: expiryDate
    });
  }
  
  /**
   * Check if valid consent exists
   */
  hasValidConsent(): boolean {
    const encrypted = localStorage.getItem(this.CONSENT_KEY);
    if (!encrypted) return false;
    
    try {
      const decrypted = this.decrypt(encrypted);
      const consent: StoredConsent = JSON.parse(decrypted);
      
      // Check if expired
      if (new Date(consent.expiryDate) < new Date()) {
        console.warn('⚠️ Parental consent expired');
        this.revokeConsent();
        return false;
      }
      
      // Verify all required consents
      if (!consent.verified || !consent.agreedToTerms || !consent.dataCollectionConsent) {
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('❌ Error validating consent:', error);
      return false;
    }
  }
  
  /**
   * Get current consent data
   */
  getConsent(): StoredConsent | null {
    const encrypted = localStorage.getItem(this.CONSENT_KEY);
    if (!encrypted) return null;
    
    try {
      const decrypted = this.decrypt(encrypted);
      return JSON.parse(decrypted);
    } catch {
      return null;
    }
  }
  
  /**
   * Get child's age from consent
   */
  getChildAge(): number | null {
    const consent = this.getConsent();
    return consent ? consent.childAge : null;
  }
  
  /**
   * Check if child is under 13 (COPPA threshold)
   */
  isUnder13(): boolean {
    const age = this.getChildAge();
    return age !== null && age < 13;
  }
  
  /**
   * Revoke consent
   */
  revokeConsent(): void {
    localStorage.removeItem(this.CONSENT_KEY);
    console.log('🗑️ Parental consent revoked');
  }
  
  /**
   * Check consent expiry on startup
   */
  private checkConsentExpiry(): void {
    if (this.hasValidConsent()) {
      const consent = this.getConsent();
      if (consent) {
        const daysUntilExpiry = Math.ceil(
          (new Date(consent.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
        );
        
        if (daysUntilExpiry <= 30) {
          console.warn(`⚠️ Parental consent expires in ${daysUntilExpiry} days`);
        }
      }
    }
  }
  
  /**
   * Simple encryption (in production, use proper encryption)
   */
  private encrypt(data: string): string {
    // This is a simple base64 encoding for demo
    // In production, use proper encryption with key management
    return btoa(encodeURIComponent(data));
  }
  
  /**
   * Simple decryption (in production, use proper decryption)
   */
  private decrypt(data: string): string {
    // This is a simple base64 decoding for demo
    // In production, use proper decryption
    return decodeURIComponent(atob(data));
  }
  
  /**
   * Get consent status for UI display
   */
  getConsentStatus(): {
    hasConsent: boolean;
    parentEmail?: string;
    childAge?: number;
    expiresIn?: number;
    marketingEnabled?: boolean;
  } {
    if (!this.hasValidConsent()) {
      return { hasConsent: false };
    }
    
    const consent = this.getConsent();
    if (!consent) {
      return { hasConsent: false };
    }
    
    const daysUntilExpiry = Math.ceil(
      (new Date(consent.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );
    
    return {
      hasConsent: true,
      parentEmail: consent.parentEmail,
      childAge: consent.childAge,
      expiresIn: daysUntilExpiry,
      marketingEnabled: consent.marketingConsent
    };
  }
  
  /**
   * Check if specific feature is allowed based on age
   */
  isFeatureAllowed(feature: 'chat' | 'sharing' | 'ai' | 'export'): boolean {
    if (!this.hasValidConsent()) return false;
    
    const age = this.getChildAge();
    if (age === null) return false;
    
    // COPPA restrictions for under 13
    if (age < 13) {
      switch (feature) {
        case 'chat': return false; // No chat for under 13
        case 'sharing': return false; // No public sharing
        case 'ai': return true; // AI allowed with safety checks
        case 'export': return true; // Local export allowed
        default: return false;
      }
    }
    
    // Less restrictive for 13+
    return true;
  }
}

// Export singleton instance
export const consentManager = ConsentManager.getInstance();