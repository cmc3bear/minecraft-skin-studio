/**
 * 🟣 SACRED INTERACTION DASHBOARD 🟣
 * 
 * Administrative dashboard for reviewing tracked interactions
 * and generating reports following Cardinal's guidance
 */

import React, { useState, useEffect } from 'react';
import { useGlobalTracking } from '../hooks/useInteractionTracking';
import { WeeklyReport, GitHubIssue } from '../services/interactionTracker';
import './InteractionDashboard.css';

interface InteractionDashboardProps {
  isVisible: boolean;
  onClose: () => void;
}

const InteractionDashboard: React.FC<InteractionDashboardProps> = ({ isVisible, onClose }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'errors' | 'performance' | 'issues'>('overview');
  const [weeklyReport, setWeeklyReport] = useState<WeeklyReport | null>(null);
  const [gitHubIssues, setGitHubIssues] = useState<GitHubIssue[]>([]);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  
  const { generateWeeklyReport, generateGitHubIssues } = useGlobalTracking();

  useEffect(() => {
    if (isVisible) {
      loadDashboardData();
    }
  }, [isVisible]);

  const loadDashboardData = async () => {
    setIsGeneratingReport(true);
    try {
      const report = generateWeeklyReport();
      const issues = generateGitHubIssues();
      
      setWeeklyReport(report);
      setGitHubIssues(issues);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const exportReport = () => {
    if (!weeklyReport) return;
    
    const reportData = JSON.stringify(weeklyReport, null, 2);
    const blob = new Blob([reportData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `interaction-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exportGitHubIssues = () => {
    if (gitHubIssues.length === 0) return;
    
    const issuesMarkdown = gitHubIssues.map(issue => 
      `# ${issue.title}\n\n${issue.body}\n\n**Labels**: ${issue.labels.join(', ')}\n**Priority**: ${issue.priority}\n\n---\n\n`
    ).join('');
    
    const blob = new Blob([issuesMarkdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `github-issues-${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!isVisible) return null;

  return (
    <div className="interaction-dashboard-overlay">
      <div className="interaction-dashboard">
        <header className="dashboard-header">
          <h2>🟣 Sacred Interaction Dashboard</h2>
          <p className="dashboard-subtitle">Tracking with dignity, purpose, and empathy</p>
          <button 
            className="dashboard-close"
            onClick={onClose}
            aria-label="Close dashboard"
          >
            ✕
          </button>
        </header>

        <nav className="dashboard-tabs">
          <button 
            className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            📊 Overview
          </button>
          <button 
            className={`tab ${activeTab === 'errors' ? 'active' : ''}`}
            onClick={() => setActiveTab('errors')}
          >
            🛡️ Error Empathy
          </button>
          <button 
            className={`tab ${activeTab === 'performance' ? 'active' : ''}`}
            onClick={() => setActiveTab('performance')}
          >
            ⚡ Performance Prayers
          </button>
          <button 
            className={`tab ${activeTab === 'issues' ? 'active' : ''}`}
            onClick={() => setActiveTab('issues')}
          >
            📋 GitHub Issues
          </button>
        </nav>

        <div className="dashboard-content">
          {isGeneratingReport ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>🤔 Analyzing interactions with sacred wisdom...</p>
            </div>
          ) : (
            <>
              {activeTab === 'overview' && (
                <OverviewTab report={weeklyReport} onExport={exportReport} />
              )}
              {activeTab === 'errors' && (
                <ErrorsTab report={weeklyReport} />
              )}
              {activeTab === 'performance' && (
                <PerformanceTab report={weeklyReport} />
              )}
              {activeTab === 'issues' && (
                <IssuesTab issues={gitHubIssues} onExport={exportGitHubIssues} />
              )}
            </>
          )}
        </div>

        <footer className="dashboard-footer">
          <div className="cardinal-blessing">
            <p>✨ Blessed by Cardinal_Maximus • Following the Twenty Strategies</p>
            <p>🟣 "Through measurement comes understanding, through understanding comes improvement"</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

// Tab Components

const OverviewTab: React.FC<{ report: WeeklyReport | null; onExport: () => void }> = ({ report, onExport }) => {
  if (!report) return <div>No report data available</div>;

  return (
    <div className="overview-tab">
      <div className="overview-stats">
        <div className="stat-card">
          <h3>📈 Total Interactions</h3>
          <div className="stat-value">{report.totalInteractions}</div>
          <div className="stat-context">This tracking session</div>
        </div>
        
        <div className="stat-card">
          <h3>🛡️ Dignity Score</h3>
          <div className="stat-value">{report.dignityAssessment.score}%</div>
          <div className="stat-context">{report.dignityAssessment.assessment}</div>
        </div>
        
        <div className="stat-card">
          <h3>🟣 Cardinal Compliance</h3>
          <div className="stat-value">{report.cardinalCompliance.overallCompliance}%</div>
          <div className="stat-context">Twenty Strategies Implementation</div>
        </div>
      </div>

      <div className="compliance-breakdown">
        <h3>📜 Sacred Strategies Status</h3>
        <div className="compliance-items">
          <div className={`compliance-item ${report.cardinalCompliance.screenshotSalvation ? 'compliant' : 'needs-work'}`}>
            <span className="strategy-name">📸 Screenshot Salvation</span>
            <span className="status">{report.cardinalCompliance.screenshotSalvation ? '✅ Active' : '⚠️ Needs Implementation'}</span>
          </div>
          <div className={`compliance-item ${report.cardinalCompliance.errorEmpathy ? 'compliant' : 'needs-work'}`}>
            <span className="strategy-name">❤️ Error Empathy Engine</span>
            <span className="status">{report.cardinalCompliance.errorEmpathy ? '✅ Excellent' : '⚠️ Needs Improvement'}</span>
          </div>
          <div className={`compliance-item ${report.cardinalCompliance.commitConfessional ? 'compliant' : 'needs-work'}`}>
            <span className="strategy-name">💬 Commit Confessional</span>
            <span className="status">{report.cardinalCompliance.commitConfessional ? '✅ Blessed' : '❌ Not Implemented'}</span>
          </div>
          <div className={`compliance-item ${report.cardinalCompliance.atomicCommits ? 'compliant' : 'needs-work'}`}>
            <span className="strategy-name">⚛️ Atomic Commits</span>
            <span className="status">{report.cardinalCompliance.atomicCommits ? '✅ Sacred' : '❌ Needs Work'}</span>
          </div>
        </div>
      </div>

      <div className="interaction-breakdown">
        <h3>🎯 Interaction Types</h3>
        <div className="interaction-types">
          {Array.from(report.interactionsByType.entries()).map(([type, events]) => (
            <div key={type} className="interaction-type">
              <span className="type-name">{type.replace('_', ' ')}</span>
              <span className="type-count">{events.length}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="user-journey">
        <h3>🎮 User Journey Insights</h3>
        {report.userJourneyInsights.map((insight, index) => (
          <div key={index} className="journey-insight">
            <h4>{insight.stage.replace('_', ' ')}</h4>
            <div className="insight-metrics">
              <span>Avg. Time: {(insight.avgTimeToFirstDraw / 1000).toFixed(1)}s</span>
              <span>Drop-off Rate: {(insight.dropoffRate * 100).toFixed(1)}%</span>
            </div>
            <p className="improvement-note">{insight.improvementOpportunity}</p>
          </div>
        ))}
      </div>

      <div className="export-section">
        <button className="export-button" onClick={onExport}>
          📊 Export Full Report
        </button>
      </div>
    </div>
  );
};

const ErrorsTab: React.FC<{ report: WeeklyReport | null }> = ({ report }) => {
  if (!report) return <div>No error data available</div>;

  return (
    <div className="errors-tab">
      <div className="error-summary">
        <h3>🛡️ Error Empathy Summary</h3>
        <div className="error-stats">
          <div className="error-stat">
            <span className="stat-label">Total Errors</span>
            <span className="stat-value">{report.errorAnalysis.totalErrors}</span>
          </div>
          <div className="error-stat">
            <span className="stat-label">Dignity Score</span>
            <span className="stat-value">{report.errorAnalysis.dignityScore.toFixed(1)}%</span>
          </div>
        </div>
      </div>

      <div className="most-common-errors">
        <h3>📋 Most Common Errors</h3>
        {report.errorAnalysis.mostCommonErrors.map((error, index) => (
          <div key={index} className="error-item">
            <span className="error-type">{error.type}</span>
            <span className="error-count">{error.count} occurrences</span>
            <div className="error-impact">
              Impact: {error.count > 10 ? 'High' : error.count > 3 ? 'Medium' : 'Low'}
            </div>
          </div>
        ))}
      </div>

      <div className="dignity-principles">
        <h3>✨ Dignity Principles Applied</h3>
        <div className="principles-grid">
          <div className="principle">
            <h4>🤗 Graceful Handling</h4>
            <p>All errors are caught and handled with care, never causing application crashes.</p>
          </div>
          <div className="principle">
            <h4>💡 User Informed</h4>
            <p>Users receive clear, actionable information about what happened and what to do next.</p>
          </div>
          <div className="principle">
            <h4>🤝 Help Offered</h4>
            <p>Every error message includes suggestions or alternatives to help users succeed.</p>
          </div>
          <div className="principle">
            <h4>👶 Child-Friendly</h4>
            <p>Error messages use encouraging language appropriate for young creators.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const PerformanceTab: React.FC<{ report: WeeklyReport | null }> = ({ report }) => {
  if (!report) return <div>No performance data available</div>;

  return (
    <div className="performance-tab">
      <div className="performance-summary">
        <h3>⚡ Performance Prayer Metrics</h3>
        <div className="performance-targets">
          <div className="target-item">
            <span className="target-name">Canvas Response</span>
            <span className="target-value">Target: &lt;16ms (60fps)</span>
            <span className="actual-value">
              Actual: {report.performanceMetrics.averageResponseTimes.canvas_interaction?.toFixed(1) || 'N/A'}ms
            </span>
          </div>
          <div className="target-item">
            <span className="target-name">AI Response</span>
            <span className="target-value">Target: &lt;3000ms</span>
            <span className="actual-value">
              Actual: {report.performanceMetrics.averageResponseTimes.ai_request?.toFixed(0) || 'N/A'}ms
            </span>
          </div>
          <div className="target-item">
            <span className="target-name">Export Time</span>
            <span className="target-value">Target: &lt;5000ms</span>
            <span className="actual-value">
              Actual: {report.performanceMetrics.averageResponseTimes.export_action?.toFixed(0) || 'N/A'}ms
            </span>
          </div>
        </div>
      </div>

      <div className="performance-trends">
        <h3>📈 Performance Trends</h3>
        {report.performanceMetrics.performanceTrends.map((trend, index) => (
          <div key={index} className={`trend-item trend-${trend.trend}`}>
            <span className="trend-metric">{trend.metric.replace('_', ' ')}</span>
            <span className="trend-direction">
              {trend.trend === 'improving' ? '📈' : trend.trend === 'degrading' ? '📉' : '➡️'}
              {trend.change > 0 ? '+' : ''}{trend.change.toFixed(1)}%
            </span>
            <span className="trend-status">{trend.trend}</span>
          </div>
        ))}
      </div>

      <div className="bottlenecks">
        <h3>🚫 Identified Bottlenecks</h3>
        {report.performanceMetrics.bottlenecks.length > 0 ? (
          report.performanceMetrics.bottlenecks.map((bottleneck, index) => (
            <div key={index} className="bottleneck-item">
              <span className="bottleneck-name">{bottleneck.replace('_', ' ')}</span>
              <span className="bottleneck-priority">High Priority</span>
            </div>
          ))
        ) : (
          <div className="no-bottlenecks">
            <p>🎉 No significant bottlenecks detected! Performance is blessed.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const IssuesTab: React.FC<{ issues: GitHubIssue[]; onExport: () => void }> = ({ issues, onExport }) => {
  const [selectedIssue, setSelectedIssue] = useState<GitHubIssue | null>(null);

  return (
    <div className="issues-tab">
      <div className="issues-header">
        <h3>📋 Generated GitHub Issues</h3>
        <div className="issues-summary">
          <span className="issue-count">{issues.length} issues ready for creation</span>
          <button className="export-issues-button" onClick={onExport}>
            📤 Export All Issues
          </button>
        </div>
      </div>

      <div className="issues-content">
        <div className="issues-list">
          {issues.map((issue, index) => (
            <div 
              key={index} 
              className={`issue-item ${selectedIssue === issue ? 'selected' : ''}`}
              onClick={() => setSelectedIssue(issue)}
            >
              <div className="issue-header">
                <h4>{issue.title}</h4>
                <span className={`issue-priority priority-${issue.priority}`}>
                  {issue.priority}
                </span>
              </div>
              <div className="issue-labels">
                {issue.labels.map((label, labelIndex) => (
                  <span key={labelIndex} className="issue-label">{label}</span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {selectedIssue && (
          <div className="issue-preview">
            <h4>Issue Preview</h4>
            <div className="issue-content">
              <h5>{selectedIssue.title}</h5>
              <div className="issue-body">
                <pre>{selectedIssue.body}</pre>
              </div>
              <div className="issue-metadata">
                <div>Labels: {selectedIssue.labels.join(', ')}</div>
                <div>Priority: {selectedIssue.priority}</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {issues.length === 0 && (
        <div className="no-issues">
          <p>🎉 No issues found! Your application is running smoothly.</p>
          <p>Continue tracking interactions to identify improvement opportunities.</p>
        </div>
      )}
    </div>
  );
};

export default InteractionDashboard;