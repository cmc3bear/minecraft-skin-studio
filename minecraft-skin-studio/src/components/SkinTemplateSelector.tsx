/**
 * Skin Template Selector Component
 * 
 * Provides a UI for selecting from preloaded Minecraft skins
 * Each skin is edit-ready with proper 64x64 UV mapping
 */

import { useState } from 'react';
import { PRELOADED_SKINS, getPreloadedSkin, PreloadedSkin } from '../utils/preloadedSkins';
import '../styles/SkinTemplateSelector.css';

interface SkinTemplateSelectorProps {
  onSkinSelect: (skinData: string, skinInfo: PreloadedSkin) => void;
  currentSkin?: string;
  isVisible: boolean;
  onClose: () => void;
}

function SkinTemplateSelector({ 
  onSkinSelect, 
  currentSkin, 
  isVisible, 
  onClose 
}: SkinTemplateSelectorProps) {
  const [selectedTheme, setSelectedTheme] = useState<string>('All');
  const [previewSkin, setPreviewSkin] = useState<PreloadedSkin | null>(null);

  // Get unique themes for filtering
  const themes = ['All', ...Array.from(new Set(PRELOADED_SKINS.map(skin => skin.theme)))];
  
  // Filter skins by selected theme
  const filteredSkins = selectedTheme === 'All' 
    ? PRELOADED_SKINS 
    : PRELOADED_SKINS.filter(skin => skin.theme === selectedTheme);

  const handleSkinSelect = async (skinId: string) => {
    const skinData = getPreloadedSkin(skinId);
    if (skinData && skinData.imageData) {
      onSkinSelect(skinData.imageData, skinData);
      onClose();
    }
  };

  const handlePreview = (skinId: string) => {
    const skinData = getPreloadedSkin(skinId);
    setPreviewSkin(skinData);
  };

  if (!isVisible) return null;

  return (
    <div className="skin-template-selector-overlay" onClick={onClose}>
      <div className="skin-template-selector-modal" onClick={(e) => e.stopPropagation()}>
        <div className="selector-header">
          <h2>Choose a Skin Template</h2>
          <p>Select a preloaded skin to start editing immediately</p>
          <button className="close-button" onClick={onClose} aria-label="Close template selector">
            ✕
          </button>
        </div>

        <div className="template-filters">
          <label htmlFor="theme-filter">Filter by theme:</label>
          <select 
            id="theme-filter"
            value={selectedTheme} 
            onChange={(e) => setSelectedTheme(e.target.value)}
            className="theme-filter-select"
          >
            {themes.map(theme => (
              <option key={theme} value={theme}>{theme}</option>
            ))}
          </select>
        </div>

        <div className="template-grid">
          {filteredSkins.map(skin => (
            <div 
              key={skin.id} 
              className={`template-card ${currentSkin === skin.id ? 'selected' : ''}`}
              onClick={() => handleSkinSelect(skin.id)}
              onMouseEnter={() => handlePreview(skin.id)}
              role="button"
              tabIndex={0}
              aria-label={`Select ${skin.name} skin template`}
            >
              <div className="template-preview">
                {/* Color palette preview */}
                <div className="color-palette-preview">
                  {skin.thumbnailColors.map((color, index) => (
                    <div 
                      key={index}
                      className="color-swatch"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
                
                {/* Arm model indicator */}
                <div className={`arm-model-indicator ${skin.armModel}`}>
                  {skin.armModel === 'steve' ? '4px arms' : '3px arms'}
                </div>
              </div>

              <div className="template-info">
                <h3 className="template-name">{skin.name}</h3>
                <p className="template-theme">{skin.theme}</p>
                <p className="template-description">{skin.description}</p>
                
                <div className="template-tags">
                  {skin.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="tag">{tag}</span>
                  ))}
                  {skin.tags.length > 3 && (
                    <span className="tag more">+{skin.tags.length - 3}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {previewSkin && (
          <div className="preview-panel">
            <h3>Preview: {previewSkin.name}</h3>
            <div className="preview-details">
              <p><strong>Theme:</strong> {previewSkin.theme}</p>
              <p><strong>Arm Model:</strong> {previewSkin.armModel === 'steve' ? 'Steve (4px arms)' : 'Alex (3px arms)'}</p>
              <p><strong>Author:</strong> {previewSkin.author}</p>
              <p className="preview-description">{previewSkin.description}</p>
              
              <div className="preview-tags">
                {previewSkin.tags.map(tag => (
                  <span key={tag} className="preview-tag">{tag}</span>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="selector-footer">
          <p className="template-info-text">
            All templates use official 64x64 UV mapping and are ready for immediate editing
          </p>
          <button className="cancel-button" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default SkinTemplateSelector;