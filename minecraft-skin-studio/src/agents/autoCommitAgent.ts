/**
 * Auto-Commit Agent
 * 
 * MISSION: Improve commitment rate from 18% to 80%+ by automatically preserving user work
 * EVIDENCE EDICT: Track all user interactions and commit patterns
 * COMMITMENT EDICT: Automatically preserve significant user creations
 * TRANSFORMATION EDICT: Document what changes were committed and why
 * 
 * TARGET: Increase commitment rate to 80%+ while maintaining user control
 */

interface CommitableAction {
  id: string;
  type: 'canvas_drawing' | 'tool_change' | 'color_selection' | 'ai_interaction' | 'export';
  significance: 'low' | 'medium' | 'high' | 'critical';
  data: any;
  timestamp: number;
  userInitiated: boolean;
  autoCommitEligible: boolean;
}

interface CommitEvent {
  id: string;
  timestamp: number;
  actionIds: string[];
  commitType: 'auto' | 'manual' | 'scheduled';
  significance: 'low' | 'medium' | 'high' | 'critical';
  success: boolean;
  dataSize: number;
  commitMessage: string;
}

interface CommitMetrics {
  totalActions: number;
  committedActions: number;
  commitmentRate: number;
  autoCommits: number;
  manualCommits: number;
  averageCommitSize: number;
  lastCommitTime: number;
}

export class AutoCommitAgent {
  private pendingActions: CommitableAction[] = [];
  private commitHistory: CommitEvent[] = [];
  private metrics: CommitMetrics = {
    totalActions: 0,
    committedActions: 0,
    commitmentRate: 0,
    autoCommits: 0,
    manualCommits: 0,
    averageCommitSize: 0,
    lastCommitTime: 0
  };

  private commitThresholds = {
    significantPixelCount: 50,      // Pixels modified to trigger commit consideration
    timeThreshold: 30000,           // 30 seconds of inactivity triggers commit
    actionCountThreshold: 10,       // Number of actions before auto-commit
    criticalActionImmediate: true   // Immediately commit critical actions
  };

  private commitTimer: number | null = null;
  private isCommitting: boolean = false;

  constructor() {
    this.initializeCommitSystem();
    this.startPeriodicCommits();
  }

  /**
   * EVIDENCE EDICT: Initialize comprehensive action tracking
   */
  private initializeCommitSystem(): void {
    console.log('[Auto-Commit Agent] Initializing commitment system');
    
    // Load existing commit history from localStorage
    this.loadCommitHistory();
    
    // Set up automatic commit triggers
    this.setupCommitTriggers();
  }

