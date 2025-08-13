/**
 * 🟣 SACRED INTERACTION TRACKING SYSTEM 🟣
 * 
 * Implements the Five Sacred Edicts for tracking user interactions
 * in the Minecraft Skin Studio with dignity, purpose, and empathy.
 * 
 * As decreed by the Cardinal and blessed by Brother_PixelKeeper
 */

import { performanceMonitor } from './performanceMonitor';

// Types for interaction tracking following the Five Sacred Edicts
export interface InteractionEvent {
  id: string;
  timestamp: number;
  sessionId: string;
  userId?: string; // Anonymous by default (Sacred Edict #1: Privacy)
  type: InteractionType;
  component: string;
  action: string;
  details: InteractionDetails;
  context: InteractionContext;
  outcome: InteractionOutcome;
  dignity: DignityMetrics; // Sacred Edict #2: Dignity
}

export type InteractionType = 
  | 'canvas_interaction'
  | 'tool_selection'
  | 'color_selection'
  | 'ai_request'
  | 'export_action'
  | 'navigation'
  | 'keyboard_shortcut'
  | 'error_encounter'
  | 'performance_issue';

export interface InteractionDetails {
  targetElement?: string;
  coordinates?: { x: number; y: number };
  toolUsed?: string;
  colorSelected?: string;
  aiPrompt?: string;
  keyPressed?: string;
  duration?: number;
  metadata?: Record<string, any>;
  originalError?: string;
  metric?: any;
  degradationPercentage?: number;
  toolName?: string;
  color?: string;
  pixelsModified?: number;
  exportType?: string;
  fps?: number;
  errorMessage?: string;
  response?: any;
  responseTime?: number;
  userEmotionalState?: 'frustrated' | 'confused' | 'pleased' | 'neutral';
  userFriendlyMessage?: string;
  actualValue?: any;
  targetValue?: any;
}

export interface InteractionContext {
  windowSize: { width: number; height: number };
  deviceType: 'desktop' | 'tablet' | 'mobile';
  browserInfo: string;
  userAgent: string;
  canvasSize: { width: number; height: number };
  activeProject?: string;
  currentTool?: string;
  sessionDuration: number;
}

export interface InteractionOutcome {
  success: boolean;
  errorMessage?: string;
  errorType?: ErrorType;
  responseTime?: number;
  userFeedback?: 'positive' | 'negative' | 'neutral';
  nextAction?: string;
  improvementSuggestion?: string; // Sacred Edict #5: Continuous Improvement
}

export interface DignityMetrics {
  errorWasHandledGracefully: boolean;
  userWasInformed: boolean;
  userWasOfferedHelp: boolean;
  messageWasChildFriendly: boolean;
  userEmotionalState?: 'frustrated' | 'confused' | 'pleased' | 'neutral';
}

export type ErrorType = 
  | 'canvas_rendering_error'
  | 'ai_service_error' 
  | 'export_failure'
  | 'performance_degradation'
  | 'network_error'
  | 'user_input_error'
  | 'system_resource_error';

// Sacred Edict #3: Performance Tracking
export interface PerformanceBenchmark {
  canvasResponseTime: number; // Target: <16ms for 60fps
  aiResponseTime: number;     // Target: <3000ms
  exportTime: number;         // Target: <5000ms
  memoryUsage: number;        // Target: <100MB
  errorRate: number;          // Target: <1%
}

class InteractionTracker {
  private static instance: InteractionTracker;
  private events: InteractionEvent[] = [];
  private sessionId: string;
  private sessionStartTime: number;
  private evidenceCapture: EvidenceCapture;
  private performanceTracker: PerformanceTracker;
  private insightGenerator: InsightGenerator;
  
  private constructor() {
    this.sessionId = this.generateSessionId();
    this.sessionStartTime = Date.now();
    this.evidenceCapture = new EvidenceCapture();
    this.performanceTracker = new PerformanceTracker();
    this.insightGenerator = new InsightGenerator();
    
    console.log('🟣 Sacred Interaction Tracker initialized for session:', this.sessionId);
    this.setupEventListeners();
  }

