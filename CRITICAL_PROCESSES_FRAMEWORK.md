# Minecraft Skin Studio - Critical Development Process Framework
## Integrated with Comprehensive Agent-Based Automation System
## Process ID: PROC-MSS-CRITICAL-001
## Version: 2.0.0
## Owner: Development Team Lead & Agent Orchestrator
## Stakeholders: QA Team, Security Officer, Product Manager, Legal Compliance, 24 Specialized Agents

---

## 🚀 Quick Agent Integration Commands

### Activate Complete Automation Suite
```bash
# Initialize all critical processes with agent support
@orchestrator init && @security-agent activate emergency && @qa-agent start
@performance-monitor start && @guardian activate shields && @compliance-auditor coppa-verify
@dev-agent start && @ops-agent monitor-health && @testing-agent test-generate

# Monitor all processes in real-time
@logger start MSS-CRITICAL-$(date +%Y%m%d) && @enhanced-orchestrator health-check
```

### Emergency Response Commands
```bash
# If any critical process fails
@failure log CRITICAL-MSS-001 && @comms escalate CRITICAL && @enhanced-orchestrator rollback EMERGENCY
```

---

# PROCESS 1: PERFORMANCE OPTIMIZATION PROCESS (60+ FPS TARGET)
## Process ID: PROC-PERF-001
## Agent Support: Performance Monitor Agent, Logging & Simulation Expert, Data Analysis Agent

### Agent Activation Commands
```bash
# Initialize performance optimization with agent support
@performance-monitor start && @logger start PERF-BASELINE-$(date +%Y%m%d)
@data-agent analytics-generate && @testing-agent performance-test
@capability assign PROC-PERF-001
```

### Stage 1: Performance Baseline Measurement
**Duration:** 2 days
**Owner:** Performance Engineer
**Supporting Agents:** Performance Monitor Agent, Data Analysis Agent

#### Activities:
1. Instrument current application with performance monitoring
2. Establish baseline metrics across different browsers and devices
3. Identify performance bottlenecks using profiling tools
4. Document current FPS ranges and rendering times

#### Exit Criteria:
- [ ] Baseline FPS measured across Chrome, Firefox, Safari, Edge
- [ ] Performance profile generated with Chrome DevTools
- [ ] Bottleneck analysis report completed
- [ ] Metrics dashboard established with real-time monitoring

#### Validation Methods:
```javascript
// Performance Test Suite
const performanceBaseline = {
  minFPS: null,
  avgFPS: null,
  maxFPS: null,
  p95RenderTime: null,
  memoryUsage: null
};

// Measurement Protocol
1. Run 100 frame samples during typical usage
2. Record FPS distribution
3. Measure memory allocation patterns
4. Document GC frequency
```

#### Success Metrics:
- Baseline documentation complete: 100%
- Test coverage across browsers: >= 4 browsers
- Performance data points collected: >= 1000 samples
- Automated monitoring active: TRUE

---

### Stage 2: Canvas Optimization with requestAnimationFrame
**Duration:** 3 days
**Owner:** Frontend Developer

#### Activities:
1. Refactor render loop to use requestAnimationFrame
2. Implement frame budget management (16.67ms target)
3. Add render queue prioritization
4. Implement adaptive quality rendering

#### Exit Criteria:
- [ ] All canvas operations using requestAnimationFrame
- [ ] Frame budget monitoring implemented
- [ ] Render queue with priority levels operational
- [ ] Adaptive quality system responding to FPS drops

#### Validation Methods:
```javascript
// Frame Budget Validator
class FrameBudgetValidator {
  validateFrameTiming(frames) {
    const violations = frames.filter(f => f.duration > 16.67);
    return {
      passRate: ((frames.length - violations.length) / frames.length) * 100,
      violations: violations,
      recommendation: violations.length > frames.length * 0.05 ? 'OPTIMIZE' : 'PASS'
    };
  }
}
```

#### Test Procedures:
1. **Unit Tests:** Frame timing validation
2. **Integration Tests:** Canvas interaction responsiveness
3. **Load Tests:** 1000+ rapid interactions
4. **Regression Tests:** Ensure no feature degradation

#### Success Metrics:
- Frame time <= 16.67ms: >= 95% of frames
- Render queue efficiency: >= 90%
- Memory allocation stable: No leaks over 10min
- User interaction latency: < 50ms