  /**
   * COMMITMENT EDICT: Register user actions for potential commitment
   */
  registerAction(
    type: CommitableAction['type'], 
    data: any, 
    userInitiated: boolean = true
  ): string {
    const action: CommitableAction = {
      id: `action_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      significance: this.calculateActionSignificance(type, data),
      data: this.sanitizeActionData(data),
      timestamp: Date.now(),
      userInitiated,
      autoCommitEligible: this.isActionCommitEligible(type, data)
    };

    this.pendingActions.push(action);
    this.metrics.totalActions++;

    console.log(`[Auto-Commit Agent] Action registered: ${action.type} (${action.significance})`);

    // Check if immediate commit is needed
    if (action.significance === 'critical' && this.commitThresholds.criticalActionImmediate) {
      this.performImmediateCommit(action);
    } else if (this.shouldAutoCommit()) {
      this.scheduleAutoCommit();
    }

    return action.id;
  }

  /**
   * ABSOLUTE TRUTH EDICT: Calculate true significance of actions
   */
  private calculateActionSignificance(
    type: CommitableAction['type'], 
    data: any
  ): CommitableAction['significance'] {
    switch (type) {
      case 'canvas_drawing':
        const pixelsModified = data.pixelsModified || 0;
        if (pixelsModified > 200) return 'high';
        if (pixelsModified > 100) return 'medium';
        if (pixelsModified > 10) return 'low';
        return 'low';

      case 'export':
        return data.success ? 'critical' : 'medium';

      case 'ai_interaction':
        return data.success ? 'medium' : 'low';

      case 'tool_change':
        return 'low';

      case 'color_selection':
        return 'low';

      default:
        return 'low';
    }
  }

  /**
   * TRANSFORMATION EDICT: Sanitize data for safe storage
   */
  private sanitizeActionData(data: any): any {
    const sanitized = { ...data };
    
    // Remove sensitive information
    if (sanitized.prompt) {
      sanitized.prompt = sanitized.prompt.length > 50 
        ? sanitized.prompt.substring(0, 47) + '...' 
        : sanitized.prompt;
    }

    // Ensure numeric values are reasonable
    if (sanitized.fileSize && sanitized.fileSize > 10000000) {
      sanitized.fileSize = 'large_file';
    }

    return sanitized;
  }

  /**
   * COMMITMENT EDICT: Determine if action should be committed
   */
  private isActionCommitEligible(type: CommitableAction['type'], data: any): boolean {
    switch (type) {
      case 'canvas_drawing':
        return (data.pixelsModified || 0) > this.commitThresholds.significantPixelCount;
      
      case 'export':
        return data.success === true;
      
      case 'ai_interaction':
        return data.success === true;
      
      case 'tool_change':
        return true; // All tool changes are eligible
      
      case 'color_selection':
        return false; // Color selections are too frequent
      
      default:
        return false;
    }
  }

  /**
   * EVIDENCE EDICT: Check if auto-commit should be triggered
   */
  private shouldAutoCommit(): boolean {
    const eligibleActions = this.pendingActions.filter(a => a.autoCommitEligible);
    
    return (
      eligibleActions.length >= this.commitThresholds.actionCountThreshold ||
      this.hasHighSignificanceActions() ||
      this.isInactivityThresholdReached()
    );
  }

  private hasHighSignificanceActions(): boolean {
    return this.pendingActions.some(a => 
      a.significance === 'high' || a.significance === 'critical'
    );
  }

  private isInactivityThresholdReached(): boolean {
    if (this.pendingActions.length === 0) return false;
    
    const lastActionTime = Math.max(...this.pendingActions.map(a => a.timestamp));
    return (Date.now() - lastActionTime) > this.commitThresholds.timeThreshold;
  }

  /**
   * DIGNIFIED ERROR EDICT: Perform immediate commit for critical actions
   */
  private performImmediateCommit(action: CommitableAction): void {
    if (this.isCommitting) return;

    console.log(`[Auto-Commit Agent] Performing immediate commit for critical action: ${action.type}`);
    this.performCommit([action], 'auto', 'critical');
  }

  /**
   * COMMITMENT EDICT: Schedule automatic commit
   */
  private scheduleAutoCommit(): void {
    if (this.commitTimer) {
      clearTimeout(this.commitTimer);
    }

    this.commitTimer = setTimeout(() => {
      if (this.pendingActions.length > 0) {
        this.performAutoCommit();
      }
    }, 5000); // 5-second delay for batching
  }

  /**
   * COMMITMENT EDICT: Perform automatic commit of pending actions
   */
  private performAutoCommit(): void {
    if (this.isCommitting || this.pendingActions.length === 0) return;

    const eligibleActions = this.pendingActions.filter(a => a.autoCommitEligible);
    if (eligibleActions.length === 0) return;

    const significance = this.getOverallSignificance(eligibleActions);
    console.log(`[Auto-Commit Agent] Auto-committing ${eligibleActions.length} actions`);
    
    this.performCommit(eligibleActions, 'auto', significance);
  }

  /**
   * TRANSFORMATION EDICT: Execute the actual commit process
   */
  private performCommit(
    actions: CommitableAction[], 
    commitType: 'auto' | 'manual' | 'scheduled',
    significance: CommitableAction['significance']
  ): void {
    if (this.isCommitting) return;
    this.isCommitting = true;

    const commitId = `commit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const startTime = performance.now();

    try {
      // Create commit data
      const commitData = {
        id: commitId,
        timestamp: Date.now(),
        actions: actions.map(a => ({
          id: a.id,
          type: a.type,
          significance: a.significance,
          data: a.data,
          timestamp: a.timestamp
        })),
        type: commitType,
        significance
      };

      // Store in localStorage (in production, this would go to a proper backend)
      const existingCommits = JSON.parse(localStorage.getItem('user_commits') || '[]');
      existingCommits.push(commitData);
      localStorage.setItem('user_commits', JSON.stringify(existingCommits));

      // Calculate data size
      const dataSize = JSON.stringify(commitData).length;
      
      // Generate commit message
      const commitMessage = this.generateCommitMessage(actions, commitType);

      // Record the commit event
      const commitEvent: CommitEvent = {
        id: commitId,
        timestamp: Date.now(),
        actionIds: actions.map(a => a.id),
        commitType,
        significance,
        success: true,
        dataSize,
        commitMessage
      };

      this.commitHistory.push(commitEvent);
      this.updateMetrics(commitEvent);

      // Remove committed actions from pending
      this.pendingActions = this.pendingActions.filter(a => 
        !actions.some(committed => committed.id === a.id)
      );

      const duration = performance.now() - startTime;
      console.log(`[Auto-Commit Agent] Commit successful: ${commitMessage} (${duration}ms)`);

      // Show user notification for significant commits
      if (significance === 'high' || significance === 'critical') {
        this.showCommitNotification(commitMessage, 'success');
      }

    } catch (error) {
      console.error('[Auto-Commit Agent] Commit failed:', error);
      this.recordFailedCommit(actions, commitType, error);
    } finally {
      this.isCommitting = false;
    }
  }

  /**
   * TRANSFORMATION EDICT: Generate meaningful commit messages
   */
  private generateCommitMessage(
    actions: CommitableAction[], 
    commitType: 'auto' | 'manual' | 'scheduled'
  ): string {
    const actionCounts = actions.reduce((counts, action) => {
      counts[action.type] = (counts[action.type] || 0) + 1;
      return counts;
    }, {} as Record<string, number>);

    const parts: string[] = [];
    
    if (actionCounts.canvas_drawing) {
      const pixelsTotal = actions
        .filter(a => a.type === 'canvas_drawing')
        .reduce((sum, a) => sum + (a.data.pixelsModified || 0), 0);
      parts.push(`drew ${pixelsTotal} pixels`);
    }
    
    if (actionCounts.export) {
      parts.push(`exported ${actionCounts.export} file(s)`);
    }
    
    if (actionCounts.ai_interaction) {
      parts.push(`used AI ${actionCounts.ai_interaction} time(s)`);
    }
    
    if (actionCounts.tool_change) {
      parts.push(`changed tools ${actionCounts.tool_change} time(s)`);
    }

    const prefix = commitType === 'auto' ? 'Auto-save:' : 'Save:';
    const message = parts.length > 0 
      ? `${prefix} ${parts.join(', ')}`
      : `${prefix} ${actions.length} actions`;

    return message;
  }

  /**
   * EVIDENCE EDICT: Update commitment metrics
   */
  private updateMetrics(commitEvent: CommitEvent): void {
    this.metrics.committedActions += commitEvent.actionIds.length;
    this.metrics.commitmentRate = (this.metrics.committedActions / this.metrics.totalActions) * 100;
    
    if (commitEvent.commitType === 'auto') {
      this.metrics.autoCommits++;
    } else {
      this.metrics.manualCommits++;
    }

    const totalSize = this.commitHistory.reduce((sum, c) => sum + c.dataSize, 0);
    this.metrics.averageCommitSize = totalSize / this.commitHistory.length;
    this.metrics.lastCommitTime = commitEvent.timestamp;

    console.log(`[Auto-Commit Agent] Commitment rate: ${this.metrics.commitmentRate.toFixed(1)}%`);
  }

  /**
   * DIGNIFIED ERROR EDICT: Handle commit failures gracefully
   */
  private recordFailedCommit(
    actions: CommitableAction[], 
    commitType: 'auto' | 'manual' | 'scheduled', 
    error: any
  ): void {
    const failedCommit: CommitEvent = {
      id: `failed_${Date.now()}`,
      timestamp: Date.now(),
      actionIds: actions.map(a => a.id),
      commitType,
      significance: this.getOverallSignificance(actions),
      success: false,
      dataSize: 0,
      commitMessage: `Failed commit: ${error.message || 'Unknown error'}`
    };

    this.commitHistory.push(failedCommit);
    this.showCommitNotification('Auto-save failed. Your work is still preserved locally.', 'warning');
  }

  /**
   * Helper methods
   */
  private getOverallSignificance(actions: CommitableAction[]): CommitableAction['significance'] {
    if (actions.some(a => a.significance === 'critical')) return 'critical';
    if (actions.some(a => a.significance === 'high')) return 'high';
    if (actions.some(a => a.significance === 'medium')) return 'medium';
    return 'low';
  }

  private setupCommitTriggers(): void {
    // Window beforeunload - commit before leaving
    window.addEventListener('beforeunload', () => {
      if (this.pendingActions.length > 0) {
        this.performCommit(this.pendingActions, 'auto', 'critical');
      }
    });

    // Visibility change - commit when tab becomes hidden
    document.addEventListener('visibilitychange', () => {
      if (document.hidden && this.pendingActions.length > 0) {
        setTimeout(() => this.performAutoCommit(), 1000);
      }
    });
  }

  private startPeriodicCommits(): void {
    // Scheduled commits every 2 minutes
    setInterval(() => {
      if (this.pendingActions.length > 0) {
        this.performCommit(this.pendingActions, 'scheduled', 'medium');
      }
    }, 120000); // 2 minutes
  }

  private loadCommitHistory(): void {
    try {
      const stored = localStorage.getItem('commit_history');
      if (stored) {
        this.commitHistory = JSON.parse(stored);
        this.recalculateMetrics();
      }
    } catch (error) {
      console.warn('[Auto-Commit Agent] Failed to load commit history:', error);
    }
  }

  private recalculateMetrics(): void {
    this.metrics.autoCommits = this.commitHistory.filter(c => c.commitType === 'auto').length;
    this.metrics.manualCommits = this.commitHistory.filter(c => c.commitType === 'manual').length;
    
    if (this.commitHistory.length > 0) {
      const totalSize = this.commitHistory.reduce((sum, c) => sum + c.dataSize, 0);
      this.metrics.averageCommitSize = totalSize / this.commitHistory.length;
      this.metrics.lastCommitTime = Math.max(...this.commitHistory.map(c => c.timestamp));
    }
  }

  private showCommitNotification(message: string, type: 'success' | 'warning' | 'info' = 'info'): void {
    // Create notification UI
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      padding: 12px 20px;
      border-radius: 8px;
      font-weight: 600;
      z-index: 1000;
      transition: all 0.3s ease;
      ${type === 'success' ? 'background: #38a169; color: white;' : ''}
      ${type === 'warning' ? 'background: #ed8936; color: white;' : ''}
      ${type === 'info' ? 'background: #3182ce; color: white;' : ''}
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => notification.remove(), 4000);
  }

