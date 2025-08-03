/**
 * Alignment Verification System
 * Ensures all changes advance master plan objectives
 */

import {
  Change,
  ChangeImpact,
  ObjectiveImpact,
  AlignmentVerification,
  ObjectiveLevel,
  Decision,
  TestExecution,
  Evidence,
  VerificationCertificate
} from './types';
import { DynamicTestGenerator } from './dynamic-test-generator';
import { MeasurementEngine } from './measurement-engine';
import { 
  MASTER_PLAN_OBJECTIVES, 
  getObjectiveById, 
  getCriticalObjectives,
  calculateObjectiveImpact,
  isObjectiveHealthy
} from './objectives';
import { createHash } from 'crypto';

export class AlignmentVerifier {
  private static instance: AlignmentVerifier;
  
  private constructor() {}
  
  static getInstance(): AlignmentVerifier {
    if (!AlignmentVerifier.instance) {
      AlignmentVerifier.instance = new AlignmentVerifier();
    }
    return AlignmentVerifier.instance;
  }
  
  async verifyChange(change: Change): Promise<AlignmentVerification> {
    console.log(`Verifying alignment for change: ${change.id} - ${change.description}`);
    
    // Step 1: Analyze impact on objectives
    const objectiveImpacts = await this.analyzeObjectiveImpacts(change);
    
    // Step 2: Classify the change
    const classification = this.classifyChange(objectiveImpacts);
    
    // Step 3: Check for critical objective violations
    const criticalViolation = this.checkCriticalViolations(objectiveImpacts);
    if (criticalViolation) {
      return this.createBlockedVerification(change, criticalViolation);
    }
    
    // Step 4: Execute relevant test plans
    const testExecutions = await this.executeRelevantTests(change, classification);
    
    // Step 5: Collect evidence
    const evidence = await this.collectEvidence(change, testExecutions);
    
    // Step 6: Make decision
    const decision = this.makeDecision(classification, objectiveImpacts, testExecutions);
    
    // Step 7: Generate certificate
    const certificate = this.generateCertificate(
      change,
      decision,
      objectiveImpacts,
      testExecutions,
      evidence
    );
    
    return {
      changeId: change.id,
      change,
      classification,
      objectiveImpacts,
      testExecutions,
      evidence,
      decision,
      certificate
    };
  }
  
  private async analyzeObjectiveImpacts(change: Change): Promise<ObjectiveImpact[]> {
    const impacts: ObjectiveImpact[] = [];
    
    // Analyze impact on each objective
    for (const objective of MASTER_PLAN_OBJECTIVES) {
      const impact = await this.predictObjectiveImpact(change, objective.id);
      if (impact) {
        impacts.push(impact);
      }
    }
    
    return impacts;
  }
  
  private async predictObjectiveImpact(
    change: Change,
    objectiveId: string
  ): Promise<ObjectiveImpact | null> {
    const objective = getObjectiveById(objectiveId);
    if (!objective) return null;
    
    // This is where ML models or heuristics would predict impact
    // For now, we'll use rule-based predictions
    let projectedValue = objective.currentValue;
    let impact = 0;
    let confidence = 0;
    const evidence: string[] = [];
    
    // Safety objective (S1)
    if (objectiveId === 'S1' && change.description.toLowerCase().includes('safety')) {
      if (change.description.includes('improve') || change.description.includes('enhance')) {
        impact = 0; // Maintaining zero incidents
        confidence = 95;
        evidence.push('Change enhances safety measures');
      } else if (change.description.includes('remove') || change.description.includes('disable')) {
        impact = -100; // Risk of incidents
        confidence = 90;
        evidence.push('Change may compromise safety');
      }
    }
    
    // Performance objective (S2)
    if (objectiveId === 'S2' && change.description.toLowerCase().includes('performance')) {
      if (change.description.includes('optimize')) {
        projectedValue = typeof objective.currentValue === 'number' 
          ? objective.currentValue * 1.05 
          : objective.currentValue;
        impact = 5;
        confidence = 80;
        evidence.push('Performance optimization detected');
      }
    }
    
    // AI Response objective (S3)
    if (objectiveId === 'S3' && change.description.toLowerCase().includes('ai')) {
      if (change.description.includes('cache') || change.description.includes('optimize')) {
        projectedValue = typeof objective.currentValue === 'number' 
          ? objective.currentValue * 0.9 
          : objective.currentValue;
        impact = 10;
        confidence = 85;
        evidence.push('AI optimization detected');
      }
    }
    
    // Only return if there's an impact
    if (impact !== 0 || evidence.length > 0) {
      return {
        objectiveId,
        currentValue: objective.currentValue,
        projectedValue,
        impact,
        confidence,
        evidence
      };
    }
    
    return null;
  }
  
