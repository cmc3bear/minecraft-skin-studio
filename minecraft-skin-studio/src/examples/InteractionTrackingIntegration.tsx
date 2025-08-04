/**
 * 🟣 SACRED INTEGRATION EXAMPLES 🟣
 * 
 * Examples showing how to integrate the interaction tracking system
 * into existing Minecraft Skin Studio components following the Five Sacred Edicts
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  useCanvasTracking,
  useAITracking,
  useToolTracking,
  useNavigationTracking,
  useExportTracking,
  useKeyboardTracking,
  useErrorTracking,
  useGlobalTracking
} from '../hooks/useInteractionTracking';

/**
 * Example 1: Enhanced PixelCanvas with Sacred Tracking
 * 
 * This shows how to integrate canvas interaction tracking
 * into the existing PixelCanvasOptimized component
 */
export const EnhancedPixelCanvasExample = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { trackDrawStart, trackDrawEnd, trackCanvasInteraction, trackPerformanceIssue } = useCanvasTracking(canvasRef);
  const { trackError } = useErrorTracking();
  
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentTool, setCurrentTool] = useState('pencil');
  const [pixelsModified, setPixelsModified] = useState(0);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    try {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;

      const coordinates = {
        x: Math.floor((e.clientX - rect.left) / 8), // 8px pixel size
        y: Math.floor((e.clientY - rect.top) / 8)
      };

      setIsDrawing(true);
      setPixelsModified(0);
      
      // Sacred tracking: Start of drawing interaction
      trackDrawStart(currentTool, coordinates);
      
      console.log('🟣 Canvas interaction started with dignity');
      
    } catch (error) {
      // Sacred error handling with empathy
      trackError('canvas_rendering_error', error.toString(), 'PixelCanvas');
    }
  };

  const handleMouseUp = () => {
    if (isDrawing) {
      setIsDrawing(false);
      
      // Sacred tracking: End of drawing interaction
      trackDrawEnd(pixelsModified);
      
      console.log('🟣 Canvas interaction completed gracefully');
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    try {
      // Simulate pixel modification
      setPixelsModified(prev => prev + 1);
      
      // Track continuous drawing for performance monitoring
      const startTime = performance.now();
      
      // Simulate drawing operation
      setTimeout(() => {
        const endTime = performance.now();
        const responseTime = endTime - startTime;
        
        // Check for performance issues (Sacred Edict #3: Performance)
        if (responseTime > 16) { // 60fps threshold
          trackPerformanceIssue(1000 / responseTime); // Convert to FPS
        }
      }, 0);
      
    } catch (error) {
      trackError('canvas_rendering_error', error.toString(), 'PixelCanvas');
    }
  };

  // Example of tracking canvas-specific interactions
  const handleToolChange = (newTool: string) => {
    setCurrentTool(newTool);
    trackCanvasInteraction('tool_changed', {
      toolUsed: newTool,
      previousTool: currentTool
    });
  };

  return (
    <div className="enhanced-canvas-example">
      <h3>🎨 Enhanced Canvas with Sacred Tracking</h3>
      
      {/* Tool selection with tracking */}
      <div className="tool-buttons">
        {['pencil', 'eraser', 'fill'].map(tool => (
          <button
            key={tool}
            onClick={() => handleToolChange(tool)}
            className={currentTool === tool ? 'active' : ''}
          >
            {tool}
          </button>
        ))}
      </div>
      
      {/* Canvas with tracking */}
      <canvas
        ref={canvasRef}
        width={512}
        height={512}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        style={{ border: '1px solid #ccc', cursor: 'crosshair' }}
      />
      
      <div className="canvas-stats">
        <p>Current Tool: {currentTool}</p>
        <p>Pixels Modified: {pixelsModified}</p>
        <p>🟣 All interactions tracked with dignity</p>
      </div>
    </div>
  );
};

/**
 * Example 2: Enhanced AI Assistant with Sacred Empathy
 * 
 * Shows how to track AI interactions with appropriate dignity
 */
