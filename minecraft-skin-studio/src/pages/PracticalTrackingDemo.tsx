import React, { useState, useEffect } from 'react';
import { practicalLogger } from '../services/practicalInteractionLogger';
import '../styles/PracticalDemo.css';

const PracticalTrackingDemo: React.FC = () => {
  const [logs, setLogs] = useState(practicalLogger.getRecentLogs(10));
  const [complianceReport, setComplianceReport] = useState(practicalLogger.getComplianceReport());
  const [insights, setInsights] = useState(practicalLogger.getActionableInsights());

  const refreshData = () => {
    setLogs(practicalLogger.getRecentLogs(10));
    setComplianceReport(practicalLogger.getComplianceReport());
    setInsights(practicalLogger.getActionableInsights());
  };

  // Simulate real interactions that would happen in the app
  const simulateCanvasDrawing = () => {
    const fps = 58 + Math.random() * 20; // 58-78 FPS
    const logId = practicalLogger.logCanvasInteraction('pixel_drawing', {
      fps: Math.round(fps),
      duration: 1500,
      pixelsModified: 156,
      tool: 'pencil',
      performance: fps > 60 ? 'good' : fps > 50 ? 'degraded' : 'poor'
    });
    console.log('Canvas interaction logged:', logId);
    refreshData();
  };

  const simulateAIRequest = () => {
    const success = Math.random() > 0.15; // 85% success rate
    const responseTime = 800 + Math.random() * 2000; // 0.8-2.8s
    
    const logId = practicalLogger.logAIInteraction('generate_suggestion', {
      prompt: 'Create a dragon knight skin with armor details',
      responseTime: Math.round(responseTime),
      success,
      fallbackUsed: !success,
      userFriendlyMessage: success ? 
        'Here are some creative ideas for your dragon knight!' : 
        'AI is taking a creative break. Here are some pre-made suggestions!'
    });
    console.log('AI interaction logged:', logId);
    refreshData();
  };

  const simulateError = () => {
    const error = new Error('Canvas context lost');
    const logId = practicalLogger.logError(error, 'canvas_rendering', {
      userImpact: 'Drawing temporarily unavailable',
      recoveryAction: 'Canvas automatically refreshed',
      fallbackProvided: true,
      technicalDetails: { context: 'webgl', recovery: 'context_restore' }
    });
    console.log('Error logged:', logId);
    refreshData();
  };

  const simulateExport = () => {
    const success = Math.random() > 0.05; // 95% success rate
    const duration = 400 + Math.random() * 800; // 0.4-1.2s
    
    const logId = practicalLogger.logExportAction('save_png', {
      format: 'png',
      success,
      fileSize: success ? 2048 + Math.random() * 1024 : undefined,
      duration: Math.round(duration),
      error: success ? undefined : 'Insufficient storage space'
    });
    console.log('Export logged:', logId);
    refreshData();
  };

  const simulateToolChange = () => {
    const tools = ['pencil', 'eraser', 'fill', 'eyedropper'];
    const fromTool = tools[Math.floor(Math.random() * tools.length)];
    const toTool = tools[Math.floor(Math.random() * tools.length)];
    
    const logId = practicalLogger.logToolChange(fromTool, toTool, {
      usage_frequency: Math.round(Math.random() * 10),
      user_efficiency: Math.round(80 + Math.random() * 20)
    });
    console.log('Tool change logged:', logId);
    refreshData();
  };

  const clearAllLogs = () => {
    practicalLogger.clearLogs();
    refreshData();
  };

  const downloadLogFile = () => {
    const url = (window as any).lastLogFileUrl;
    const fileName = (window as any).lastLogFileName;
    
    if (url && fileName) {
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      console.log('📥 Log file downloaded:', fileName);
    } else {
      console.log('❌ No log file available for download. Try logging some interactions first.');
    }
  };

  // Add global download function
  useEffect(() => {
    (window as any).downloadLogFile = downloadLogFile;
    return () => {
      delete (window as any).downloadLogFile;
    };
  }, []);

  useEffect(() => {
    refreshData();
  }, []);

  return (
    <div className="practical-demo">
      <h1>Practical Interaction Tracking</h1>
      <p className="subtitle">
        Five Sacred Edicts as Process Instructions - No Ceremony, Only Results
      </p>

      <div className="demo-controls">
        <h2>Simulate Real App Interactions</h2>
        <div className="control-buttons">
          <button onClick={simulateCanvasDrawing} className="canvas-btn">
            🎨 Canvas Drawing
          </button>
          <button onClick={simulateAIRequest} className="ai-btn">
            🤖 AI Request
          </button>
          <button onClick={simulateError} className="error-btn">
            ⚠️ Handle Error
          </button>
          <button onClick={simulateExport} className="export-btn">
            💾 Export File
          </button>
          <button onClick={simulateToolChange} className="tool-btn">
            🔧 Change Tool
          </button>
          <button onClick={clearAllLogs} className="clear-btn">
            🧹 Clear Logs
          </button>
          <button onClick={downloadLogFile} className="download-btn">
            📥 Download Log File
          </button>
        </div>
      </div>

      <div className="results-grid">
        <div className="compliance-panel">
          <h3>Five Sacred Edicts Compliance</h3>
          <div className="compliance-metrics">
            <div className="metric">
              <span className="metric-name">Evidence</span>
              <span className="metric-value">{complianceReport.evidenceCompliance}%</span>
            </div>
            <div className="metric">
              <span className="metric-name">Commitment</span>
              <span className="metric-value">{complianceReport.commitmentCompliance}%</span>
            </div>
            <div className="metric">
              <span className="metric-name">Transformation</span>
              <span className="metric-value">{complianceReport.transformationCompliance}%</span>
            </div>
            <div className="metric">
              <span className="metric-name">Dignified Error</span>
              <span className="metric-value">{complianceReport.errorHandlingCompliance}%</span>
            </div>
            <div className="metric">
              <span className="metric-name">Absolute Truth</span>
              <span className="metric-value">{complianceReport.truthCompliance}%</span>
            </div>
          </div>
          <div className="overall-score">
            Overall Compliance: {complianceReport.overallCompliance}%
          </div>
        </div>

        <div className="insights-panel">
          <h3>Actionable Insights</h3>
          {insights.performanceIssues.length > 0 && (
            <div className="insight-section">
              <h4>Performance Issues</h4>
              <ul>
                {insights.performanceIssues.map((issue, i) => (
                  <li key={i}>{issue}</li>
                ))}
              </ul>
            </div>
          )}
          {insights.userStrugglePoints.length > 0 && (
            <div className="insight-section">
              <h4>User Struggle Points</h4>
              <ul>
                {insights.userStrugglePoints.map((point, i) => (
                  <li key={i}>{point}</li>
                ))}
              </ul>
            </div>
          )}
          {insights.improvementOpportunities.length > 0 && (
            <div className="insight-section">
              <h4>Improvement Opportunities</h4>
              <ul>
                {insights.improvementOpportunities.map((opp, i) => (
                  <li key={i}>{opp}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="logs-panel">
          <h3>Recent Interaction Logs</h3>
          <div className="logs-list">
            {logs.length === 0 ? (
              <div className="no-logs">No interactions logged yet. Try the buttons above!</div>
            ) : (
              logs.map((log) => (
                <div key={log.id} className="log-item">
                  <div className="log-header">
                    <span className="log-type">{log.type}</span>
                    <span className="log-action">{log.action}</span>
                    <span className="log-time">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="log-compliance">
                    {log.evidence && Object.keys(log.evidence).length > 0 && (
                      <span className="edict-badge evidence">📊 Evidence</span>
                    )}
                    {log.committed && (
                      <span className="edict-badge commitment">💾 Committed</span>
                    )}
                    {log.documented && (
                      <span className="edict-badge transformation">📝 Documented</span>
                    )}
                    {log.errorHandled && (
                      <span className="edict-badge error">🛟 Error Handled</span>
                    )}
                    {log.verified && (
                      <span className="edict-badge truth">✅ Verified</span>
                    )}
                  </div>
                  <div className="log-evidence">
                    {JSON.stringify(log.evidence, null, 2).slice(0, 200)}
                    {JSON.stringify(log.evidence).length > 200 && '...'}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="recommendations-panel">
        <h3>Process Improvement Recommendations</h3>
        <ul>
          {complianceReport.recommendations.map((rec, i) => (
            <li key={i}>{rec}</li>
          ))}
        </ul>
      </div>

      <div className="technical-details">
        <h3>Technical Implementation</h3>
        <ul>
          <li>✅ Evidence Edict: All actions logged with concrete proof (FPS, timing, file sizes)</li>
          <li>✅ Commitment Edict: Critical interactions marked for preservation</li>
          <li>✅ Transformation Edict: Changes documented for future analysis</li>
          <li>✅ Dignified Error Edict: Errors logged with recovery actions</li>
          <li>✅ Absolute Truth Edict: All metrics verified and measurable</li>
          <li>🔒 Privacy: Data stored locally, prompts sanitized</li>
          <li>📈 Actionable: Generates real insights for development team</li>
          <li>📄 <strong>LIVE LOGGING:</strong> Creates actual downloadable log files</li>
          <li>🖥️ <strong>Console Output:</strong> Check browser console for detailed log data</li>
          <li>💾 <strong>File Generation:</strong> Each interaction updates a real JSON file</li>
        </ul>
        
        <div className="file-info">
          <h4>📁 Log File Details</h4>
          <p><strong>Storage:</strong> Browser localStorage + downloadable files</p>
          <p><strong>Format:</strong> JSON with session ID, compliance metrics, insights</p>
          <p><strong>Access:</strong> Browser console shows: "📄 INTERACTION LOG FILE GENERATED"</p>
          <p><strong>Download:</strong> Click "📥 Download Log File" or use <code>window.downloadLogFile()</code></p>
        </div>
      </div>
    </div>
  );
};

export default PracticalTrackingDemo;