  private classifyChange(impacts: ObjectiveImpact[]): ChangeImpact {
    // Check for blocking impacts first
    const criticalObjectives = getCriticalObjectives();
    for (const impact of impacts) {
      const objective = getObjectiveById(impact.objectiveId);
      if (objective && criticalObjectives.includes(objective)) {
        if (impact.impact < 0) {
          return ChangeImpact.BLOCKING;
        }
        if (impact.impact > 0) {
          return ChangeImpact.CRITICAL_POSITIVE;
        }
      }
    }
    
    // Check for positive impacts
    const positiveImpacts = impacts.filter(i => i.impact > 0);
    const negativeImpacts = impacts.filter(i => i.impact < 0);
    
    if (positiveImpacts.length > 0 && negativeImpacts.length === 0) {
      // Determine level based on objectives affected
      const affectedLevels = positiveImpacts.map(i => {
        const obj = getObjectiveById(i.objectiveId);
        return obj?.level;
      });
      
      if (affectedLevels.includes(ObjectiveLevel.CRITICAL)) return ChangeImpact.CRITICAL_POSITIVE;
      if (affectedLevels.includes(ObjectiveLevel.CORE)) return ChangeImpact.CORE_POSITIVE;
      if (affectedLevels.includes(ObjectiveLevel.GROWTH)) return ChangeImpact.GROWTH_POSITIVE;
    }
    
    // Check for negative impacts
    if (negativeImpacts.length > 0) {
      const maxNegativeImpact = Math.max(...negativeImpacts.map(i => Math.abs(i.impact)));
      if (maxNegativeImpact > 10) return ChangeImpact.MAJOR_NEGATIVE;
      return ChangeImpact.MINOR_NEGATIVE;
    }
    
    return ChangeImpact.NEUTRAL;
  }
  
  private checkCriticalViolations(impacts: ObjectiveImpact[]): string | null {
    for (const impact of impacts) {
      const objective = getObjectiveById(impact.objectiveId);
      if (objective && objective.level === 'CRITICAL') {
        // Check if projected value violates threshold
        const projectedNum = typeof impact.projectedValue === 'number' 
          ? impact.projectedValue 
          : parseFloat(impact.projectedValue as string);
          
        if (objective.threshold?.max !== undefined && projectedNum > objective.threshold.max) {
          return `Critical violation: ${objective.name} would exceed maximum threshold`;
        }
        
        if (objective.threshold?.min !== undefined && projectedNum < objective.threshold.min) {
          return `Critical violation: ${objective.name} would fall below minimum threshold`;
        }
      }
    }
    return null;
  }
  
  private async executeRelevantTests(
    change: Change,
    classification: ChangeImpact
  ): Promise<TestExecution[]> {
    const executions: TestExecution[] = [];
    
    // Generate change-specific tests with measurable criteria
    const testGenerator = DynamicTestGenerator.getInstance();
    const measurementEngine = MeasurementEngine.getInstance();
    
    const changeSpecificTest = testGenerator.generateChangeSpecificTest(change);
    
    // Execute measurements and collect objective evidence
    const evidencePackage = await measurementEngine.executeMeasurements(change, changeSpecificTest);
    
    // Convert measurements to test execution format
    const testExecution: TestExecution = {
      id: `exec-${Date.now()}-${change.id}`,
      testPlanId: changeSpecificTest.testPlan.id,
      timestamp: new Date(),
      duration: 0, // Will be calculated
      status: evidencePackage.measurements.every(m => m.passed) ? 'passed' : 'failed',
      results: changeSpecificTest.testPlan.testCases.map((testCase, index) => ({
        testCaseId: testCase.name,
        status: evidencePackage.measurements[index]?.passed ? 'passed' : 'failed',
        duration: Math.random() * 100, // Simulated duration
        assertions: testCase.assertions?.map(assertion => ({
          assertion,
          passed: evidencePackage.measurements[index]?.passed || false,
          actual: evidencePackage.measurements[index]?.actualValue || 'unknown',
          message: evidencePackage.measurements[index]?.passed ? 
            `✓ ${assertion.name}: ${evidencePackage.measurements[index]?.improvement.toFixed(1)}% improvement` :
            `✗ ${assertion.name}: measurement failed`
        })) || [],
        artifacts: evidencePackage.artifacts.map(artifact => ({
          path: artifact,
          type: 'data' as const,
          size: 1024,
          hash: 'mock-hash',
          metadata: {
            changeId: change.id,
            timestamp: new Date()
          }
        }))
      })),
      evidence: {
        id: `evidence-${change.id}-${Date.now()}`,
        type: 'measurement',
        timestamp: new Date(),
        source: 'measurement-engine',
        data: {
          evidencePackage,
          certificateHash: evidencePackage.certificateHash
        },
        artifacts: evidencePackage.artifacts.map(artifact => ({
          path: artifact,
          type: 'data' as const,
          size: 1024,
          hash: 'mock-hash',
          metadata: {
            changeId: change.id,
            timestamp: new Date()
          }
        })),
        signature: evidencePackage.certificateHash,
        verified: true
      },
      environment: {
        node: process.version,
        os: process.platform,
        config: {}
      }
    };
    
    executions.push(testExecution);
    
    return executions;
  }
  
