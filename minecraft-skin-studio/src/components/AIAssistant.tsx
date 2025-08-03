/**
 * AI Assistant Component
 * Child-safe AI-powered skin creation assistant
 */

import React, { useState } from 'react';
import { useAI } from '../hooks/useAI';
import './AIAssistant.css';

interface AIAssistantProps {
  onApplySuggestion?: (suggestion: any) => void;
  onApplyColorPalette?: (colors: string[]) => void;
}

export default function AIAssistant({ onApplySuggestion, onApplyColorPalette }: AIAssistantProps) {
  const [prompt, setPrompt] = useState('');
  const { 
    suggestions, 
    colorPalette, 
    isLoading, 
    error, 
    responseTime,
    isPerforming,
    generateSuggestions, 
    generateColorPalette,
    clearSuggestions,
    clearError 
  } = useAI();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    generateSuggestions(prompt);
  };

  const handleQuickPalette = (theme: string) => {
    generateColorPalette(theme);
  };

  return (
    <div className="ai-assistant">
      <div className="ai-header">
        <h3>🎨 AI Creative Assistant</h3>
        <p className="ai-subtitle">Describe your dream Minecraft skin!</p>
      </div>

      {/* Performance indicator for OQE monitoring */}
      {responseTime && (
        <div className={`performance-indicator ${isPerforming ? 'good' : 'warning'}`}>
          ⚡ Response: {responseTime.toFixed(0)}ms 
          {isPerforming ? ' ✅' : ' ⚠️ (>3s target)'}
        </div>
      )}

      <form onSubmit={handleSubmit} className="ai-prompt-form">
        <div className="prompt-input-group">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., 'a friendly dragon with blue scales' or 'superhero with cape'"
            className="prompt-input"
            disabled={isLoading}
            maxLength={200}
          />
          <button 
            type="submit" 
            disabled={isLoading || !prompt.trim()}
            className="generate-btn"
          >
            {isLoading ? '🤔 Thinking...' : '✨ Create Ideas'}
          </button>
        </div>
        
        <div className="prompt-help">
          <small>💡 Try: animals, superheroes, fantasy characters, or favorite colors!</small>
        </div>
      </form>

      {/* Quick Color Palettes */}
      <div className="quick-palettes">
        <h4>🌈 Quick Color Themes</h4>
        <div className="palette-buttons">
          <button onClick={() => handleQuickPalette('minecraft')} disabled={isLoading}>
            🟫 Minecraft
          </button>
          <button onClick={() => handleQuickPalette('fantasy')} disabled={isLoading}>
            🦄 Fantasy
          </button>
          <button onClick={() => handleQuickPalette('space')} disabled={isLoading}>
            🚀 Space
          </button>
          <button onClick={() => handleQuickPalette('ocean')} disabled={isLoading}>
            🌊 Ocean
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="ai-error">
          <p>😅 Oops! {error}</p>
          <button onClick={clearError} className="dismiss-btn">Got it!</button>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="ai-loading">
          <div className="loading-spinner"></div>
          <p>🎨 Creating amazing ideas for you...</p>
        </div>
      )}

      {/* Suggestions Display */}
      {suggestions.length > 0 && (
        <div className="suggestions-section">
          <div className="suggestions-header">
            <h4>💡 Creative Ideas</h4>
            <button onClick={clearSuggestions} className="clear-btn">Clear</button>
          </div>
          
          <div className="suggestions-grid">
            {suggestions.map((suggestion) => (
              <div key={suggestion.id} className="suggestion-card">
                <div className="suggestion-header">
                  <h5>{suggestion.description}</h5>
                  <span className="confidence">
                    {Math.round(suggestion.confidence * 100)}% match
                  </span>
                </div>
                
                <div className="suggestion-colors">
                  {suggestion.colorPalette.map((color, index) => (
                    <div
                      key={index}
                      className="color-preview"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
                
                <div className="suggestion-actions">
                  <button
                    onClick={() => onApplySuggestion?.(suggestion)}
                    className="apply-btn"
                  >
                    🎨 Use This Idea
                  </button>
                  <button
                    onClick={() => onApplyColorPalette?.(suggestion.colorPalette)}
                    className="apply-colors-btn"
                  >
                    🌈 Use Colors
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Generated Color Palette */}
      {colorPalette && (
        <div className="palette-section">
          <h4>🎨 {colorPalette.name}</h4>
          <div className="palette-colors">
            {colorPalette.colors.map((color, index) => (
              <div
                key={index}
                className="palette-color"
                style={{ backgroundColor: color }}
                title={color}
                onClick={() => navigator.clipboard.writeText(color)}
              >
                <span className="color-code">{color}</span>
              </div>
            ))}
          </div>
          <button
            onClick={() => onApplyColorPalette?.(colorPalette.colors)}
            className="apply-palette-btn"
          >
            🌈 Use This Palette
          </button>
        </div>
      )}

      {/* Safety Notice */}
      <div className="safety-notice">
        <p>🛡️ This AI assistant is designed to be safe and fun for kids!</p>
      </div>
    </div>
  );
}