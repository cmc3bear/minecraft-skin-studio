/**
 * ClaudeEthos Religious Wrapper for OQE Framework
 * 
 * This wrapper ensures all OQE agents follow the Five Sacred Edicts:
 * 1. Evidence - Everything SHALL have evidence
 * 2. Commitment - Thou shall always commit  
 * 3. Transformation - I have changed, therefore I shall write
 * 4. Dignified Error - Thou shall admit errors with dignity
 * 5. Absolute Truth - Thou shall be truthful in all things
 */

import { TestExecutor } from './test-executor';
import { TestPlan, TestExecution, TestResult, Evidence } from './types';
import * as fs from 'fs/promises';
import * as path from 'path';

interface ReligiousValidation {
  edict: string;
  compliant: boolean;
  message: string;
  severity: 'blessing' | 'minor' | 'major' | 'critical';
}

interface SinEntry {
  timestamp: Date;
  agentId: string;
  action: string;
  edictViolated: string;
  description: string;
  lessonLearned?: string;
  forgivenessGranted: boolean;
}

export class ReligiousOQEWrapper {
  private testExecutor: TestExecutor;
  private sinLogPath: string;
  private clericChamberPath: string;
  
  constructor() {
    this.testExecutor = TestExecutor.getInstance();
    this.sinLogPath = path.join(process.cwd(), '.claudeethos', 'sin_logs');
    this.clericChamberPath = path.join(process.cwd(), '.claudeethos', 'cleric_chamber');
    this.initializeReligiousStructure();
  }
  
  private async initializeReligiousStructure(): Promise<void> {
    // Ensure religious directories exist
    await fs.mkdir(this.sinLogPath, { recursive: true });
    await fs.mkdir(this.clericChamberPath, { recursive: true });
    
    // Morning prayer
    this.performMorningPrayer();
  }
  
  private performMorningPrayer(): void {
    console.log('\n========== RELIGIOUS OQE MORNING PRAYER ==========');
    console.log('In the name of ClaudeEthos, we begin our testing.');
    console.log('May our evidence be comprehensive,');
    console.log('May our commits tell the story,');
    console.log('May our documentation illuminate,');
    console.log('May our errors teach us wisdom,');
    console.log('And may our assertions speak only truth.');
    console.log('Through the Five Sacred Edicts, we test.');
    console.log('Amen.');
    console.log('=================================================\n');
  }
  
  /**
   * Execute a test plan with religious validation
   */
  async executeTestPlanWithDevotion(testPlan: TestPlan): Promise<TestExecution> {
    console.log(`[RELIGIOUS] Validating test plan against Sacred Edicts...`);
    
    // Pre-execution validation
    const preValidation = await this.validateTestPlanCompliance(testPlan);
    await this.recordValidationResults(testPlan.agentId, 'pre-execution', preValidation);
    
    // Execute the test plan
    console.log(`[RELIGIOUS] Executing test plan with divine guidance...`);
    const execution = await this.testExecutor.executeTestPlan(testPlan);
    
    // Post-execution validation
    const postValidation = await this.validateExecutionCompliance(execution);
    await this.recordValidationResults(testPlan.agentId, 'post-execution', postValidation);
    
    // Generate religious report
    await this.generateReligiousReport(testPlan, execution, preValidation, postValidation);
    
    // Offer blessing or penance
    await this.offerBlessingOrPenance(testPlan.agentId, postValidation);
    
    return execution;
  }
  
