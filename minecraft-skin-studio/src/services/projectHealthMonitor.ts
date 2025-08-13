/**
 * Project Health Monitor
 * Real-time performance and health tracking for dashboard integration
 */

interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  timestamp: number;
  target?: number;
}

interface HealthStatus {
  score: number;
  status: 'healthy' | 'warning' | 'critical';
  alerts: Alert[];
  lastUpdate: string;
}

interface Alert {
  level: 'info' | 'warning' | 'error' | 'critical';
  message: string;
  metric?: string;
  value?: any;
  threshold?: any;
  timestamp: string;
}

interface ProjectMetrics {
  performance: {
    fps: number;
    frameTime: number;
    memoryUsage: number;
    canvasOperations: number;
  };
  user: {
    sessionDuration: number;
    actionsPerMinute: number;
    featuresUsed: Set<string>;
    errors: number;
  };
  quality: {
    renderingErrors: number;
    failedOperations: number;
    successRate: number;
    responseTime: number;
  };
  development: {
    buildStatus: 'success' | 'failure' | 'pending';
    lastDeployment: string;
    activeFeatures: number;
    featureFlags: Map<string, boolean>;
  };
}

class ProjectHealthMonitor {
  private static instance: ProjectHealthMonitor;
  private metrics: ProjectMetrics;
  private performanceHistory: PerformanceMetric[] = [];
  private healthStatus: HealthStatus;
  private monitoringInterval: number | null = null;
  private sessionStartTime: number;
  private frameCount: number = 0;
  private lastFrameTime: number = 0;
  
  private readonly MONITORING_INTERVAL = 5000; // 5 seconds
  private readonly HISTORY_LIMIT = 100;
  private readonly DASHBOARD_ENDPOINT = '/api/project/health';

  private constructor() {
    this.sessionStartTime = Date.now();
    this.metrics = this.initializeMetrics();
    this.healthStatus = this.initializeHealthStatus();
    this.startMonitoring();
  }

  public static getInstance(): ProjectHealthMonitor {
    if (!ProjectHealthMonitor.instance) {
      ProjectHealthMonitor.instance = new ProjectHealthMonitor();
    }
    return ProjectHealthMonitor.instance;
  }

  private initializeMetrics(): ProjectMetrics {
    return {
      performance: {
        fps: 0,
        frameTime: 0,
        memoryUsage: 0,
        canvasOperations: 0
      },
      user: {
        sessionDuration: 0,
        actionsPerMinute: 0,
        featuresUsed: new Set(),
        errors: 0
      },
      quality: {
        renderingErrors: 0,
        failedOperations: 0,
        successRate: 100,
        responseTime: 0
      },
      development: {
        buildStatus: 'success',
        lastDeployment: new Date().toISOString(),
        activeFeatures: 15,
        featureFlags: new Map([
          ['aiGeneration', true],
          ['3dPreview', true],
          ['templates', true],
          ['networkShare', false],
          ['cloudSave', false]
        ])
      }
    };
  }

  private initializeHealthStatus(): HealthStatus {
    return {
      score: 100,
      status: 'healthy',
      alerts: [],
      lastUpdate: new Date().toISOString()
    };
  }

  /**
   * Start continuous monitoring
   */
  private startMonitoring(): void {
    if (this.monitoringInterval) return;

    this.monitoringInterval = window.setInterval(() => {
      this.collectMetrics();
      this.calculateHealthScore();
      this.checkThresholds();
      this.sendToDashboard();
    }, this.MONITORING_INTERVAL);

    // Monitor FPS
    this.monitorFPS();
    
    // Monitor memory if available
    this.monitorMemory();
    
    console.log('📊 Project Health Monitor started');
  }

