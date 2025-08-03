import { Link } from 'react-router-dom';
import { useState } from 'react';
import '../styles/HomePage.css';
import ParentalDashboard from '../components/ParentalDashboard';
import PerformanceTester from '../components/PerformanceTester';
import { consentManager } from '../services/consentManager';

function HomePage() {
  const [showParentalDashboard, setShowParentalDashboard] = useState(false);
  const [showPerformanceTester, setShowPerformanceTester] = useState(false);
  const consentStatus = consentManager.getConsentStatus();

  return (
    <div className="home-page">
      <header className="hero">
        <h1>Minecraft Skin Studio</h1>
        <p>Create amazing Minecraft skins with AI-powered tools!</p>
        <div className="header-buttons">
          {consentStatus.hasConsent && (
            <button 
              onClick={() => setShowParentalDashboard(true)}
              className="parental-access-button"
              title="Parental Dashboard"
              aria-label="Open parental dashboard"
            >
              👨‍👩‍👧
            </button>
          )}
          <button 
            onClick={() => setShowPerformanceTester(true)}
            className="performance-test-button"
            title="Performance Benchmark"
            aria-label="Run performance benchmark"
          >
            🎯
          </button>
        </div>
      </header>
      
      <div className="home-actions">
        <Link to="/editor" className="action-card create-new">
          <div className="icon">🎨</div>
          <h2>Create New Skin</h2>
          <p>Start from scratch or use a template</p>
        </Link>
        
        <Link to="/gallery" className="action-card view-gallery">
          <div className="icon">📁</div>
          <h2>My Skins</h2>
          <p>View and edit your saved creations</p>
        </Link>
      </div>
      
      <section className="features">
        <h2>What you can do:</h2>
        <div className="feature-grid">
          <div className="feature">
            <span className="feature-icon">✏️</span>
            <h3>Draw Pixel by Pixel</h3>
            <p>Use easy drawing tools to create your skin</p>
          </div>
          <div className="feature">
            <span className="feature-icon">🤖</span>
            <h3>AI Assistant</h3>
            <p>Get help from Claude to design amazing skins</p>
          </div>
          <div className="feature">
            <span className="feature-icon">👁️</span>
            <h3>3D Preview</h3>
            <p>See how your skin looks on a Minecraft character</p>
          </div>
          <div className="feature">
            <span className="feature-icon">💾</span>
            <h3>Save & Export</h3>
            <p>Save your work and use it in Minecraft</p>
          </div>
        </div>
      </section>

      {showParentalDashboard && (
        <ParentalDashboard 
          onClose={() => setShowParentalDashboard(false)}
        />
      )}
      
      {showPerformanceTester && (
        <PerformanceTester 
          onClose={() => setShowPerformanceTester(false)}
        />
      )}
    </div>
  );
}

export default HomePage;