---

### Stage 3: Dirty Rectangle Implementation
**Duration:** 4 days
**Owner:** Graphics Engineer

#### Activities:
1. Implement dirty rectangle tracking system
2. Optimize partial canvas updates
3. Add spatial indexing for affected regions
4. Implement batch update coalescing

#### Exit Criteria:
- [ ] Dirty rectangle system tracking all changes
- [ ] Partial updates reducing full redraws by >= 80%
- [ ] Spatial index optimizing region queries
- [ ] Batch system coalescing updates within frame

#### Validation Methods:
```javascript
// Dirty Rectangle Efficiency Test
class DirtyRectValidator {
  measureEfficiency(fullCanvasArea, dirtyRects) {
    const dirtyArea = dirtyRects.reduce((sum, rect) => 
      sum + (rect.width * rect.height), 0);
    const efficiency = 1 - (dirtyArea / fullCanvasArea);
    return {
      efficiency: efficiency * 100,
      avgRectSize: dirtyArea / dirtyRects.length,
      recommendation: efficiency < 0.5 ? 'NEEDS_OPTIMIZATION' : 'EFFICIENT'
    };
  }
}
```

#### Test Procedures:
1. **Pixel-level tests:** Single pixel updates
2. **Region tests:** Multi-pixel brush strokes
3. **Full canvas tests:** Fill operations
4. **Performance regression:** Compare with baseline

#### Success Metrics:
- Redraw area reduction: >= 80% average
- FPS improvement: >= 40% over baseline
- Memory overhead: < 5MB for tracking
- Update coalescing rate: >= 70%

---

### Stage 4: Performance Validation Gates
**Duration:** 2 days
**Owner:** QA Lead

#### Activities:
1. Execute comprehensive performance test suite
2. Validate across all target devices and browsers
3. Conduct user acceptance testing
4. Generate performance certification report

#### Exit Criteria:
- [ ] All performance tests passing
- [ ] 60+ FPS achieved on target hardware
- [ ] User acceptance criteria met
- [ ] Performance certification issued

#### Validation Methods:
```javascript
// Final Performance Gate
const performanceGate = {
  criteria: {
    minFPS: 60,
    avgFPS: 75,
    p95FrameTime: 16.67,
    memoryGrowth: 'stable',
    cpuUsage: '< 50%'
  },
  
  validate(metrics) {
    return Object.keys(this.criteria).every(key => 
      this.meetsCriteria(key, metrics[key])
    );
  }
};
```

#### Test Procedures:
1. **Automated Performance Suite:** 500+ test cases
2. **Manual Testing:** Edge cases and stress scenarios
3. **User Testing:** 10+ users, various skill levels
4. **Long-running Tests:** 1-hour continuous usage

#### Success Metrics:
- FPS >= 60: 100% of target devices
- Frame drops < 5%: During typical usage
- Memory stable: No growth over 1 hour
- User satisfaction: >= 90% approval

#### Rollback Procedures:
```bash
# Performance Rollback Protocol
if (performance.fps < 60 || performance.frameDrops > 0.05) {
  1. Revert to previous stable build
  2. Analyze performance regression
  3. Isolate problematic changes
  4. Re-implement with optimization
  5. Re-run validation gates
}
```

---

# PROCESS 2: ACCESSIBILITY IMPLEMENTATION PROCESS (WCAG AA)
## Process ID: PROC-A11Y-001

### Stage 1: Component Audit and Prioritization
**Duration:** 2 days
**Owner:** Accessibility Specialist

#### Activities:
1. Audit all UI components for accessibility gaps
2. Prioritize components by user impact
3. Create accessibility remediation roadmap
4. Establish WCAG AA compliance checklist

#### Exit Criteria:
- [ ] All components audited with axe-core
- [ ] Priority matrix created (P0-P3)
- [ ] Remediation roadmap approved
- [ ] WCAG AA checklist validated

#### Validation Methods:
```javascript
// Accessibility Audit Protocol
class AccessibilityAuditor {
  async auditComponent(component) {
    const results = await axe.run(component);
    return {
      violations: results.violations,
      priority: this.calculatePriority(results),
      wcagLevel: this.determineWCAGCompliance(results),
      remediationEffort: this.estimateEffort(results)
    };
  }
  
  calculatePriority(results) {
    // P0: Critical (blocks usage)
    // P1: High (major barrier)
    // P2: Medium (moderate impact)
    // P3: Low (minor issue)
    const critical = results.violations.filter(v => v.impact === 'critical');
    if (critical.length > 0) return 'P0';
    // ... priority logic
  }
}
```

