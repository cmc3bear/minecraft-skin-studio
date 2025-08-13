/**
 * Dashboard API for Project Health Monitoring
 * Provides REST endpoints for project-boilerplate integration
 */

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const KPICollector = require('./kpi-collector.cjs');

class DashboardAPI {
  constructor(port = 3001) {
    this.port = port;
    this.app = express();
    this.collector = new KPICollector();
    this.monitoringDir = __dirname;
    
    this.setupMiddleware();
    this.setupRoutes();
    this.startPeriodicCollection();
  }

  setupMiddleware() {
    this.app.use(cors());
    this.app.use(express.json());
    
    // Logging middleware
    this.app.use((req, res, next) => {
      console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
      next();
    });
  }

  setupRoutes() {
    /**
     * Health check endpoint
     */
    this.app.get('/api/health', (req, res) => {
      const metricsFile = path.join(this.monitoringDir, 'metrics', 'current-metrics.json');
      
      try {
        const metrics = JSON.parse(fs.readFileSync(metricsFile, 'utf8'));
        res.json({
          status: metrics.status,
          score: metrics.healthScore,
          timestamp: metrics.timestamp,
          alerts: metrics.alerts
        });
      } catch (error) {
        res.status(500).json({
          status: 'error',
          message: 'Unable to retrieve health status',
          error: error.message
        });
      }
    });

    /**
     * Full metrics endpoint
     */
    this.app.get('/api/metrics', async (req, res) => {
      try {
        const metrics = await this.collector.collectAllMetrics();
        res.json(metrics);
      } catch (error) {
        res.status(500).json({
          status: 'error',
          message: 'Unable to collect metrics',
          error: error.message
        });
      }
    });

    /**
     * KPI endpoint
     */
    this.app.get('/api/kpis', (req, res) => {
      const dashboardFile = path.join(this.monitoringDir, 'dashboards', 'dashboard-export.json');
      
      try {
        const dashboard = JSON.parse(fs.readFileSync(dashboardFile, 'utf8'));
        res.json(dashboard.kpis);
      } catch (error) {
        res.status(500).json({
          status: 'error',
          message: 'Unable to retrieve KPIs',
          error: error.message
        });
      }
    });

    /**
     * Alerts endpoint
     */
    this.app.get('/api/alerts', (req, res) => {
      const metricsFile = path.join(this.monitoringDir, 'metrics', 'current-metrics.json');
      
      try {
        const metrics = JSON.parse(fs.readFileSync(metricsFile, 'utf8'));
        res.json({
          alerts: metrics.alerts,
          count: metrics.alerts.length,
          timestamp: metrics.timestamp
        });
      } catch (error) {
        res.status(500).json({
          status: 'error',
          message: 'Unable to retrieve alerts',
          error: error.message
        });
      }
    });

    /**
     * Dashboard data endpoint - Full export for project-boilerplate
     */
    this.app.get('/api/dashboard', (req, res) => {
      const dashboardFile = path.join(this.monitoringDir, 'dashboards', 'dashboard-export.json');
      
      try {
        const dashboard = JSON.parse(fs.readFileSync(dashboardFile, 'utf8'));
        res.json(dashboard);
      } catch (error) {
        res.status(500).json({
          status: 'error',
          message: 'Unable to retrieve dashboard data',
          error: error.message
        });
      }
    });

    /**
     * Historical metrics endpoint
     */
    this.app.get('/api/metrics/history', (req, res) => {
      const evidenceDir = path.join(this.monitoringDir, 'evidence');
      
      try {
        const files = fs.readdirSync(evidenceDir)
          .filter(f => f.startsWith('metrics-'))
          .sort()
          .reverse()
          .slice(0, 7); // Last 7 days
        
        const history = files.map(file => {
          const data = JSON.parse(fs.readFileSync(path.join(evidenceDir, file), 'utf8'));
          return {
            date: file.replace('metrics-', '').replace('.json', ''),
            healthScore: data.healthScore,
            alerts: data.alerts.length,
            status: data.status
          };
        });
        
        res.json({ history });
      } catch (error) {
        res.status(500).json({
          status: 'error',
          message: 'Unable to retrieve historical metrics',
          error: error.message
        });
      }
    });

    /**
     * Real-time metrics from browser (if available)
     */
    this.app.post('/api/metrics/realtime', (req, res) => {
      const realtimeFile = path.join(this.monitoringDir, 'metrics', 'realtime.json');
      
      try {
        // Store real-time metrics from browser
        fs.writeFileSync(realtimeFile, JSON.stringify({
          ...req.body,
          receivedAt: new Date().toISOString()
        }, null, 2));
        
        res.json({ status: 'success', message: 'Real-time metrics received' });
      } catch (error) {
        res.status(500).json({
          status: 'error',
          message: 'Unable to store real-time metrics',
          error: error.message
        });
      }
    });

    /**
     * Trigger manual metric collection
     */
    this.app.post('/api/collect', async (req, res) => {
      try {
        const metrics = await this.collector.collectAllMetrics();
        const dashboard = this.collector.exportForDashboard();
        
        res.json({
          status: 'success',
          message: 'Metrics collected successfully',
          healthScore: metrics.healthScore,
          dashboard: dashboard
        });
      } catch (error) {
        res.status(500).json({
          status: 'error',
          message: 'Collection failed',
          error: error.message
        });
      }
    });

    /**
     * WebSocket endpoint for real-time updates
     */
    this.app.get('/api/ws/metrics', (req, res) => {
      res.json({
        message: 'WebSocket endpoint for real-time metrics',
        url: `ws://localhost:${this.port}/metrics`,
        protocol: 'json',
        events: ['health', 'metrics', 'alerts', 'kpis']
      });
    });
  }

  /**
   * Start periodic metric collection
   */
  startPeriodicCollection() {
    // Collect metrics every 5 minutes
    setInterval(async () => {
      console.log('📊 Running scheduled metric collection...');
      try {
        await this.collector.collectAllMetrics();
        this.collector.exportForDashboard();
        console.log('✅ Scheduled collection complete');
      } catch (error) {
        console.error('❌ Scheduled collection failed:', error);
      }
    }, 5 * 60 * 1000); // 5 minutes

    // Initial collection
    this.collector.collectAllMetrics()
      .then(() => this.collector.exportForDashboard())
      .catch(console.error);
  }

  /**
   * Start the API server
   */
  start() {
    this.app.listen(this.port, () => {
      console.log('🚀 Dashboard API Server Started');
      console.log(`📊 API available at: http://localhost:${this.port}`);
      console.log('\n📌 Available endpoints:');
      console.log(`  GET  /api/health        - Project health status`);
      console.log(`  GET  /api/metrics       - Full metrics data`);
      console.log(`  GET  /api/kpis          - Key performance indicators`);
      console.log(`  GET  /api/alerts        - Active alerts`);
      console.log(`  GET  /api/dashboard     - Complete dashboard export`);
      console.log(`  GET  /api/metrics/history - Historical metrics`);
      console.log(`  POST /api/metrics/realtime - Receive real-time metrics`);
      console.log(`  POST /api/collect       - Trigger manual collection`);
      console.log('\n✅ Periodic collection running every 5 minutes');
    });
  }
}

// Export for use as module
module.exports = DashboardAPI;

// Run if executed directly
if (require.main === module) {
  const api = new DashboardAPI(3001);
  api.start();
}