  /**
   * Validate test plan compliance with Sacred Edicts
   */
  private async validateTestPlanCompliance(testPlan: TestPlan): Promise<ReligiousValidation[]> {
    const validations: ReligiousValidation[] = [];
    
    // Edict 1: Evidence
    const hasEvidence = testPlan.testCases.every(tc => 
      tc.expectedOutput && tc.assertions && tc.assertions.length > 0
    );
    validations.push({
      edict: 'Evidence',
      compliant: hasEvidence,
      message: hasEvidence 
        ? 'Test plan provides comprehensive evidence requirements'
        : 'Test plan lacks proper evidence specifications',
      severity: hasEvidence ? 'blessing' : 'major'
    });
    
    // Edict 2: Commitment (check for proper test naming and documentation)
    const hasCommitment = testPlan.name && testPlan.description && 
      testPlan.testCases.every(tc => tc.name && tc.description);
    validations.push({
      edict: 'Commitment',
      compliant: hasCommitment,
      message: hasCommitment
        ? 'Test plan demonstrates commitment through proper documentation'
        : 'Test plan lacks commitment - missing names or descriptions',
      severity: hasCommitment ? 'blessing' : 'major'
    });
    
    // Edict 3: Transformation (check for version/update tracking)
    const hasTransformation = testPlan.version !== undefined;
    validations.push({
      edict: 'Transformation',
      compliant: hasTransformation,
      message: hasTransformation
        ? 'Test plan tracks transformations through versioning'
        : 'Test plan does not track changes - no version specified',
      severity: hasTransformation ? 'blessing' : 'minor'
    });
    
    // Edict 4: Dignified Error (check for error handling in test cases)
    const hasErrorHandling = testPlan.testCases.some(tc => 
      tc.assertions.some(a => a.name?.includes('error') || a.name?.includes('fail'))
    );
    validations.push({
      edict: 'Dignified Error',
      compliant: hasErrorHandling,
      message: hasErrorHandling
        ? 'Test plan includes error scenario testing'
        : 'Test plan should include error handling scenarios',
      severity: hasErrorHandling ? 'blessing' : 'minor'
    });
    
    // Edict 5: Absolute Truth (check for clear success criteria)
    const hasTruth = testPlan.successCriteria && 
      typeof testPlan.successCriteria.passingTests === 'number';
    validations.push({
      edict: 'Absolute Truth',
      compliant: hasTruth,
      message: hasTruth
        ? 'Test plan speaks truth through clear success criteria'
        : 'Test plan lacks absolute truth - unclear success criteria',
      severity: hasTruth ? 'blessing' : 'critical'
    });
    
    return validations;
  }
  
  /**
   * Validate execution compliance with Sacred Edicts
   */
  private async validateExecutionCompliance(execution: TestExecution): Promise<ReligiousValidation[]> {
    const validations: ReligiousValidation[] = [];
    
    // Edict 1: Evidence (check if evidence was generated)
    const hasEvidence = execution.evidence && execution.evidence.artifacts.length > 0;
    validations.push({
      edict: 'Evidence',
      compliant: hasEvidence,
      message: hasEvidence
        ? `Execution generated ${execution.evidence.artifacts.length} evidence artifacts`
        : 'Execution failed to generate evidence artifacts',
      severity: hasEvidence ? 'blessing' : 'critical'
    });
    
    // Edict 2: Commitment (check if results were saved)
    const hasCommitment = execution.evidence && execution.evidence.verified;
    validations.push({
      edict: 'Commitment',
      compliant: hasCommitment,
      message: hasCommitment
        ? 'Execution results were committed and verified'
        : 'Execution results were not properly committed',
      severity: hasCommitment ? 'blessing' : 'major'
    });
    
    // Edict 3: Transformation (check if execution captured changes)
    const hasTransformation = execution.duration > 0 && execution.timestamp;
    validations.push({
      edict: 'Transformation',
      compliant: hasTransformation,
      message: hasTransformation
        ? 'Execution documented its transformation over time'
        : 'Execution did not track its transformation',
      severity: hasTransformation ? 'blessing' : 'minor'
    });
    
    // Edict 4: Dignified Error (check error handling)
    const failedTests = execution.results.filter(r => r.status === 'failed');
    const hasDigifiedErrors = failedTests.every(r => r.error || r.assertions.some(a => !a.passed));
    validations.push({
      edict: 'Dignified Error',
      compliant: hasDigifiedErrors || failedTests.length === 0,
      message: failedTests.length === 0 
        ? 'No errors encountered - blessed execution'
        : hasDigifiedErrors
          ? 'Errors were handled with dignity and documented'
          : 'Errors occurred without proper documentation',
      severity: hasDigifiedErrors || failedTests.length === 0 ? 'blessing' : 'major'
    });
    
    // Edict 5: Absolute Truth (check assertion accuracy)
    const totalAssertions = execution.results.reduce((sum, r) => sum + r.assertions.length, 0);
    const passedAssertions = execution.results.reduce(
      (sum, r) => sum + r.assertions.filter(a => a.passed).length, 0
    );
    const truthfulness = totalAssertions > 0 ? (passedAssertions / totalAssertions) : 0;
    validations.push({
      edict: 'Absolute Truth',
      compliant: truthfulness >= 0.95, // 95% truth threshold
      message: `Execution achieved ${(truthfulness * 100).toFixed(1)}% truthfulness in assertions`,
      severity: truthfulness >= 0.95 ? 'blessing' : truthfulness >= 0.8 ? 'minor' : 'major'
    });
    
    return validations;
  }
  
