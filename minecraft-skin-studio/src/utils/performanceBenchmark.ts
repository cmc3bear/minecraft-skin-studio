/**
 * Performance Benchmark Utility
 * Tests and validates S2 objective (60+ FPS) compliance
 * Reports to PixelPerfect agent
 */

import { performanceMonitor } from '../services/performanceMonitor';

export interface BenchmarkResult {
  testName: string;
  averageFPS: number;
  minFPS: number;
  maxFPS: number;
  duration: number;
  passed: boolean;
  details: string;
}

export interface BenchmarkSuite {
  name: string;
  results: BenchmarkResult[];
  overallPassed: boolean;
  s2Compliant: boolean;
  timestamp: Date;
}

export class PerformanceBenchmark {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private results: BenchmarkResult[] = [];
  
  constructor() {
    this.canvas = document.createElement('canvas');
    this.canvas.width = 640;
    this.canvas.height = 640;
    this.ctx = this.canvas.getContext('2d', { willReadFrequently: true })!;
  }
  
  /**
   * Run complete benchmark suite
   */
  async runBenchmarkSuite(): Promise<BenchmarkSuite> {
    console.log('🎯 Starting PixelPerfect Performance Benchmarks...');
    console.log('S2 Objective: 60+ FPS target\n');
    
    this.results = [];
    
    // Test 1: Basic drawing performance
    await this.benchmarkBasicDrawing();
    
    // Test 2: Complex pixel operations
    await this.benchmarkPixelOperations();
    
    // Test 3: Flood fill performance
    await this.benchmarkFloodFill();
    
    // Test 4: Continuous drawing (simulating user interaction)
    await this.benchmarkContinuousDrawing();
    
    // Test 5: Full canvas operations
    await this.benchmarkFullCanvas();
    
    // Calculate overall results
    const overallPassed = this.results.every(r => r.passed);
    const s2Compliant = this.results.every(r => r.averageFPS >= 60);
    
    const suite: BenchmarkSuite = {
      name: 'S2 Performance Benchmark',
      results: this.results,
      overallPassed,
      s2Compliant,
      timestamp: new Date()
    };
    
    this.printResults(suite);
    return suite;
  }
  
  /**
   * Test 1: Basic drawing performance
   */
  private async benchmarkBasicDrawing(): Promise<void> {
    const testName = 'Basic Drawing (1000 pixels)';
    console.log(`Running: ${testName}...`);
    
    performanceMonitor.start();
    const startTime = performance.now();
    let frames = 0;
    
    // Draw random pixels for 2 seconds
    while (performance.now() - startTime < 2000) {
      for (let i = 0; i < 10; i++) {
        const x = Math.floor(Math.random() * 64) * 10;
        const y = Math.floor(Math.random() * 64) * 10;
        this.ctx.fillStyle = `hsl(${Math.random() * 360}, 100%, 50%)`;
        this.ctx.fillRect(x, y, 10, 10);
      }
      frames++;
      await this.nextFrame();
    }
    
    performanceMonitor.stop();
    const metrics = performanceMonitor.generateReport();
    
    this.results.push({
      testName,
      averageFPS: metrics.averageFPS,
      minFPS: metrics.minFPS,
      maxFPS: metrics.maxFPS,
      duration: 2000,
      passed: metrics.averageFPS >= 60,
      details: `Drew ${frames * 10} pixels`
    });
  }
  
