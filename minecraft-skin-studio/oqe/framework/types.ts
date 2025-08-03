/**
 * OQE Framework Core Types
 * Defines the structure for quality verification, alignment, and evidence
 */

// Master Plan Objectives
export enum ObjectiveLevel {
  CRITICAL = 'CRITICAL', // Level 1 - Non-negotiable
  CORE = 'CORE',         // Level 2 - Essential
  GROWTH = 'GROWTH'      // Level 3 - Strategic
}

export interface Objective {
  id: string;
  level: ObjectiveLevel;
  name: string;
  description: string;
  target: number | string;
  currentValue: number | string;
  unit: string;
  threshold?: {
    min?: number;
    max?: number;
  };
}

// Change Impact Classification
export enum ChangeImpact {
  CRITICAL_POSITIVE = 'CRITICAL_POSITIVE',
  CORE_POSITIVE = 'CORE_POSITIVE',
  GROWTH_POSITIVE = 'GROWTH_POSITIVE',
  NEUTRAL = 'NEUTRAL',
  MINOR_NEGATIVE = 'MINOR_NEGATIVE',
  MAJOR_NEGATIVE = 'MAJOR_NEGATIVE',
  BLOCKING = 'BLOCKING'
}

// Agent System
export interface Agent {
  id: string;
  name: string;
  description: string;
  objectives: string[]; // Objective IDs this agent protects
  standards: AgentStandard[];
}

export interface AgentStandard {
  metric: string;
  requirement: string;
  threshold: number | string;
  measurement: string;
}

// Test Plans
export interface TestPlan {
  id: string;
  agentId: string;
  name: string;
  objective: string;
  description: string;
  preConditions: string[];
  testCases: TestCase[];
  successCriteria: SuccessCriteria;
  evidenceRequirements: string[];
}

export interface TestCase {
  id: string;
  name: string;
  description: string;
  input: any;
  expectedOutput: any;
  assertions: Assertion[];
}

export interface Assertion {
  name: string;
  rule: string;
  value: any;
  operator: 'equals' | 'contains' | 'greaterThan' | 'lessThan' | 'matches' | 'greater_than' | 'less_than' | 'greater_than_or_equal' | 'less_than_or_equal' | 'record';
}

export type TestAssertionRule = string;

export interface SuccessCriteria {
  passingTests: number; // Percentage
  performance: {
    metric: string;
    threshold: number;
    unit: string;
  }[];
  noRegressions: boolean;
}

// Test Execution
export interface TestExecution {
  id: string;
  testPlanId: string;
  timestamp: Date;
  duration: number;
  status: 'running' | 'passed' | 'failed' | 'blocked';
  results: TestResult[];
  evidence: Evidence;
  environment: TestEnvironment;
}

export interface TestResult {
  testCaseId: string;
  status: 'passed' | 'failed' | 'skipped';
  duration: number;
  assertions: AssertionResult[];
  error?: string;
  artifacts: Artifact[];
}

export interface AssertionResult {
  assertion: Assertion;
  passed: boolean;
  actual: any;
  message?: string;
}

export interface TestEnvironment {
  node: string;
  browser?: string;
  os: string;
  device?: string;
  config: Record<string, any>;
}

// Evidence System
export interface Evidence {
  id: string;
  type: 'test' | 'metric' | 'scan' | 'audit' | 'review' | 'measurement';
  timestamp: Date;
  source: string;
  data: any;
  artifacts: Artifact[];
  signature: string; // Cryptographic signature
  verified: boolean;
}

export interface Artifact {
  type: 'log' | 'screenshot' | 'video' | 'report' | 'data';
  path: string;
  hash: string;
  size: number;
  metadata: Record<string, any>;
}

// Alignment Verification
export interface AlignmentVerification {
  changeId: string;
  change: Change;
  classification: ChangeImpact;
  objectiveImpacts: ObjectiveImpact[];
  testExecutions: TestExecution[];
  evidence: Evidence[];
  decision: Decision;
  certificate: VerificationCertificate;
}

export interface Change {
  id: string;
  type: 'feature' | 'fix' | 'refactor' | 'config';
  description: string;
  author: string;
  timestamp: Date;
  files: string[];
  diff: string;
  agent?: string;
}

export interface ObjectiveImpact {
  objectiveId: string;
  currentValue: number | string;
  projectedValue: number | string;
  impact: number; // Percentage change
  confidence: number; // 0-100
  evidence: string[];
}

export interface Decision {
  verdict: 'approved' | 'rejected' | 'conditional';
  timestamp: Date;
  approver: string;
  rationale: string;
  conditions?: string[];
  followUp?: Action[];
}

export interface Action {
  type: 'monitor' | 'test' | 'review' | 'fix';
  description: string;
  assignee: string;
  dueDate: Date;
  completed: boolean;
}

// Verification Certificate
export interface VerificationCertificate {
  id: string;
  changeId: string;
  timestamp: Date;
  verdict: string;
  objectives: {
    id: string;
    impact: string;
    verified: boolean;
  }[];
  testsPassed: number;
  testsTotal: number;
  evidenceHash: string;
  signature: string;
  blockchainTx?: string;
}

// Monitoring & Metrics
export interface MetricSnapshot {
  timestamp: Date;
  objectives: {
    [objectiveId: string]: {
      value: number | string;
      trend: 'up' | 'down' | 'stable';
      health: 'healthy' | 'warning' | 'critical';
    };
  };
  alerts: Alert[];
}

export interface Alert {
  id: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  objective: string;
  message: string;
  timestamp: Date;
  resolved: boolean;
  resolvedAt?: Date;
  resolvedBy?: string;
}

// Dashboard Types
export interface OQEDashboard {
  realTime: {
    objectives: ObjectiveStatus[];
    activeTests: TestExecution[];
    recentChanges: AlignmentVerification[];
    alerts: Alert[];
  };
  metrics: {
    testVelocity: number;
    changeApprovalRate: number;
    objectiveHealth: number;
    evidenceCompleteness: number;
  };
  trends: {
    daily: TrendData[];
    weekly: TrendData[];
    monthly: TrendData[];
  };
}

export interface ObjectiveStatus {
  objective: Objective;
  status: 'healthy' | 'warning' | 'critical';
  lastMeasurement: Date;
  trend: 'improving' | 'stable' | 'degrading';
  projectedViolation?: Date;
}

export interface TrendData {
  date: Date;
  objectives: Record<string, number>;
  incidents: number;
  changes: number;
  testsPassed: number;
}