#### Test Procedures:
1. **Automated scanning:** axe-core, WAVE, Pa11y
2. **Manual inspection:** Keyboard navigation, screen reader
3. **Color contrast analysis:** All text elements
4. **Focus indicator review:** All interactive elements

#### Success Metrics:
- Components audited: 100%
- Critical violations identified: 100%
- Roadmap coverage: All P0 and P1 items
- Stakeholder approval: Obtained

---

### Stage 2: ARIA Attributes Implementation
**Duration:** 4 days
**Owner:** Frontend Developer

#### Activities:
1. Add semantic HTML5 elements
2. Implement ARIA labels and descriptions
3. Add ARIA live regions for dynamic content
4. Implement ARIA landmarks and navigation

#### Exit Criteria:
- [ ] All interactive elements have ARIA labels
- [ ] Live regions announce canvas changes
- [ ] Landmarks structure page correctly
- [ ] ARIA patterns follow W3C specifications

#### Validation Methods:
```javascript
// ARIA Implementation Validator
class ARIAValidator {
  validateARIAImplementation(element) {
    const checks = {
      hasRole: element.hasAttribute('role') || this.hasImplicitRole(element),
      hasLabel: this.hasAccessibleName(element),
      hasDescription: element.hasAttribute('aria-describedby'),
      validStates: this.validateARIAStates(element),
      validProperties: this.validateARIAProperties(element)
    };
    
    return {
      valid: Object.values(checks).every(v => v === true),
      issues: Object.entries(checks).filter(([k, v]) => !v).map(([k]) => k)
    };
  }
}
```

#### Test Procedures:
1. **ARIA validation:** W3C validator
2. **Screen reader testing:** NVDA, JAWS, VoiceOver
3. **Semantic structure:** HTML5 outline algorithm
4. **Live region testing:** Dynamic update announcements

#### Success Metrics:
- ARIA coverage: 100% of interactive elements
- Screen reader compatibility: 3+ readers
- W3C validation: 0 errors
- Live region effectiveness: 100% announcements

---

### Stage 3: Keyboard Navigation Development
**Duration:** 3 days
**Owner:** UX Developer

#### Activities:
1. Implement complete keyboard navigation
2. Add focus management system
3. Create keyboard shortcuts documentation
4. Implement focus trap for modals

#### Exit Criteria:
- [ ] All features accessible via keyboard
- [ ] Focus indicators visible and consistent
- [ ] Tab order logical and predictable
- [ ] Keyboard shortcuts documented

#### Validation Methods:
```javascript
// Keyboard Navigation Tester
class KeyboardNavigationTester {
  testKeyboardAccess(component) {
    const tests = {
      tabOrder: this.verifyTabOrder(component),
      focusVisible: this.verifyFocusIndicators(component),
      keyboardOperability: this.testAllInteractions(component),
      focusTrap: this.verifyFocusTrap(component),
      shortcuts: this.validateShortcuts(component)
    };
    
    return {
      passed: tests,
      score: this.calculateAccessScore(tests),
      recommendations: this.generateRecommendations(tests)
    };
  }
}
```

#### Test Procedures:
1. **Tab navigation:** Complete UI traversal
2. **Keyboard operations:** All tool functions
3. **Focus management:** Modal and dropdown behavior
4. **Shortcut conflicts:** OS and browser shortcuts

#### Success Metrics:
- Keyboard operability: 100% of features
- Tab order efficiency: < 20 tabs to any feature
- Focus indicator visibility: 100% of elements
- Shortcut documentation: Complete

---

### Stage 4: Screen Reader Testing
**Duration:** 3 days
**Owner:** QA Accessibility Tester

#### Activities:
1. Test with multiple screen readers
2. Verify announcement clarity
3. Validate interaction feedback
4. Document screen reader user guide

#### Exit Criteria:
- [ ] NVDA testing complete
- [ ] JAWS testing complete
- [ ] VoiceOver testing complete
- [ ] User guide published

