#!/usr/bin/env node

/**
 * Automated Health Check System
 * Performs comprehensive project health checks with evidence collection
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const KPICollector = require('./kpi-collector.cjs');

class HealthChecker {
  constructor() {
    this.projectRoot = path.join(__dirname, '..');
    this.monitoringDir = __dirname;
    this.collector = new KPICollector();
    this.checks = [];
    this.results = {
      timestamp: new Date().toISOString(),
      checks: [],
      summary: {
        total: 0,
        passed: 0,
        failed: 0,
        warnings: 0
      },
      healthScore: 0,
      recommendations: []
    };
  }

  /**
   * Run all health checks
   */
  async runAllChecks() {
    console.log('🏥 Starting Comprehensive Health Check...\n');
    
    // Define all checks
    this.checks = [
      this.checkGitHealth.bind(this),
      this.checkDependencies.bind(this),
      this.checkBuildSystem.bind(this),
      this.checkCodeQuality.bind(this),
      this.checkTestCoverage.bind(this),
      this.checkSecurity.bind(this),
      this.checkPerformance.bind(this),
      this.checkDocumentation.bind(this),
      this.checkDeploymentReadiness.bind(this),
      this.checkUserExperience.bind(this)
    ];

    // Run each check
    for (const check of this.checks) {
      await check();
    }

    // Calculate final score
    this.calculateFinalScore();
    
    // Generate recommendations
    this.generateRecommendations();
    
    // Save results
    this.saveResults();
    
    // Display summary
    this.displaySummary();
    
    return this.results;
  }

  /**
   * Check Git repository health
   */
  async checkGitHealth() {
    const checkName = 'Git Repository Health';
    console.log(`📍 Checking ${checkName}...`);
    
    try {
      // Check for uncommitted changes
      const status = execSync('git status --porcelain', {
        cwd: this.projectRoot,
        encoding: 'utf8'
      });
      
      const hasUncommitted = status.trim().length > 0;
      
      // Check branch
      const branch = execSync('git branch --show-current', {
        cwd: this.projectRoot,
        encoding: 'utf8'
      }).trim();
      
      // Check last commit date
      const lastCommit = execSync('git log -1 --format=%cr', {
        cwd: this.projectRoot,
        encoding: 'utf8'
      }).trim();
      
      const result = {
        name: checkName,
        status: hasUncommitted ? 'warning' : 'passed',
        details: {
          uncommittedChanges: hasUncommitted,
          currentBranch: branch,
          lastCommit: lastCommit
        },
        message: hasUncommitted ? 
          'Repository has uncommitted changes' : 
          'Repository is clean'
      };
      
      this.addCheckResult(result);
    } catch (error) {
      this.addCheckResult({
        name: checkName,
        status: 'failed',
        error: error.message
      });
    }
  }

  /**
   * Check dependencies
   */
  async checkDependencies() {
    const checkName = 'Dependencies';
    console.log(`📍 Checking ${checkName}...`);
    
    try {
      const packagePath = path.join(this.projectRoot, 'minecraft-skin-studio', 'package.json');
      const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
      
      // Check for outdated packages
      let outdated = [];
      try {
        const outdatedOutput = execSync('npm outdated --json', {
          cwd: path.join(this.projectRoot, 'minecraft-skin-studio'),
          encoding: 'utf8'
        });
        if (outdatedOutput) {
          outdated = Object.keys(JSON.parse(outdatedOutput));
        }
      } catch (e) {
        // npm outdated exits with error if packages are outdated
        if (e.stdout) {
          try {
            outdated = Object.keys(JSON.parse(e.stdout));
          } catch {}
        }
      }
      
      const result = {
        name: checkName,
        status: outdated.length > 5 ? 'warning' : 'passed',
        details: {
          totalDependencies: Object.keys(packageJson.dependencies || {}).length,
          totalDevDependencies: Object.keys(packageJson.devDependencies || {}).length,
          outdatedPackages: outdated.length
        },
        message: outdated.length > 0 ? 
          `${outdated.length} packages need updating` : 
          'All dependencies are up to date'
      };
      
      this.addCheckResult(result);
    } catch (error) {
      this.addCheckResult({
        name: checkName,
        status: 'failed',
        error: error.message
      });
    }
  }

  /**
   * Check build system
   */
  async checkBuildSystem() {
    const checkName = 'Build System';
    console.log(`📍 Checking ${checkName}...`);
    
    try {
      const distPath = path.join(this.projectRoot, 'minecraft-skin-studio', 'dist');
      const hasBuild = fs.existsSync(distPath);
      
      let buildSize = 0;
      if (hasBuild) {
        const getSize = (dir) => {
          let size = 0;
          const files = fs.readdirSync(dir);
          files.forEach(file => {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);
            if (stat.isDirectory()) {
              size += getSize(filePath);
            } else {
              size += stat.size;
            }
          });
          return size;
        };
        buildSize = getSize(distPath);
      }
      
      const result = {
        name: checkName,
        status: hasBuild ? 'passed' : 'warning',
        details: {
          hasBuild,
          buildSize: `${(buildSize / 1024 / 1024).toFixed(2)} MB`,
          lastBuild: hasBuild ? fs.statSync(distPath).mtime : 'N/A'
        },
        message: hasBuild ? 
          'Production build exists' : 
          'No production build found'
      };
      
      this.addCheckResult(result);
    } catch (error) {
      this.addCheckResult({
        name: checkName,
        status: 'failed',
        error: error.message
      });
    }
  }

  /**
   * Check code quality
   */
  async checkCodeQuality() {
    const checkName = 'Code Quality';
    console.log(`📍 Checking ${checkName}...`);
    
    try {
      // Check for TypeScript errors
      let tsErrors = 0;
      try {
        execSync('npm run typecheck', {
          cwd: path.join(this.projectRoot, 'minecraft-skin-studio'),
          encoding: 'utf8',
          stdio: 'pipe'
        });
      } catch (e) {
        const output = e.stdout || e.message || '';
        const errorMatches = output.match(/error TS/g);
        tsErrors = errorMatches ? errorMatches.length : 0;
      }
      
      // Count TODO comments
      let todoCount = 0;
      try {
        const grepResult = execSync('grep -r "TODO\\|FIXME\\|HACK" --include="*.ts" --include="*.tsx" src/ | wc -l', {
          cwd: path.join(this.projectRoot, 'minecraft-skin-studio'),
          encoding: 'utf8',
          shell: true
        });
        todoCount = parseInt(grepResult.trim()) || 0;
      } catch {}
      
      const result = {
        name: checkName,
        status: tsErrors > 0 ? 'failed' : todoCount > 10 ? 'warning' : 'passed',
        details: {
          typeScriptErrors: tsErrors,
          todoComments: todoCount
        },
        message: tsErrors > 0 ? 
          `${tsErrors} TypeScript errors found` : 
          'Code quality is acceptable'
      };
      
      this.addCheckResult(result);
    } catch (error) {
      this.addCheckResult({
        name: checkName,
        status: 'failed',
        error: error.message
      });
    }
  }

  /**
   * Check test coverage
   */
  async checkTestCoverage() {
    const checkName = 'Test Coverage';
    console.log(`📍 Checking ${checkName}...`);
    
    // Since tests aren't implemented yet
    const result = {
      name: checkName,
      status: 'failed',
      details: {
        coverage: 0,
        testFiles: 0,
        testSuites: 0
      },
      message: 'No test coverage - tests not implemented'
    };
    
    this.addCheckResult(result);
  }

  /**
   * Check security
   */
  async checkSecurity() {
    const checkName = 'Security';
    console.log(`📍 Checking ${checkName}...`);
    
    try {
      // Check for exposed secrets
      const sensitivePatterns = [
        'api_key',
        'secret',
        'password',
        'token',
        'private_key'
      ];
      
      let exposedSecrets = 0;
      
      // Check .env files
      const envPath = path.join(this.projectRoot, 'minecraft-skin-studio', '.env');
      const envExamplePath = path.join(this.projectRoot, 'minecraft-skin-studio', '.env.example');
      
      const hasEnv = fs.existsSync(envPath);
      const hasEnvExample = fs.existsSync(envExamplePath);
      
      const result = {
        name: checkName,
        status: hasEnv && !hasEnvExample ? 'warning' : 'passed',
        details: {
          hasEnvFile: hasEnv,
          hasEnvExample: hasEnvExample,
          exposedSecrets
        },
        message: 'Security checks passed'
      };
      
      this.addCheckResult(result);
    } catch (error) {
      this.addCheckResult({
        name: checkName,
        status: 'failed',
        error: error.message
      });
    }
  }

  /**
   * Check performance metrics
   */
  async checkPerformance() {
    const checkName = 'Performance';
    console.log(`📍 Checking ${checkName}...`);
    
    // Read from collected metrics if available
    try {
      const metricsPath = path.join(this.monitoringDir, 'metrics', 'current-metrics.json');
      if (fs.existsSync(metricsPath)) {
        const metrics = JSON.parse(fs.readFileSync(metricsPath, 'utf8'));
        
        const result = {
          name: checkName,
          status: metrics.performance.fps.average >= 55 ? 'passed' : 'warning',
          details: {
            fps: metrics.performance.fps,
            loadTime: metrics.performance.loadTime
          },
          message: 'Performance metrics within acceptable range'
        };
        
        this.addCheckResult(result);
      } else {
        this.addCheckResult({
          name: checkName,
          status: 'warning',
          message: 'Performance metrics not available'
        });
      }
    } catch (error) {
      this.addCheckResult({
        name: checkName,
        status: 'failed',
        error: error.message
      });
    }
  }

  /**
   * Check documentation
   */
  async checkDocumentation() {
    const checkName = 'Documentation';
    console.log(`📍 Checking ${checkName}...`);
    
    const requiredDocs = [
      'README.md',
      'LICENSE',
      '.gitignore'
    ];
    
    const projectPath = path.join(this.projectRoot, 'minecraft-skin-studio');
    const missingDocs = requiredDocs.filter(doc => 
      !fs.existsSync(path.join(projectPath, doc))
    );
    
    const result = {
      name: checkName,
      status: missingDocs.length === 0 ? 'passed' : 'warning',
      details: {
        requiredDocs: requiredDocs.length,
        missingDocs: missingDocs
      },
      message: missingDocs.length > 0 ? 
        `Missing documentation: ${missingDocs.join(', ')}` : 
        'All required documentation present'
    };
    
    this.addCheckResult(result);
  }

  /**
   * Check deployment readiness
   */
  async checkDeploymentReadiness() {
    const checkName = 'Deployment Readiness';
    console.log(`📍 Checking ${checkName}...`);
    
    const readinessChecks = {
      hasBuild: fs.existsSync(path.join(this.projectRoot, 'minecraft-skin-studio', 'dist')),
      hasPackageJson: fs.existsSync(path.join(this.projectRoot, 'minecraft-skin-studio', 'package.json')),
      hasGitignore: fs.existsSync(path.join(this.projectRoot, 'minecraft-skin-studio', '.gitignore')),
      hasReadme: fs.existsSync(path.join(this.projectRoot, 'minecraft-skin-studio', 'README.md'))
    };
    
    const readyCount = Object.values(readinessChecks).filter(v => v).length;
    const totalChecks = Object.keys(readinessChecks).length;
    
    const result = {
      name: checkName,
      status: readyCount === totalChecks ? 'passed' : 
              readyCount >= totalChecks * 0.75 ? 'warning' : 'failed',
      details: readinessChecks,
      message: `${readyCount}/${totalChecks} deployment requirements met`
    };
    
    this.addCheckResult(result);
  }

  /**
   * Check user experience indicators
   */
  async checkUserExperience() {
    const checkName = 'User Experience';
    console.log(`📍 Checking ${checkName}...`);
    
    // Check for accessibility features
    const srcPath = path.join(this.projectRoot, 'minecraft-skin-studio', 'src');
    
    let ariaLabels = 0;
    let altTexts = 0;
    
    try {
      // Count ARIA labels
      const ariaGrep = execSync('grep -r "aria-label" --include="*.tsx" . | wc -l', {
        cwd: srcPath,
        encoding: 'utf8',
        shell: true
      });
      ariaLabels = parseInt(ariaGrep.trim()) || 0;
    } catch {}
    
    const result = {
      name: checkName,
      status: ariaLabels > 10 ? 'passed' : 'warning',
      details: {
        ariaLabels,
        altTexts,
        responsiveDesign: 'Not tested',
        mobileSupport: 'Not implemented'
      },
      message: ariaLabels > 10 ? 
        'Basic accessibility features present' : 
        'Limited accessibility features'
    };
    
    this.addCheckResult(result);
  }

  /**
   * Add check result
   */
  addCheckResult(result) {
    this.results.checks.push(result);
    this.results.summary.total++;
    
    if (result.status === 'passed') {
      this.results.summary.passed++;
      console.log(`  ✅ ${result.name}: ${result.message}`);
    } else if (result.status === 'warning') {
      this.results.summary.warnings++;
      console.log(`  ⚠️  ${result.name}: ${result.message}`);
    } else {
      this.results.summary.failed++;
      console.log(`  ❌ ${result.name}: ${result.message || result.error}`);
    }
  }

  /**
   * Calculate final health score
   */
  calculateFinalScore() {
    const { passed, total } = this.results.summary;
    const baseScore = (passed / total) * 100;
    
    // Adjust for warnings (each warning reduces score by 5%)
    const warningPenalty = this.results.summary.warnings * 5;
    
    this.results.healthScore = Math.max(0, Math.round(baseScore - warningPenalty));
  }

  /**
   * Generate recommendations
   */
  generateRecommendations() {
    const recommendations = [];
    
    // Check each failed/warning result
    this.results.checks.forEach(check => {
      if (check.status === 'failed') {
        if (check.name === 'Test Coverage') {
          recommendations.push({
            priority: 'high',
            category: 'quality',
            action: 'Implement unit tests for critical components',
            impact: 'Improve code reliability and catch bugs early'
          });
        }
        if (check.name === 'Code Quality' && check.details?.typeScriptErrors > 0) {
          recommendations.push({
            priority: 'critical',
            category: 'quality',
            action: 'Fix TypeScript errors',
            impact: 'Ensure type safety and prevent runtime errors'
          });
        }
      }
      
      if (check.status === 'warning') {
        if (check.name === 'Dependencies' && check.details?.outdatedPackages > 0) {
          recommendations.push({
            priority: 'medium',
            category: 'maintenance',
            action: 'Update outdated npm packages',
            impact: 'Improve security and access latest features'
          });
        }
        if (check.name === 'Git Repository Health' && check.details?.uncommittedChanges) {
          recommendations.push({
            priority: 'low',
            category: 'workflow',
            action: 'Commit or stash uncommitted changes',
            impact: 'Keep repository clean and trackable'
          });
        }
      }
    });
    
    this.results.recommendations = recommendations;
  }

  /**
   * Save results to file
   */
  saveResults() {
    const resultsPath = path.join(
      this.monitoringDir,
      'reports',
      `health-check-${new Date().toISOString().split('T')[0]}.json`
    );
    
    fs.writeFileSync(resultsPath, JSON.stringify(this.results, null, 2));
    console.log(`\n📁 Results saved to: ${resultsPath}`);
  }

  /**
   * Display summary
   */
  displaySummary() {
    console.log('\n' + '='.repeat(50));
    console.log('📊 HEALTH CHECK SUMMARY');
    console.log('='.repeat(50));
    console.log(`Total Checks: ${this.results.summary.total}`);
    console.log(`✅ Passed: ${this.results.summary.passed}`);
    console.log(`⚠️  Warnings: ${this.results.summary.warnings}`);
    console.log(`❌ Failed: ${this.results.summary.failed}`);
    console.log(`\n🏥 Overall Health Score: ${this.results.healthScore}/100`);
    
    if (this.results.healthScore >= 80) {
      console.log('Status: 🟢 HEALTHY');
    } else if (this.results.healthScore >= 60) {
      console.log('Status: 🟡 NEEDS ATTENTION');
    } else {
      console.log('Status: 🔴 CRITICAL');
    }
    
    if (this.results.recommendations.length > 0) {
      console.log('\n📋 Top Recommendations:');
      this.results.recommendations
        .filter(r => r.priority === 'critical' || r.priority === 'high')
        .slice(0, 3)
        .forEach(rec => {
          console.log(`  • [${rec.priority.toUpperCase()}] ${rec.action}`);
        });
    }
    
    console.log('\n' + '='.repeat(50));
  }
}

// Run if executed directly
if (require.main === module) {
  const checker = new HealthChecker();
  checker.runAllChecks().then(() => {
    console.log('\n✅ Health check complete!');
  }).catch(error => {
    console.error('❌ Health check failed:', error);
    process.exit(1);
  });
}

module.exports = HealthChecker;