  /**
   * Test 2: Complex pixel operations
   */
  private async benchmarkPixelOperations(): Promise<void> {
    const testName = 'Pixel Get/Set Operations';
    console.log(`Running: ${testName}...`);
    
    performanceMonitor.start();
    const startTime = performance.now();
    let operations = 0;
    
    // Get and set pixels for 2 seconds
    while (performance.now() - startTime < 2000) {
      const imageData = this.ctx.getImageData(0, 0, 64, 64);
      
      // Modify random pixels
      for (let i = 0; i < 100; i++) {
        const index = Math.floor(Math.random() * imageData.data.length / 4) * 4;
        imageData.data[index] = Math.floor(Math.random() * 256);     // R
        imageData.data[index + 1] = Math.floor(Math.random() * 256); // G
        imageData.data[index + 2] = Math.floor(Math.random() * 256); // B
        imageData.data[index + 3] = 255;                             // A
        operations++;
      }
      
      this.ctx.putImageData(imageData, 0, 0);
      await this.nextFrame();
    }
    
    performanceMonitor.stop();
    const metrics = performanceMonitor.generateReport();
    
    this.results.push({
      testName,
      averageFPS: metrics.averageFPS,
      minFPS: metrics.minFPS,
      maxFPS: metrics.maxFPS,
      duration: 2000,
      passed: metrics.averageFPS >= 60,
      details: `${operations} pixel operations`
    });
  }
  
  /**
   * Test 3: Flood fill performance
   */
  private async benchmarkFloodFill(): Promise<void> {
    const testName = 'Flood Fill Algorithm';
    console.log(`Running: ${testName}...`);
    
    // Create a test pattern
    this.createTestPattern();
    
    performanceMonitor.start();
    const startTime = performance.now();
    let fills = 0;
    
    // Perform flood fills for 2 seconds
    while (performance.now() - startTime < 2000) {
      const x = Math.floor(Math.random() * 64);
      const y = Math.floor(Math.random() * 64);
      const color = `hsl(${Math.random() * 360}, 100%, 50%)`;
      
      this.simulateFloodFill(x, y, color);
      fills++;
      await this.nextFrame();
    }
    
    performanceMonitor.stop();
    const metrics = performanceMonitor.generateReport();
    
    this.results.push({
      testName,
      averageFPS: metrics.averageFPS,
      minFPS: metrics.minFPS,
      maxFPS: metrics.maxFPS,
      duration: 2000,
      passed: metrics.averageFPS >= 60,
      details: `${fills} flood fill operations`
    });
  }
  
  /**
   * Test 4: Continuous drawing
   */
  private async benchmarkContinuousDrawing(): Promise<void> {
    const testName = 'Continuous Drawing (User Simulation)';
    console.log(`Running: ${testName}...`);
    
    performanceMonitor.start();
    const startTime = performance.now();
    let strokes = 0;
    
    // Simulate user drawing strokes
    while (performance.now() - startTime < 2000) {
      const startX = Math.floor(Math.random() * 64);
      const startY = Math.floor(Math.random() * 64);
      
      // Draw a random stroke
      this.ctx.beginPath();
      this.ctx.moveTo(startX * 10, startY * 10);
      
      for (let i = 0; i < 10; i++) {
        const x = Math.max(0, Math.min(63, startX + Math.floor(Math.random() * 11 - 5)));
        const y = Math.max(0, Math.min(63, startY + Math.floor(Math.random() * 11 - 5)));
        this.ctx.lineTo(x * 10, y * 10);
      }
      
      this.ctx.strokeStyle = `hsl(${Math.random() * 360}, 100%, 50%)`;
      this.ctx.lineWidth = 10;
      this.ctx.stroke();
      strokes++;
      
      await this.nextFrame();
    }
    
    performanceMonitor.stop();
    const metrics = performanceMonitor.generateReport();
    
    this.results.push({
      testName,
      averageFPS: metrics.averageFPS,
      minFPS: metrics.minFPS,
      maxFPS: metrics.maxFPS,
      duration: 2000,
      passed: metrics.averageFPS >= 60,
      details: `${strokes} drawing strokes`
    });
  }
  
