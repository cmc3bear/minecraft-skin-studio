import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SkinProject, Tool, Color } from '../types';
import PixelCanvasOptimized, { PixelCanvasRef } from '../components/PixelCanvasOptimized';
import ColorPalette from '../components/ColorPalette';
import { createThumbnail, exportAsMinecraftSkin } from '../utils/canvasUtils';
import { performanceMonitor } from '../services/performanceMonitor';
import '../styles/EditorPage.css';

interface EditorPageProps {
  projects: SkinProject[];
  onSave: (project: SkinProject) => void;
}

const TOOLS: Tool[] = [
  { id: 'pencil', name: 'Pencil (P)', icon: '✏️', cursor: 'crosshair' },
  { id: 'fill', name: 'Fill (F)', icon: '🪣', cursor: 'crosshair' },
  { id: 'eraser', name: 'Eraser (E)', icon: '🧹', cursor: 'crosshair' },
  { id: 'picker', name: 'Color Picker (I)', icon: '👁️', cursor: 'crosshair' }
];

function EditorPage({ projects, onSave }: EditorPageProps) {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const canvasRef = useRef<PixelCanvasRef>(null);
  const [currentProject, setCurrentProject] = useState<SkinProject | null>(null);
  const [currentTool, setCurrentTool] = useState<Tool>(TOOLS[0]);
  const [currentColor, setCurrentColor] = useState<Color>({ hex: '#000000', rgb: { r: 0, g: 0, b: 0 } });

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Tool shortcuts
      if (!e.ctrlKey && !e.metaKey && !e.altKey) {
        switch(e.key.toLowerCase()) {
          case 'p':
            setCurrentTool(TOOLS[0]); // Pencil
            break;
          case 'f':
            setCurrentTool(TOOLS[1]); // Fill
            break;
          case 'e':
            setCurrentTool(TOOLS[2]); // Eraser
            break;
          case 'i':
            setCurrentTool(TOOLS[3]); // Picker
            break;
        }
      }
      
      // Save shortcut
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentProject]);

  useEffect(() => {
    // Start performance monitoring for S2 objective
    performanceMonitor.start();
    
    if (projectId) {
      const project = projects.find(p => p.id === projectId);
      if (project) {
        setCurrentProject(project);
      }
    } else {
      // Create new project
      const newProject: SkinProject = {
        id: Date.now().toString(),
        name: 'New Skin',
        createdAt: new Date(),
        updatedAt: new Date(),
        imageData: '',
        layers: []
      };
      setCurrentProject(newProject);
    }
    
    // Cleanup performance monitor on unmount
    return () => {
      performanceMonitor.stop();
    };
  }, [projectId, projects]);

  const handleExport = () => {
    if (canvasRef.current) {
      const imageData = canvasRef.current.getImageData();
      const canvas = document.createElement('canvas');
      canvas.width = 64;
      canvas.height = 64;
      
      const img = new Image();
      img.onload = () => {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.imageSmoothingEnabled = false;
          ctx.drawImage(img, 0, 0, 64, 64);
          exportAsMinecraftSkin(canvas);
        }
      };
      img.src = imageData;
    }
  };

  const handleSave = () => {
    if (currentProject && canvasRef.current) {
      const imageData = canvasRef.current.getImageData();
      const canvas = document.createElement('canvas');
      canvas.width = 64;
      canvas.height = 64;
      
      // Create thumbnail
      const img = new Image();
      img.onload = () => {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.imageSmoothingEnabled = false;
          ctx.drawImage(img, 0, 0, 64, 64);
          const thumbnail = createThumbnail(canvas);
          
          onSave({
            ...currentProject,
            imageData,
            thumbnail,
            updatedAt: new Date()
          });
          navigate('/gallery');
        }
      };
      img.src = imageData;
    }
  };

  if (!currentProject) {
    return <div>Loading...</div>;
  }

  return (
    <div className="editor-page">
      <header className="editor-header">
        <button 
          onClick={() => navigate('/')} 
          className="back-button"
          aria-label="Go back to home page"
        >
          ← Home
        </button>
        <input 
          type="text" 
          value={currentProject.name}
          onChange={(e) => setCurrentProject({
            ...currentProject,
            name: e.target.value
          })}
          className="project-name"
          aria-label="Project name"
        />
        <button 
          onClick={handleSave} 
          className="save-button"
          aria-label="Save project to gallery"
        >
          Save
        </button>
        <button 
          onClick={handleExport} 
          className="export-button"
          aria-label="Export skin as PNG file"
        >
          Export
        </button>
      </header>
      
      <div className="editor-content">
        <aside className="toolbar" role="toolbar" aria-label="Drawing tools">
          <h3>Tools</h3>
          <div className="tool-buttons">
            {TOOLS.map(tool => (
              <button
                key={tool.id}
                className={`tool-button ${currentTool.id === tool.id ? 'active' : ''}`}
                onClick={() => setCurrentTool(tool)}
                title={tool.name}
              >
                {tool.icon} {tool.name}
              </button>
            ))}
          </div>
          
          <h3>Colors</h3>
          <ColorPalette
            currentColor={currentColor}
            onColorSelect={setCurrentColor}
          />
        </aside>
        
        <main className="canvas-area" role="main" aria-label="Skin editor canvas">
          <PixelCanvasOptimized
            ref={canvasRef}
            currentTool={currentTool}
            currentColor={currentColor}
            initialData={currentProject.imageData}
            showFPS={true} // Enable FPS monitoring for S2 objective
            onPixelChange={(x, y, color) => {
              // Handle pixel changes for real-time updates
            }}
          />
        </main>
        
        <aside className="preview-panel" role="complementary" aria-label="3D preview panel">
          <h3>3D Preview</h3>
          <div className="preview-container">
            {/* 3D preview will be implemented */}
            <div className="placeholder-preview">
              3D Preview coming soon!
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default EditorPage;