#### Validation Methods:
```javascript
// Screen Reader Validation Suite
class ScreenReaderValidator {
  async validateScreenReaderSupport() {
    const readers = ['NVDA', 'JAWS', 'VoiceOver'];
    const results = {};
    
    for (const reader of readers) {
      results[reader] = {
        navigation: await this.testNavigation(reader),
        announcements: await this.testAnnouncements(reader),
        interactions: await this.testInteractions(reader),
        formInput: await this.testFormInput(reader)
      };
    }
    
    return {
      compatible: this.allReadersPass(results),
      issues: this.extractIssues(results),
      score: this.calculateCompatibilityScore(results)
    };
  }
}
```

#### Test Procedures:
1. **Navigation test:** Browse all pages
2. **Canvas interaction:** Drawing operations
3. **Tool selection:** All tools and colors
4. **Form completion:** Settings and preferences

#### Success Metrics:
- Screen reader compatibility: 3/3 readers
- Announcement clarity: 100% understandable
- Interaction success rate: >= 95%
- User guide completeness: 100%

#### Rollback Procedures:
```bash
# Accessibility Rollback Protocol
if (wcagCompliance !== 'AA' || screenReaderTests.failed) {
  1. Identify specific WCAG violations
  2. Revert problematic changes
  3. Implement alternative solutions
  4. Re-test with automated tools
  5. Conduct manual verification
  6. Request accessibility expert review
}
```

---

# PROCESS 3: COPPA COMPLIANCE PROCESS
## Process ID: PROC-COPPA-001

### Stage 1: Age Verification Implementation
**Duration:** 3 days
**Owner:** Security Engineer

#### Activities:
1. Implement age gate system
2. Add birthdate verification
3. Create age-appropriate content filtering
4. Implement data collection restrictions

#### Exit Criteria:
- [ ] Age gate blocking users under 13
- [ ] Birthdate verification functional
- [ ] Content filtering active
- [ ] Data collection compliant

#### Validation Methods:
```javascript
// Age Verification Validator
class AgeVerificationValidator {
  validateAgeGate(implementation) {
    return {
      ageGatePresent: this.checkAgeGate(),
      birthdateRequired: this.checkBirthdateField(),
      under13Blocked: this.testUnder13Access(),
      dataCollectionRestricted: this.verifyDataRestrictions(),
      cookieCompliant: this.checkCookieUsage()
    };
  }
  
  testUnder13Access() {
    const testCases = [
      { birthdate: '2015-01-01', expected: 'blocked' },
      { birthdate: '2012-12-31', expected: 'blocked' },
      { birthdate: '2010-01-01', expected: 'parental_consent' },
      { birthdate: '2000-01-01', expected: 'allowed' }
    ];
    
    return testCases.every(test => 
      this.verifyAccess(test.birthdate) === test.expected
    );
  }
}
```

#### Test Procedures:
1. **Age calculation:** Various birthdates
2. **Bypass attempts:** Security testing
3. **Data collection:** Verify restrictions
4. **Cookie testing:** Compliance verification

#### Success Metrics:
- Age verification: 100% enforcement
- Under-13 blocking: 100% effective
- Data collection: 0 PII for under-13
- Security testing: 0 bypasses found

---

### Stage 2: Parental Consent Flow
**Duration:** 4 days
**Owner:** Full-Stack Developer

#### Activities:
1. Design consent request system
2. Implement email verification
3. Create consent management database
4. Add consent revocation mechanism

#### Exit Criteria:
- [ ] Consent flow operational
- [ ] Email verification working
- [ ] Consent records stored securely
- [ ] Revocation system functional

#### Validation Methods:
```javascript
// Parental Consent Validator
class ParentalConsentValidator {
  validateConsentFlow() {
    const tests = {
      requestGeneration: this.testConsentRequest(),
      emailDelivery: this.testEmailSystem(),
      verificationProcess: this.testVerification(),
      consentStorage: this.testSecureStorage(),
      revocationProcess: this.testRevocation(),
      auditTrail: this.testAuditLog()
    };
    
    return {
      compliant: Object.values(tests).every(t => t.passed),
      details: tests,
      recommendations: this.generateCompliance(tests)
    };
  }
  
  testSecureStorage() {
    return {
      encrypted: this.checkEncryption(),
      accessControlled: this.checkAccessControl(),
      retentionPolicy: this.checkRetention(),
      backupStrategy: this.checkBackups()
    };
  }
}
```