  /**
   * Public API methods
   */

  /**
   * COMMITMENT EDICT: Manual commit trigger
   */
  manualCommit(message?: string): boolean {
    if (this.pendingActions.length === 0) {
      console.log('[Auto-Commit Agent] No pending actions to commit');
      return false;
    }

    this.performCommit(this.pendingActions, 'manual', this.getOverallSignificance(this.pendingActions));
    return true;
  }

  /**
   * EVIDENCE EDICT: Get current commitment metrics
   */
  getCommitmentMetrics(): CommitMetrics & {
    pendingActions: number;
    recentCommits: CommitEvent[];
    targetAchieved: boolean;
  } {
    return {
      ...this.metrics,
      pendingActions: this.pendingActions.length,
      recentCommits: this.commitHistory.slice(-10),
      targetAchieved: this.metrics.commitmentRate >= 80
    };
  }

  /**
   * ABSOLUTE TRUTH EDICT: Health check for commit system
   */
  performHealthCheck(): {
    systemOperational: boolean;
    commitmentRate: number;
    pendingActions: number;
    lastCommitAge: number;
    recommendations: string[];
  } {
    const now = Date.now();
    const lastCommitAge = this.metrics.lastCommitTime ? now - this.metrics.lastCommitTime : Infinity;
    
    const health = {
      systemOperational: !this.isCommitting,
      commitmentRate: this.metrics.commitmentRate,
      pendingActions: this.pendingActions.length,
      lastCommitAge,
      recommendations: [] as string[]
    };

    if (health.commitmentRate < 80) {
      health.recommendations.push(`Increase commitment rate to 80% (currently ${health.commitmentRate.toFixed(1)}%)`);
    }
    
    if (health.pendingActions > 20) {
      health.recommendations.push('High number of pending actions - consider manual commit');
    }
    
    if (lastCommitAge > 300000) { // 5 minutes
      health.recommendations.push('No recent commits - check system functionality');
    }

    return health;
  }
}

export default AutoCommitAgent;