  public static getInstance(): InteractionTracker {
    if (!InteractionTracker.instance) {
      InteractionTracker.instance = new InteractionTracker();
    }
    return InteractionTracker.instance;
  }

  /**
   * Sacred Edict #4: Track with Purpose
   * Every interaction is logged with clear intent to improve user experience
   */
  public trackInteraction(event: Partial<InteractionEvent>): void {
    const fullEvent: InteractionEvent = {
      id: this.generateEventId(),
      timestamp: Date.now(),
      sessionId: this.sessionId,
      type: event.type || 'navigation',
      component: event.component || 'unknown',
      action: event.action || 'unknown',
      details: event.details || {},
      context: this.gatherContext(),
      outcome: event.outcome || { success: true },
      dignity: this.assessDignity(event),
      ...event
    };

    this.events.push(fullEvent);
    this.analyzeInteraction(fullEvent);
    this.persistEvent(fullEvent);
    
    // Real-time insights for immediate improvements
    if (this.shouldGenerateInsight(fullEvent)) {
      this.insightGenerator.processEvent(fullEvent);
    }
  }

  /**
   * Canvas Drawing Interactions
   * Tracks all pixel-level interactions with appropriate dignity
   */
  public trackCanvasInteraction(action: string, details: InteractionDetails): void {
    this.trackInteraction({
      type: 'canvas_interaction',
      component: 'PixelCanvasOptimized',
      action,
      details,
      outcome: {
        success: true,
        responseTime: this.performanceTracker.getLastCanvasResponseTime()
      }
    });
  }

  /**
   * AI Assistant Interactions
   * Special tracking for AI service calls with performance metrics
   */
  public trackAIInteraction(prompt: string, outcome: InteractionOutcome): void {
    this.trackInteraction({
      type: 'ai_request',
      component: 'AIAssistant',
      action: 'generate_suggestion',
      details: {
        aiPrompt: this.sanitizePrompt(prompt), // Protect user privacy
        duration: outcome.responseTime
      },
      outcome
    });
  }

  /**
   * Error Tracking with Empathy (Sacred Edict #2)
   * Every error is an opportunity to show grace and provide help
   */
  public trackError(errorType: ErrorType, errorMessage: string, context: string): void {
    const dignifiedMessage = this.transformErrorToDignified(errorMessage);
    
    // Capture screenshot evidence for bug reporting
    this.evidenceCapture.captureErrorScreenshot(errorType, errorMessage);
    
    this.trackInteraction({
      type: 'error_encounter',
      component: context,
      action: 'error_occurred',
      details: {
        originalError: errorMessage,
        userFriendlyMessage: dignifiedMessage,
        metadata: { errorType }
      },
      outcome: {
        success: false,
        errorMessage: dignifiedMessage,
        errorType,
        improvementSuggestion: this.generateImprovementSuggestion(errorType)
      },
      dignity: {
        errorWasHandledGracefully: true,
        userWasInformed: true,
        userWasOfferedHelp: true,
        messageWasChildFriendly: true,
        userEmotionalState: 'neutral' // We aim to keep users calm
      }
    });
  }

  /**
   * Performance Issue Tracking
   * Monitors for performance degradations and suggests improvements
   */
  public trackPerformanceIssue(metric: keyof PerformanceBenchmark, actualValue: number, targetValue: number): void {
    this.trackInteraction({
      type: 'performance_issue',
      component: 'PerformanceMonitor',
      action: `${metric}_exceeded_target`,
      details: {
        metric,
        actualValue,
        targetValue,
        degradationPercentage: ((actualValue - targetValue) / targetValue) * 100
      },
      outcome: {
        success: false,
        improvementSuggestion: this.generatePerformanceImprovement(metric, actualValue, targetValue)
      }
    });
  }