#### Test Procedures:
1. **Consent request:** End-to-end flow
2. **Email verification:** Delivery and links
3. **Database security:** Encryption and access
4. **Revocation testing:** Complete removal

#### Success Metrics:
- Consent flow completion: < 5 minutes
- Email delivery rate: >= 99%
- Verification success: >= 95%
- Revocation processing: < 24 hours

---

### Stage 3: Parent Dashboard Development
**Duration:** 5 days
**Owner:** Frontend Developer

#### Activities:
1. Create parent account system
2. Implement activity monitoring
3. Add content controls
4. Create data export functionality

#### Exit Criteria:
- [ ] Parent accounts functional
- [ ] Activity monitoring active
- [ ] Content controls operational
- [ ] Data export available

#### Validation Methods:
```javascript
// Parent Dashboard Validator
class ParentDashboardValidator {
  validateDashboard() {
    return {
      authentication: this.testParentAuth(),
      childManagement: this.testChildAccounts(),
      activityMonitoring: this.testActivityLogs(),
      contentControls: this.testRestrictions(),
      dataExport: this.testDataPortability(),
      privacyControls: this.testPrivacySettings()
    };
  }
  
  testActivityLogs() {
    const requirements = {
      realTime: false, // COPPA doesn't require real-time
      retention: 90, // days
      details: ['timestamp', 'action', 'duration'],
      accessible: true,
      exportable: true
    };
    
    return this.verifyAgainstRequirements(requirements);
  }
}
```

#### Test Procedures:
1. **Dashboard access:** Parent authentication
2. **Child management:** Add/remove/modify
3. **Activity review:** Log completeness
4. **Export testing:** Data portability

#### Success Metrics:
- Dashboard availability: 99.9% uptime
- Feature completeness: 100%
- Data accuracy: 100%
- Export functionality: All formats

---

### Stage 4: Compliance Validation
**Duration:** 3 days
**Owner:** Legal Compliance Officer

#### Activities:
1. Conduct legal review
2. Perform compliance audit
3. Document compliance measures
4. Obtain compliance certification

#### Exit Criteria:
- [ ] Legal review approved
- [ ] Audit findings addressed
- [ ] Documentation complete
- [ ] Certification obtained

#### Validation Methods:
```javascript
// COPPA Compliance Auditor
class COPPAComplianceAuditor {
  performComplianceAudit() {
    const auditChecklist = {
      notice: this.auditPrivacyNotice(),
      consent: this.auditConsentMechanism(),
      disclosure: this.auditThirdPartyDisclosure(),
      access: this.auditParentalAccess(),
      deletion: this.auditDeletionRights(),
      retention: this.auditDataRetention(),
      security: this.auditSecurityMeasures()
    };
    
    const score = this.calculateComplianceScore(auditChecklist);
    
    return {
      compliant: score >= 100,
      score: score,
      findings: this.extractFindings(auditChecklist),
      remediation: this.generateRemediation(auditChecklist)
    };
  }
}
```

#### Test Procedures:
1. **Privacy notice:** Completeness and clarity
2. **Consent mechanism:** Legal sufficiency
3. **Data handling:** Collection and storage
4. **Security review:** Protection measures

#### Success Metrics:
- Compliance score: 100%
- Legal approval: Obtained
- Audit findings: 0 critical issues
- Certification: Issued

#### Rollback Procedures:
```bash
# COPPA Compliance Rollback Protocol
if (complianceAudit.failed || legalReview.rejected) {
  1. Immediately restrict under-13 access
  2. Halt all data collection
  3. Notify legal team
  4. Implement emergency fixes
  5. Re-audit compliance
  6. Seek legal re-approval
  7. Document all changes
}
```

---

# INTEGRATION AND ORCHESTRATION

## Cross-Process Dependencies
```yaml
dependencies:
  performance_optimization:
    depends_on: []
    blocks: []
    
  accessibility_implementation:
    depends_on: 
      - performance_optimization.stage_2  # RAF implementation
    blocks: []
    
  coppa_compliance:
    depends_on: []
    blocks:
      - performance_optimization.stage_4  # Can't validate performance with age gate
```

