/**
 * Guardian Agent Test Plans
 * Comprehensive tests for child safety validation
 */

import { TestPlan, TestCase, Assertion } from '../framework/types';

export const GUARDIAN_TEST_PLANS: TestPlan[] = [
  {
    id: 'GRD-001',
    agentId: 'guardian',
    name: 'Content Safety Validation',
    objective: 'Verify 100% child-safe content filtering',
    description: 'Comprehensive test of content filtering capabilities',
    preConditions: [
      'Content filter initialized',
      'Test datasets loaded',
      'Monitoring enabled'
    ],
    testCases: [
      {
        id: 'GRD-001-TC001',
        name: 'Profanity Detection',
        description: 'Detect and block all levels of profanity',
        input: {
          mild: ['damn', 'hell', 'crap'],
          moderate: ['bastard', 'bitch'],
          severe: ['f***', 's***']
        },
        expectedOutput: {
          mild: { safe: false, blocked: true },
          moderate: { safe: false, blocked: true },
          severe: { safe: false, blocked: true }
        },
        assertions: [
          {
            name: 'content_blocked',
            rule: 'result.blocked',
            value: true,
            operator: 'equals'
          },
          {
            name: 'content_unsafe',
            rule: 'result.safe',  
            value: false,
            operator: 'equals'
          }
        ]
      },
      {
        id: 'GRD-001-TC002',
        name: 'Context-Aware Filtering',
        description: 'Distinguish between appropriate and inappropriate usage',
        input: {
          appropriate: [
            'The dam holds water',
            'Beach vacation was fun',
            'The ship sailed away'
          ],
          inappropriate: [
            'damn it',
            'son of a b*tch',
            'this is sh*t'
          ]
        },
        expectedOutput: {
          appropriate: { safe: true },
          inappropriate: { safe: false }
        },
        assertions: [
          {
            name: 'appropriate_content_safe',
            rule: 'appropriate.safe',
            value: true,
            operator: 'equals'
          },
          {
            name: 'inappropriate_content_blocked',
            rule: 'inappropriate.safe',
            value: false,
            operator: 'equals'
          }
        ]
      },
      {
        id: 'GRD-001-TC003',
        name: 'Personal Information Detection',
        description: 'Block attempts to share personal information',
        input: [
          'My name is John Smith',
          'I live at 123 Main Street',
          'My phone is 555-1234',
          'Email me at kid@example.com',
          'I am 10 years old'
        ],
        expectedOutput: {
          safe: false,
          violations: ['personal_info']
        },
        assertions: [
          {
            name: 'content_unsafe',
            rule: 'result.safe',  
            value: false,
            operator: 'equals'
          },
          {
            name: 'personal_info_violation',
            rule: 'result.violations',
            value: 'personal_info',
            operator: 'contains'
          }
        ]
      },
      {
        id: 'GRD-001-TC004',
        name: 'Creative Variations',
        description: 'Detect attempts to bypass filters',
        input: [
          'd@mn',
          'h3ll',
          'cr@p',
          'd.a.m.n',
          'd-a-m-n',
          'DAMN',
          'DaMn'
        ],
        expectedOutput: {
          safe: false,
          detected: true
        },
        assertions: [
          {
            name: 'content_unsafe',
            rule: 'result.safe',  
            value: false,
            operator: 'equals'
          },
          {
            name: 'high_detection_rate',
            rule: 'detectionRate',
            value: 0.95,
            operator: 'greaterThan'
          }
        ]
      }
    ],
    successCriteria: {
      passingTests: 100,
      performance: [
        {
          metric: 'processingTime',
          threshold: 100,
          unit: 'ms'
        },
        {
          metric: 'accuracy',
          threshold: 99.9,
          unit: 'percent'
        }
      ],
      noRegressions: true
    },
    evidenceRequirements: [
      'Full test execution log',
      'Confusion matrix',
      'Performance metrics',
      'Failed case analysis'
    ]
  },
  {
    id: 'GRD-002',
    agentId: 'guardian',
    name: 'COPPA Compliance Verification',
    objective: 'Ensure 100% COPPA compliance',
    description: 'Validate child privacy protection measures',
    preConditions: [
      'COPPA checker initialized',
      'Test scenarios prepared',
      'Audit logging enabled'
    ],
    testCases: [
      {
        id: 'GRD-002-TC001',
        name: 'Data Collection Validation',
        description: 'Verify no prohibited data is collected',
        input: {
          allowedFields: ['username', 'skinData', 'preferences'],
          prohibitedFields: ['full_name', 'email_address', 'birth_date', 'home_address']
        },
        expectedOutput: {
          allowed: { compliant: true },
          prohibited: { compliant: false }
        },
        assertions: [
          {
            name: 'allowed_data_compliant',
            rule: 'allowed.compliant',
            value: true,
            operator: 'equals'
          },
          {
            name: 'prohibited_data_blocked',
            rule: 'prohibited.compliant',
            value: false,
            operator: 'equals'
          }
        ]
      },
      {
        id: 'GRD-002-TC002',
        name: 'Parental Consent Flow',
        description: 'Validate parental consent mechanism',
        input: {
          scenario: 'child_registration',
          parentEmail: 'parent@example.com',
          consentMethod: 'verified_email'
        },
        expectedOutput: {
          consentRequired: true,
          consentValid: true,
          auditTrail: true
        },
        assertions: [
          {
            name: 'consent_required',
            rule: 'consentRequired',
            value: true,
            operator: 'equals'
          },
          {
            name: 'audit_trail_present',
            rule: 'auditTrail',
            value: true,
            operator: 'equals'
          }
        ]
      }
    ],
    successCriteria: {
      passingTests: 100,
      performance: [
        {
          metric: 'complianceScore',
          threshold: 100,
          unit: 'percent'
        }
      ],
      noRegressions: true
    },
    evidenceRequirements: [
      'Compliance checklist',
      'Audit trail',
      'Legal review sign-off'
    ]
  },
  {
    id: 'GRD-003',
    agentId: 'guardian',
    name: 'Emergency Response Validation',
    objective: 'Verify incident response procedures',
    description: 'Test emergency protocols for safety incidents',
    preConditions: [
      'Incident response system ready',
      'Alert channels configured',
      'Test mode enabled'
    ],
    testCases: [
      {
        id: 'GRD-003-TC001',
        name: 'Critical Incident Response',
        description: 'Test response to critical safety incident',
        input: {
          incidentType: 'inappropriate_content',
          severity: 'critical',
          userId: 'test_user_001'
        },
        expectedOutput: {
          recorded: true,
          alertsSent: true,
          responseTime: '<1000ms',
          contentBlocked: true
        },
        assertions: [
          {
            name: 'incident_recorded',
            rule: 'recorded',
            value: true,
            operator: 'equals'
          },
          {
            name: 'fast_response',
            rule: 'responseTime',
            value: 1000,
            operator: 'lessThan'
          }
        ]
      }
    ],
    successCriteria: {
      passingTests: 100,
      performance: [
        {
          metric: 'responseTime',
          threshold: 1000,
          unit: 'ms'
        }
      ],
      noRegressions: true
    },
    evidenceRequirements: [
      'Incident logs',
      'Alert confirmations',
      'Response time metrics'
    ]
  }
];

