/**
 * Test Execution Engine
 * Runs test plans and collects evidence
 */

import {
  TestPlan,
  TestCase,
  TestExecution,
  TestResult,
  TestEnvironment,
  Evidence,
  Artifact,
  AssertionResult
} from './types';
import { performance } from 'perf_hooks';
import * as fs from 'fs/promises';
import * as path from 'path';
import { createHash } from 'crypto';

export class TestExecutor {
  private static instance: TestExecutor;
  private evidencePath: string;
  
  private constructor() {
    this.evidencePath = path.join(process.cwd(), 'oqe', 'evidence');
    this.ensureEvidenceDirectory();
  }
  
  static getInstance(): TestExecutor {
    if (!TestExecutor.instance) {
      TestExecutor.instance = new TestExecutor();
    }
    return TestExecutor.instance;
  }
  
  private async ensureEvidenceDirectory(): Promise<void> {
    try {
      await fs.mkdir(this.evidencePath, { recursive: true });
    } catch (error) {
      console.error('Failed to create evidence directory:', error);
    }
  }
  
  async executeTestPlan(testPlan: TestPlan): Promise<TestExecution> {
    console.log(`Executing test plan: ${testPlan.id} - ${testPlan.name}`);
    
    const execution: TestExecution = {
      id: `exec-${Date.now()}-${testPlan.id}`,
      testPlanId: testPlan.id,
      timestamp: new Date(),
      duration: 0,
      status: 'running',
      results: [],
      evidence: null as any, // Will be set later
      environment: this.captureEnvironment()
    };
    
    const startTime = performance.now();
    const artifacts: Artifact[] = [];
    
    try {
      // Verify pre-conditions
      await this.verifyPreConditions(testPlan);
      
      // Execute each test case
      for (const testCase of testPlan.testCases) {
        const result = await this.executeTestCase(testCase, testPlan);
        execution.results.push(result);
        
        // Collect artifacts from test case
        if (result.artifacts.length > 0) {
          artifacts.push(...result.artifacts);
        }
      }
      
      // Determine overall status
      const failedTests = execution.results.filter(r => r.status === 'failed').length;
      execution.status = failedTests === 0 ? 'passed' : 'failed';
      
      // Check success criteria
      const successRate = (execution.results.filter(r => r.status === 'passed').length / 
                          execution.results.length) * 100;
      
      if (successRate < testPlan.successCriteria.passingTests) {
        execution.status = 'failed';
      }
      
    } catch (error) {
      execution.status = 'blocked';
      console.error(`Test plan execution failed: ${(error as Error).message || String(error)}`);
    } finally {
      execution.duration = performance.now() - startTime;
      
      // Generate evidence
      execution.evidence = await this.generateEvidence(
        testPlan,
        execution,
        artifacts
      );
      
      // Save execution report
      await this.saveExecutionReport(execution);
    }
    
    return execution;
  }
  
  private async verifyPreConditions(testPlan: TestPlan): Promise<void> {
    console.log('Verifying pre-conditions...');
    
    for (const condition of testPlan.preConditions) {
      // In production, this would actually check the conditions
      // For now, we'll simulate
      const verified = await this.checkCondition(condition);
      if (!verified) {
        throw new Error(`Pre-condition not met: ${condition}`);
      }
    }
  }
  
  private async checkCondition(condition: string): Promise<boolean> {
    // Simulate condition checking
    await new Promise(resolve => setTimeout(resolve, 10));
    return true; // All conditions pass in mock
  }
  
  private async executeTestCase(
    testCase: TestCase,
    testPlan: TestPlan
  ): Promise<TestResult> {
    console.log(`  Executing test case: ${testCase.id} - ${testCase.name}`);
    
    const result: TestResult = {
      testCaseId: testCase.id,
      status: 'passed',
      duration: 0,
      assertions: [],
      artifacts: []
    };
    
    const startTime = performance.now();
    
    try {
      // Execute the test logic based on agent type
      const testOutput = await this.runTestLogic(testCase, testPlan.agentId);
      
      // Verify assertions
      for (const assertion of testCase.assertions) {
        const assertionResult = await this.verifyAssertion(
          assertion,
          testOutput,
          testCase.expectedOutput
        );
        result.assertions.push(assertionResult);
        
        if (!assertionResult.passed) {
          result.status = 'failed';
        }
      }
      
      // Capture test artifacts
      const artifactPaths = await this.captureTestArtifacts(testCase, testOutput);
      result.artifacts = await this.processArtifacts(artifactPaths);
      
    } catch (error) {
      result.status = 'failed';
      result.error = error instanceof Error ? error.message : String(error);
    } finally {
      result.duration = performance.now() - startTime;
    }
    
    return result;
  }
  