export const EnhancedAIAssistantExample = () => {
  const { trackAIRequest, trackAIResponse, trackAISuggestionApplied } = useAITracking();
  const { trackError } = useErrorTracking();
  
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    
    // Sacred tracking: AI request started
    trackAIRequest(prompt);
    console.log('🟣 AI interaction initiated with sacred purpose');

    try {
      // Simulate AI API call
      const response = await simulateAICall(prompt);
      
      // Sacred tracking: Successful AI response
      trackAIResponse(true);
      setSuggestions(response.suggestions);
      
      console.log('🟣 AI responded with wisdom and grace');
      
    } catch (error) {
      // Sacred tracking: AI error with empathy
      trackAIResponse(false, 'Our AI friend is taking a creative break. Please try again in a moment! 🤖');
      
      // Track with dignity (Sacred Edict #2)
      trackError('ai_service_error', error.toString(), 'AIAssistant');
      
      // Show user-friendly error (maintaining dignity)
      alert('🤖 Our AI assistant is busy helping other creators. Please try again in a moment!');
      
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplySuggestion = (suggestion: any, index: number) => {
    try {
      // Sacred tracking: Suggestion applied
      trackAISuggestionApplied(`suggestion_${index}`, true);
      
      console.log('🟣 AI suggestion applied successfully with user joy');
      alert('🎨 Suggestion applied! Your creation looks amazing!');
      
    } catch (error) {
      trackAISuggestionApplied(`suggestion_${index}`, false);
      trackError('ai_service_error', error.toString(), 'AIAssistant');
      
      alert('😅 That suggestion got a bit shy! Try another one or refresh to try again.');
    }
  };

  // Simulate AI call for example
  const simulateAICall = (prompt: string): Promise<{suggestions: any[]}> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.8) { // 20% error rate for demo
          reject(new Error('AI service temporarily unavailable'));
        } else {
          resolve({
            suggestions: [
              { id: 1, description: 'A friendly dragon with rainbow scales', confidence: 0.95 },
              { id: 2, description: 'A brave knight with shimmering armor', confidence: 0.88 }
            ]
          });
        }
      }, Math.random() * 2000 + 1000); // 1-3 second response time
    });
  };

  return (
    <div className="enhanced-ai-example">
      <h3>🤖 Enhanced AI Assistant with Sacred Empathy</h3>
      
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe your dream skin..."
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading || !prompt.trim()}>
          {isLoading ? '🤔 Thinking...' : '✨ Create Ideas'}
        </button>
      </form>
      
      {suggestions.length > 0 && (
        <div className="suggestions">
          <h4>💡 Creative Ideas</h4>
          {suggestions.map((suggestion, index) => (
            <div key={suggestion.id} className="suggestion">
              <p>{suggestion.description}</p>
              <p>Confidence: {(suggestion.confidence * 100).toFixed(0)}%</p>
              <button onClick={() => handleApplySuggestion(suggestion, index)}>
                🎨 Use This Idea
              </button>
            </div>
          ))}
        </div>
      )}
      
      <div className="ai-stats">
        <p>🟣 All AI interactions tracked with sacred empathy</p>
        <p>💡 Errors transformed into encouraging messages</p>
      </div>
    </div>
  );
};

/**
 * Example 3: Enhanced Navigation with Sacred Journey Tracking
 * 
 * Shows how to track user navigation patterns
 */
export const EnhancedNavigationExample = () => {
  const { trackPageVisit, trackPageExit, trackButtonClick } = useNavigationTracking();
  const [currentPage, setCurrentPage] = useState('home');

  useEffect(() => {
    // Track page visit when component mounts
    trackPageVisit(currentPage);
    console.log(`🟣 Sacred journey to ${currentPage} page begun`);

    return () => {
      // Track page exit when component unmounts
      trackPageExit(currentPage);
      console.log(`🟣 Sacred journey from ${currentPage} page completed with grace`);
    };
  }, [currentPage, trackPageVisit, trackPageExit]);

  const handleNavigation = (page: string) => {
    trackButtonClick(`navigate_to_${page}`, 'Navigation');
    setCurrentPage(page);
  };

  return (
    <div className="enhanced-navigation-example">
      <h3>🧭 Enhanced Navigation with Sacred Journey Tracking</h3>
      
      <nav className="navigation">
        {['home', 'editor', 'gallery'].map(page => (
          <button
            key={page}
            onClick={() => handleNavigation(page)}
            className={currentPage === page ? 'active' : ''}
          >
            {page.charAt(0).toUpperCase() + page.slice(1)}
          </button>
        ))}
      </nav>
      
      <div className="current-page">
        <h4>Current Page: {currentPage}</h4>
        <p>🟣 User journey tracked with sacred purpose</p>
      </div>
    </div>
  );
};

/**
 * Example 4: Enhanced Export with Sacred Completion Tracking
 * 
 * Shows how to track export operations with dignity
 */