  /**
   * Monitor FPS in real-time
   */
  private monitorFPS(): void {
    const measureFPS = (timestamp: number) => {
      if (this.lastFrameTime) {
        const delta = timestamp - this.lastFrameTime;
        const fps = 1000 / delta;
        
        // Update rolling average
        this.metrics.performance.fps = Math.round(
          (this.metrics.performance.fps * 0.9) + (fps * 0.1)
        );
        this.metrics.performance.frameTime = delta;
      }
      
      this.lastFrameTime = timestamp;
      this.frameCount++;
      
      requestAnimationFrame(measureFPS);
    };
    
    requestAnimationFrame(measureFPS);
  }

  /**
   * Monitor memory usage
   */
  private monitorMemory(): void {
    if ('memory' in performance) {
      setInterval(() => {
        const memInfo = (performance as any).memory;
        this.metrics.performance.memoryUsage = Math.round(
          memInfo.usedJSHeapSize / 1048576 // Convert to MB
        );
      }, 10000); // Check every 10 seconds
    }
  }

  /**
   * Collect current metrics
   */
  private collectMetrics(): void {
    // Update session duration
    this.metrics.user.sessionDuration = Math.floor(
      (Date.now() - this.sessionStartTime) / 1000
    );

    // Calculate success rate
    const totalOps = this.metrics.quality.failedOperations + 
                    this.metrics.performance.canvasOperations;
    if (totalOps > 0) {
      this.metrics.quality.successRate = Math.round(
        ((totalOps - this.metrics.quality.failedOperations) / totalOps) * 100
      );
    }

    // Add to history
    this.addToHistory('fps', this.metrics.performance.fps, 'fps', 60);
    this.addToHistory('memory', this.metrics.performance.memoryUsage, 'MB', 200);
    this.addToHistory('successRate', this.metrics.quality.successRate, '%', 95);
  }

  /**
   * Add metric to history
   */
  private addToHistory(name: string, value: number, unit: string, target?: number): void {
    this.performanceHistory.push({
      name,
      value,
      unit,
      target,
      timestamp: Date.now()
    });

    // Limit history size
    if (this.performanceHistory.length > this.HISTORY_LIMIT) {
      this.performanceHistory.shift();
    }
  }

  /**
   * Calculate overall health score
   */
  private calculateHealthScore(): void {
    let score = 0;
    const weights = {
      performance: 0.3,
      quality: 0.3,
      user: 0.2,
      stability: 0.2
    };

    // Performance score (based on FPS)
    const fpsScore = Math.min(100, (this.metrics.performance.fps / 60) * 100);
    score += fpsScore * weights.performance;

    // Quality score (based on success rate)
    score += this.metrics.quality.successRate * weights.quality;

    // User engagement score
    const engagementScore = Math.min(100, 
      (this.metrics.user.featuresUsed.size / 10) * 100
    );
    score += engagementScore * weights.user;

    // Stability score (inverse of errors)
    const stabilityScore = Math.max(0, 100 - (this.metrics.user.errors * 10));
    score += stabilityScore * weights.stability;

    this.healthStatus.score = Math.round(score);
    
    // Update status
    if (this.healthStatus.score >= 80) {
      this.healthStatus.status = 'healthy';
    } else if (this.healthStatus.score >= 60) {
      this.healthStatus.status = 'warning';
    } else {
      this.healthStatus.status = 'critical';
    }

    this.healthStatus.lastUpdate = new Date().toISOString();
  }

  /**
   * Check metric thresholds and generate alerts
   */
  private checkThresholds(): void {
    this.healthStatus.alerts = [];

    // FPS threshold
    if (this.metrics.performance.fps < 30) {
      this.addAlert('critical', 'FPS below critical threshold', 'fps', 
        this.metrics.performance.fps, 30);
    } else if (this.metrics.performance.fps < 45) {
      this.addAlert('warning', 'FPS below optimal', 'fps', 
        this.metrics.performance.fps, 45);
    }

    // Memory threshold
    if (this.metrics.performance.memoryUsage > 500) {
      this.addAlert('error', 'High memory usage detected', 'memory',
        this.metrics.performance.memoryUsage, 500);
    }

    // Error threshold
    if (this.metrics.user.errors > 5) {
      this.addAlert('warning', 'Multiple errors detected', 'errors',
        this.metrics.user.errors, 5);
    }

    // Success rate threshold
    if (this.metrics.quality.successRate < 90) {
      this.addAlert('warning', 'Success rate below threshold', 'successRate',
        this.metrics.quality.successRate, 90);
    }
  }

