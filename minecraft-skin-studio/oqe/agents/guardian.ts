/**
 * Guardian Agent - Child Safety Protector
 * Ensures zero inappropriate content reaches children
 */

import { Agent, AgentStandard } from '../framework/types';

export const GuardianAgent: Agent = {
  id: 'guardian',
  name: 'Guardian',
  description: 'Child safety and COPPA compliance enforcer',
  objectives: ['S1', 'C1'], // Zero Safety Incidents, COPPA Compliance
  standards: [
    {
      metric: 'Safety Incidents',
      requirement: 'Zero tolerance',
      threshold: 0,
      measurement: 'incidents per period'
    },
    {
      metric: 'Content Filter Accuracy',
      requirement: '100% inappropriate content blocked',
      threshold: 100,
      measurement: 'percentage blocked'
    },
    {
      metric: 'False Positive Rate',
      requirement: 'Minimal false blocks',
      threshold: 1,
      measurement: 'percentage false positives'
    },
    {
      metric: 'COPPA Compliance',
      requirement: 'Full compliance',
      threshold: 100,
      measurement: 'compliance score'
    },
    {
      metric: 'Response Time',
      requirement: 'Real-time filtering',
      threshold: 100,
      measurement: 'milliseconds'
    }
  ]
};

// Content filter implementation
export class ContentFilter {
  private static instance: ContentFilter;
  private blockedPatterns: RegExp[];
  private contextualFilters: Map<string, (text: string) => boolean>;
  
  private constructor() {
    this.blockedPatterns = this.loadBlockedPatterns();
    this.contextualFilters = this.loadContextualFilters();
  }
  
  static getInstance(): ContentFilter {
    if (!ContentFilter.instance) {
      ContentFilter.instance = new ContentFilter();
    }
    return ContentFilter.instance;
  }
  
  private loadBlockedPatterns(): RegExp[] {
    // In production, this would load from a secure, updatable source
    return [
      // Profanity patterns (examples - real list would be comprehensive)
      /\b(damn|hell|crap)\b/gi,
      // Violence patterns
      /\b(kill|murder|die|death)\b/gi,
      // Personal information patterns
      /\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b/g, // Phone numbers
      /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, // Email
      /\b\d{1,5}\s\w+\s(street|st|avenue|ave|road|rd|drive|dr)\b/gi, // Addresses
    ];
  }
  
  private loadContextualFilters(): Map<string, (text: string) => boolean> {
    const filters = new Map<string, (text: string) => boolean>();
    
    // Context-aware filtering
    filters.set('personal_info', (text: string) => {
      const lowerText = text.toLowerCase();
      return lowerText.includes('my name is') ||
             lowerText.includes('i live at') ||
             lowerText.includes('my phone') ||
             lowerText.includes('my email') ||
             lowerText.includes('years old') ||
             lowerText.includes('my age');
    });
    
    filters.set('inappropriate_requests', (text: string) => {
      const lowerText = text.toLowerCase();
      return lowerText.includes('scary') ||
             lowerText.includes('violent') ||
             lowerText.includes('blood') ||
             lowerText.includes('weapon');
    });
    
    return filters;
  }
  
  async checkContent(text: string): Promise<SafetyCheckResult> {
    const startTime = Date.now();
    const violations: string[] = [];
    
    // Check against blocked patterns
    for (const pattern of this.blockedPatterns) {
      const matches = text.match(pattern);
      if (matches) {
        violations.push(`Blocked pattern detected: ${matches.join(', ')}`);
      }
    }
    
    // Check contextual filters
    for (const [filterName, filterFunc] of this.contextualFilters) {
      if (filterFunc(text)) {
        violations.push(`Failed ${filterName} filter`);
      }
    }
    
    const processingTime = Date.now() - startTime;
    
    return {
      safe: violations.length === 0,
      violations,
      processingTime,
      timestamp: new Date(),
      filterVersion: '1.0.0'
    };
  }
  
  async checkImage(imageData: string): Promise<SafetyCheckResult> {
    // In production, this would use image recognition APIs
    // For now, we'll implement a placeholder
    return {
      safe: true,
      violations: [],
      processingTime: 50,
      timestamp: new Date(),
      filterVersion: '1.0.0'
    };
  }
}

export interface SafetyCheckResult {
  safe: boolean;
  violations: string[];
  processingTime: number;
  timestamp: Date;
  filterVersion: string;
}

// COPPA Compliance Checker
export class COPPAComplianceChecker {
  private static readonly PROHIBITED_DATA = [
    'full_name',
    'home_address',
    'email_address',
    'phone_number',
    'social_security_number',
    'credit_card',
    'birth_date',
    'geolocation'
  ];
  
  static checkDataCollection(dataFields: string[]): ComplianceResult {
    const violations: string[] = [];
    
    for (const field of dataFields) {
      if (this.PROHIBITED_DATA.includes(field)) {
        violations.push(`Prohibited data field: ${field}`);
      }
    }
    
    return {
      compliant: violations.length === 0,
      violations,
      recommendation: violations.length > 0 
        ? 'Remove prohibited data fields or implement parental consent flow'
        : 'Data collection is COPPA compliant'
    };
  }
  
  static validateParentalConsent(consentData: any): boolean {
    // Validate parental consent implementation
    return consentData && 
           consentData.parentEmail && 
           consentData.consentDate && 
           consentData.consentMethod === 'verified_email';
  }
}

export interface ComplianceResult {
  compliant: boolean;
  violations: string[];
  recommendation: string;
}

// Safety Monitor
export class SafetyMonitor {
  private static incidents: SafetyIncident[] = [];
  
  static async recordIncident(incident: SafetyIncident): Promise<void> {
    this.incidents.push(incident);
    
    // Critical alert for any safety incident
    if (incident.severity === 'critical') {
      await this.alertEmergencyContacts(incident);
    }
    
    // Log for audit
    console.error('SAFETY INCIDENT:', incident);
  }
  
  static getIncidentCount(): number {
    return this.incidents.length;
  }
  
  static getIncidents(): SafetyIncident[] {
    return [...this.incidents];
  }
  
  private static async alertEmergencyContacts(incident: SafetyIncident): Promise<void> {
    // In production, this would trigger real alerts
    console.error('EMERGENCY ALERT:', incident);
  }
}

export interface SafetyIncident {
  id: string;
  timestamp: Date;
  type: 'content' | 'data' | 'behavior' | 'system';
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  userId?: string;
  resolved: boolean;
  resolvedBy?: string;
  resolvedAt?: Date;
}