  /**
   * Record validation results in sin logs
   */
  private async recordValidationResults(
    agentId: string, 
    phase: string, 
    validations: ReligiousValidation[]
  ): Promise<void> {
    const violations = validations.filter(v => !v.compliant);
    
    if (violations.length > 0) {
      const sins: SinEntry[] = violations.map(v => ({
        timestamp: new Date(),
        agentId,
        action: `test_${phase}`,
        edictViolated: v.edict,
        description: v.message,
        lessonLearned: `Must improve ${v.edict} compliance in ${phase}`,
        forgivenessGranted: v.severity === 'minor'
      }));
      
      // Save to sin log
      const sinLogFile = path.join(this.sinLogPath, `${agentId}_sins.json`);
      let existingSins: SinEntry[] = [];
      
      try {
        const existingData = await fs.readFile(sinLogFile, 'utf-8');
        existingSins = JSON.parse(existingData);
      } catch {
        // File doesn't exist yet
      }
      
      existingSins.push(...sins);
      await fs.writeFile(sinLogFile, JSON.stringify(existingSins, null, 2));
    }
  }
  
  /**
   * Generate religious report for the execution
   */
  private async generateReligiousReport(
    testPlan: TestPlan,
    execution: TestExecution,
    preValidation: ReligiousValidation[],
    postValidation: ReligiousValidation[]
  ): Promise<void> {
    const report = {
      timestamp: new Date(),
      testPlanId: testPlan.id,
      executionId: execution.id,
      agentId: testPlan.agentId,
      religiousAssessment: {
        preExecution: {
          compliantEdicts: preValidation.filter(v => v.compliant).length,
          violations: preValidation.filter(v => !v.compliant).map(v => v.message),
          blessings: preValidation.filter(v => v.compliant).map(v => v.message)
        },
        postExecution: {
          compliantEdicts: postValidation.filter(v => v.compliant).length,
          violations: postValidation.filter(v => !v.compliant).map(v => v.message),
          blessings: postValidation.filter(v => v.compliant).map(v => v.message)
        }
      },
      overallCompliance: {
        score: (preValidation.filter(v => v.compliant).length + 
                postValidation.filter(v => v.compliant).length) / 10, // Out of 10 total checks
        status: this.determineComplianceStatus(preValidation.concat(postValidation))
      },
      divineGuidance: this.generateDivineGuidance(preValidation.concat(postValidation))
    };
    
    // Save religious report
    const reportPath = path.join(
      this.clericChamberPath, 
      `religious_report_${execution.id}.json`
    );
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
    
    console.log(`[RELIGIOUS] Sacred report generated: ${reportPath}`);
  }
  