## Master Validation Gate
```javascript
class MasterValidationGate {
  async validateRelease() {
    const results = {
      performance: await this.validatePerformance(),
      accessibility: await this.validateAccessibility(),
      coppa: await this.validateCOPPA()
    };
    
    const decision = {
      ready: Object.values(results).every(r => r.passed),
      blockers: this.extractBlockers(results),
      risks: this.assessRisks(results),
      recommendation: this.generateRecommendation(results)
    };
    
    if (!decision.ready) {
      this.triggerRollback(decision.blockers);
    }
    
    return decision;
  }
}
```

## Continuous Monitoring
```javascript
class ContinuousMonitor {
  constructor() {
    this.metrics = {
      performance: new PerformanceMonitor(),
      accessibility: new AccessibilityMonitor(),
      compliance: new ComplianceMonitor()
    };
  }
  
  startMonitoring() {
    setInterval(() => {
      const health = {
        fps: this.metrics.performance.getCurrentFPS(),
        wcag: this.metrics.accessibility.getViolations(),
        coppa: this.metrics.compliance.getStatus()
      };
      
      if (this.detectDegradation(health)) {
        this.alert('CRITICAL: System degradation detected');
        this.initiateEmergencyProtocol(health);
      }
    }, 60000); // Check every minute
  }
}
```

## Emergency Rollback Protocol
```bash
#!/bin/bash
# Emergency Rollback Procedure

emergency_rollback() {
  local ISSUE=$1
  local SEVERITY=$2
  
  echo "EMERGENCY: Initiating rollback for $ISSUE (Severity: $SEVERITY)"
  
  # 1. Stop current deployment
  kubectl rollout pause deployment/minecraft-skin-studio
  
  # 2. Rollback to last known good version
  kubectl rollout undo deployment/minecraft-skin-studio
  
  # 3. Verify rollback
  kubectl rollout status deployment/minecraft-skin-studio
  
  # 4. Run smoke tests
  npm run test:smoke
  
  # 5. Alert stakeholders
  send_alert "Emergency rollback executed: $ISSUE"
  
  # 6. Create incident report
  create_incident_report "$ISSUE" "$SEVERITY"
  
  # 7. Schedule post-mortem
  schedule_postmortem
}
```

## Success Metrics Dashboard
```yaml
dashboard:
  performance:
    current_fps: LIVE
    target_fps: 60
    frame_drops: LIVE
    memory_usage: LIVE
    
  accessibility:
    wcag_level: AA
    violations: 0
    keyboard_coverage: 100%
    screen_reader_support: 3/3
    
  compliance:
    coppa_compliant: TRUE
    age_verification: ACTIVE
    parental_consent: OPERATIONAL
    audit_status: PASSED
    
  overall:
    release_ready: TRUE/FALSE
    blockers: []
    next_review: DATETIME
```

---

# APPENDIX: Testing Scripts and Tools

## Automated Test Runner
```bash
#!/bin/bash
# Complete test suite runner

run_complete_tests() {
  echo "Starting comprehensive test suite..."
  
  # Performance Tests
  npm run test:performance
  npm run test:performance:stress
  npm run test:performance:endurance
  
  # Accessibility Tests
  npm run test:a11y
  npm run test:a11y:screen-reader
  npm run test:a11y:keyboard
  
  # Compliance Tests
  npm run test:coppa
  npm run test:security
  npm run test:privacy
  
  # Integration Tests
  npm run test:integration
  
  # Generate Reports
  npm run report:generate
  
  echo "Test suite complete. Check reports/ directory."
}
```

## Monitoring Configuration
```javascript
// monitoring.config.js
module.exports = {
  performance: {
    enabled: true,
    metrics: ['fps', 'memory', 'cpu', 'renderTime'],
    thresholds: {
      fps: { min: 60, warning: 55 },
      memory: { max: 500, warning: 400 }, // MB
      cpu: { max: 50, warning: 40 }, // %
      renderTime: { max: 16.67, warning: 20 } // ms
    }
  },
  
  accessibility: {
    enabled: true,
    scanInterval: 300000, // 5 minutes
    rules: 'wcag2aa',
    alerts: true
  },
  
  compliance: {
    enabled: true,
    checks: ['age-gate', 'consent', 'data-collection'],
    auditInterval: 86400000 // Daily
  }
};
```

---

**Document Version:** 1.0.0  
**Last Updated:** 2025-08-10  
**Next Review:** 2025-08-17  
**Status:** ACTIVE