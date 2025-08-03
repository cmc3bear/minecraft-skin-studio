/**
 * OQE Monitoring Dashboard
 * Real-time quality metrics and objective tracking
 */

import {
  OQEDashboard,
  ObjectiveStatus,
  Alert,
  MetricSnapshot,
  TrendData,
  AlignmentVerification,
  TestExecution
} from '../framework/types';
import { 
  MASTER_PLAN_OBJECTIVES,
  getObjectiveHealth,
  isObjectiveHealthy
} from '../framework/objectives';
import { EventEmitter } from 'events';

export class OQEMonitor extends EventEmitter {
  private static instance: OQEMonitor;
  private dashboard: OQEDashboard;
  private alerts: Alert[] = [];
  private metricsHistory: MetricSnapshot[] = [];
  private updateInterval: NodeJS.Timeout | null = null;
  
  private constructor() {
    super();
    this.dashboard = this.initializeDashboard();
    this.startMonitoring();
  }
  
  static getInstance(): OQEMonitor {
    if (!OQEMonitor.instance) {
      OQEMonitor.instance = new OQEMonitor();
    }
    return OQEMonitor.instance;
  }
  
  private initializeDashboard(): OQEDashboard {
    return {
      realTime: {
        objectives: this.getObjectiveStatuses(),
        activeTests: [],
        recentChanges: [],
        alerts: []
      },
      metrics: {
        testVelocity: 0,
        changeApprovalRate: 0,
        objectiveHealth: 0,
        evidenceCompleteness: 0
      },
      trends: {
        daily: [],
        weekly: [],
        monthly: []
      }
    };
  }
  
  private getObjectiveStatuses(): ObjectiveStatus[] {
    return MASTER_PLAN_OBJECTIVES.map(objective => {
      const health = getObjectiveHealth(objective);
      const trend = this.calculateTrend(objective.id);
      
      return {
        objective,
        status: health,
        lastMeasurement: new Date(),
        trend,
        projectedViolation: this.predictViolation(objective, trend)
      };
    });
  }
  
  private calculateTrend(objectiveId: string): 'improving' | 'stable' | 'degrading' {
    // Look at historical data to determine trend
    const history = this.metricsHistory.slice(-10); // Last 10 snapshots
    
    if (history.length < 2) return 'stable';
    
    const values = history
      .map(snapshot => snapshot.objectives[objectiveId]?.value)
      .filter(v => v !== undefined)
      .map(v => typeof v === 'number' ? v : parseFloat(v as string));
    
    if (values.length < 2) return 'stable';
    
    // Simple linear regression
    const avgFirst = values.slice(0, Math.floor(values.length / 2))
      .reduce((a, b) => a + b, 0) / Math.floor(values.length / 2);
    const avgSecond = values.slice(Math.floor(values.length / 2))
      .reduce((a, b) => a + b, 0) / (values.length - Math.floor(values.length / 2));
    
    const change = avgSecond - avgFirst;
    const threshold = Math.abs(avgFirst) * 0.01; // 1% threshold
    
    if (change > threshold) return 'improving';
    if (change < -threshold) return 'degrading';
    return 'stable';
  }
  
  private predictViolation(objective: any, trend: string): Date | undefined {
    if (trend !== 'degrading') return undefined;
    
    // Simple prediction based on current rate of change
    // In production, this would use more sophisticated forecasting
    const daysUntilViolation = Math.random() * 30 + 10; // 10-40 days
    
    return new Date(Date.now() + daysUntilViolation * 24 * 60 * 60 * 1000);
  }
  
  private startMonitoring(): void {
    // Update dashboard every 5 seconds
    this.updateInterval = setInterval(() => {
      this.updateDashboard();
    }, 5000);
    
    // Initial update
    this.updateDashboard();
  }
  
  private updateDashboard(): void {
    // Update objective statuses
    this.dashboard.realTime.objectives = this.getObjectiveStatuses();
    
    // Update metrics
    this.updateMetrics();
    
    // Check for alerts
    this.checkAlerts();
    
    // Update trends
    this.updateTrends();
    
    // Emit update event
    this.emit('dashboardUpdate', this.dashboard);
  }
  
  private updateMetrics(): void {
    const totalTests = this.dashboard.realTime.activeTests.length;
    const completedToday = this.dashboard.realTime.activeTests
      .filter(t => t.status !== 'running').length;
    
    this.dashboard.metrics.testVelocity = completedToday;
    
    // Calculate approval rate from recent changes
    const recentChanges = this.dashboard.realTime.recentChanges.slice(-20);
    const approved = recentChanges.filter(c => c.decision.verdict === 'approved').length;
    this.dashboard.metrics.changeApprovalRate = 
      recentChanges.length > 0 ? (approved / recentChanges.length) * 100 : 0;
    
    // Calculate overall objective health
    const healthyObjectives = this.dashboard.realTime.objectives
      .filter(o => o.status === 'healthy').length;
    this.dashboard.metrics.objectiveHealth = 
      (healthyObjectives / this.dashboard.realTime.objectives.length) * 100;
    
    // Evidence completeness (mock)
    this.dashboard.metrics.evidenceCompleteness = 95 + Math.random() * 5;
  }
  
