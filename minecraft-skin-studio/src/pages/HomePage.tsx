import { Link } from 'react-router-dom';
import '../styles/HomePage.css';

function HomePage() {
  return (
    <div className="home-page">
      <header className="hero">
        <h1>Minecraft Skin Studio</h1>
        <p>Create amazing Minecraft skins with AI-powered tools!</p>
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
    </div>
  );
}

export default HomePage;