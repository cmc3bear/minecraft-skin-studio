/**
 * Log Checking Script
 * Reviews application logs and reports significant events
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('=== Minecraft Skin Studio Log Analysis ===\n');

// Check for log files in common locations
const logDirs = [
  './logs',
  './dist/logs',
  './src/logs',
  './'
];

let logsFound = false;

// Check each directory for log files
logDirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    const files = fs.readdirSync(dir);
    const logFiles = files.filter(f => 
      f.endsWith('.log') || 
      f.endsWith('.json') && f.includes('log') ||
      f.includes('interaction')
    );
    
    if (logFiles.length > 0) {
      console.log(`📁 Found logs in ${dir}:`);
      logFiles.forEach(file => {
        const filePath = path.join(dir, file);
        const stats = fs.statSync(filePath);
        const size = (stats.size / 1024).toFixed(2);
        const modified = stats.mtime.toISOString();
        console.log(`  - ${file} (${size}KB, modified: ${modified})`);
        
        // Try to read and analyze JSON logs
        if (file.endsWith('.json')) {
          try {
            const content = fs.readFileSync(filePath, 'utf8');
            const data = JSON.parse(content);
            
            if (data.logs || data.interactions) {
              const logs = data.logs || data.interactions;
              console.log(`    └─ Contains ${logs.length} log entries`);
              
              // Analyze log types
              const types = {};
              logs.forEach(log => {
                types[log.type] = (types[log.type] || 0) + 1;
              });
              
              Object.entries(types).forEach(([type, count]) => {
                console.log(`       • ${type}: ${count} events`);
              });
            }
            
            // Check compliance if available
            if (data.complianceReport) {
              console.log(`    └─ Compliance Report:`);
              console.log(`       • Overall: ${data.complianceReport.overallCompliance}%`);
              console.log(`       • Evidence: ${data.complianceReport.evidenceCompliance}%`);
              console.log(`       • Error Handling: ${data.complianceReport.errorHandlingCompliance}%`);
            }
            
            // Check insights if available
            if (data.insights) {
              const { performanceIssues, userStrugglePoints, improvementOpportunities } = data.insights;
              if (performanceIssues?.length > 0) {
                console.log(`    └─ ⚠️ Performance Issues:`);
                performanceIssues.forEach(issue => {
                  console.log(`       • ${issue}`);
                });
              }
              if (userStrugglePoints?.length > 0) {
                console.log(`    └─ 🔧 User Struggle Points:`);
                userStrugglePoints.forEach(point => {
                  console.log(`       • ${point}`);
                });
              }
              if (improvementOpportunities?.length > 0) {
                console.log(`    └─ 💡 Improvement Opportunities:`);
                improvementOpportunities.forEach(opp => {
                  console.log(`       • ${opp}`);
                });
              }
            }
          } catch (e) {
            console.log(`    └─ Unable to parse JSON: ${e.message}`);
          }
        }
        
        logsFound = true;
      });
      console.log('');
    }
  }
});

// Check browser console logging setup
console.log('📊 Browser-Based Logging Configuration:');
console.log('  • PracticalInteractionLogger: Active (localStorage + console)');
console.log('  • Logs stored in: localStorage["practical_interaction_logs"]');
console.log('  • Session tracking: Enabled with unique session IDs');
console.log('  • Compliance tracking: Five Sacred Edicts framework');
console.log('');

// Check for error patterns in recent builds
console.log('🔍 Build & Runtime Status:');
const packageJsonPath = path.join(__dirname, 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
console.log(`  • Project: ${packageJson.name} v${packageJson.version}`);
console.log(`  • Environment: ${process.env.NODE_ENV || 'development'}`);

// Check if dist folder exists (production build)
if (fs.existsSync('./dist')) {
  const distFiles = fs.readdirSync('./dist');
  console.log(`  • Production build: ✓ (${distFiles.length} files)`);
} else {
  console.log('  • Production build: ✗ (run npm run build)');
}

console.log('');
console.log('📝 Logging Mechanisms Overview:');
console.log('  1. PracticalInteractionLogger (Primary):');
console.log('     - Tracks: canvas, AI, tool, export, error, navigation events');
console.log('     - Storage: localStorage + console output');
console.log('     - Features: Compliance reporting, actionable insights');
console.log('');
console.log('  2. InteractionTracker (Secondary):');
console.log('     - Tracks: User behavior patterns');
console.log('     - Storage: In-memory + localStorage');
console.log('     - Features: Session analysis, pattern detection');
console.log('');

if (!logsFound) {
  console.log('ℹ️ No file-based logs found. Logs are primarily stored in browser localStorage.');
  console.log('   To view logs: Open browser DevTools > Application > Local Storage');
  console.log('   Key: "practical_interaction_logs"');
}

console.log('\n=== Analysis Complete ===');