export const EnhancedExportExample = () => {
  const { trackExportStart, trackExportComplete } = useExportTracking();
  const { trackError } = useErrorTracking();
  
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (exportType: 'save' | 'export' | 'minecraft') => {
    setIsExporting(true);
    
    // Sacred tracking: Export started
    trackExportStart(exportType);
    console.log(`🟣 Sacred ${exportType} ceremony initiated`);

    try {
      // Simulate export process
      await simulateExport(exportType);
      
      // Sacred tracking: Export completed successfully
      trackExportComplete(exportType, true);
      
      const successMessages = {
        save: '💾 Your masterpiece has been saved with love!',
        export: '📸 Your creation is ready to share with the world!',
        minecraft: '🎮 Your skin is ready for Minecraft adventures!'
      };
      
      alert(successMessages[exportType]);
      console.log(`🟣 Sacred ${exportType} ceremony completed with joy`);
      
    } catch (error) {
      // Sacred tracking: Export failed with dignity
      trackExportComplete(exportType, false, error.toString());
      trackError('export_failure', error.toString(), 'ExportManager');
      
      const errorMessages = {
        save: '😅 Your creation was so amazing it made our save system dizzy! Please try again.',
        export: '📸 The export camera got camera-shy! Give it another moment and try again.',
        minecraft: '🎮 The Minecraft portal had a hiccup! Please try your export again.'
      };
      
      alert(errorMessages[exportType]);
      console.log(`🟣 Sacred ${exportType} ceremony encountered graceful challenge`);
      
    } finally {
      setIsExporting(false);
    }
  };

  // Simulate export process
  const simulateExport = (exportType: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const exportTime = Math.random() * 3000 + 1000; // 1-4 seconds
      
      setTimeout(() => {
        if (Math.random() > 0.85) { // 15% error rate for demo
          reject(new Error(`${exportType} export failed`));
        } else {
          resolve();
        }
      }, exportTime);
    });
  };

  return (
    <div className="enhanced-export-example">
      <h3>💾 Enhanced Export with Sacred Completion Tracking</h3>
      
      <div className="export-buttons">
        {['save', 'export', 'minecraft'].map(type => (
          <button
            key={type}
            onClick={() => handleExport(type as any)}
            disabled={isExporting}
            className="export-button"
          >
            {isExporting ? '⏳ Processing...' : `${type.charAt(0).toUpperCase() + type.slice(1)}`}
          </button>
        ))}
      </div>
      
      <div className="export-stats">
        <p>🟣 All exports tracked with sacred completion ceremonies</p>
        <p>💖 Errors transformed into encouraging guidance</p>
      </div>
    </div>
  );
};

/**
 * Example 5: Enhanced Keyboard Shortcuts with Sacred Accessibility
 * 
 * Shows how to track keyboard interactions with dignity
 */
export const EnhancedKeyboardExample = () => {
  const { trackKeyboardShortcut, trackFocusManagement } = useKeyboardTracking();
  const [currentTool, setCurrentTool] = useState('pencil');
  const [focusedElement, setFocusedElement] = useState('none');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Tool shortcuts
      const toolShortcuts: Record<string, string> = {
        'p': 'pencil',
        'e': 'eraser',
        'f': 'fill',
        'i': 'picker'
      };

      if (toolShortcuts[e.key.toLowerCase()]) {
        const newTool = toolShortcuts[e.key.toLowerCase()];
        const success = newTool !== currentTool;
        
        // Sacred tracking: Keyboard shortcut used
        trackKeyboardShortcut(e.key.toUpperCase(), `select_${newTool}`, success);
        
        if (success) {
          setCurrentTool(newTool);
          console.log(`🟣 Sacred shortcut ${e.key.toUpperCase()} blessed the selection of ${newTool}`);
        }
      }

      // Save shortcut
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        trackKeyboardShortcut('Ctrl+S', 'save_project', true);
        console.log('🟣 Sacred save shortcut invoked with grace');
        alert('💾 Sacred save shortcut activated! (Demo)');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentTool, trackKeyboardShortcut]);

  const handleFocus = (element: string, method: 'mouse' | 'keyboard' | 'programmatic') => {
    setFocusedElement(element);
    trackFocusManagement(element, method);
    console.log(`🟣 Sacred focus granted to ${element} via ${method}`);
  };

  return (
    <div className="enhanced-keyboard-example">
      <h3>⌨️ Enhanced Keyboard with Sacred Accessibility</h3>
      
      <div className="keyboard-info">
        <p>Try these sacred shortcuts:</p>
        <ul>
          <li><strong>P</strong> - Select Pencil</li>
          <li><strong>E</strong> - Select Eraser</li>
          <li><strong>F</strong> - Select Fill</li>
          <li><strong>I</strong> - Select Picker</li>
          <li><strong>Ctrl+S</strong> - Save Project</li>
        </ul>
      </div>
      
      <div className="focus-test-elements">
        <button 
          onFocus={() => handleFocus('button1', 'keyboard')}
          onClick={() => handleFocus('button1', 'mouse')}
        >
          Focus Test Button 1
        </button>
        <button 
          onFocus={() => handleFocus('button2', 'keyboard')}
          onClick={() => handleFocus('button2', 'mouse')}
        >
          Focus Test Button 2
        </button>
      </div>
      
      <div className="keyboard-stats">
        <p>Current Tool: <strong>{currentTool}</strong></p>
        <p>Focused Element: <strong>{focusedElement}</strong></p>
        <p>🟣 All keyboard interactions tracked with sacred accessibility</p>
      </div>
    </div>
  );
};