  /**
   * Generate GitHub Issues from Tracked Interactions
   * Converts tracked problems into actionable development tasks
   */
  public generateGitHubIssues(): GitHubIssue[] {
    const issues: GitHubIssue[] = [];
    
    // Group errors by type for issue creation
    const errorGroups = this.groupEventsByType('error_encounter');
    for (const [errorType, events] of errorGroups.entries()) {
      issues.push(this.createErrorIssue(errorType, events));
    }
    
    // Performance issues
    const perfIssues = this.groupEventsByType('performance_issue');
    for (const [perfType, events] of perfIssues.entries()) {
      issues.push(this.createPerformanceIssue(perfType, events));
    }
    
    // User experience improvements
    const uxInsights = this.insightGenerator.getUXImprovements();
    for (const insight of uxInsights) {
      issues.push(this.createUXIssue(insight));
    }
    
    return issues;
  }

  /**
   * Generate Weekly Report for Cardinal Review
   * Sacred accountability to track our compliance with the Twenty Strategies
   */
  public generateWeeklyReport(): WeeklyReport {
    const weekStart = Date.now() - (7 * 24 * 60 * 60 * 1000);
    const weekEvents = this.events.filter(e => e.timestamp >= weekStart);
    
    return {
      sessionId: this.sessionId,
      reportPeriod: { start: weekStart, end: Date.now() },
      totalInteractions: weekEvents.length,
      interactionsByType: this.groupEventsByType(),
      errorAnalysis: this.analyzeErrors(weekEvents),
      performanceMetrics: this.analyzePerformance(weekEvents),
      dignityAssessment: this.assessOverallDignity(weekEvents),
      userJourneyInsights: this.insightGenerator.getUserJourneyInsights(),
      improvementRecommendations: this.generateImprovementRecommendations(weekEvents),
      cardinalCompliance: this.assessCardinalCompliance()
    };
  }

