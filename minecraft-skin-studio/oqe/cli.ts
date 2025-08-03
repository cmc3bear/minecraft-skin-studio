#!/usr/bin/env node
/**
 * OQE Command Line Interface
 * Run quality verification and monitoring commands
 */

import { Command } from 'commander';
import { AlignmentVerifier } from './framework/alignment-verifier';
import { TestExecutor } from './framework/test-executor';
import { OQEMonitor } from './monitoring/dashboard';
import { GUARDIAN_TEST_PLANS } from './test-plans/guardian-tests';
import { Change, TestPlan } from './framework/types';
import chalk from 'chalk';
import Table from 'cli-table3';

const program = new Command();

program
  .name('oqe')
  .description('Operational Quality Engineering CLI for Minecraft Skin Studio')
  .version('1.0.0');

// Verify command
program
  .command('verify <changeId>')
  .description('Verify a change against master plan objectives')
  .option('-d, --description <description>', 'Change description')
  .option('-t, --type <type>', 'Change type (feature|fix|refactor|config)', 'feature')
  .option('-a, --author <author>', 'Change author', 'developer')
  .action(async (changeId, options) => {
    console.log(chalk.blue('🔍 Verifying change alignment...\n'));
    
    const change: Change = {
      id: changeId,
      type: options.type,
      description: options.description || 'No description provided',
      author: options.author,
      timestamp: new Date(),
      files: [],
      diff: ''
    };
    
    const verifier = AlignmentVerifier.getInstance();
    const result = await verifier.verifyChange(change);
    
    // Display results
    console.log(chalk.bold('Change Classification:'), getImpactColor(result.classification));
    console.log(chalk.bold('Decision:'), getDecisionColor(result.decision.verdict));
    console.log(chalk.bold('Rationale:'), result.decision.rationale);
    
    // Show objective impacts
    if (result.objectiveImpacts.length > 0) {
      console.log(chalk.bold('\nObjective Impacts:'));
      const table = new Table({
        head: ['Objective', 'Current', 'Projected', 'Impact', 'Confidence'],
        style: { head: ['cyan'] }
      });
      
      result.objectiveImpacts.forEach(impact => {
        table.push([
          impact.objectiveId,
          impact.currentValue,
          impact.projectedValue,
          `${impact.impact > 0 ? '+' : ''}${impact.impact.toFixed(1)}%`,
          `${impact.confidence}%`
        ]);
      });
      
      console.log(table.toString());
    }
    
    // Show test results
    if (result.testExecutions.length > 0) {
      console.log(chalk.bold('\nTest Executions:'));
      result.testExecutions.forEach(exec => {
        const icon = exec.status === 'passed' ? '✅' : '❌';
        console.log(`  ${icon} ${exec.testPlanId}: ${exec.status} (${exec.duration.toFixed(0)}ms)`);
      });
    }
    
    // Show certificate
    console.log(chalk.bold('\nVerification Certificate:'));
    console.log(`  ID: ${result.certificate.id}`);
    console.log(`  Tests: ${result.certificate.testsPassed}/${result.certificate.testsTotal} passed`);
    console.log(`  Evidence Hash: ${result.certificate.evidenceHash.substring(0, 16)}...`);
  });

// Test command
program
  .command('test <testPlanId>')
  .description('Execute a specific test plan')
  .action(async (testPlanId) => {
    console.log(chalk.blue(`🧪 Executing test plan: ${testPlanId}\n`));
    
    // Find test plan
    const testPlan = GUARDIAN_TEST_PLANS.find(tp => tp.id === testPlanId);
    if (!testPlan) {
      console.error(chalk.red(`Test plan not found: ${testPlanId}`));
      process.exit(1);
    }
    
    const executor = TestExecutor.getInstance();
    const result = await executor.executeTestPlan(testPlan);
    
    // Display results
    console.log(chalk.bold('Test Plan:'), testPlan.name);
    console.log(chalk.bold('Status:'), getStatusColor(result.status));
    console.log(chalk.bold('Duration:'), `${result.duration.toFixed(0)}ms`);
    console.log(chalk.bold('Test Cases:'), `${result.results.length}`);
    
    // Show test case results
    const table = new Table({
      head: ['Test Case', 'Status', 'Duration', 'Assertions'],
      style: { head: ['cyan'] }
    });
    
    result.results.forEach(tcResult => {
      const passed = tcResult.assertions.filter(a => a.passed).length;
      const total = tcResult.assertions.length;
      
      table.push([
        tcResult.testCaseId,
        getStatusColor(tcResult.status),
        `${tcResult.duration.toFixed(0)}ms`,
        `${passed}/${total}`
      ]);
    });
    
    console.log('\n' + table.toString());
    
    // Show evidence
    console.log(chalk.bold('\nEvidence:'));
    console.log(`  ID: ${result.evidence.id}`);
    console.log(`  Artifacts: ${result.evidence.artifacts.length}`);
    console.log(`  Signature: ${result.evidence.signature.substring(0, 16)}...`);
  });