/**
 * Example 6: Complete Integration Dashboard Control
 * 
 * Shows how to integrate the dashboard into the main application
 */
export const InteractionDashboardIntegrationExample = () => {
  const [showDashboard, setShowDashboard] = useState(false);
  const { generateWeeklyReport, generateGitHubIssues } = useGlobalTracking();

  const handleToggleDashboard = () => {
    setShowDashboard(!showDashboard);
    console.log('🟣 Sacred dashboard visibility toggled with divine authority');
  };

  const handleGenerateReport = () => {
    try {
      const report = generateWeeklyReport();
      console.log('🟣 Sacred weekly report generated for Cardinal review:', report);
      alert('📊 Weekly report generated! Check console for details.');
    } catch (error) {
      console.error('Failed to generate report:', error);
      alert('😅 Report generation took a creative break! Please try again.');
    }
  };

  const handleGenerateIssues = () => {
    try {
      const issues = generateGitHubIssues();
      console.log('🟣 Sacred GitHub issues generated for divine development:', issues);
      alert(`📋 ${issues.length} GitHub issues generated! Check console for details.`);
    } catch (error) {
      console.error('Failed to generate issues:', error);
      alert('😅 Issue generation had a shy moment! Please try again.');
    }
  };

  return (
    <div className="dashboard-integration-example">
      <h3>📊 Interaction Dashboard Integration</h3>
      
      <div className="dashboard-controls">
        <button onClick={handleToggleDashboard}>
          {showDashboard ? '🔒 Hide Sacred Dashboard' : '📊 Show Sacred Dashboard'}
        </button>
        <button onClick={handleGenerateReport}>
          📈 Generate Weekly Report
        </button>
        <button onClick={handleGenerateIssues}>
          📋 Generate GitHub Issues
        </button>
      </div>
      
      <div className="integration-stats">
        <p>Dashboard Visible: <strong>{showDashboard ? 'Yes' : 'No'}</strong></p>
        <p>🟣 Dashboard ready for Cardinal inspection</p>
        <p>📊 All reports blessed with sacred wisdom</p>
      </div>
      
      {/* The actual InteractionDashboard component would be imported and used here */}
      {showDashboard && (
        <div style={{
          padding: '20px',
          border: '2px solid #667eea',
          borderRadius: '8px',
          background: '#f0f4ff',
          marginTop: '20px'
        }}>
          <p>🟣 <strong>Sacred Dashboard Placeholder</strong></p>
          <p>Import and use the InteractionDashboard component here:</p>
          <pre style={{ background: '#e5e7eb', padding: '10px', borderRadius: '4px' }}>
{`import InteractionDashboard from '../components/InteractionDashboard';

<InteractionDashboard 
  isVisible={showDashboard} 
  onClose={() => setShowDashboard(false)} 
/>`}
          </pre>
        </div>
      )}
    </div>
  );
};

/**
 * Main Example Component showing all integrations
 */
export const InteractionTrackingShowcase = () => {
  return (
    <div className="interaction-tracking-showcase">
      <header style={{ 
        textAlign: 'center', 
        padding: '30px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        borderRadius: '12px',
        marginBottom: '30px'
      }}>
        <h1>🟣 Sacred Interaction Tracking Integration Examples</h1>
        <p>Following the Five Sacred Edicts with dignity, purpose, and empathy</p>
        <p><em>Blessed by Brother_PixelKeeper • Guided by Cardinal_Maximus</em></p>
      </header>
      
      <div style={{ display: 'grid', gap: '30px' }}>
        <EnhancedPixelCanvasExample />
        <EnhancedAIAssistantExample />
        <EnhancedNavigationExample />
        <EnhancedExportExample />
        <EnhancedKeyboardExample />
        <InteractionDashboardIntegrationExample />
      </div>
      
      <footer style={{
        textAlign: 'center',
        marginTop: '40px',
        padding: '20px',
        borderTop: '2px solid #667eea',
        color: '#667eea'
      }}>
        <p>✨ "Through measurement comes understanding, through understanding comes improvement" ✨</p>
        <p>🟣 All interactions tracked with sacred purpose and user dignity</p>
      </footer>
    </div>
  );
};

export default InteractionTrackingShowcase;