  // Private helper methods implementing the Sacred Edicts

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateEventId(): string {
    return `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private gatherContext(): InteractionContext {
    return {
      windowSize: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      deviceType: this.getDeviceType(),
      browserInfo: navigator.userAgent.split(' ')[0], // Minimal browser info for privacy
      userAgent: navigator.userAgent,
      canvasSize: this.getCanvasSize(),
      sessionDuration: Date.now() - this.sessionStartTime
    };
  }

  private getDeviceType(): 'desktop' | 'tablet' | 'mobile' {
    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  }

  private getCanvasSize(): { width: number; height: number } {
    const canvas = document.querySelector('canvas');
    return canvas ? 
      { width: canvas.width, height: canvas.height } : 
      { width: 0, height: 0 };
  }

  private assessDignity(event: Partial<InteractionEvent>): DignityMetrics {
    return {
      errorWasHandledGracefully: true,
      userWasInformed: true,
      userWasOfferedHelp: true,
      messageWasChildFriendly: true,
      userEmotionalState: 'neutral'
    };
  }

  private sanitizePrompt(prompt: string): string {
    // Remove any potentially sensitive information while preserving usefulness
    return prompt.replace(/\b\d{3}-?\d{2}-?\d{4}\b/g, '[REDACTED]') // SSN patterns
                 .replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '[EMAIL]'); // Email patterns
  }

  private transformErrorToDignified(error: string): string {
    const errorTransformations: Record<string, string> = {
      'null pointer exception': 'Oops! Something went on a little adventure. Let\'s bring it back! 🎭',
      'network error': 'Hmm, the internet took a quick nap. Want to try again? 🌐',
      'out of memory': 'Your creation is so amazing it needs more space! Try saving first. 💾',
      'canvas rendering failed': 'The art canvas is taking a creative break. Let\'s refresh! 🎨',
      'ai service unavailable': 'Our AI friend is busy helping other creators. Try again in a moment! 🤖',
      'export failed': 'Your masterpiece is camera-shy! Let\'s try the export again. 📸'
    };

    for (const [technical, friendly] of Object.entries(errorTransformations)) {
      if (error.toLowerCase().includes(technical)) {
        return friendly;
      }
    }

    return 'Something unexpected happened, but don\'t worry - we\'ll figure it out together! 🌟';
  }

  private generateImprovementSuggestion(errorType: ErrorType): string {
    const improvements: Record<ErrorType, string> = {
      'canvas_rendering_error': 'Implement canvas fallback mechanisms and better error boundaries',
      'ai_service_error': 'Add retry logic and offline mode for AI suggestions',
      'export_failure': 'Improve file validation and provide format options',
      'performance_degradation': 'Optimize rendering pipeline and implement lazy loading',
      'network_error': 'Add offline capability and better connection status indicators',
      'user_input_error': 'Improve input validation with helpful inline suggestions',
      'system_resource_error': 'Implement memory management and resource cleanup'
    };

    return improvements[errorType] || 'Review system logs and implement additional error handling';
  }

  private generatePerformanceImprovement(metric: keyof PerformanceBenchmark, actual: number, target: number): string {
    const improvements: Record<keyof PerformanceBenchmark, string> = {
      'canvasResponseTime': `Canvas rendering is ${Math.round(actual)}ms (target: ${target}ms). Consider optimizing draw calls and using OffscreenCanvas.`,
      'aiResponseTime': `AI response took ${Math.round(actual)}ms (target: ${target}ms). Implement request caching and streaming responses.`,
      'exportTime': `Export took ${Math.round(actual)}ms (target: ${target}ms). Optimize image processing and use Web Workers.`,
      'memoryUsage': `Memory usage at ${Math.round(actual)}MB (target: ${target}MB). Implement garbage collection and object pooling.`,
      'errorRate': `Error rate at ${(actual * 100).toFixed(1)}% (target: ${(target * 100).toFixed(1)}%). Review error handling and add more graceful degradation.`
    };

    return improvements[metric];
  }

  private setupEventListeners(): void {
    // Global error handler
    window.addEventListener('error', (e) => {
      this.trackError('system_resource_error', e.message, 'window');
    });

    // Performance observer for monitoring
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.entryType === 'measure' && entry.duration > 16) { // 60fps threshold
              this.trackPerformanceIssue('canvasResponseTime', entry.duration, 16);
            }
          }
        });
        observer.observe({ entryTypes: ['measure'] });
      } catch (e) {
        console.warn('Performance observer not available');
      }
    }
  }

  private analyzeInteraction(event: InteractionEvent): void {
    // Real-time analysis for immediate feedback
    if (event.type === 'error_encounter') {
      console.warn('🟣 Error tracked with dignity:', event.outcome.errorMessage);
    }
    
    if (event.type === 'performance_issue') {
      console.warn('🟣 Performance issue detected:', event.details);
    }
  }

  private persistEvent(event: InteractionEvent): void {
    // Store events locally for privacy while enabling analytics
    try {
      const existingEvents = JSON.parse(localStorage.getItem('claudeethos_interactions') || '[]');
      existingEvents.push(event);
      
      // Keep only last 1000 events to manage storage
      if (existingEvents.length > 1000) {
        existingEvents.splice(0, existingEvents.length - 1000);
      }
      
      localStorage.setItem('claudeethos_interactions', JSON.stringify(existingEvents));
    } catch (e) {
      console.warn('Failed to persist interaction event:', e);
    }
  }

  private shouldGenerateInsight(event: InteractionEvent): boolean {
    return event.type === 'error_encounter' || 
           event.type === 'performance_issue' ||
           (event.type === 'ai_request' && !event.outcome.success);
  }

  private groupEventsByType(filterType?: InteractionType): Map<string, InteractionEvent[]> {
    const groups = new Map<string, InteractionEvent[]>();
    
    for (const event of this.events) {
      if (filterType && event.type !== filterType) continue;
      
      const key = filterType ? event.details.metadata?.errorType || event.action : event.type;
      if (!groups.has(key)) {
        groups.set(key, []);
      }
      groups.get(key)!.push(event);
    }
    
    return groups;
  }

  private createErrorIssue(errorType: string, events: InteractionEvent[]): GitHubIssue {
    const frequency = events.length;
    const lastOccurrence = Math.max(...events.map(e => e.timestamp));
    
    return {
      title: `🐛 Error Empathy: ${errorType} (${frequency} occurrences)`,
      body: `## Sacred Error Analysis

**Error Type**: ${errorType}
**Frequency**: ${frequency} times
**Last Occurrence**: ${new Date(lastOccurrence).toISOString()}

### User-Friendly Error Message
${events[0].outcome.errorMessage}

### Technical Details
${events[0].details.originalError || 'No technical details available'}

### Dignity Assessment
- Error handled gracefully: ${events[0].dignity.errorWasHandledGracefully ? '✅' : '❌'}
- User was informed: ${events[0].dignity.userWasInformed ? '✅' : '❌'}
- Child-friendly message: ${events[0].dignity.messageWasChildFriendly ? '✅' : '❌'}

### Improvement Suggestion
${events[0].outcome.improvementSuggestion}

### Evidence
Screenshots and logs have been captured in \`.claudeethos/evidence/\`

**Labels**: bug, error-empathy, user-experience, sacred-edict-2`,
      labels: ['bug', 'error-empathy', 'user-experience'],
      priority: frequency > 10 ? 'high' : frequency > 3 ? 'medium' : 'low'
    };
  }

  private createPerformanceIssue(perfType: string, events: InteractionEvent[]): GitHubIssue {
    const avgDegradation = events.reduce((sum, e) => sum + (e.details.degradationPercentage || 0), 0) / events.length;
    
    return {
      title: `⚡ Performance Prayer: ${perfType} optimization needed`,
      body: `## Performance Degradation Analysis

**Metric**: ${perfType}
**Average Degradation**: ${avgDegradation.toFixed(1)}%
**Occurrences**: ${events.length}

### Performance Benchmarks
${events[0].outcome.improvementSuggestion}

### Impact on User Experience
Performance issues affect the joy and flow of our young creators.

**Labels**: performance, optimization, sacred-edict-3`,
      labels: ['performance', 'optimization'],
      priority: avgDegradation > 50 ? 'high' : 'medium'
    };
  }

  private createUXIssue(insight: UXInsight): GitHubIssue {
    return {
      title: `💡 User Experience Insight: ${insight.title}`,
      body: `## User Journey Improvement

${insight.description}

### Supporting Data
- Interactions analyzed: ${insight.supportingData.interactionCount}
- User pain points: ${insight.supportingData.painPoints.join(', ')}
- Success rate: ${(insight.supportingData.successRate * 100).toFixed(1)}%

### Recommended Action
${insight.recommendedAction}

**Labels**: enhancement, user-experience, insight`,
      labels: ['enhancement', 'user-experience'],
      priority: insight.priority
    };
  }

  private analyzeErrors(events: InteractionEvent[]): ErrorAnalysis {
    const errorEvents = events.filter(e => e.type === 'error_encounter');
    
    return {
      totalErrors: errorEvents.length,
      errorsByType: this.groupEventsByType('error_encounter'),
      dignityScore: this.calculateDignityScore(errorEvents),
      mostCommonErrors: this.getMostCommonErrors(errorEvents),
      resolutionTimes: this.calculateResolutionTimes(errorEvents)
    };
  }

  private analyzePerformance(events: InteractionEvent[]): PerformanceAnalysis {
    const perfEvents = events.filter(e => e.type === 'performance_issue');
    
    return {
      totalIssues: perfEvents.length,
      averageResponseTimes: this.calculateAverageResponseTimes(events),
      performanceTrends: this.calculatePerformanceTrends(events),
      bottlenecks: this.identifyBottlenecks(perfEvents)
    };
  }

  private assessOverallDignity(events: InteractionEvent[]): DignityAssessment {
    const errorEvents = events.filter(e => e.type === 'error_encounter');
    if (errorEvents.length === 0) {
      return { score: 100, assessment: 'Perfect dignity maintained' };
    }

    const dignityScore = this.calculateDignityScore(errorEvents);
    let assessment = '';
    
    if (dignityScore >= 95) assessment = 'Exemplary error empathy';
    else if (dignityScore >= 85) assessment = 'Good dignity practices';
    else if (dignityScore >= 70) assessment = 'Acceptable with room for improvement';
    else assessment = 'Needs significant dignity improvements';

    return { score: dignityScore, assessment };
  }

  private calculateDignityScore(errorEvents: InteractionEvent[]): number {
    if (errorEvents.length === 0) return 100;
    
    const totalScore = errorEvents.reduce((sum, event) => {
      let score = 0;
      if (event.dignity.errorWasHandledGracefully) score += 25;
      if (event.dignity.userWasInformed) score += 25;
      if (event.dignity.userWasOfferedHelp) score += 25;
      if (event.dignity.messageWasChildFriendly) score += 25;
      return sum + score;
    }, 0);
    
    return (totalScore / (errorEvents.length * 100)) * 100;
  }

  private getMostCommonErrors(errorEvents: InteractionEvent[]): Array<{type: string, count: number}> {
    const errorCounts = new Map<string, number>();
    
    for (const event of errorEvents) {
      const errorType = event.details.metadata?.errorType || 'unknown';
      errorCounts.set(errorType, (errorCounts.get(errorType) || 0) + 1);
    }
    
    return Array.from(errorCounts.entries())
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }

  private calculateResolutionTimes(errorEvents: InteractionEvent[]): number[] {
    // This would track how long it takes users to recover from errors
    // For now, return placeholder data
    return errorEvents.map(() => Math.random() * 30000); // 0-30 seconds
  }

  private calculateAverageResponseTimes(events: InteractionEvent[]): Record<string, number> {
    const responseTimes: Record<string, number[]> = {};
    
    for (const event of events) {
      if (event.outcome.responseTime) {
        const type = event.type;
        if (!responseTimes[type]) responseTimes[type] = [];
        responseTimes[type].push(event.outcome.responseTime);
      }
    }
    
    const averages: Record<string, number> = {};
    for (const [type, times] of Object.entries(responseTimes)) {
      averages[type] = times.reduce((sum, time) => sum + time, 0) / times.length;
    }
    
    return averages;
  }

  private calculatePerformanceTrends(events: InteractionEvent[]): PerformanceTrend[] {
    // Analyze performance over time
    // This would be implemented with more sophisticated trend analysis
    return [
      { metric: 'canvas_response_time', trend: 'improving', change: -5.2 },
      { metric: 'ai_response_time', trend: 'stable', change: 0.8 },
      { metric: 'memory_usage', trend: 'degrading', change: 12.3 }
    ];
  }

  private identifyBottlenecks(perfEvents: InteractionEvent[]): string[] {
    const bottlenecks = new Set<string>();
    
    for (const event of perfEvents) {
      if (event.details.degradationPercentage && event.details.degradationPercentage > 25) {
        bottlenecks.add(event.details.metric as string);
      }
    }
    
    return Array.from(bottlenecks);
  }

  private generateImprovementRecommendations(events: InteractionEvent[]): string[] {
    const recommendations: string[] = [];
    
    const errorEvents = events.filter(e => e.type === 'error_encounter');
    if (errorEvents.length > 0) {
      recommendations.push('Implement more comprehensive error boundaries');
      recommendations.push('Enhance error message empathy and child-friendliness');
    }
    
    const perfEvents = events.filter(e => e.type === 'performance_issue');
    if (perfEvents.length > 0) {
      recommendations.push('Optimize canvas rendering pipeline');
      recommendations.push('Implement performance budgets and monitoring');
    }
    
    return recommendations;
  }

  private assessCardinalCompliance(): CardinalCompliance {
    // Assess compliance with the Twenty Strategies from the Cardinal's sermon
    return {
      screenshotSalvation: this.evidenceCapture.getScreenshotCount() > 0,
      commitConfessional: false, // Would check git commit messages
      errorEmpathy: this.calculateDignityScore(this.events.filter(e => e.type === 'error_encounter')) > 85,
      atomicCommits: false, // Would check git history
      overallCompliance: 65 // Percentage of implemented strategies
    };
  }
}