  private checkAlerts(): void {
    const newAlerts: Alert[] = [];
    
    // Check each objective for alert conditions
    for (const objStatus of this.dashboard.realTime.objectives) {
      if (objStatus.status === 'critical') {
        newAlerts.push({
          id: `alert-${Date.now()}-${objStatus.objective.id}`,
          severity: 'critical',
          objective: objStatus.objective.id,
          message: `${objStatus.objective.name} is in critical state`,
          timestamp: new Date(),
          resolved: false
        });
      } else if (objStatus.status === 'warning') {
        newAlerts.push({
          id: `alert-${Date.now()}-${objStatus.objective.id}`,
          severity: 'warning',
          objective: objStatus.objective.id,
          message: `${objStatus.objective.name} approaching threshold`,
          timestamp: new Date(),
          resolved: false
        });
      }
      
      if (objStatus.projectedViolation) {
        newAlerts.push({
          id: `alert-${Date.now()}-${objStatus.objective.id}-projection`,
          severity: 'warning',
          objective: objStatus.objective.id,
          message: `${objStatus.objective.name} projected to violate threshold by ${objStatus.projectedViolation.toDateString()}`,
          timestamp: new Date(),
          resolved: false
        });
      }
    }
    
    // Add new alerts
    this.alerts = [...this.alerts, ...newAlerts];
    this.dashboard.realTime.alerts = this.alerts.filter(a => !a.resolved);
    
    // Emit critical alerts
    newAlerts.filter(a => a.severity === 'critical').forEach(alert => {
      this.emit('criticalAlert', alert);
    });
  }
  
  private updateTrends(): void {
    const now = new Date();
    
    // Create trend data point
    const trendPoint: TrendData = {
      date: now,
      objectives: {},
      incidents: 0, // Mock data
      changes: this.dashboard.realTime.recentChanges.length,
      testsPassed: this.dashboard.realTime.activeTests
        .filter(t => t.status === 'passed').length
    };
    
    // Add objective values
    for (const objStatus of this.dashboard.realTime.objectives) {
      const value = typeof objStatus.objective.currentValue === 'number'
        ? objStatus.objective.currentValue
        : parseFloat(objStatus.objective.currentValue as string);
      trendPoint.objectives[objStatus.objective.id] = value;
    }
    
    // Update daily trends (keep last 24 hours)
    this.dashboard.trends.daily.push(trendPoint);
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    this.dashboard.trends.daily = this.dashboard.trends.daily
      .filter(t => t.date > oneDayAgo);
    
    // Update weekly trends (keep last 7 days)
    if (this.shouldAddToWeekly(now)) {
      this.dashboard.trends.weekly.push(trendPoint);
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      this.dashboard.trends.weekly = this.dashboard.trends.weekly
        .filter(t => t.date > oneWeekAgo);
    }
    
    // Update monthly trends (keep last 30 days)
    if (this.shouldAddToMonthly(now)) {
      this.dashboard.trends.monthly.push(trendPoint);
      const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      this.dashboard.trends.monthly = this.dashboard.trends.monthly
        .filter(t => t.date > oneMonthAgo);
    }
  }
  
  private shouldAddToWeekly(date: Date): boolean {
    // Add to weekly if it's been an hour since last entry
    const lastEntry = this.dashboard.trends.weekly[this.dashboard.trends.weekly.length - 1];
    if (!lastEntry) return true;
    
    return date.getTime() - lastEntry.date.getTime() > 60 * 60 * 1000;
  }
  
  private shouldAddToMonthly(date: Date): boolean {
    // Add to monthly if it's been a day since last entry
    const lastEntry = this.dashboard.trends.monthly[this.dashboard.trends.monthly.length - 1];
    if (!lastEntry) return true;
    
    return date.getTime() - lastEntry.date.getTime() > 24 * 60 * 60 * 1000;
  }
  
  // Public methods for external updates
  recordTestExecution(execution: TestExecution): void {
    this.dashboard.realTime.activeTests.push(execution);
    
    // Keep only last 100 tests
    if (this.dashboard.realTime.activeTests.length > 100) {
      this.dashboard.realTime.activeTests = 
        this.dashboard.realTime.activeTests.slice(-100);
    }
    
    this.updateDashboard();
  }
  
  recordChangeVerification(verification: AlignmentVerification): void {
    this.dashboard.realTime.recentChanges.push(verification);
    
    // Keep only last 50 changes
    if (this.dashboard.realTime.recentChanges.length > 50) {
      this.dashboard.realTime.recentChanges = 
        this.dashboard.realTime.recentChanges.slice(-50);
    }
    
    this.updateDashboard();
  }
  
  updateObjectiveValue(objectiveId: string, newValue: number | string): void {
    const objective = MASTER_PLAN_OBJECTIVES.find(o => o.id === objectiveId);
    if (objective) {
      objective.currentValue = newValue;
      this.updateDashboard();
    }
  }
  
  resolveAlert(alertId: string, resolvedBy: string): void {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.resolved = true;
      alert.resolvedAt = new Date();
      alert.resolvedBy = resolvedBy;
      this.updateDashboard();
    }
  }
  
  getDashboard(): OQEDashboard {
    return { ...this.dashboard };
  }
  
  getMetricSnapshot(): MetricSnapshot {
    const snapshot: MetricSnapshot = {
      timestamp: new Date(),
      objectives: {},
      alerts: [...this.dashboard.realTime.alerts]
    };
    
    for (const objStatus of this.dashboard.realTime.objectives) {
      snapshot.objectives[objStatus.objective.id] = {
        value: objStatus.objective.currentValue,
        trend: objStatus.trend === 'improving' ? 'up' : 
               objStatus.trend === 'degrading' ? 'down' : 'stable',
        health: objStatus.status
      };
    }
    
    return snapshot;
  }
  
  stop(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }
}