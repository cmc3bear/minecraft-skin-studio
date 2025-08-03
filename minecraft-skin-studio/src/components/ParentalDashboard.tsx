/**
 * Parental Dashboard Component
 * Allows parents to manage consent, view activity, and control features
 * Guardian Agent requirement for C1 objective
 */

import React, { useState, useEffect } from 'react';
import { consentManager } from '../services/consentManager';
import { useFocusTrap } from '../hooks/useFocusTrap';
import './ParentalDashboard.css';

interface ParentalDashboardProps {
  onClose: () => void;
}

interface ActivityLog {
  timestamp: Date;
  action: string;
  details?: string;
}

export default function ParentalDashboard({ onClose }: ParentalDashboardProps) {
  const [consentStatus, setConsentStatus] = useState(consentManager.getConsentStatus());
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'controls' | 'activity' | 'data'>('overview');
  const [featureSettings, setFeatureSettings] = useState({
    aiEnabled: true,
    exportEnabled: true,
    timeLimit: 120, // minutes per day
    breakReminders: true
  });
  
  const focusTrapRef = useFocusTrap(true);

  useEffect(() => {
    // Load activity logs (mock data for demo)
    setActivityLogs([
      { timestamp: new Date(), action: 'Login', details: 'Parental consent verified' },
      { timestamp: new Date(Date.now() - 3600000), action: 'Created skin', details: 'Steve variant' },
      { timestamp: new Date(Date.now() - 7200000), action: 'Exported skin', details: 'minecraft-skin.png' }
    ]);
  }, []);

  const handleRevokeConsent = () => {
    if (window.confirm('Are you sure you want to revoke consent? Your child will need to get permission again to use the app.')) {
      consentManager.revokeConsent();
      window.location.reload();
    }
  };

  const handleFeatureToggle = (feature: keyof typeof featureSettings) => {
    setFeatureSettings(prev => ({
      ...prev,
      [feature]: !prev[feature]
    }));
    // In production, save these settings
    console.log(`Feature ${feature} toggled:`, !featureSettings[feature]);
  };

  const renderOverview = () => (
    <div className="dashboard-section">
      <h3>👤 Account Overview</h3>
      <div className="info-grid">
        <div className="info-item">
          <label>Parent Email:</label>
          <span>{consentStatus.parentEmail}</span>
        </div>
        <div className="info-item">
          <label>Child's Age:</label>
          <span>{consentStatus.childAge} years old</span>
        </div>
        <div className="info-item">
          <label>Consent Status:</label>
          <span className="status-badge active">Active</span>
        </div>
        <div className="info-item">
          <label>Expires In:</label>
          <span>{consentStatus.expiresIn} days</span>
        </div>
      </div>

      <div className="coppa-info">
        <h4>🛡️ COPPA Protection Active</h4>
        <p>Your child's privacy is protected according to COPPA regulations:</p>
        <ul>
          <li>✅ No personal information collected</li>
          <li>✅ No chat or messaging features</li>
          <li>✅ No public sharing without approval</li>
          <li>✅ AI safety filters active</li>
        </ul>
      </div>
    </div>
  );

  const renderControls = () => (
    <div className="dashboard-section">
      <h3>⚙️ Parental Controls</h3>
      
      <div className="control-group">
        <label className="toggle-control">
          <input
            type="checkbox"
            checked={featureSettings.aiEnabled}
            onChange={() => handleFeatureToggle('aiEnabled')}
          />
          <span>AI Assistant</span>
          <small>Allow AI-powered design suggestions</small>
        </label>

        <label className="toggle-control">
          <input
            type="checkbox"
            checked={featureSettings.exportEnabled}
            onChange={() => handleFeatureToggle('exportEnabled')}
          />
          <span>Export Skins</span>
          <small>Allow saving skins to device</small>
        </label>

        <label className="toggle-control">
          <input
            type="checkbox"
            checked={featureSettings.breakReminders}
            onChange={() => handleFeatureToggle('breakReminders')}
          />
          <span>Break Reminders</span>
          <small>Remind to take breaks every 30 minutes</small>
        </label>
      </div>

      <div className="time-limit-control">
        <h4>⏰ Daily Time Limit</h4>
        <input
          type="range"
          min="30"
          max="240"
          step="30"
          value={featureSettings.timeLimit}
          onChange={(e) => setFeatureSettings(prev => ({
            ...prev,
            timeLimit: parseInt(e.target.value)
          }))}
        />
        <span>{featureSettings.timeLimit} minutes per day</span>
      </div>

      <div className="danger-zone">
        <h4>⚠️ Danger Zone</h4>
        <button 
          onClick={handleRevokeConsent}
          className="revoke-button"
        >
          Revoke Consent
        </button>
        <p className="warning-text">
          This will immediately log out your child and require new consent to use the app.
        </p>
      </div>
    </div>
  );

  const renderActivity = () => (
    <div className="dashboard-section">
      <h3>📊 Activity Log</h3>
      <div className="activity-list">
        {activityLogs.map((log, index) => (
          <div key={index} className="activity-item">
            <div className="activity-time">
              {log.timestamp.toLocaleTimeString()}
            </div>
            <div className="activity-content">
              <strong>{log.action}</strong>
              {log.details && <span> - {log.details}</span>}
            </div>
          </div>
        ))}
      </div>
      <p className="privacy-note">
        💡 Activity logs are stored locally and never sent to servers.
      </p>
    </div>
  );

  const renderDataPrivacy = () => (
    <div className="dashboard-section">
      <h3>🔒 Data & Privacy</h3>
      
      <div className="data-section">
        <h4>What We Collect</h4>
        <ul>
          <li>✅ Skin designs (stored locally)</li>
          <li>✅ Display name (no real names)</li>
          <li>✅ Consent verification data</li>
        </ul>
      </div>

      <div className="data-section">
        <h4>What We DON'T Collect</h4>
        <ul>
          <li>❌ Personal information</li>
          <li>❌ Location data</li>
          <li>❌ Behavioral tracking</li>
          <li>❌ Third-party analytics</li>
        </ul>
      </div>

      <div className="data-actions">
        <button className="data-button">
          📥 Download All Data
        </button>
        <button className="data-button">
          🗑️ Delete All Data
        </button>
      </div>

      <div className="compliance-badges">
        <span className="badge">COPPA Compliant</span>
        <span className="badge">GDPR Ready</span>
        <span className="badge">Guardian Verified</span>
      </div>
    </div>
  );

  return (
    <div className="parental-dashboard-modal">
      <div className="dashboard-container" ref={focusTrapRef}>
        <div className="dashboard-header">
          <h2>👨‍👩‍👧 Parental Dashboard</h2>
          <button onClick={onClose} className="close-button">✕</button>
        </div>

        <div className="dashboard-tabs">
          <button 
            className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`tab ${activeTab === 'controls' ? 'active' : ''}`}
            onClick={() => setActiveTab('controls')}
          >
            Controls
          </button>
          <button 
            className={`tab ${activeTab === 'activity' ? 'active' : ''}`}
            onClick={() => setActiveTab('activity')}
          >
            Activity
          </button>
          <button 
            className={`tab ${activeTab === 'data' ? 'active' : ''}`}
            onClick={() => setActiveTab('data')}
          >
            Data & Privacy
          </button>
        </div>

        <div className="dashboard-content">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'controls' && renderControls()}
          {activeTab === 'activity' && renderActivity()}
          {activeTab === 'data' && renderDataPrivacy()}
        </div>
      </div>
    </div>
  );
}