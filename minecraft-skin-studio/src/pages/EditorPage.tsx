import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SkinProject, Tool, Color } from '../types';
import PixelCanvas, { PixelCanvasRef } from '../components/PixelCanvas';
import ColorPalette from '../components/ColorPalette';
import { createThumbnail, exportAsMinecraftSkin } from '../utils/canvasUtils';
import '../styles/EditorPage.css';

interface EditorPageProps {
  projects: SkinProject[];
  onSave: (project: SkinProject) => void;
}

const TOOLS: Tool[] = [
  { id: 'pencil', name: 'Pencil', icon: '✏️', cursor: 'crosshair' },
  { id: 'fill', name: 'Fill', icon: '🪣', cursor: 'crosshair' },
  { id: 'eraser', name: 'Eraser', icon: '🧹', cursor: 'crosshair' },
  { id: 'picker', name: 'Color Picker', icon: '👁️', cursor: 'crosshair' }
];

function EditorPage({ projects, onSave }: EditorPageProps) {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const canvasRef = useRef<PixelCanvasRef>(null);
  const [currentProject, setCurrentProject] = useState<SkinProject | null>(null);
  const [currentTool, setCurrentTool] = useState<Tool>(TOOLS[0]);
  const [currentColor, setCurrentColor] = useState<Color>({ hex: '#000000', rgb: { r: 0, g: 0, b: 0 } });

  useEffect(() => {
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
        <button onClick={() => navigate('/')} className="back-button">
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
        />
        <button onClick={handleSave} className="save-button">
          Save
        </button>
        <button onClick={handleExport} className="export-button">
          Export
        </button>
      </header>
      
      <div className="editor-content">
        <aside className="toolbar">
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
        
        <main className="canvas-area">
          <PixelCanvas
            ref={canvasRef}
            currentTool={currentTool}
            currentColor={currentColor}
            initialData={currentProject.imageData}
            onPixelChange={(x, y, color) => {
              // Handle pixel changes
              console.log(`Pixel at ${x},${y} changed to ${color.hex}`);
            }}
          />
        </main>
        
        <aside className="preview-panel">
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