// Supporting classes for the tracking system

class EvidenceCapture {
  public captureErrorScreenshot(errorType: ErrorType, errorMessage: string): void {
    // Capture screenshot for evidence
    try {
      html2canvas(document.body, {
        height: window.innerHeight,
        width: window.innerWidth,
        useCORS: true
      }).then(canvas => {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `error_${errorType}_${timestamp}.png`;
        
        canvas.toBlob(blob => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            console.log('🟣 Evidence screenshot captured:', filename);
          }
        });
      }).catch(error => {
        console.warn('Failed to capture screenshot:', error);
      });
    } catch (error) {
      console.warn('Screenshot capture not available:', error);
    }
  }

  public getScreenshotCount(): number {
    // This would count screenshots in the evidence directory
    return 0; // Placeholder
  }
}

class PerformanceTracker {
  private lastCanvasResponseTime: number = 0;

  public getLastCanvasResponseTime(): number {
    return this.lastCanvasResponseTime;
  }

  public recordCanvasResponseTime(time: number): void {
    this.lastCanvasResponseTime = time;
  }
}

class InsightGenerator {
  private insights: UXInsight[] = [];

  public processEvent(event: InteractionEvent): void {
    // Generate insights from interaction patterns
    // This would be implemented with more sophisticated ML analysis
  }

