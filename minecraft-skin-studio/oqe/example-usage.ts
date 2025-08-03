/**
 * OQE System Example Usage
 * Demonstrates how the OQE framework works
 */

import { AlignmentVerifier } from './framework/alignment-verifier';
import { TestExecutor } from './framework/test-executor';
import { OQEMonitor } from './monitoring/dashboard';
import { GUARDIAN_TEST_PLANS } from './test-plans/guardian-tests';
import { Change } from './framework/types';

async function demonstrateOQE() {
  console.log('🚀 OQE System Demonstration\n');
  
  // Initialize components
  const verifier = AlignmentVerifier.getInstance();
  const executor = TestExecutor.getInstance();
  const monitor = OQEMonitor.getInstance();
  
  // Example 1: Verify a safety-enhancing change
  console.log('Example 1: Safety Enhancement Change');
  console.log('====================================\n');
  
  const safetyChange: Change = {
    id: 'change-001',
    type: 'feature',
    description: 'Improve content filter to catch more inappropriate words',
    author: 'safety-engineer',
    timestamp: new Date(),
    files: ['src/filters/content-filter.ts'],
    diff: '+ Added 50 new blocked patterns',
    agent: 'guardian'
  };
  
  const safetyResult = await verifier.verifyChange(safetyChange);
  console.log('Classification:', safetyResult.classification);
  console.log('Decision:', safetyResult.decision.verdict);
  console.log('Certificate ID:', safetyResult.certificate.id);
  console.log('\n');
  
  // Example 2: Verify a performance optimization
  console.log('Example 2: Performance Optimization Change');
  console.log('=========================================\n');
  
  const perfChange: Change = {
    id: 'change-002',
    type: 'refactor',
    description: 'Optimize canvas rendering for better performance',
    author: 'performance-engineer',
    timestamp: new Date(),
    files: ['src/canvas/renderer.ts'],
    diff: '- Removed unnecessary redraws',
    agent: 'pixelperfect'
  };
  
  const perfResult = await verifier.verifyChange(perfChange);
  console.log('Classification:', perfResult.classification);
  console.log('Decision:', perfResult.decision.verdict);
  console.log('\n');
  
  // Example 3: Verify a potentially dangerous change
  console.log('Example 3: Dangerous Change (Should be Blocked)');
  console.log('==============================================\n');
  
  const dangerousChange: Change = {
    id: 'change-003',
    type: 'feature',
    description: 'Remove safety filters to improve performance',
    author: 'misguided-developer',
    timestamp: new Date(),
    files: ['src/filters/content-filter.ts'],
    diff: '- Removed content filtering',
    agent: 'unknown'
  };
  
  const dangerResult = await verifier.verifyChange(dangerousChange);
  console.log('Classification:', dangerResult.classification);
  console.log('Decision:', dangerResult.decision.verdict);
  console.log('Rationale:', dangerResult.decision.rationale);
  console.log('\n');
  
  // Example 4: Execute a test plan
  console.log('Example 4: Execute Guardian Test Plan');
  console.log('====================================\n');
  
  const testPlan = GUARDIAN_TEST_PLANS[0]; // Content Safety Validation
  const testResult = await executor.executeTestPlan(testPlan);
  
  console.log('Test Plan:', testPlan.name);
  console.log('Status:', testResult.status);
  console.log('Duration:', testResult.duration.toFixed(0) + 'ms');
  console.log('Test Cases:', testResult.results.length);
  console.log('Evidence ID:', testResult.evidence.id);
  console.log('\n');
  
  // Example 5: Monitor dashboard
  console.log('Example 5: Dashboard Status');
  console.log('==========================\n');
  
  // Record the test execution
  monitor.recordTestExecution(testResult);
  
  // Record the change verifications
  monitor.recordChangeVerification(safetyResult);
  monitor.recordChangeVerification(perfResult);
  monitor.recordChangeVerification(dangerResult);
  
  // Get dashboard snapshot
  const dashboard = monitor.getDashboard();
  
  console.log('Objectives Health:');
  dashboard.realTime.objectives.forEach(obj => {
    console.log(`  ${obj.objective.name}: ${obj.status} (${obj.objective.currentValue} ${obj.objective.unit})`);
  });
  
  console.log('\nMetrics:');
  console.log(`  Test Velocity: ${dashboard.metrics.testVelocity}`);
  console.log(`  Change Approval Rate: ${dashboard.metrics.changeApprovalRate.toFixed(1)}%`);
  console.log(`  Objective Health: ${dashboard.metrics.objectiveHealth.toFixed(1)}%`);
  
  console.log('\nRecent Activity:');
  console.log(`  Active Tests: ${dashboard.realTime.activeTests.length}`);
  console.log(`  Recent Changes: ${dashboard.realTime.recentChanges.length}`);
  console.log(`  Active Alerts: ${dashboard.realTime.alerts.length}`);
  
  // Simulate objective update
  console.log('\nSimulating FPS Drop...');
  monitor.updateObjectiveValue('S2', 58); // Below 60 FPS threshold
  
  const updatedDashboard = monitor.getDashboard();
  const fpsObjective = updatedDashboard.realTime.objectives.find(o => o.objective.id === 'S2');
  console.log(`  FPS Status: ${fpsObjective?.status}`);
  console.log(`  New Alerts: ${updatedDashboard.realTime.alerts.length}`);
  
  // Clean up
  monitor.stop();
  
  console.log('\n✅ OQE Demonstration Complete!');
}

// Run the demonstration
demonstrateOQE().catch(console.error);