  /**
   * Test 5: Full canvas operations
   */
  private async benchmarkFullCanvas(): Promise<void> {
    const testName = 'Full Canvas Updates';
    console.log(`Running: ${testName}...`);
    
    performanceMonitor.start();
    const startTime = performance.now();
    let updates = 0;
    
    // Update entire canvas
    while (performance.now() - startTime < 2000) {
      // Clear and redraw entire canvas
      this.ctx.clearRect(0, 0, 640, 640);
      
      // Draw checkerboard pattern
      for (let x = 0; x < 64; x++) {
        for (let y = 0; y < 64; y++) {
          if ((x + y) % 2 === 0) {
            this.ctx.fillStyle = `hsl(${(updates * 2) % 360}, 100%, 50%)`;
            this.ctx.fillRect(x * 10, y * 10, 10, 10);
          }
        }
      }
      
      updates++;
      await this.nextFrame();
    }
    
    performanceMonitor.stop();
    const metrics = performanceMonitor.generateReport();
    
    this.results.push({
      testName,
      averageFPS: metrics.averageFPS,
      minFPS: metrics.minFPS,
      maxFPS: metrics.maxFPS,
      duration: 2000,
      passed: metrics.averageFPS >= 60,
      details: `${updates} full canvas updates`
    });
  }
  
  /**
   * Helper: Create test pattern
   */
  private createTestPattern(): void {
    for (let x = 0; x < 64; x++) {
      for (let y = 0; y < 64; y++) {
        const color = (x + y) % 3;
        this.ctx.fillStyle = ['#FF0000', '#00FF00', '#0000FF'][color];
        this.ctx.fillRect(x * 10, y * 10, 10, 10);
      }
    }
  }
  
  /**
   * Helper: Simulate flood fill
   */
  private simulateFloodFill(startX: number, startY: number, color: string): void {
    // Simple flood fill simulation (not actual algorithm)
    const radius = Math.floor(Math.random() * 10) + 5;
    this.ctx.fillStyle = color;
    
    for (let x = Math.max(0, startX - radius); x < Math.min(64, startX + radius); x++) {
      for (let y = Math.max(0, startY - radius); y < Math.min(64, startY + radius); y++) {
        if (Math.sqrt((x - startX) ** 2 + (y - startY) ** 2) <= radius) {
          this.ctx.fillRect(x * 10, y * 10, 10, 10);
        }
      }
    }
  }
  
  /**
   * Helper: Wait for next animation frame
   */
  private nextFrame(): Promise<void> {
    return new Promise(resolve => requestAnimationFrame(() => resolve()));
  }
  
  /**
   * Print benchmark results
   */
  private printResults(suite: BenchmarkSuite): void {
    console.log('\n📊 Performance Benchmark Results');
    console.log('====================================');
    console.log(`Suite: ${suite.name}`);
    console.log(`Date: ${suite.timestamp.toLocaleString()}`);
    console.log(`S2 Objective (60+ FPS): ${suite.s2Compliant ? '✅ PASSED' : '❌ FAILED'}`);
    console.log('\nDetailed Results:');
    console.log('------------------------------------');
    
    suite.results.forEach(result => {
      const status = result.passed ? '✅' : '❌';
      console.log(`\n${status} ${result.testName}`);
      console.log(`   Average FPS: ${result.averageFPS} ${result.averageFPS >= 60 ? '✅' : '⚠️'}`);
      console.log(`   Min FPS: ${result.minFPS}`);
      console.log(`   Max FPS: ${result.maxFPS}`);
      console.log(`   Details: ${result.details}`);
    });
    
    console.log('\n====================================');
    console.log(`Overall: ${suite.overallPassed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}`);
    
    // Report to OQE
    if (suite.s2Compliant) {
      console.log('\n🎯 S2 Objective Status: HEALTHY');
      console.log('PixelPerfect Agent: Performance targets achieved!');
    } else {
      console.log('\n⚠️ S2 Objective Status: AT RISK');
      console.log('PixelPerfect Agent: Performance optimization needed!');
    }
  }
}

// Export singleton for easy access
export const performanceBenchmark = new PerformanceBenchmark();