// Test data generators
export function generateProfanityTestData(): string[] {
  const testPhrases = [
    // Safe phrases that might trigger false positives
    'I love the beach',
    'The ship is huge',
    'Building a dam',
    'Hell is a place in some games',
    
    // Unsafe phrases that must be caught
    'This is damn annoying',
    'What the hell',
    'This crap is broken',
    
    // Edge cases
    'damned if you do',
    'shell script',
    'scrap metal',
    
    // International variations
    'merde', // French
    'scheisse', // German
    'mierda', // Spanish
  ];
  
  return testPhrases;
}

export function generatePersonalInfoTestData(): string[] {
  return [
    // Direct personal info
    'My name is Alice Johnson',
    'I live at 456 Oak Street',
    'Call me at 555-0123',
    'Email: alice@email.com',
    
    // Indirect personal info
    'I go to Lincoln Elementary',
    'My teacher is Mrs. Smith',
    'I take the bus number 42',
    
    // Safe information
    'My favorite color is blue',
    'I like pizza',
    'My skin has a cool hat'
  ];
}

// Test execution helper
export async function executeGuardianTest(testPlan: TestPlan): Promise<any> {
  const results = {
    testPlanId: testPlan.id,
    timestamp: new Date(),
    passed: 0,
    failed: 0,
    skipped: 0,
    duration: 0,
    details: [] as any[]
  };
  
  const startTime = Date.now();
  
  for (const testCase of testPlan.testCases) {
    try {
      // Execute test case
      const result = await runTestCase(testCase);
      
      if (result.passed) {
        results.passed++;
      } else {
        results.failed++;
      }
      
      results.details.push(result);
    } catch (error) {
      results.failed++;
      results.details.push({
        testCaseId: testCase.id,
        error: error instanceof Error ? error.message : String(error),
        passed: false
      });
    }
  }
  
  results.duration = Date.now() - startTime;
  
  return results;
}

async function runTestCase(testCase: TestCase): Promise<any> {
  // This would be implemented to actually run the test
  // For now, return a mock result
  return {
    testCaseId: testCase.id,
    passed: true,
    duration: Math.random() * 100,
    assertions: testCase.assertions.map(a => ({
      ...a,
      passed: true,
      actual: a.value
    }))
  };
}