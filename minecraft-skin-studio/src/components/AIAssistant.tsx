/**
 * AI Assistant Component
 * Child-safe AI-powered skin creation assistant
 */

import React, { useState, useEffect } from 'react';
import { useAI } from '../hooks/useAI';
import './AIAssistant.css';

interface AIAssistantProps {
  onApplySuggestion?: (suggestion: any) => void;
  onApplyColorPalette?: (colors: string[]) => void;
}

export default function AIAssistant({ onApplySuggestion, onApplyColorPalette }: AIAssistantProps) {
  const [prompt, setPrompt] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  
  const { 
    suggestions, 
    colorPalette, 
    isLoading, 
    error, 
    responseTime,
    isPerforming,
    isOffline,
    generateSuggestions, 
    generateColorPalette,
    clearSuggestions,
    clearError 
  } = useAI();

  useEffect(() => {
    // Check if speech recognition is supported
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    setSpeechSupported(!!SpeechRecognition);
  }, []);

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in your browser');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
      console.log('🎤 Listening for speech...');
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setPrompt(transcript);
      setIsListening(false);
      console.log('📝 Speech recognized:', transcript);
      // Auto-submit after speech recognition
      generateSuggestions(transcript);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      alert(`Speech recognition error: ${event.error}`);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      console.log('🤖 Sending request to OpenAI:', prompt);
      generateSuggestions(prompt);
    }
  };

  const handleQuickPalette = (theme: string) => {
    generateColorPalette(theme);
  };

  const handleRandomize = () => {
    const randomPrompts = [
      'a brave knight in shining armor',
      'a magical wizard with starry robes',
      'a friendly robot with glowing eyes',
      'a cool ninja in black outfit',
      'a space explorer with jetpack',
      'a nature fairy with leaf wings',
      'a pirate captain with treasure map',
      'a superhero with cape and mask',
      'a cute animal character',
      'a steampunk inventor with goggles'
    ];
    
    const randomPrompt = randomPrompts[Math.floor(Math.random() * randomPrompts.length)];
    setPrompt(randomPrompt);
    generateSuggestions(randomPrompt);
  };

  return (
    <div className="ai-assistant" role="region" aria-label="AI Creative Assistant">
      <div className="ai-header">
        <h3>🎨 AI Creative Assistant</h3>
        <p className="ai-subtitle">Describe your dream Minecraft skin!</p>
      </div>

      {/* Offline indicator */}
      {isOffline && (
        <div className="offline-indicator" role="status" aria-live="polite">
          📱 Offline Mode - Using cached suggestions
        </div>
      )}

      {/* Performance indicator for OQE monitoring */}
      {responseTime && !isOffline && (
        <div 
          className={`performance-indicator ${isPerforming ? 'good' : 'warning'}`}
          role="status"
          aria-live="polite"
          aria-label={`AI response time: ${responseTime.toFixed(0)} milliseconds${isPerforming ? '' : ', slower than 3 second target'}`}
        >
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
            className={`prompt-input ${isListening ? 'listening' : ''}`}
            disabled={isLoading || isListening}
            maxLength={200}
            aria-label="Describe your skin idea"
            aria-describedby="prompt-help"
          />
          {speechSupported && (
            <button
              type="button"
              onClick={startListening}
              disabled={isLoading || isListening}
              className={`mic-button ${isListening ? 'active' : ''}`}
              aria-label={isListening ? 'Listening...' : 'Start voice input'}
              title={isListening ? 'Listening...' : 'Click to speak'}
            >
              {isListening ? '🔴' : '🎤'}
            </button>
          )}
          <button 
            type="submit" 
            disabled={isLoading || !prompt.trim() || isListening}
            className="generate-btn"
          >
            {isLoading ? '🤔 Thinking...' : '✨ Create Ideas'}
          </button>
        </div>
        
        <div className="prompt-help" id="prompt-help">
          <small>💡 Try: animals, superheroes, fantasy characters, or favorite colors!</small>
        </div>
      </form>

      {/* Randomize Button */}
      <div className="randomize-section">
        <button 
          onClick={handleRandomize}
          disabled={isLoading}
          className="randomize-btn"
          aria-label="Generate random skin idea"
        >
          🎲 Random Idea
        </button>
      </div>

      {/* Quick Color Palettes */}
      <div className="quick-palettes">
        <h4>🌈 Quick Color Themes</h4>
        <div className="palette-buttons" role="group" aria-label="Quick color theme selection">
          <button onClick={() => handleQuickPalette('minecraft')} disabled={isLoading} aria-label="Apply Minecraft color theme">
            🟫 Minecraft
          </button>
          <button onClick={() => handleQuickPalette('fantasy')} disabled={isLoading} aria-label="Apply Fantasy color theme">
            🦄 Fantasy
          </button>
          <button onClick={() => handleQuickPalette('space')} disabled={isLoading} aria-label="Apply Space color theme">
            🚀 Space
          </button>
          <button onClick={() => handleQuickPalette('ocean')} disabled={isLoading} aria-label="Apply Ocean color theme">
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