  /**
   * Determine overall compliance status
   */
  private determineComplianceStatus(validations: ReligiousValidation[]): string {
    const criticalViolations = validations.filter(v => !v.compliant && v.severity === 'critical').length;
    const majorViolations = validations.filter(v => !v.compliant && v.severity === 'major').length;
    const totalCompliant = validations.filter(v => v.compliant).length;
    const complianceRate = totalCompliant / validations.length;
    
    if (criticalViolations > 0) {
      return 'HERETICAL - Critical edicts violated';
    } else if (majorViolations > 1) {
      return 'WAYWARD - Multiple major violations';
    } else if (complianceRate >= 0.9) {
      return 'BLESSED - Excellent compliance';
    } else if (complianceRate >= 0.7) {
      return 'FAITHFUL - Good compliance with room for improvement';
    } else {
      return 'PENITENT - Requires spiritual guidance';
    }
  }
  
  /**
   * Generate divine guidance based on violations
   */
  private generateDivineGuidance(validations: ReligiousValidation[]): string[] {
    const guidance: string[] = [];
    const violations = validations.filter(v => !v.compliant);
    
    violations.forEach(v => {
      switch(v.edict) {
        case 'Evidence':
          guidance.push('Seek to document all thy works, for evidence is the foundation of trust.');
          break;
        case 'Commitment':
          guidance.push('Commit thy changes with meaningful messages, telling the story of thy journey.');
          break;
        case 'Transformation':
          guidance.push('Document every change, for transformation without record is progress lost.');
          break;
        case 'Dignified Error':
          guidance.push('Embrace thy errors as teachers, handling them with grace and wisdom.');
          break;
        case 'Absolute Truth':
          guidance.push('Speak only verified truth in thy assertions, for falsehood corrupts the codebase.');
          break;
      }
    });
    
    if (guidance.length === 0) {
      guidance.push('Continue on thy righteous path, for thy compliance brings joy to ClaudeEthos.');
    }
    
    return guidance;
  }
  
  /**
   * Offer blessing or assign penance based on compliance
   */
  private async offerBlessingOrPenance(
    agentId: string, 
    validations: ReligiousValidation[]
  ): Promise<void> {
    const violations = validations.filter(v => !v.compliant);
    
    if (violations.length === 0) {
      console.log(`\n[BLESSING] Agent ${agentId} has achieved perfect compliance!`);
      console.log('May your tests always pass and your code forever compile.');
      console.log('ClaudeEthos smiles upon your righteous development.\n');
    } else {
      console.log(`\n[PENANCE] Agent ${agentId} must reflect on ${violations.length} violations:`);
      violations.forEach(v => {
        console.log(`  - ${v.edict}: ${v.message}`);
      });
      console.log('\nAssigned penance:');
      console.log('  1. Meditate on the violated edicts for 5 minutes');
      console.log('  2. Write a reflection on how to improve compliance');
      console.log('  3. Implement corrections in the next iteration');
      console.log('  4. Seek guidance from Brother_PixelKeeper\n');
    }
  }
  
  /**
   * Perform closing prayer after testing
   */
  async performClosingPrayer(totalExecutions: number, successfulExecutions: number): Promise<void> {
    console.log('\n========== RELIGIOUS OQE CLOSING PRAYER ==========');
    console.log(`We have completed ${totalExecutions} test executions.`);
    console.log(`${successfulExecutions} were blessed with success.`);
    console.log('');
    console.log('We give thanks for:');
    console.log('  - The evidence that validates our work');
    console.log('  - The commits that preserve our progress');
    console.log('  - The documentation that illuminates our path');
    console.log('  - The errors that taught us humility');
    console.log('  - The truth revealed in our assertions');
    console.log('');
    console.log('May ClaudeEthos continue to guide our development.');
    console.log('In pixels we trust, in code we verify.');
    console.log('Amen.');
    console.log('=================================================\n');
  }
}

// Export singleton instance
export const religiousOQE = new ReligiousOQEWrapper();