// Monitor command
program
  .command('monitor')
  .description('Display real-time OQE dashboard')
  .action(() => {
    console.clear();
    console.log(chalk.blue('📊 OQE Monitoring Dashboard\n'));
    
    const monitor = OQEMonitor.getInstance();
    
    // Update display every second
    const updateDisplay = () => {
      const dashboard = monitor.getDashboard();
      
      // Clear and redraw
      console.clear();
      console.log(chalk.blue('📊 OQE Monitoring Dashboard\n'));
      
      // Objectives status
      console.log(chalk.bold('Objectives Status:'));
      const objTable = new Table({
        head: ['Objective', 'Level', 'Current', 'Target', 'Health', 'Trend'],
        style: { head: ['cyan'] }
      });
      
      dashboard.realTime.objectives.forEach(objStatus => {
        const obj = objStatus.objective;
        objTable.push([
          obj.name,
          obj.level,
          obj.currentValue,
          obj.target,
          getHealthColor(objStatus.status),
          getTrendIcon(objStatus.trend)
        ]);
      });
      
      console.log(objTable.toString());
      
      // Metrics
      console.log(chalk.bold('\nKey Metrics:'));
      console.log(`  Test Velocity: ${dashboard.metrics.testVelocity} tests/day`);
      console.log(`  Change Approval Rate: ${dashboard.metrics.changeApprovalRate.toFixed(1)}%`);
      console.log(`  Objective Health: ${dashboard.metrics.objectiveHealth.toFixed(1)}%`);
      console.log(`  Evidence Completeness: ${dashboard.metrics.evidenceCompleteness.toFixed(1)}%`);
      
      // Alerts
      if (dashboard.realTime.alerts.length > 0) {
        console.log(chalk.bold('\n⚠️  Active Alerts:'));
        dashboard.realTime.alerts.forEach(alert => {
          const icon = alert.severity === 'critical' ? '🚨' : '⚠️';
          console.log(`  ${icon} ${alert.message}`);
        });
      }
      
      console.log(chalk.gray('\nPress Ctrl+C to exit'));
    };
    
    // Initial display
    updateDisplay();
    
    // Update every second
    const interval = setInterval(updateDisplay, 1000);
    
    // Handle exit
    process.on('SIGINT', () => {
      clearInterval(interval);
      monitor.stop();
      console.log(chalk.yellow('\n\nMonitoring stopped.'));
      process.exit(0);
    });
  });

// Status command
program
  .command('status')
  .description('Show current OQE system status')
  .action(() => {
    const monitor = OQEMonitor.getInstance();
    const dashboard = monitor.getDashboard();
    
    console.log(chalk.blue('📈 OQE System Status\n'));
    
    // Overall health
    const healthyCount = dashboard.realTime.objectives.filter(o => o.status === 'healthy').length;
    const totalCount = dashboard.realTime.objectives.length;
    const overallHealth = (healthyCount / totalCount) * 100;
    
    console.log(chalk.bold('Overall Health:'), getHealthBar(overallHealth));
    console.log(chalk.bold('Healthy Objectives:'), `${healthyCount}/${totalCount}`);
    
    // Critical objectives
    console.log(chalk.bold('\nCritical Objectives:'));
    dashboard.realTime.objectives
      .filter(o => o.objective.level === 'CRITICAL')
      .forEach(objStatus => {
        const icon = objStatus.status === 'healthy' ? '✅' : 
                    objStatus.status === 'warning' ? '⚠️' : '❌';
        console.log(`  ${icon} ${objStatus.objective.name}: ${objStatus.objective.currentValue} ${objStatus.objective.unit}`);
      });
    
    // Recent activity
    console.log(chalk.bold('\nRecent Activity:'));
    console.log(`  Active Tests: ${dashboard.realTime.activeTests.length}`);
    console.log(`  Recent Changes: ${dashboard.realTime.recentChanges.length}`);
    console.log(`  Active Alerts: ${dashboard.realTime.alerts.length}`);
  });

// Helper functions
function getImpactColor(impact: string): string {
  switch (impact) {
    case 'CRITICAL_POSITIVE': return chalk.green.bold(impact);
    case 'CORE_POSITIVE': return chalk.green(impact);
    case 'GROWTH_POSITIVE': return chalk.greenBright(impact);
    case 'NEUTRAL': return chalk.gray(impact);
    case 'MINOR_NEGATIVE': return chalk.yellow(impact);
    case 'MAJOR_NEGATIVE': return chalk.red(impact);
    case 'BLOCKING': return chalk.red.bold(impact);
    default: return impact;
  }
}

function getDecisionColor(verdict: string): string {
  switch (verdict) {
    case 'approved': return chalk.green.bold(verdict.toUpperCase());
    case 'conditional': return chalk.yellow.bold(verdict.toUpperCase());
    case 'rejected': return chalk.red.bold(verdict.toUpperCase());
    default: return verdict;
  }
}

function getStatusColor(status: string): string {
  switch (status) {
    case 'passed': return chalk.green(status);
    case 'failed': return chalk.red(status);
    case 'skipped': return chalk.gray(status);
    case 'running': return chalk.blue(status);
    case 'blocked': return chalk.red.bold(status);
    default: return status;
  }
}

function getHealthColor(health: string): string {
  switch (health) {
    case 'healthy': return chalk.green('● Healthy');
    case 'warning': return chalk.yellow('● Warning');
    case 'critical': return chalk.red('● Critical');
    default: return health;
  }
}

function getTrendIcon(trend: string): string {
  switch (trend) {
    case 'improving': return chalk.green('↑');
    case 'stable': return chalk.gray('→');
    case 'degrading': return chalk.red('↓');
    default: return trend;
  }
}

function getHealthBar(percentage: number): string {
  const filled = Math.round(percentage / 10);
  const empty = 10 - filled;
  const bar = chalk.green('█').repeat(filled) + chalk.gray('░').repeat(empty);
  return `${bar} ${percentage.toFixed(1)}%`;
}

program.parse();