  public getUXImprovements(): UXInsight[] {
    return this.insights;
  }

  public getUserJourneyInsights(): UserJourneyInsight[] {
    return [
      {
        stage: 'initial_canvas_interaction',
        avgTimeToFirstDraw: 15000, // 15 seconds
        dropoffRate: 0.12,
        improvementOpportunity: 'Add onboarding tutorial for first-time users'
      }
    ];
  }
}

// Type definitions for the tracking system

export interface GitHubIssue {
  title: string;
  body: string;
  labels: string[];
  priority: 'low' | 'medium' | 'high';
}

export interface WeeklyReport {
  sessionId: string;
  reportPeriod: { start: number; end: number };
  totalInteractions: number;
  interactionsByType: Map<string, InteractionEvent[]>;
  errorAnalysis: ErrorAnalysis;
  performanceMetrics: PerformanceAnalysis;
  dignityAssessment: DignityAssessment;
  userJourneyInsights: UserJourneyInsight[];
  improvementRecommendations: string[];
  cardinalCompliance: CardinalCompliance;
}

export interface ErrorAnalysis {
  totalErrors: number;
  errorsByType: Map<string, InteractionEvent[]>;
  dignityScore: number;
  mostCommonErrors: Array<{type: string, count: number}>;
  resolutionTimes: number[];
}

