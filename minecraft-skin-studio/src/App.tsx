import { Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './App.css';
import HomePage from './pages/HomePage';
import EditorPage from './pages/EditorPage';
import GalleryPage from './pages/GalleryPage';
import TrackingDemo from './pages/PracticalTrackingDemo';
import type { SkinProject } from './types';
import ParentalConsent, { type ConsentData } from './components/ParentalConsent';
import { consentManager } from './services/consentManager';

function App() {
  const [projects, setProjects] = useState<SkinProject[]>([]);
  const [hasConsent, setHasConsent] = useState(false);
  const [consentChecked, setConsentChecked] = useState(false);

  useEffect(() => {
    // Check for existing consent
    const validConsent = consentManager.hasValidConsent();
    setHasConsent(validConsent);
    setConsentChecked(true);
    
    // Load projects from localStorage on mount
    const savedProjects = localStorage.getItem('skinProjects');
    if (savedProjects) {
      setProjects(JSON.parse(savedProjects));
    }
  }, []);

  const saveProject = (project: SkinProject) => {
    const updatedProjects = projects.find(p => p.id === project.id) 
      ? projects.map(p => p.id === project.id ? project : p)
      : [...projects, project];
    
    setProjects(updatedProjects);
    localStorage.setItem('skinProjects', JSON.stringify(updatedProjects));
  };

  const deleteProject = (id: string) => {
    const updatedProjects = projects.filter(p => p.id !== id);
    setProjects(updatedProjects);
    localStorage.setItem('skinProjects', JSON.stringify(updatedProjects));
  };

  const handleConsentGranted = (consentData: ConsentData) => {
    consentManager.storeConsent(consentData);
    setHasConsent(true);
    console.log('✅ COPPA Compliance: Parental consent granted');
  };

  const handleConsentDenied = () => {
    console.log('❌ Parental consent denied - app access restricted');
    // Show message that app cannot be used without consent
    alert('Parental consent is required to use Minecraft Skin Studio. Please have a parent or guardian complete the consent process.');
  };

  // Show loading while checking consent
  if (!consentChecked) {
    return <div className="app-loading">Checking parental consent...</div>;
  }

  // Show consent form if no valid consent
  if (!hasConsent) {
    return (
      <ParentalConsent 
        onConsentGranted={handleConsentGranted}
        onConsentDenied={handleConsentDenied}
      />
    );
  }

  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route 
          path="/editor/:projectId?" 
          element={
            <EditorPage 
              projects={projects} 
              onSave={saveProject}
            />
          } 
        />
        <Route 
          path="/gallery" 
          element={
            <GalleryPage 
              projects={projects} 
              onDelete={deleteProject}
            />
          } 
        />
        <Route path="/tracking-demo" element={<TrackingDemo />} />
      </Routes>
    </div>
  );
}

export default App
