/**
 * Performance Monitoring Service
 * Tracks FPS and other metrics for S2 objective compliance
 * Reports to PixelPerfect agent
 */

export interface PerformanceMetrics {
  fps: number;
  frameTime: number; // milliseconds
  memoryUsage: number; // MB
  renderCalls: number;
  timestamp: Date;
}

export interface PerformanceAlert {
  type: 'fps_drop' | 'memory_spike' | 'frame_skip';
  severity: 'warning' | 'critical';
  message: string;
  metric: number;
  threshold: number;
  timestamp: Date;
}

class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: PerformanceMetrics[] = [];
  private alerts: PerformanceAlert[] = [];
  private isMonitoring = false;
  private animationFrameId: number | null = null;
  
  // S2 Objective thresholds
  private readonly FPS_TARGET = 60;
  private readonly FPS_WARNING = 50;
  private readonly FRAME_TIME_TARGET = 16.67; // 60 FPS = ~16.67ms per frame
  private readonly MEMORY_WARNING = 100; // MB
  
  // Performance tracking
  private frameCount = 0;
  private lastTime = performance.now();
  private fpsHistory: number[] = [];
  
  private constructor() {}
  
  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }
  
  start() {
    if (this.isMonitoring) return;
    
    this.isMonitoring = true;
    this.lastTime = performance.now();
    this.frameCount = 0;
    
    console.log('🎯 PixelPerfect Performance Monitor started');
    console.log(`📊 Target: ${this.FPS_TARGET} FPS (S2 Objective)`);
    
    this.monitor();
  }
  
  stop() {
    this.isMonitoring = false;
    
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    
    console.log('🛑 Performance Monitor stopped');
    this.generateReport();
  }
  
  private monitor = () => {
    if (!this.isMonitoring) return;
    
    const currentTime = performance.now();
    const deltaTime = currentTime - this.lastTime;
    
    this.frameCount++;
    
    // Calculate FPS every second
    if (deltaTime >= 1000) {
      const fps = Math.round((this.frameCount * 1000) / deltaTime);
      const frameTime = deltaTime / this.frameCount;
      
      // Get memory usage if available
      const memoryUsage = this.getMemoryUsage();
      
      const metric: PerformanceMetrics = {
        fps,
        frameTime,
        memoryUsage,
        renderCalls: this.frameCount,
        timestamp: new Date()
      };
      
      this.metrics.push(metric);
      this.fpsHistory.push(fps);
      
      // Keep only last 60 seconds of history
      if (this.fpsHistory.length > 60) {
        this.fpsHistory.shift();
      }
      
      // Check for alerts
      this.checkPerformance(metric);
      
      // Reset counters
      this.frameCount = 0;
      this.lastTime = currentTime;
      
      // Log performance
      if (fps < this.FPS_TARGET) {
        console.warn(`⚠️ FPS below target: ${fps} < ${this.FPS_TARGET}`);
      } else {
        console.log(`✅ FPS: ${fps} (Target: ${this.FPS_TARGET})`);
      }
    }
    
    this.animationFrameId = requestAnimationFrame(this.monitor);
  };
  
  private getMemoryUsage(): number {
    // Use Performance API if available
    if ('memory' in performance && (performance as any).memory) {
      const memory = (performance as any).memory;
      return Math.round(memory.usedJSHeapSize / 1048576); // Convert to MB
    }
    return 0;
  }
  
  private checkPerformance(metric: PerformanceMetrics) {
    // Check FPS
    if (metric.fps < this.FPS_WARNING) {
      this.addAlert({
        type: 'fps_drop',
        severity: metric.fps < 30 ? 'critical' : 'warning',
        message: `FPS dropped below target: ${metric.fps} FPS`,
        metric: metric.fps,
        threshold: this.FPS_TARGET,
        timestamp: new Date()
      });
    }
    
    // Check memory
    if (metric.memoryUsage > this.MEMORY_WARNING) {
      this.addAlert({
        type: 'memory_spike',
        severity: metric.memoryUsage > 150 ? 'critical' : 'warning',
        message: `Memory usage high: ${metric.memoryUsage}MB`,
        metric: metric.memoryUsage,
        threshold: this.MEMORY_WARNING,
        timestamp: new Date()
      });
    }
    
    // Check frame time
    if (metric.frameTime > this.FRAME_TIME_TARGET * 1.5) {
      this.addAlert({
        type: 'frame_skip',
        severity: 'warning',
        message: `Frame time exceeded: ${metric.frameTime.toFixed(2)}ms`,
        metric: metric.frameTime,
        threshold: this.FRAME_TIME_TARGET,
        timestamp: new Date()
      });
    }
  }
  
  private addAlert(alert: PerformanceAlert) {
    this.alerts.push(alert);
    
    // Keep only last 100 alerts
    if (this.alerts.length > 100) {
      this.alerts.shift();
    }
    
    // Log critical alerts
    if (alert.severity === 'critical') {
      console.error('🚨 CRITICAL PERFORMANCE ALERT:', alert.message);
    }
  }
  
  getAverageFPS(): number {
    if (this.fpsHistory.length === 0) return 0;
    
    const sum = this.fpsHistory.reduce((a, b) => a + b, 0);
    return Math.round(sum / this.fpsHistory.length);
  }
  
  getMinFPS(): number {
    if (this.fpsHistory.length === 0) return 0;
    return Math.min(...this.fpsHistory);
  }
  
  getMaxFPS(): number {
    if (this.fpsHistory.length === 0) return 0;
    return Math.max(...this.fpsHistory);
  }
  
  getCurrentMetrics(): PerformanceMetrics | null {
    return this.metrics[this.metrics.length - 1] || null;
  }
  
  getAlerts(): PerformanceAlert[] {
    return [...this.alerts];
  }
  
  getCriticalAlerts(): PerformanceAlert[] {
    return this.alerts.filter(a => a.severity === 'critical');
  }
  
  generateReport() {
    const avgFPS = this.getAverageFPS();
    const minFPS = this.getMinFPS();
    const maxFPS = this.getMaxFPS();
    const criticalAlerts = this.getCriticalAlerts();
    
    console.log('\n📊 Performance Report (PixelPerfect Agent)');
    console.log('==========================================');
    console.log(`Average FPS: ${avgFPS} ${avgFPS >= this.FPS_TARGET ? '✅' : '⚠️'}`);
    console.log(`Min FPS: ${minFPS}`);
    console.log(`Max FPS: ${maxFPS}`);
    console.log(`S2 Objective (60+ FPS): ${avgFPS >= this.FPS_TARGET ? 'PASSED ✅' : 'FAILED ❌'}`);
    console.log(`Total Alerts: ${this.alerts.length}`);
    console.log(`Critical Alerts: ${criticalAlerts.length}`);
    
    if (criticalAlerts.length > 0) {
      console.log('\n🚨 Critical Issues:');
      criticalAlerts.forEach(alert => {
        console.log(`  - ${alert.message}`);
      });
    }
    
    console.log('==========================================\n');
    
    return {
      averageFPS: avgFPS,
      minFPS,
      maxFPS,
      s2Compliant: avgFPS >= this.FPS_TARGET,
      totalAlerts: this.alerts.length,
      criticalAlerts: criticalAlerts.length,
      report: this.metrics
    };
  }
  
  // OQE Integration
  getOQEMetrics() {
    return {
      objectiveId: 'S2',
      objectiveName: '60+ FPS Performance',
      currentValue: this.getAverageFPS(),
      target: this.FPS_TARGET,
      status: this.getAverageFPS() >= this.FPS_TARGET ? 'healthy' : 'critical',
      alerts: this.alerts.length,
      evidence: {
        metrics: this.metrics.slice(-10), // Last 10 measurements
        averageFPS: this.getAverageFPS(),
        minFPS: this.getMinFPS(),
        maxFPS: this.getMaxFPS()
      }
    };
  }
}

// Export singleton instance
export const performanceMonitor = PerformanceMonitor.getInstance();