  private async collectEvidence(
    change: Change,
    testExecutions: TestExecution[]
  ): Promise<Evidence[]> {
    const evidence: Evidence[] = [];
    
    // Collect test evidence
    for (const execution of testExecutions) {
      evidence.push(execution.evidence);
    }
    
    // Add change analysis evidence
    evidence.push({
      id: `evidence-analysis-${Date.now()}`,
      type: 'audit',
      timestamp: new Date(),
      source: 'alignment-verifier',
      data: {
        changeFiles: change.files,
        changeType: change.type,
        agent: change.agent
      },
      artifacts: [],
      signature: this.generateSignature(change),
      verified: true
    });
    
    return evidence;
  }
  
  private makeDecision(
    classification: ChangeImpact,
    impacts: ObjectiveImpact[],
    testExecutions: TestExecution[]
  ): Decision {
    // Check if all tests passed
    const allTestsPassed = testExecutions.every(exec => exec.status === 'passed');
    
    // Decision matrix based on classification
    switch (classification) {
      case ChangeImpact.CRITICAL_POSITIVE:
        return {
          verdict: allTestsPassed ? 'approved' : 'conditional',
          timestamp: new Date(),
          approver: 'alignment-verifier',
          rationale: 'Change positively impacts critical objectives',
          conditions: allTestsPassed ? undefined : ['Fix failing tests']
        };
        
      case ChangeImpact.BLOCKING:
        return {
          verdict: 'rejected',
          timestamp: new Date(),
          approver: 'alignment-verifier',
          rationale: 'Change violates critical objectives',
          followUp: [{
            type: 'fix',
            description: 'Revise change to avoid critical objective violation',
            assignee: 'developer',
            dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
            completed: false
          }]
        };
        
      case ChangeImpact.NEUTRAL:
        return {
          verdict: allTestsPassed ? 'approved' : 'conditional',
          timestamp: new Date(),
          approver: 'alignment-verifier',
          rationale: 'Change has neutral impact on objectives',
          conditions: allTestsPassed ? undefined : ['Ensure no regressions']
        };
        
      default:
        return {
          verdict: 'conditional',
          timestamp: new Date(),
          approver: 'alignment-verifier',
          rationale: `Change classified as ${classification}`,
          conditions: ['Manual review required']
        };
    }
  }
  
  private generateCertificate(
    change: Change,
    decision: Decision,
    impacts: ObjectiveImpact[],
    testExecutions: TestExecution[],
    evidence: Evidence[]
  ): VerificationCertificate {
    const objectives = impacts.map(impact => ({
      id: impact.objectiveId,
      impact: `${impact.impact > 0 ? '+' : ''}${impact.impact}%`,
      verified: impact.confidence > 80
    }));
    
    const testsPassed = testExecutions.filter(e => e.status === 'passed').length;
    const testsTotal = testExecutions.length;
    
    const evidenceData = JSON.stringify({
      change: change.id,
      decision: decision.verdict,
      impacts,
      tests: testExecutions.map(e => e.id),
      timestamp: new Date().toISOString()
    });
    
    const evidenceHash = createHash('sha256').update(evidenceData).digest('hex');
    
    return {
      id: `cert-${Date.now()}-${change.id}`,
      changeId: change.id,
      timestamp: new Date(),
      verdict: decision.verdict,
      objectives,
      testsPassed,
      testsTotal,
      evidenceHash,
      signature: this.generateSignature({ evidenceHash, decision })
    };
  }
  
  private createBlockedVerification(change: Change, reason: string): AlignmentVerification {
    const decision: Decision = {
      verdict: 'rejected',
      timestamp: new Date(),
      approver: 'alignment-verifier',
      rationale: reason,
      followUp: [{
        type: 'fix',
        description: 'Address critical objective violation',
        assignee: change.author,
        dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
        completed: false
      }]
    };
    
    const certificate: VerificationCertificate = {
      id: `cert-blocked-${Date.now()}`,
      changeId: change.id,
      timestamp: new Date(),
      verdict: 'rejected',
      objectives: [],
      testsPassed: 0,
      testsTotal: 0,
      evidenceHash: 'blocked',
      signature: this.generateSignature({ reason })
    };
    
    return {
      changeId: change.id,
      change,
      classification: ChangeImpact.BLOCKING,
      objectiveImpacts: [],
      testExecutions: [],
      evidence: [],
      decision,
      certificate
    };
  }
  
  private generateSignature(data: any): string {
    // In production, this would use proper cryptographic signing
    const content = JSON.stringify(data);
    return createHash('sha256').update(content).digest('hex');
  }
}