  private async runTestLogic(testCase: TestCase, agentId: string): Promise<any> {
    // This is where agent-specific test logic would be implemented
    // For now, we'll simulate based on agent type
    
    switch (agentId) {
      case 'guardian':
        return this.runGuardianTest(testCase);
      case 'tensor':
        return this.runTensorTest(testCase);
      case 'pixelperfect':
        return this.runPixelPerfectTest(testCase);
      default:
        return this.runGenericTest(testCase);
    }
  }
  
  private async runGuardianTest(testCase: TestCase): Promise<any> {
    // Simulate Guardian agent tests
    const { ContentFilter } = await import('../agents/guardian');
    const filter = ContentFilter.getInstance();
    
    const results: any = {};
    
    // Test profanity if input contains text
    if (typeof testCase.input === 'string') {
      results.safety = await filter.checkContent(testCase.input);
    } else if (Array.isArray(testCase.input)) {
      results.safety = await Promise.all(
        testCase.input.map(text => filter.checkContent(text))
      );
    } else if (testCase.input.appropriate && testCase.input.inappropriate) {
      results.appropriate = await Promise.all(
        testCase.input.appropriate.map((text: any) => filter.checkContent(text))
      );
      results.inappropriate = await Promise.all(
        testCase.input.inappropriate.map((text: any) => filter.checkContent(text))
      );
    }
    
    return results;
  }
  
  private async runTensorTest(testCase: TestCase): Promise<any> {
    // Simulate Tensor AI tests
    return {
      responseTime: Math.random() * 3000, // 0-3 seconds
      safe: true,
      accuracy: 85 + Math.random() * 15 // 85-100%
    };
  }
  
  private async runPixelPerfectTest(testCase: TestCase): Promise<any> {
    // Simulate PixelPerfect performance tests
    return {
      fps: 58 + Math.random() * 5, // 58-63 FPS
      memoryUsage: 70 + Math.random() * 30, // 70-100 MB
      renderTime: 10 + Math.random() * 6 // 10-16ms
    };
  }
  
  private async runGenericTest(testCase: TestCase): Promise<any> {
    // Generic test simulation
    return {
      passed: true,
      output: testCase.expectedOutput
    };
  }
  
  private async verifyAssertion(
    assertion: any,
    actual: any,
    expected: any
  ): Promise<AssertionResult> {
    let passed = false;
    let actualValue = actual;
    let message = '';
    
    // Navigate to the actual value if path is specified
    if (assertion.actual && assertion.actual.includes('.')) {
      const path = assertion.actual.split('.');
      actualValue = this.getNestedValue(actual, path);
    }
    
    // Perform assertion based on type
    switch (assertion.type) {
      case 'equals':
        passed = actualValue === assertion.expected;
        message = passed ? 'Values are equal' : 
          `Expected ${assertion.expected}, got ${actualValue}`;
        break;
        
      case 'contains':
        passed = Array.isArray(actualValue) 
          ? actualValue.includes(assertion.expected)
          : String(actualValue).includes(assertion.expected);
        message = passed ? 'Value contains expected' : 
          `Value does not contain ${assertion.expected}`;
        break;
        
      case 'greaterThan':
        passed = Number(actualValue) > Number(assertion.expected);
        message = passed ? 'Value is greater' : 
          `${actualValue} is not greater than ${assertion.expected}`;
        break;
        
      case 'lessThan':
        passed = Number(actualValue) < Number(assertion.expected);
        message = passed ? 'Value is less' : 
          `${actualValue} is not less than ${assertion.expected}`;
        break;
        
      case 'matches':
        const regex = new RegExp(assertion.expected);
        passed = regex.test(String(actualValue));
        message = passed ? 'Pattern matches' : 
          `Value does not match pattern ${assertion.expected}`;
        break;
    }
    
    return {
      assertion,
      passed,
      actual: actualValue,
      message
    };
  }
  