  /**
   * Add alert to health status
   */
  private addAlert(level: Alert['level'], message: string, metric?: string, 
                  value?: any, threshold?: any): void {
    this.healthStatus.alerts.push({
      level,
      message,
      metric,
      value,
      threshold,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Send metrics to dashboard
   */
  private async sendToDashboard(): Promise<void> {
    const dashboardData = this.prepareDashboardData();
    
    // Store in localStorage for local access
    localStorage.setItem('project_health_metrics', JSON.stringify(dashboardData));
    
    // Attempt to send to backend if available
    try {
      const response = await fetch(this.DASHBOARD_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dashboardData)
      });
      
      if (!response.ok) {
        console.warn('Failed to send metrics to dashboard:', response.status);
      }
    } catch (error) {
      // Silently fail if no backend available
      console.debug('Dashboard endpoint not available, metrics stored locally');
    }
  }

  /**
   * Prepare data for dashboard export
   */
  private prepareDashboardData(): any {
    return {
      project: 'minecraft-skin-studio',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      health: this.healthStatus,
      metrics: {
        current: this.metrics,
        history: this.performanceHistory.slice(-20) // Last 20 entries
      },
      kpis: {
        fps: {
          current: this.metrics.performance.fps,
          target: 60,
          status: this.metrics.performance.fps >= 55 ? 'good' : 
                  this.metrics.performance.fps >= 30 ? 'acceptable' : 'poor'
        },
        memory: {
          current: this.metrics.performance.memoryUsage,
          target: 200,
          status: this.metrics.performance.memoryUsage <= 200 ? 'good' :
                  this.metrics.performance.memoryUsage <= 400 ? 'acceptable' : 'poor'
        },
        uptime: {
          current: this.metrics.user.sessionDuration,
          unit: 'seconds'
        },
        engagement: {
          featuresUsed: Array.from(this.metrics.user.featuresUsed),
          actionsPerMinute: this.metrics.user.actionsPerMinute
        }
      }
    };
  }

  /**
   * Public API for tracking events
   */
  public trackFeatureUse(feature: string): void {
    this.metrics.user.featuresUsed.add(feature);
  }

  public trackCanvasOperation(): void {
    this.metrics.performance.canvasOperations++;
  }

  public trackError(error: Error, context?: string): void {
    this.metrics.user.errors++;
    this.metrics.quality.failedOperations++;
    
    console.error(`[Health Monitor] Error in ${context || 'unknown'}:`, error);
    
    // Generate alert for critical errors
    if (this.metrics.user.errors > 10) {
      this.addAlert('critical', 'High error rate detected', 'errors',
        this.metrics.user.errors, 10);
    }
  }

  public trackResponseTime(time: number): void {
    // Rolling average
    this.metrics.quality.responseTime = Math.round(
      (this.metrics.quality.responseTime * 0.9) + (time * 0.1)
    );
  }

  /**
   * Get current health status
   */
  public getHealthStatus(): HealthStatus {
    return { ...this.healthStatus };
  }

  /**
   * Get current metrics
   */
  public getMetrics(): ProjectMetrics {
    return { ...this.metrics };
  }

  /**
   * Get dashboard-ready data
   */
  public getDashboardData(): any {
    return this.prepareDashboardData();
  }

  /**
   * Stop monitoring
   */
  public stopMonitoring(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
      console.log('📊 Project Health Monitor stopped');
    }
  }
}

// Export singleton instance
export const projectHealthMonitor = ProjectHealthMonitor.getInstance();

// Auto-start monitoring when module loads
if (typeof window !== 'undefined') {
  (window as any).projectHealthMonitor = projectHealthMonitor;
  console.log('📊 Project Health Monitor initialized and available at window.projectHealthMonitor');
}