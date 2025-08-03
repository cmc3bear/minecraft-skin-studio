import { Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './App.css';
import HomePage from './pages/HomePage';
import EditorPage from './pages/EditorPage';
import GalleryPage from './pages/GalleryPage';
import { SkinProject } from './types';

function App() {
  const [projects, setProjects] = useState<SkinProject[]>([]);

  useEffect(() => {
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
      </Routes>
    </div>
  );
}

export default App
