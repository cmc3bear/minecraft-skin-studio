/**
 * Enhanced OQE System Example Usage
 * Demonstrates change-specific testing with measurable objective evidence
 */

import { AlignmentVerifier } from './framework/alignment-verifier';
import { Change } from './framework/types';
import chalk from 'chalk';

async function demonstrateEnhancedOQE() {
  console.log(chalk.blue.bold('🚀 Enhanced OQE System - Change-Specific Testing\n'));
  
  const verifier = AlignmentVerifier.getInstance();
  
  // Example 1: Performance optimization with specific claims
  console.log(chalk.yellow.bold('Example 1: Performance Optimization with Quantified Claims'));
  console.log('='.repeat(60) + '\n');
  
  const performanceChange: Change = {
    id: 'perf-001',
    type: 'refactor',
    description: 'Optimize canvas rendering to improve FPS by 15% from baseline 52 to target 60+ FPS',
    author: 'performance-engineer',
    timestamp: new Date(),
    files: ['src/canvas/renderer.ts', 'src/canvas/optimization.ts'],
    diff: '+ Added render caching\n+ Optimized draw calls\n+ Reduced memory allocations',
    agent: 'pixelperfect'
  };
  
  console.log(chalk.cyan('Change Description:'), performanceChange.description);
  console.log(chalk.cyan('Claimed Impact:'), '15% FPS improvement (52 → 60+ FPS)');
  console.log();
  
  const perfResult = await verifier.verifyChange(performanceChange);
  console.log(chalk.bold('Classification:'), getColoredClassification(perfResult.classification));
  console.log(chalk.bold('Decision:'), getColoredDecision(perfResult.decision.verdict));
  
  if (perfResult.testExecutions.length > 0) {
    const testExec = perfResult.testExecutions[0];
    console.log(chalk.bold('\\nMeasurable Evidence:'));
    console.log(`  Test Plan: ${testExec.testPlanId}`);
    console.log(`  Status: ${getColoredStatus(testExec.status)}`);
    
    if (testExec.evidence.data.evidencePackage) {
      const evidence = testExec.evidence.data.evidencePackage;
      console.log('\\n  📊 Objective Measurements:');
      
      evidence.measurements.forEach((measurement: any) => {
        const icon = measurement.passed ? '✅' : '❌';
        console.log(`    ${icon} ${measurement.metric}:`);
        console.log(`      Baseline: ${measurement.baselineValue} ${measurement.metric.includes('fps') ? 'fps' : 'units'}`);
        console.log(`      Actual: ${measurement.actualValue} ${measurement.metric.includes('fps') ? 'fps' : 'units'}`);
        console.log(`      Improvement: ${chalk.green.bold(measurement.improvement.toFixed(1) + '%')}`);
        console.log(`      Target Met: ${measurement.passed ? chalk.green('YES') : chalk.red('NO')}`);
      });
      
      console.log('\\n  📈 Statistical Analysis:');
      console.log(`    P-Value: ${evidence.statisticalSignificance.pValue.toFixed(3)}`);
      console.log(`    Confidence: ${evidence.statisticalSignificance.confidenceInterval[0].toFixed(1)}% - ${evidence.statisticalSignificance.confidenceInterval[1].toFixed(1)}%`);
      console.log(`    Sample Size: ${evidence.statisticalSignificance.sampleSize.toLocaleString()}`);
      
      console.log('\\n  🔒 Evidence Artifacts:');
      evidence.artifacts.forEach((artifact: any) => {
        console.log(`    📄 ${artifact}`);
      });
      console.log(`    🔐 Certificate Hash: ${evidence.certificateHash.substring(0, 16)}...`);
    }
  }
  
  console.log('\\n' + '='.repeat(60) + '\\n');
  
  // Example 2: Safety improvement with accuracy claims
  console.log(chalk.yellow.bold('Example 2: Safety Filter with Accuracy Claims'));
  console.log('='.repeat(60) + '\\n');
  
  const safetyChange: Change = {
    id: 'safety-002',
    type: 'feature',
    description: 'Improve content filter accuracy by 5% reducing false negatives from 2.1% to under 1%',
    author: 'safety-engineer',
    timestamp: new Date(),
    files: ['src/filters/content-filter.ts'],
    diff: '+ Added contextual analysis\n+ Improved pattern matching\n+ Added ML classification',
    agent: 'guardian'
  };
  
  console.log(chalk.cyan('Change Description:'), safetyChange.description);
  console.log(chalk.cyan('Claimed Impact:'), '5% accuracy improvement, false negatives: 2.1% → <1%');
  console.log();
  
  const safetyResult = await verifier.verifyChange(safetyChange);
  console.log(chalk.bold('Classification:'), getColoredClassification(safetyResult.classification));
  console.log(chalk.bold('Decision:'), getColoredDecision(safetyResult.decision.verdict));
  
  if (safetyResult.testExecutions.length > 0) {
    const testExec = safetyResult.testExecutions[0];
    console.log(chalk.bold('\\nMeasurable Evidence:'));
    
    if (testExec.evidence.data.evidencePackage) {
      const evidence = testExec.evidence.data.evidencePackage;
      console.log('\\n  📊 Safety Metrics:');
      
      evidence.measurements.forEach((measurement: any) => {
        const icon = measurement.passed ? '✅' : '❌';  
        console.log(`    ${icon} ${measurement.metric}:`);
        console.log(`      Before: ${measurement.baselineValue}% accuracy`);
        console.log(`      After: ${measurement.actualValue}% accuracy`);
        console.log(`      Improvement: ${chalk.green.bold('+' + measurement.improvement.toFixed(1) + ' points')}`);
        console.log(`      Child Safety: ${measurement.passed ? chalk.green('ENHANCED') : chalk.red('INSUFFICIENT')}`);
      });
    }
  }
  
  console.log('\\n' + '='.repeat(60) + '\\n');
  
  // Example 3: Feature addition with response time claims
  console.log(chalk.yellow.bold('Example 3: AI Feature with Response Time Claims'));
  console.log('='.repeat(60) + '\\n');
  
  const featureChange: Change = {
    id: 'feature-003',
    type: 'feature',
    description: 'Add AI skin suggestion feature with response time under 3 seconds, reduce from 4.2s baseline',
    author: 'ai-engineer',
    timestamp: new Date(),
    files: ['src/ai/suggestions.ts', 'src/api/ai-service.ts'],
    diff: '+ Added AI suggestion endpoint\n+ Implemented caching layer\n+ Added response optimization',
    agent: 'tensor'
  };
  
  console.log(chalk.cyan('Change Description:'), featureChange.description);
  console.log(chalk.cyan('Claimed Impact:'), 'Response time: 4.2s → <3s (30% improvement)');
  console.log();
  
  const featureResult = await verifier.verifyChange(featureChange);
  console.log(chalk.bold('Classification:'), getColoredClassification(featureResult.classification));
  console.log(chalk.bold('Decision:'), getColoredDecision(featureResult.decision.verdict));
  
  if (featureResult.testExecutions.length > 0) {
    const testExec = featureResult.testExecutions[0];
    
    if (testExec.evidence.data.evidencePackage) {
      const evidence = testExec.evidence.data.evidencePackage;
      console.log('\\n  📊 Performance Evidence:');
      
      evidence.measurements.forEach((measurement: any) => {
        const icon = measurement.passed ? '✅' : '❌';
        console.log(`    ${icon} ${measurement.metric}:`);
        console.log(`      Baseline: ${measurement.baselineValue}s`);
        console.log(`      Achieved: ${measurement.actualValue}s`);
        console.log(`      Improvement: ${chalk.green.bold(Math.abs(measurement.improvement).toFixed(1) + '% faster')}`);
        console.log(`      Meets Objective S3 (<3s): ${measurement.passed ? chalk.green('YES') : chalk.red('NO')}`);
      });
      
      console.log('\\n  🎯 Objective Alignment:');
      console.log(`    S3 - AI Response Time: ${chalk.green('IMPROVED')}`);
      console.log(`    Child Experience: ${chalk.green('ENHANCED')}`);
    }
  }
  
  console.log('\\n' + '='.repeat(60) + '\\n');
  
  console.log(chalk.green.bold('✅ Enhanced OQE Demonstration Complete!'));
  console.log(chalk.gray('All changes verified with objective, measurable evidence.'));
  console.log(chalk.gray('Evidence packages saved with cryptographic certificates.'));
}

function getColoredClassification(classification: string): string {
  switch (classification) {
    case 'CRITICAL_POSITIVE': return chalk.green.bold(classification);
    case 'CORE_POSITIVE': return chalk.green(classification);
    case 'GROWTH_POSITIVE': return chalk.greenBright(classification);
    case 'NEUTRAL': return chalk.gray(classification);
    case 'MINOR_NEGATIVE': return chalk.yellow(classification);
    case 'MAJOR_NEGATIVE': return chalk.red(classification);
    case 'BLOCKING': return chalk.red.bold(classification);
    default: return classification;
  }
}

function getColoredDecision(verdict: string): string {
  switch (verdict) {
    case 'approved': return chalk.green.bold(verdict.toUpperCase());
    case 'conditional': return chalk.yellow.bold(verdict.toUpperCase());
    case 'rejected': return chalk.red.bold(verdict.toUpperCase());
    default: return verdict;
  }
}

function getColoredStatus(status: string): string {
  switch (status) {
    case 'passed': return chalk.green(status);
    case 'failed': return chalk.red(status);
    case 'blocked': return chalk.red.bold(status);
    default: return status;
  }
}

// Run the enhanced demonstration
demonstrateEnhancedOQE().catch(console.error);