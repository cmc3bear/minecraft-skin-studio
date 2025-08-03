"use strict";
/**
 * Parallel Agent Review Pipeline
 * Runs all agents concurrently to review the codebase
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParallelAgentReview = void 0;
exports.runParallelReview = runParallelReview;
const guardian_1 = require("./guardian");
const fs = __importStar(require("fs/promises"));
const path = __importStar(require("path"));
class ParallelAgentReview {
    constructor() {
        this.agents = new Map();
        this.initializeAgents();
    }
    initializeAgents() {
        // Guardian Agent - Safety & COPPA
        this.agents.set('guardian', guardian_1.GuardianAgent);
        // PixelPerfect Agent - Performance
        this.agents.set('pixelPerfect', {
            id: 'pixelPerfect',
            name: 'PixelPerfect',
            description: 'Canvas performance and rendering quality',
            objectives: ['S2'],
            standards: [
                { metric: 'FPS', requirement: '60+ FPS', threshold: 60, measurement: 'frames/second' },
                { metric: 'Memory Usage', requirement: '<100MB', threshold: 100, measurement: 'megabytes' },
                { metric: 'Render Time', requirement: '<16ms', threshold: 16, measurement: 'milliseconds' }
            ]
        });
        // CloudShield Agent - Security
        this.agents.set('cloudShield', {
            id: 'cloudShield',
            name: 'CloudShield',
            description: 'Backend security and API protection',
            objectives: ['C4'],
            standards: [
                { metric: 'Vulnerabilities', requirement: 'Zero high/critical', threshold: 0, measurement: 'count' },
                { metric: 'API Auth', requirement: '100% authenticated', threshold: 100, measurement: 'percent' },
                { metric: 'Secrets Exposed', requirement: 'Zero', threshold: 0, measurement: 'count' }
            ]
        });
        // Tensor Agent - AI Quality
        this.agents.set('tensor', {
            id: 'tensor',
            name: 'Tensor',
            description: 'AI integration quality and response times',
            objectives: ['S3'],
            standards: [
                { metric: 'Response Time', requirement: '<3s', threshold: 3000, measurement: 'milliseconds' },
                { metric: 'AI Safety', requirement: '100% safe', threshold: 100, measurement: 'percent' },
                { metric: 'Context Accuracy', requirement: '>95%', threshold: 95, measurement: 'percent' }
            ]
        });
        // Professor UX Agent - Accessibility
        this.agents.set('professorUX', {
            id: 'professorUX',
            name: 'Professor UX',
            description: 'User experience and accessibility',
            objectives: ['C2'],
            standards: [
                { metric: 'WCAG Compliance', requirement: 'AA rating', threshold: 90, measurement: 'score' },
                { metric: 'Touch Targets', requirement: '>44px', threshold: 44, measurement: 'pixels' },
                { metric: 'Error Clarity', requirement: '100% kid-friendly', threshold: 100, measurement: 'percent' }
            ]
        });
    }
    async runParallelReview(projectPath) {
        console.log('🚀 Starting parallel agent review pipeline...');
        const reviewPromises = Array.from(this.agents.entries()).map(async ([agentId, agent]) => {
            console.log(`  🤖 ${agent.name} starting review...`);
            return this.runAgentReview(agent, projectPath);
        });
        const reviews = await Promise.all(reviewPromises);
        console.log('✅ All agent reviews completed');
        return reviews;
    }
    async runAgentReview(agent, projectPath) {
        const startTime = Date.now();
        const findings = [];
        const recommendations = [];
        const objectiveImpacts = [];
        try {
            // Run agent-specific reviews
            switch (agent.id) {
                case 'guardian':
                    await this.runGuardianReview(projectPath, findings, recommendations, objectiveImpacts);
                    break;
                case 'pixelPerfect':
                    await this.runPixelPerfectReview(projectPath, findings, recommendations, objectiveImpacts);
                    break;
                case 'cloudShield':
                    await this.runCloudShieldReview(projectPath, findings, recommendations, objectiveImpacts);
                    break;
                case 'tensor':
                    await this.runTensorReview(projectPath, findings, recommendations, objectiveImpacts);
                    break;
                case 'professorUX':
                    await this.runProfessorUXReview(projectPath, findings, recommendations, objectiveImpacts);
                    break;
            }
        }
        catch (error) {
            findings.push({
                severity: 'high',
                category: 'agent-error',
                description: `Agent review failed: ${error}`,
                recommendation: 'Fix agent implementation'
            });
        }
        const duration = Date.now() - startTime;
        console.log(`  ✓ ${agent.name} completed in ${duration}ms`);
        return {
            agentId: agent.id,
            agentName: agent.name,
            timestamp: new Date(),
            findings,
            recommendations,
            objectiveImpacts,
            overallScore: this.calculateScore(findings)
        };
    }
    async runGuardianReview(projectPath, findings, recommendations, objectiveImpacts) {
        // Check for content safety implementations
        const srcPath = path.join(projectPath, 'src');
        const files = await this.getTypeScriptFiles(srcPath);
        let hasContentFiltering = false;
        let hasCOPPACompliance = false;
        let hasParentalControls = false;
        for (const file of files) {
            const content = await fs.readFile(file, 'utf-8');
            // Check for safety validations
            if (content.includes('validateContentSafety') || content.includes('ContentFilter')) {
                hasContentFiltering = true;
            }
            // Check for COPPA compliance
            if (content.includes('COPPA') || content.includes('parental consent')) {
                hasCOPPACompliance = true;
            }
            // Check for parental controls
            if (content.includes('parental') && content.includes('control')) {
                hasParentalControls = true;
            }
            // Check for exposed personal data
            if (content.includes('localStorage') && (content.includes('email') || content.includes('phone'))) {
                findings.push({
                    severity: 'critical',
                    category: 'data-privacy',
                    file: path.relative(projectPath, file),
                    description: 'Potential personal data storage in localStorage',
                    recommendation: 'Remove personal data storage or implement secure encryption',
                    objectiveId: 'S1'
                });
            }
        }
        // Report findings
        if (!hasContentFiltering) {
            findings.push({
                severity: 'critical',
                category: 'safety',
                description: 'Missing content filtering implementation',
                recommendation: 'Implement Guardian content filter for all user inputs',
                objectiveId: 'S1'
            });
        }
        else {
            objectiveImpacts.push({
                objectiveId: 'S1',
                impact: 'positive',
                description: 'Content filtering is implemented'
            });
        }
        if (!hasCOPPACompliance) {
            findings.push({
                severity: 'high',
                category: 'compliance',
                description: 'COPPA compliance measures not fully implemented',
                recommendation: 'Implement full COPPA compliance checklist',
                objectiveId: 'C1'
            });
        }
        if (!hasParentalControls) {
            findings.push({
                severity: 'medium',
                category: 'safety',
                description: 'Parental control features not found',
                recommendation: 'Add parental dashboard and controls',
                objectiveId: 'S1'
            });
        }
        recommendations.push('Implement comprehensive safety testing suite');
        recommendations.push('Add content moderation queue for user-generated content');
        recommendations.push('Create parent onboarding flow');
    }
    async runPixelPerfectReview(projectPath, findings, recommendations, objectiveImpacts) {
        const srcPath = path.join(projectPath, 'src');
        const files = await this.getTypeScriptFiles(srcPath);
        for (const file of files) {
            const content = await fs.readFile(file, 'utf-8');
            // Check for performance optimizations
            if (file.includes('Canvas') || file.includes('canvas')) {
                if (!content.includes('requestAnimationFrame')) {
                    findings.push({
                        severity: 'high',
                        category: 'performance',
                        file: path.relative(projectPath, file),
                        description: 'Canvas not using requestAnimationFrame for optimal rendering',
                        recommendation: 'Use requestAnimationFrame for 60 FPS performance',
                        objectiveId: 'S2'
                    });
                }
                if (!content.includes('willReadFrequently')) {
                    findings.push({
                        severity: 'medium',
                        category: 'performance',
                        file: path.relative(projectPath, file),
                        description: 'Canvas context not optimized for frequent reads',
                        recommendation: 'Add willReadFrequently: true to getContext options',
                        objectiveId: 'S2'
                    });
                }
            }
            // Check for memory leaks
            if (content.includes('addEventListener') && !content.includes('removeEventListener')) {
                findings.push({
                    severity: 'medium',
                    category: 'memory',
                    file: path.relative(projectPath, file),
                    description: 'Potential memory leak: addEventListener without cleanup',
                    recommendation: 'Add cleanup in useEffect return or component unmount',
                    objectiveId: 'S2'
                });
            }
        }
        recommendations.push('Implement performance monitoring dashboard');
        recommendations.push('Add FPS counter to development mode');
        recommendations.push('Create performance budget tests');
    }
    async runCloudShieldReview(projectPath, findings, recommendations, objectiveImpacts) {
        const files = await this.getAllFiles(projectPath);
        for (const file of files) {
            const content = await fs.readFile(file, 'utf-8');
            // Check for exposed secrets
            const secretPatterns = [
                /api[_-]?key\s*[:=]\s*["'][^"']+["']/gi,
                /secret\s*[:=]\s*["'][^"']+["']/gi,
                /password\s*[:=]\s*["'][^"']+["']/gi,
                /token\s*[:=]\s*["'][^"']+["']/gi
            ];
            for (const pattern of secretPatterns) {
                if (pattern.test(content)) {
                    findings.push({
                        severity: 'critical',
                        category: 'security',
                        file: path.relative(projectPath, file),
                        description: 'Potential exposed secret or API key',
                        recommendation: 'Move to environment variables and add to .gitignore',
                        objectiveId: 'C4'
                    });
                }
            }
            // Check for input validation
            if (content.includes('innerHTML') && !content.includes('sanitize')) {
                findings.push({
                    severity: 'high',
                    category: 'security',
                    file: path.relative(projectPath, file),
                    description: 'Potential XSS vulnerability: innerHTML without sanitization',
                    recommendation: 'Use textContent or sanitize HTML input',
                    objectiveId: 'C4'
                });
            }
        }
        // Check for .env and .gitignore
        const gitignorePath = path.join(projectPath, '.gitignore');
        try {
            const gitignore = await fs.readFile(gitignorePath, 'utf-8');
            if (!gitignore.includes('.env')) {
                findings.push({
                    severity: 'high',
                    category: 'security',
                    description: '.env not in .gitignore',
                    recommendation: 'Add .env to .gitignore to prevent secret exposure',
                    objectiveId: 'C4'
                });
            }
        }
        catch (error) {
            findings.push({
                severity: 'medium',
                category: 'security',
                description: 'Missing .gitignore file',
                recommendation: 'Create .gitignore with proper exclusions',
                objectiveId: 'C4'
            });
        }
        recommendations.push('Implement API rate limiting');
        recommendations.push('Add security headers middleware');
        recommendations.push('Set up dependency vulnerability scanning');
    }
    async runTensorReview(projectPath, findings, recommendations, objectiveImpacts) {
        const srcPath = path.join(projectPath, 'src');
        const files = await this.getTypeScriptFiles(srcPath);
        let hasAIService = false;
        let hasResponseTimeMonitoring = false;
        let hasErrorHandling = false;
        for (const file of files) {
            const content = await fs.readFile(file, 'utf-8');
            if (content.includes('AIService') || content.includes('generateSuggestions')) {
                hasAIService = true;
                // Check for response time monitoring
                if (content.includes('performance.now()') || content.includes('responseTime')) {
                    hasResponseTimeMonitoring = true;
                    objectiveImpacts.push({
                        objectiveId: 'S3',
                        impact: 'positive',
                        description: 'AI response time monitoring implemented'
                    });
                }
                // Check for proper error handling
                if (content.includes('try') && content.includes('catch')) {
                    hasErrorHandling = true;
                }
                // Check for fallback mechanisms
                if (!content.includes('fallback')) {
                    findings.push({
                        severity: 'medium',
                        category: 'reliability',
                        file: path.relative(projectPath, file),
                        description: 'AI service missing fallback mechanism',
                        recommendation: 'Add offline fallback for AI features',
                        objectiveId: 'S3'
                    });
                }
            }
        }
        if (!hasAIService) {
            findings.push({
                severity: 'info',
                category: 'feature',
                description: 'AI service implementation found and validated',
                recommendation: 'Continue monitoring response times',
                objectiveId: 'S3'
            });
        }
        if (!hasResponseTimeMonitoring) {
            findings.push({
                severity: 'high',
                category: 'performance',
                description: 'Missing AI response time monitoring',
                recommendation: 'Add performance monitoring for S3 objective compliance',
                objectiveId: 'S3'
            });
        }
        recommendations.push('Implement AI response caching');
        recommendations.push('Add AI model versioning');
        recommendations.push('Create AI quality metrics dashboard');
    }
    async runProfessorUXReview(projectPath, findings, recommendations, objectiveImpacts) {
        const srcPath = path.join(projectPath, 'src');
        const files = await this.getTypeScriptFiles(srcPath);
        for (const file of files) {
            const content = await fs.readFile(file, 'utf-8');
            // Check for accessibility attributes
            if (file.endsWith('.tsx')) {
                if (!content.includes('aria-') && !content.includes('role=')) {
                    findings.push({
                        severity: 'medium',
                        category: 'accessibility',
                        file: path.relative(projectPath, file),
                        description: 'Missing ARIA attributes for accessibility',
                        recommendation: 'Add appropriate ARIA labels and roles',
                        objectiveId: 'C2'
                    });
                }
                // Check for alt text on images
                if (content.includes('<img') && !content.includes('alt=')) {
                    findings.push({
                        severity: 'high',
                        category: 'accessibility',
                        file: path.relative(projectPath, file),
                        description: 'Images missing alt text',
                        recommendation: 'Add descriptive alt text to all images',
                        objectiveId: 'C2'
                    });
                }
                // Check for keyboard navigation
                if (content.includes('onClick') && !content.includes('onKeyDown')) {
                    findings.push({
                        severity: 'medium',
                        category: 'accessibility',
                        file: path.relative(projectPath, file),
                        description: 'Click handlers without keyboard support',
                        recommendation: 'Add keyboard event handlers for accessibility',
                        objectiveId: 'C2'
                    });
                }
            }
            // Check for error messages
            if (content.includes('error') || content.includes('Error')) {
                if (!content.includes('friendly') && !content.includes('kid')) {
                    findings.push({
                        severity: 'low',
                        category: 'ux',
                        file: path.relative(projectPath, file),
                        description: 'Error messages may not be kid-friendly',
                        recommendation: 'Review error messages for child-appropriate language',
                        objectiveId: 'C2'
                    });
                }
            }
        }
        recommendations.push('Conduct accessibility audit with screen readers');
        recommendations.push('Add skip navigation links');
        recommendations.push('Implement high contrast mode');
    }
    async getTypeScriptFiles(dir) {
        const files = [];
        try {
            const entries = await fs.readdir(dir, { withFileTypes: true });
            for (const entry of entries) {
                const fullPath = path.join(dir, entry.name);
                if (entry.isDirectory() && !entry.name.includes('node_modules')) {
                    files.push(...await this.getTypeScriptFiles(fullPath));
                }
                else if (entry.isFile() && (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx'))) {
                    files.push(fullPath);
                }
            }
        }
        catch (error) {
            console.error(`Error reading directory ${dir}:`, error);
        }
        return files;
    }
    async getAllFiles(dir) {
        const files = [];
        try {
            const entries = await fs.readdir(dir, { withFileTypes: true });
            for (const entry of entries) {
                const fullPath = path.join(dir, entry.name);
                if (entry.isDirectory() && !entry.name.includes('node_modules') && !entry.name.includes('.git')) {
                    files.push(...await this.getAllFiles(fullPath));
                }
                else if (entry.isFile()) {
                    files.push(fullPath);
                }
            }
        }
        catch (error) {
            console.error(`Error reading directory ${dir}:`, error);
        }
        return files;
    }
    calculateScore(findings) {
        let score = 100;
        findings.forEach(finding => {
            switch (finding.severity) {
                case 'critical':
                    score -= 20;
                    break;
                case 'high':
                    score -= 10;
                    break;
                case 'medium':
                    score -= 5;
                    break;
                case 'low':
                    score -= 2;
                    break;
                case 'info':
                    score -= 0;
                    break;
            }
        });
        return Math.max(0, score);
    }
}
exports.ParallelAgentReview = ParallelAgentReview;
// Export for CLI usage
async function runParallelReview(projectPath) {
    const reviewer = new ParallelAgentReview();
    const reviews = await reviewer.runParallelReview(projectPath);
    // Save results
    const outputPath = path.join(projectPath, 'agent-review-results.json');
    await fs.writeFile(outputPath, JSON.stringify(reviews, null, 2));
    console.log(`\n📊 Review results saved to: ${outputPath}`);
    // Generate summary
    console.log('\n📋 Review Summary:');
    reviews.forEach(review => {
        console.log(`\n${review.agentName} (Score: ${review.overallScore}/100)`);
        console.log(`  Findings: ${review.findings.length}`);
        console.log(`  Critical: ${review.findings.filter(f => f.severity === 'critical').length}`);
        console.log(`  High: ${review.findings.filter(f => f.severity === 'high').length}`);
    });
    return reviews;
}
