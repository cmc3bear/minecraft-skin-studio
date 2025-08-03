/**
 * Dynamic Test Generator
 * Creates change-specific tests with measurable objective evidence
 */

import { Change, TestPlan, TestCase, TestAssertionRule } from './types';

export interface MeasurementSpec {
  metric: string;
  baseline: number | string;
  target: number | string;
  unit: string;
  tolerance: number; // acceptable variance percentage
  measurementMethod: string;
}

export interface ChangeSpecificTest {
  testPlan: TestPlan;
  measurements: MeasurementSpec[];
  evidenceRequirements: string[];
}

export class DynamicTestGenerator {
  private static instance: DynamicTestGenerator;

  public static getInstance(): DynamicTestGenerator {
    if (!DynamicTestGenerator.instance) {
      DynamicTestGenerator.instance = new DynamicTestGenerator();
    }
    return DynamicTestGenerator.instance;
  }

  /**
   * Generate change-specific test plan with measurable criteria
   */
  public generateChangeSpecificTest(change: Change): ChangeSpecificTest {
    const changeType = this.classifyChangeType(change);
    const claimedImpacts = this.extractClaimedImpacts(change.description);
    
    const testPlan: TestPlan = {
      id: `DYNAMIC-${change.id}`,
      agentId: 'dynamic-generator',
      name: `Verification: ${change.description}`,
      objective: `Verify measurable impact claims for change ${change.id}`,
      description: `Dynamically generated test plan to verify the claimed impacts of change ${change.id}`,
      preConditions: ['System is in stable state', 'Baseline measurements available'],
      testCases: [],
      successCriteria: {
        passingTests: 100,
        performance: [],
        noRegressions: true
      },
      evidenceRequirements: ['Measurement data', 'Performance benchmarks', 'Regression analysis']
    };

    const measurements: MeasurementSpec[] = [];
    const evidenceRequirements: string[] = [];

    // Generate specific tests based on change type and claims
    switch (changeType) {
      case 'performance':
        this.generatePerformanceTests(change, claimedImpacts, testPlan, measurements, evidenceRequirements);
        break;
      case 'safety':
        this.generateSafetyTests(change, claimedImpacts, testPlan, measurements, evidenceRequirements);
        break;
      case 'accuracy':
        this.generateAccuracyTests(change, claimedImpacts, testPlan, measurements, evidenceRequirements);
        break;
      case 'feature':
        this.generateFeatureTests(change, claimedImpacts, testPlan, measurements, evidenceRequirements);
        break;
      default:
        this.generateGenericTests(change, claimedImpacts, testPlan, measurements, evidenceRequirements);
    }

    return {
      testPlan,
      measurements,
      evidenceRequirements
    };
  }

  /**
   * Extract quantitative claims from change description
   */
  private extractClaimedImpacts(description: string): Array<{
    metric: string;
    value: number;
    unit: string;
    direction: 'increase' | 'decrease';
  }> {
    const claims = [];
    
    // Pattern: "improve X by Y%" 
    const improvementPattern = /improve\s+([^by]+)\s+by\s+(\d+(?:\.\d+)?)\s*%/gi;
    let match = improvementPattern.exec(description);
    while (match) {
      claims.push({
        metric: match[1].trim(),
        value: parseFloat(match[2]),
        unit: 'percent',
        direction: 'increase' as const
      });
      match = improvementPattern.exec(description);
    }

    // Pattern: "reduce X by Y%"
    const reductionPattern = /reduce\s+([^by]+)\s+by\s+(\d+(?:\.\d+)?)\s*%/gi;
    match = reductionPattern.exec(description);
    while (match) {
      claims.push({
        metric: match[1].trim(),
        value: parseFloat(match[2]),
        unit: 'percent',
        direction: 'decrease' as const
      });
      match = reductionPattern.exec(description);
    }

    // Pattern: "increase X to Y"
    const increasePattern = /increase\s+([^to]+)\s+to\s+(\d+(?:\.\d+)?)\s*(\w+)?/gi;
    match = increasePattern.exec(description);
    while (match) {
      claims.push({
        metric: match[1].trim(),
        value: parseFloat(match[2]),
        unit: match[3] || 'units',
        direction: 'increase' as const
      });
      match = increasePattern.exec(description);
    }

    return claims;
  }

  private classifyChangeType(change: Change): string {
    const description = change.description.toLowerCase();
    
    if (description.includes('performance') || description.includes('speed') || 
        description.includes('fps') || description.includes('optimize')) {
      return 'performance';
    }
    
    if (description.includes('safety') || description.includes('filter') || 
        description.includes('security') || description.includes('protect')) {
      return 'safety';
    }
    
    if (description.includes('accuracy') || description.includes('precision') || 
        description.includes('correct') || description.includes('detect')) {
      return 'accuracy';
    }
    
    if (change.type === 'feature') {
      return 'feature';
    }
    
    return 'generic';
  }

  private generatePerformanceTests(
    change: Change, 
    claims: any[], 
    testPlan: TestPlan, 
    measurements: MeasurementSpec[], 
    evidence: string[]
  ) {
    // FPS measurement test
    testPlan.testCases.push({
      id: `${testPlan.id}-TC001`,
      name: 'FPS Performance Measurement',
      description: 'Measure frame rate performance before and after change to verify impact claims',
      input: { renderFrames: 1000 },
      expectedOutput: { minFPS: 60 },
      assertions: [
        {
          name: 'fps_baseline',
          rule: 'measure_fps_before_change',
          value: 'baseline',
          operator: 'record'
        },
        {
          name: 'fps_after',
          rule: 'measure_fps_after_change', 
          value: 'target',
          operator: 'record'
        },
        {
          name: 'fps_improvement',
          rule: 'calculate_improvement_percentage',
          value: claims.find(c => c.metric.includes('fps'))?.value || 10,
          operator: 'greater_than_or_equal'
        }
      ]
    });

    measurements.push({
      metric: 'fps',
      baseline: 0, // to be measured
      target: claims.find(c => c.metric.includes('fps'))?.value || 60,
      unit: 'frames_per_second',
      tolerance: 5,
      measurementMethod: 'render_benchmark'
    });

    evidence.push('fps_before_after_comparison.json');
    evidence.push('render_performance_profile.json');
  }

