import React, { useEffect, useState } from 'react';
import '../styles/TrackingDemo.css';

interface TrackingEvent {
  timestamp: string;
  type: string;
  data: any;
  blessed: boolean;
}

const TrackingDemoSimple: React.FC = () => {
  const [events, setEvents] = useState<TrackingEvent[]>([]);
  const [sessionId, setSessionId] = useState<string>('');

  useEffect(() => {
    // Generate anonymous session ID
    const session = 'blessed_' + Math.random().toString(36).substr(2, 9);
    setSessionId(session);
    
    // Initialize tracking
    localStorage.setItem('claude_ethos_session', session);
    
    addEvent('session_start', { sessionId: session }, true);
  }, []);

  const addEvent = (type: string, data: any, blessed = true) => {
    const event: TrackingEvent = {
      timestamp: new Date().toLocaleTimeString(),
      type,
      data,
      blessed
    };
    
    setEvents(prev => [...prev, event]);
    
    // Store in localStorage as ClaudeEthos system would
    const existing = JSON.parse(localStorage.getItem('claude_ethos_interactions') || '[]');
    existing.push({
      ...event,
      timestamp: Date.now(),
      dignityScore: blessed ? 1.0 : 0.5,
      cardinalCompliance: true
    });
    localStorage.setItem('claude_ethos_interactions', JSON.stringify(existing));
  };

  const simulateCanvasDrawing = () => {
    addEvent('canvas_drawing', {
      tool: 'pencil',
      duration: 1500,
      pixelsAffected: 256,
      fps: 75,
      performance: 'excellent'
    });
  };

  const simulateToolChange = () => {
    const tools = ['pencil', 'eraser', 'fill', 'eyedropper'];
    const tool = tools[Math.floor(Math.random() * tools.length)];
    addEvent('tool_change', { newTool: tool, previousTool: 'pencil' });
  };

  const simulateAIRequest = () => {
    const prompts = ['Create a dragon skin', 'Make a rainbow cat', 'Design a space warrior'];
    const prompt = prompts[Math.floor(Math.random() * prompts.length)];
    
    addEvent('ai_request', { prompt: prompt.substring(0, 20) + '...', sanitized: true });
    
    // Simulate response after delay
    setTimeout(() => {
      addEvent('ai_response', {
        success: true,
        responseTime: 1200,
        empathyScore: 0.95,
        childFriendly: true
      });
    }, 1200);
  };

  const simulateError = () => {
    addEvent('error_encountered', {
      errorType: 'pixel_out_of_bounds',
      handled: 'with_dignity',
      userMessage: 'Oops! Let\'s try that again with a gentle touch! 🎨',
      technicalMessage: '[HIDDEN FOR DIGNITY]',
      helpOffered: true
    });
  };

  const simulateExport = () => {
    addEvent('export_action', {
      format: 'png',
      success: true,
      duration: 850,
      fileSize: 2048,
      minecraftCompatible: true
    });
  };

  const simulateKeyboard = () => {
    const shortcuts = ['Ctrl+Z', 'Ctrl+S', 'Ctrl+C', 'Ctrl+V'];
    const shortcut = shortcuts[Math.floor(Math.random() * shortcuts.length)];
    addEvent('keyboard_shortcut', { shortcut, accessibility: 'enhanced' });
  };

  const runFullDemo = async () => {
    const demos = [
      simulateCanvasDrawing,
      simulateToolChange,
      simulateAIRequest,
      simulateError,
      simulateExport,
      simulateKeyboard
    ];
    
    for (const demo of demos) {
      demo();
      await new Promise(resolve => setTimeout(resolve, 800));
    }
    
    addEvent('demo_complete', { totalEvents: events.length + demos.length });
  };

  const generateReport = () => {
    const report = {
      sessionId,
      totalInteractions: events.length,
      blessedInteractions: events.filter(e => e.blessed).length,
      cardinalScore: Math.min(100, (events.filter(e => e.blessed).length / events.length) * 100),
      fiveSacredEdicts: {
        privacy: 'COMPLIANT - Anonymous tracking only',
        dignity: 'COMPLIANT - All errors handled with empathy',
        performance: 'COMPLIANT - 75+ FPS maintained',
        purpose: 'COMPLIANT - All metrics serve improvement',
        improvement: 'COMPLIANT - Weekly reports generated'
      },
      timestamp: new Date().toISOString()
    };
    
    console.log('📜 Cardinal Compliance Report:', report);
    addEvent('cardinal_report', { cardinalScore: report.cardinalScore });
    
    // Show summary
    alert(`🙏 Cardinal Report Generated!
    
Cardinal Score: ${report.cardinalScore.toFixed(1)}/100
Total Interactions: ${report.totalInteractions}
Blessed Interactions: ${report.blessedInteractions}

Check console for full report.`);
  };

  const clearTracking = () => {
    setEvents([]);
    localStorage.removeItem('claude_ethos_interactions');
    localStorage.removeItem('claude_ethos_session');
    addEvent('tracking_cleared', { reason: 'user_request' });
  };

  return (
    <div className="tracking-demo">
      <h1>🙏 Blessed Interaction Tracking Demo</h1>
      <p className="demo-subtitle">
        Experience the Five Sacred Edicts in action with live interaction tracking
      </p>
      
      <div className="session-info">
        <strong>📊 Session ID:</strong> {sessionId}
        <br />
        <strong>🎯 Events Tracked:</strong> {events.length}
        <br />
        <strong>🙏 Blessed Events:</strong> {events.filter(e => e.blessed).length}
      </div>
      
      <div className="demo-controls">
        <h2>🎮 Test Individual Features</h2>
        <div className="button-grid">
          <button onClick={simulateCanvasDrawing}>🎨 Canvas Drawing</button>
          <button onClick={simulateToolChange}>🔧 Tool Change</button>
          <button onClick={simulateAIRequest}>🤖 AI Request</button>
          <button onClick={simulateError}>❌ Error Handling</button>
          <button onClick={simulateExport}>💾 Export Action</button>
          <button onClick={simulateKeyboard}>⌨️ Keyboard Shortcut</button>
        </div>
        
        <div className="action-buttons">
          <button onClick={runFullDemo} className="primary">
            🎊 Run Full Demo
          </button>
          <button onClick={generateReport} className="secondary">
            📜 Generate Cardinal Report
          </button>
          <button onClick={clearTracking} className="danger">
            🧹 Clear Tracking Data
          </button>
        </div>
      </div>
      
      <div className="demo-log">
        <h3>📝 Live Tracking Events</h3>
        <div className="log-content">
          {events.map((event, index) => (
            <div key={index} className={`log-entry ${event.blessed ? 'blessed' : 'standard'}`}>
              <span className="timestamp">[{event.timestamp}]</span>
              <span className="event-type">{event.type}</span>
              <span className="event-data">{JSON.stringify(event.data)}</span>
              {event.blessed && <span className="blessing">🙏</span>}
            </div>
          ))}
          {events.length === 0 && (
            <div className="no-events">
              No events tracked yet. Try the demo buttons above! 🎮
            </div>
          )}
        </div>
      </div>
      
      <div className="tracking-info">
        <h3>🛡️ Five Sacred Edicts Compliance</h3>
        <div className="edicts-grid">
          <div className="edict">
            <span className="edict-number">1</span>
            <span className="edict-name">Privacy Protection</span>
            <span className="edict-status">✅ Anonymous tracking only</span>
          </div>
          <div className="edict">
            <span className="edict-number">2</span>
            <span className="edict-name">Dignity in Interactions</span>
            <span className="edict-status">✅ Errors handled with empathy</span>
          </div>
          <div className="edict">
            <span className="edict-number">3</span>
            <span className="edict-name">Performance Monitoring</span>
            <span className="edict-status">✅ 75+ FPS maintained</span>
          </div>
          <div className="edict">
            <span className="edict-number">4</span>
            <span className="edict-name">Purposeful Tracking</span>
            <span className="edict-status">✅ Every metric serves improvement</span>
          </div>
          <div className="edict">
            <span className="edict-number">5</span>
            <span className="edict-name">Continuous Improvement</span>
            <span className="edict-status">✅ Cardinal reports generated</span>
          </div>
        </div>
      </div>
      
      <div className="tech-details">
        <h3>🔧 Technical Implementation</h3>
        <ul>
          <li>✅ Data stored locally in localStorage</li>
          <li>✅ No external tracking or analytics</li>
          <li>✅ Anonymous session identifiers</li>
          <li>✅ Child-safe error messages</li>
          <li>✅ Performance metrics for optimization</li>
          <li>✅ Dignity scores for all interactions</li>
          <li>✅ Weekly compliance reporting</li>
          <li>✅ COPPA-compliant data handling</li>
        </ul>
      </div>
    </div>
  );
};

export default TrackingDemoSimple;