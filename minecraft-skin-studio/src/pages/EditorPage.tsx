import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SkinProject, Tool, Color } from '../types';
import PixelCanvasOptimized, { PixelCanvasRef } from '../components/PixelCanvasOptimized';
import ColorPalette from '../components/ColorPalette';
import SkinTemplateSelector from '../components/SkinTemplateSelector';
import { lazy, Suspense } from 'react';

// Lazy load heavy components to reduce initial bundle size
const MinecraftCharacter3D = lazy(() => import('../components/MinecraftCharacter3D'));
const AIAssistant = lazy(() => import('../components/AIAssistant'));
import { createThumbnail, exportAsMinecraftSkin } from '../utils/canvasUtils';
import { exportToMinecraft, validateMinecraftSkin, generateSkinFilename } from '../utils/minecraftExport';
import { performanceMonitor } from '../services/performanceMonitor';
import { PreloadedSkin, getPreloadedSkin } from '../utils/preloadedSkins';
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
  const [currentSkinData, setCurrentSkinData] = useState<string | undefined>(undefined);
  const [isUpdating3D, setIsUpdating3D] = useState(false);
  const update3DTimeoutRef = useRef<number | null>(null);
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState<string>('enhanced-steve');
  const [showUVOverlay, setShowUVOverlay] = useState(false);

  const handleSkinSelect = (skinType: string) => {
    const skinData = getPreloadedSkin(skinType);
    if (skinData && canvasRef.current) {
      canvasRef.current.setImageData(skinData);
      setCurrentTemplate(skinType);
      setShowTemplateSelector(false);
      // Update 3D preview after loading new template
      setTimeout(update3DPreview, 100);
    }
  };

  // Helper function to convert hex to RGB
  const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  // Debounced 3D preview update to prevent race conditions
  const update3DPreview = useCallback(() => {
    // Clear any pending updates
    if (update3DTimeoutRef.current) {
      clearTimeout(update3DTimeoutRef.current);
    }

    // Debounce updates to prevent race conditions
    update3DTimeoutRef.current = window.setTimeout(async () => {
      if (isUpdating3D || !canvasRef.current) {
        return;
      }

      setIsUpdating3D(true);

      try {
        // Wait for any pending canvas operations to complete
        await new Promise(resolve => requestAnimationFrame(resolve));
        
        const imageData = canvasRef.current.getImageData();
        console.log('🎮 Updating 3D preview with canvas data');
        console.log('📊 Canvas data length:', imageData?.length || 0);
        
        // Update 3D skin data atomically
        setCurrentSkinData(imageData);
        console.log('✅ 3D preview state updated');
        
      } catch (error) {
        console.error('❌ Failed to get canvas image data:', error);
      } finally {
        setIsUpdating3D(false);
      }
    }, 100); // 100ms debounce to batch multiple rapid changes
  }, [isUpdating3D]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (update3DTimeoutRef.current) {
        clearTimeout(update3DTimeoutRef.current);
      }
    };
  }, []);

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
    
    // Initialize 3D preview with Steve skin
    setTimeout(() => {
      update3DPreview();
    }, 1000); // Wait for canvas to load Steve skin
    
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

  const handleCommitToMinecraft = async () => {
    if (!canvasRef.current) {
      alert('No canvas found. Please try again.');
      return;
    }

    try {
      const imageData = canvasRef.current.getImageData();
      const canvas = document.createElement('canvas');
      canvas.width = 64;
      canvas.height = 64;
      
      const img = new Image();
      img.onload = async () => {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.imageSmoothingEnabled = false;
          ctx.drawImage(img, 0, 0, 64, 64);
          
          // Validate the skin
          const validation = validateMinecraftSkin(canvas);
          if (!validation.valid) {
            alert(`❌ ${validation.message}`);
            return;
          }
          
          // Generate filename and export
          const filename = generateSkinFilename(currentProject?.name);
          await exportToMinecraft(canvas, filename);
        }
      };
      img.src = imageData;
      
    } catch (error) {
      console.error('Failed to commit to Minecraft:', error);
      alert('❌ Failed to export skin to Minecraft. Please try again.');
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
        <button 
          onClick={handleCommitToMinecraft} 
          className="minecraft-button"
          aria-label="Download skin for Minecraft"
          title="Download skin file for use in Minecraft"
        >
          🎮 Commit to Minecraft
        </button>
        <button 
          onClick={() => setShowTemplateSelector(true)} 
          className="template-button"
          aria-label="Select character template"
          title="Choose a character template to start with"
        >
          🎨 Templates
        </button>
        <button 
          onClick={() => setShowUVOverlay(!showUVOverlay)} 
          className={`overlay-button ${showUVOverlay ? 'active' : ''}`}
          aria-label="Toggle UV map overlay"
          title="Show/hide section labels on the skin editor"
        >
          🗺️ {showUVOverlay ? 'Hide' : 'Show'} Labels
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
            showOverlay={showUVOverlay} // UV map overlay
            onPixelChange={(x, y, color) => {
              // Update 3D preview on pixel changes (debounced)
              console.log('🎨 Pixel changed at', x, y, 'color:', color);
              update3DPreview();
            }}
          />
        </main>
        
        <aside className="preview-panel" role="complementary" aria-label="3D preview panel">
          <h3>3D Preview</h3>
          <div className="preview-container">
            <Suspense fallback={
              <div style={{
                width: '268px',
                height: '300px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid #555',
                borderRadius: '8px',
                background: '#f0f0f0',
                color: '#666',
                fontSize: '14px'
              }}>
                🎮 Loading 3D Preview...
              </div>
            }>
              <MinecraftCharacter3D 
                skinDataURL={currentSkinData}
                width={268}
                height={300}
                autoRotate={false}
              />
            </Suspense>
          </div>
          
          {/* Debug controls */}
          <div style={{ padding: '10px', borderTop: '1px solid #555' }}>
            <button 
              onClick={update3DPreview}
              style={{
                background: '#4CAF50',
                color: 'white',
                border: 'none',
                padding: '5px 10px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              🔄 Update 3D
            </button>
            <div style={{ fontSize: '10px', color: '#888', marginTop: '5px' }}>
              Current data: {currentSkinData ? 'Loaded' : 'None'}
            </div>
          </div>
          
          <div className="ai-section">
            <Suspense fallback={
              <div style={{
                padding: '20px',
                textAlign: 'center',
                color: '#666',
                fontSize: '14px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                background: '#f9f9f9'
              }}>
                🤖 Loading AI Assistant...
              </div>
            }>
              <AIAssistant 
                onApplySuggestion={async (suggestion) => {
                  try {
                    console.log('Applying AI suggestion:', suggestion);
                    
                    // Generate skin pixel data from the suggestion
                    const { aiService } = await import('../services/aiService');
                    const skinDataURL = await aiService.generateSkinPixelData(suggestion);
                    
                    // Apply the generated skin to the canvas
                    if (canvasRef.current) {
                      canvasRef.current.setImageData(skinDataURL);
                      console.log('✅ AI skin applied successfully');
                      
                      // Update 3D preview with new skin (debounced)
                      update3DPreview();
                    }
                  } catch (error) {
                    console.error('Failed to apply AI suggestion:', error);
                    alert('❌ Failed to apply AI suggestion. Please try again.');
                  }
                }}
                onApplyColorPalette={(colors) => {
                  // Apply color palette to current color selection
                  console.log('Applying color palette:', colors);
                  if (colors.length > 0) {
                    // Set the first color as the current drawing color
                    const firstColor = colors[0];
                    const rgb = hexToRgb(firstColor);
                    if (rgb) {
                      setCurrentColor({
                        hex: firstColor,
                        rgb
                      });
                    }
                  }
                }}
              />
            </Suspense>
          </div>
        </aside>
      </div>
      
      {showTemplateSelector && (
        <SkinTemplateSelector
          currentTemplate={currentTemplate}
          onSkinSelect={handleSkinSelect}
          onClose={() => setShowTemplateSelector(false)}
        />
      )}
    </div>
  );
}

export default EditorPage;