  private generateSafetyTests(
    change: Change, 
    claims: any[], 
    testPlan: TestPlan, 
    measurements: MeasurementSpec[], 
    evidence: string[]
  ) {
    const accuracyClaim = claims.find(c => c.metric.includes('accuracy') || c.metric.includes('filter'));
    
    testPlan.testCases.push({
      id: `${testPlan.id}-TC002`,
      name: 'Content Filter Accuracy Measurement',
      description: 'Measure content filtering accuracy to verify safety improvement claims',
      input: { 
        testSet: 'safety_validation_dataset',
        inappropriateCount: 1000,
        appropriateCount: 1000
      },
      expectedOutput: { 
        falsePositiveRate: '<1%',
        falseNegativeRate: '<0.1%'
      },
      assertions: [
        {
          name: 'baseline_accuracy',
          rule: 'measure_filter_accuracy_before',
          value: 'baseline',
          operator: 'record'
        },
        {
          name: 'improved_accuracy', 
          rule: 'measure_filter_accuracy_after',
          value: 'target',
          operator: 'record'
        },
        {
          name: 'accuracy_improvement',
          rule: 'verify_accuracy_increase',
          value: accuracyClaim?.value || 5,
          operator: 'greater_than_or_equal'
        }
      ]
    });

    measurements.push({
      metric: 'content_filter_accuracy',
      baseline: 0, // to be measured
      target: accuracyClaim?.value || 95,
      unit: 'percent',
      tolerance: 1,
      measurementMethod: 'confusion_matrix_analysis'
    });

    evidence.push('content_filter_confusion_matrix.json');
    evidence.push('safety_test_results_detailed.json');
    evidence.push('false_positive_negative_analysis.json');
  }

  private generateAccuracyTests(
    change: Change, 
    claims: any[], 
    testPlan: TestPlan, 
    measurements: MeasurementSpec[], 
    evidence: string[]
  ) {
    const accuracyClaim = claims.find(c => c.metric.includes('accuracy'));
    
    testPlan.testCases.push({
      id: `${testPlan.id}-TC003`,
      name: 'Accuracy Improvement Verification',
      description: 'Verify claimed accuracy improvements with statistical significance',
      input: { testDataset: 'validation_set', sampleSize: 10000 },
      expectedOutput: { accuracyImprovement: accuracyClaim?.value || 5 },
      assertions: [
        {
          name: 'baseline_measurement',
          rule: 'measure_baseline_accuracy',
          value: 'baseline',
          operator: 'record'
        },
        {
          name: 'post_change_measurement',
          rule: 'measure_post_change_accuracy',
          value: 'target', 
          operator: 'record'
        },
        {
          name: 'statistical_significance',
          rule: 'verify_statistical_significance',
          value: 0.05, // p-value threshold
          operator: 'less_than'
        }
      ]
    });

    measurements.push({
      metric: 'detection_accuracy',
      baseline: 0,
      target: accuracyClaim?.value || 95,
      unit: 'percent',
      tolerance: 2,
      measurementMethod: 'statistical_validation'
    });

    evidence.push('statistical_significance_test.json');
    evidence.push('accuracy_measurement_report.json');
  }

  private generateFeatureTests(
    change: Change, 
    claims: any[], 
    testPlan: TestPlan, 
    measurements: MeasurementSpec[], 
    evidence: string[]
  ) {
    testPlan.testCases.push({
      id: `${testPlan.id}-TC004`,
      name: 'Feature Functionality Verification',
      description: 'Verify that new feature implementation meets specified requirements',
      input: { featureSpec: change.description },
      expectedOutput: { functionalityComplete: true },
      assertions: [
        {
          name: 'feature_availability',
          rule: 'verify_feature_exists',
          value: true,
          operator: 'equals'
        },
        {
          name: 'feature_performance',
          rule: 'verify_feature_performance_acceptable',
          value: 3000, // 3 second max response time
          operator: 'less_than'
        }
      ]
    });

    measurements.push({
      metric: 'feature_response_time',
      baseline: 0,
      target: 3,
      unit: 'seconds',
      tolerance: 10,
      measurementMethod: 'response_time_measurement'
    });

    evidence.push('feature_functionality_test.json');
    evidence.push('feature_performance_benchmark.json');
  }

  private generateGenericTests(
    change: Change, 
    claims: any[], 
    testPlan: TestPlan, 
    measurements: MeasurementSpec[], 
    evidence: string[]
  ) {
    testPlan.testCases.push({
      id: `${testPlan.id}-TC005`,
      name: 'Generic Change Verification',
      description: 'General verification that change does not break existing functionality',
      input: { changeId: change.id },
      expectedOutput: { noRegression: true },
      assertions: [
        {
          name: 'no_breaking_changes',
          rule: 'verify_no_regression',
          value: true,
          operator: 'equals'
        }
      ]
    });

    measurements.push({
      metric: 'system_stability',
      baseline: 100,
      target: 100,
      unit: 'percent',
      tolerance: 0,
      measurementMethod: 'regression_testing'
    });

    evidence.push('regression_test_results.json');
  }
}