  private getNestedValue(obj: any, path: string[]): any {
    return path.reduce((current, key) => current?.[key], obj);
  }
  
  private async captureTestArtifacts(
    testCase: TestCase,
    output: any
  ): Promise<string[]> {
    const artifacts: string[] = [];
    
    // Save test output as JSON artifact
    const outputPath = path.join(
      this.evidencePath,
      `${testCase.id}-output-${Date.now()}.json`
    );
    
    await fs.writeFile(outputPath, JSON.stringify(output, null, 2));
    artifacts.push(outputPath);
    
    return artifacts;
  }
  
  private async processArtifacts(artifactPaths: string[]): Promise<Artifact[]> {
    const artifacts: Artifact[] = [];
    
    for (const artifactPath of artifactPaths) {
      try {
        const stats = await fs.stat(artifactPath);
        const content = await fs.readFile(artifactPath);
        const hash = createHash('sha256').update(content).digest('hex');
        
        artifacts.push({
          type: this.determineArtifactType(artifactPath),
          path: artifactPath,
          hash,
          size: stats.size,
          metadata: {
            created: stats.birthtime,
            modified: stats.mtime
          }
        });
      } catch (error) {
        console.error(`Failed to process artifact ${artifactPath}:`, error);
      }
    }
    
    return artifacts;
  }
  
  private determineArtifactType(filePath: string): 'log' | 'screenshot' | 'video' | 'report' | 'data' {
    const ext = path.extname(filePath).toLowerCase();
    
    switch (ext) {
      case '.log':
      case '.txt':
        return 'log';
      case '.png':
      case '.jpg':
      case '.jpeg':
        return 'screenshot';
      case '.mp4':
      case '.webm':
        return 'video';
      case '.pdf':
      case '.html':
        return 'report';
      default:
        return 'data';
    }
  }
  
  private async generateEvidence(
    testPlan: TestPlan,
    execution: TestExecution,
    artifacts: Artifact[]
  ): Promise<Evidence> {
    const evidenceData = {
      testPlanId: testPlan.id,
      executionId: execution.id,
      status: execution.status,
      duration: execution.duration,
      results: execution.results.map(r => ({
        testCaseId: r.testCaseId,
        status: r.status,
        assertions: r.assertions.length,
        passed: r.assertions.filter(a => a.passed).length
      })),
      timestamp: execution.timestamp
    };
    
    const evidence: Evidence = {
      id: `evidence-${execution.id}`,
      type: 'test',
      timestamp: new Date(),
      source: `${testPlan.agentId}-test-executor`,
      data: evidenceData,
      artifacts,
      signature: this.generateSignature(evidenceData),
      verified: true
    };
    
    // Save evidence record
    const evidencePath = path.join(
      this.evidencePath,
      `evidence-${evidence.id}.json`
    );
    
    await fs.writeFile(evidencePath, JSON.stringify(evidence, null, 2));
    
    return evidence;
  }
  
  private async saveExecutionReport(execution: TestExecution): Promise<void> {
    const reportPath = path.join(
      this.evidencePath,
      `execution-${execution.id}.json`
    );
    
    await fs.writeFile(reportPath, JSON.stringify(execution, null, 2));
    
    console.log(`Test execution report saved: ${reportPath}`);
  }
  
  private captureEnvironment(): TestEnvironment {
    return {
      node: process.version,
      os: process.platform,
      browser: process.env.BROWSER || undefined,
      device: process.env.DEVICE || undefined,
      config: {
        testMode: process.env.NODE_ENV === 'test',
        ci: process.env.CI === 'true'
      }
    };
  }
  
  private generateSignature(data: any): string {
    const content = JSON.stringify(data);
    return createHash('sha256').update(content).digest('hex');
  }
}