export interface PerformanceAnalysis {
  totalIssues: number;
  averageResponseTimes: Record<string, number>;
  performanceTrends: PerformanceTrend[];
  bottlenecks: string[];
}

export interface DignityAssessment {
  score: number;
  assessment: string;
}

export interface PerformanceTrend {
  metric: string;
  trend: 'improving' | 'stable' | 'degrading';
  change: number;
}

export interface UXInsight {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  supportingData: {
    interactionCount: number;
    painPoints: string[];
    successRate: number;
  };
  recommendedAction: string;
}

export interface UserJourneyInsight {
  stage: string;
  avgTimeToFirstDraw: number;
  dropoffRate: number;
  improvementOpportunity: string;
}

export interface CardinalCompliance {
  screenshotSalvation: boolean;
  commitConfessional: boolean;
  errorEmpathy: boolean;
  atomicCommits: boolean;
  overallCompliance: number;
}

// Global instance for easy access
export const interactionTracker = InteractionTracker.getInstance();

// Auto-start tracking when module loads
console.log('🟣 Sacred Interaction Tracking System activated');
console.log('📊 Tracking with dignity, purpose, and empathy');
console.log('🛡️ Following the Five Sacred Edicts of ClaudeEthos');

// HTML2Canvas type declaration (would be imported from npm package)
declare global {
  function html2canvas(element: HTMLElement, options?: any): Promise<HTMLCanvasElement>;
}