import React, { useEffect, useState } from 'react';
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
import InteractionDashboard from '../components/InteractionDashboard';
import '../styles/TrackingDemo.css';

const TrackingDemo: React.FC = () => {
  const [showDashboard, setShowDashboard] = useState(false);
  const [demoLog, setDemoLog] = useState<string[]>([]);
  
  // Initialize all tracking hooks
  const canvasTracking = useCanvasTracking();
  const aiTracking = useAITracking();
  const toolTracking = useToolTracking();
  const navigationTracking = useNavigationTracking();
  const exportTracking = useExportTracking();
  const keyboardTracking = useKeyboardTracking();
  const errorTracking = useErrorTracking();
  const { startSession, endSession, generateCardinalReport } = useGlobalTracking();

  // Start session on mount
  useEffect(() => {
    startSession();
    navigationTracking.trackPageVisit('tracking-demo');
    addLog('🙏 Blessed tracking session started');
    
    return () => {
      endSession();
    };
  }, []);

  const addLog = (message: string) => {
    setDemoLog(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
  };

  // Demo functions
  const demoCanvasDrawing = () => {
    addLog('🎨 Simulating canvas drawing...');
    canvasTracking.trackDrawing('pencil', Date.now(), 1500, 256);
    canvasTracking.trackPerformance(75, 45); // 75 FPS, 45MB memory
    addLog('✅ Canvas interaction tracked with 75 FPS');
  };

  const demoToolChange = () => {
    const tools = ['pencil', 'eraser', 'fill', 'eyedropper'];
    const randomTool = tools[Math.floor(Math.random() * tools.length)];
    addLog(`🔧 Changing tool to: ${randomTool}`);
    toolTracking.trackToolChange(randomTool);
    addLog('✅ Tool change tracked');
  };

  const demoColorSelection = () => {
    const colors = ['#FF0000', '#00FF00', '#0000FF', '#FFD700'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    addLog(`🎨 Selecting color: ${randomColor}`);
    toolTracking.trackColorSelection(randomColor, 'palette');
    addLog('✅ Color selection tracked');
  };

  const demoAIRequest = async () => {
    const prompts = [
      'Create a dragon skin',
      'Make me a rainbow cat',
      'Design a space warrior',
      'Generate a flower princess'
    ];
    const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
    const requestId = Date.now().toString();
    
    addLog(`🤖 AI Request: "${randomPrompt}"`);
    aiTracking.trackAIRequest(requestId, randomPrompt);
    
    // Simulate AI response after delay
    setTimeout(() => {
      aiTracking.trackAIResponse(
        requestId,
        `Here's your ${randomPrompt}! [Generated suggestion]`,
        true,
        1200
      );
      addLog('✅ AI response tracked (1.2s response time)');
    }, 1200);
  };

  const demoError = () => {
    addLog('❌ Simulating an error...');
    try {
      throw new Error('Pixel out of bounds');
    } catch (error) {
      errorTracking.trackError(error as Error, 'canvas_drawing', {
        tool: 'pencil',
        position: { x: 999, y: 999 }
      });
      addLog('✅ Error tracked with dignity and empathy');
    }
  };

  const demoExport = () => {
    addLog('💾 Simulating export operation...');
    exportTracking.trackExportAction('png', true, 850, 2048);
    addLog('✅ Export tracked (850ms, 2KB file)');
  };

  const demoKeyboard = () => {
    const shortcuts = ['Ctrl+Z', 'Ctrl+S', 'Ctrl+C', 'Ctrl+V'];
    const randomShortcut = shortcuts[Math.floor(Math.random() * shortcuts.length)];
    addLog(`⌨️ Keyboard shortcut: ${randomShortcut}`);
    keyboardTracking.trackShortcut(randomShortcut);
    addLog('✅ Keyboard interaction tracked');
  };

  const runFullDemo = async () => {
    addLog('🎊 Starting full tracking demonstration...');
    
    // Run all demos with delays
    const demos = [
      demoCanvasDrawing,
      demoToolChange,
      demoColorSelection,
      demoAIRequest,
      demoError,
      demoExport,
      demoKeyboard
    ];
    
    for (const demo of demos) {
      demo();
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    addLog('🌟 Full demonstration complete!');
    addLog('📊 Check the dashboard for tracked metrics');
  };

  const generateReport = () => {
    addLog('📜 Generating Cardinal compliance report...');
    const report = generateCardinalReport();
    console.log('Cardinal Report:', report);
    addLog('✅ Cardinal report generated (check console)');
    
    // Also log summary
    const stored = localStorage.getItem('claude_ethos_summary');
    if (stored) {
      const summary = JSON.parse(stored);
      addLog(`📊 Summary: ${summary.totalInteractions} interactions tracked`);
      addLog(`🙏 Cardinal Score: ${summary.cardinalScore}/100`);
    }
  };

  return (
    <div className="tracking-demo">
      <h1>🙏 Blessed Interaction Tracking Demo</h1>
      
      <div className="demo-controls">
        <h2>Test Individual Features</h2>
        <div className="button-grid">
          <button onClick={demoCanvasDrawing}>🎨 Canvas Drawing</button>
          <button onClick={demoToolChange}>🔧 Tool Change</button>
          <button onClick={demoColorSelection}>🎨 Color Selection</button>
          <button onClick={demoAIRequest}>🤖 AI Request</button>
          <button onClick={demoError}>❌ Error Handling</button>
          <button onClick={demoExport}>💾 Export Action</button>
          <button onClick={demoKeyboard}>⌨️ Keyboard Shortcut</button>
        </div>
        
        <div className="action-buttons">
          <button onClick={runFullDemo} className="primary">
            🎊 Run Full Demo
          </button>
          <button onClick={generateReport} className="secondary">
            📜 Generate Cardinal Report
          </button>
          <button 
            onClick={() => setShowDashboard(!showDashboard)}
            className="dashboard-toggle"
          >
            📊 {showDashboard ? 'Hide' : 'Show'} Dashboard
          </button>
        </div>
      </div>
      
      <div className="demo-log">
        <h3>📝 Tracking Log</h3>
        <div className="log-content">
          {demoLog.map((log, index) => (
            <div key={index} className="log-entry">{log}</div>
          ))}
        </div>
      </div>
      
      {showDashboard && (
        <div className="dashboard-container">
          <h2>📊 Interaction Tracking Dashboard</h2>
          <InteractionDashboard />
        </div>
      )}
      
      <div className="tracking-info">
        <h3>🛡️ Five Sacred Edicts Compliance</h3>
        <ul>
          <li>✅ Privacy Protection - All data stored locally</li>
          <li>✅ Dignity in Interactions - Errors handled with empathy</li>
          <li>✅ Performance Monitoring - FPS and metrics tracked</li>
          <li>✅ Purposeful Tracking - Every metric has a goal</li>
          <li>✅ Continuous Improvement - Cardinal reports generated</li>
        </ul>
      </div>
    </div>
  );
};

export default TrackingDemo;