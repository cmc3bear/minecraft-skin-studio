/**
 * Performance Benchmark for Skin Generation
 * Measures current performance before optimization
 */

import { advancedSkinGenerator } from './advancedSkinGenerator';

interface BenchmarkResult {
  function: string;
  averageTime: number;
  minTime: number;
  maxTime: number;
  iterations: number;
  timestamp: string;
}

class SkinGeneratorBenchmark {
  private results: BenchmarkResult[] = [];

  /**
   * Run benchmark for a specific function
   */
  async runBenchmark(
    name: string,
    fn: () => Promise<any> | any,
    iterations: number = 100
  ): Promise<BenchmarkResult> {
    const times: number[] = [];
    
    // Warm up (5 iterations)
    for (let i = 0; i < 5; i++) {
      await fn();
    }

    // Actual benchmark
    for (let i = 0; i < iterations; i++) {
      const start = performance.now();
      await fn();
      const end = performance.now();
      times.push(end - start);
    }

    const result: BenchmarkResult = {
      function: name,
      averageTime: times.reduce((a, b) => a + b, 0) / times.length,
      minTime: Math.min(...times),
      maxTime: Math.max(...times),
      iterations,
      timestamp: new Date().toISOString()
    };

    this.results.push(result);
    return result;
  }

  /**
   * Benchmark theme detection for different themes
   */
  async benchmarkThemeDetection() {
    const themes = ['Fantasy', 'SciFi', 'Medieval', 'Modern', 'Nature', 'Cyberpunk'];
    const mockImageData = this.createMockImageData(64, 64);

    for (const theme of themes) {
      await this.runBenchmark(
        `Theme Detection - ${theme}`,
        () => {
          // This will measure the theme detection part
          const canvas = document.createElement('canvas');
          canvas.width = 64;
          canvas.height = 64;
          const ctx = canvas.getContext('2d')!;
          ctx.putImageData(mockImageData, 0, 0);
          
          return advancedSkinGenerator(theme, canvas);
        },
        20
      );
    }
  }

  /**
   * Benchmark pixel manipulation performance
   */
  async benchmarkPixelManipulation() {
    const sizes = [
      { width: 32, height: 32, name: 'Small' },
      { width: 64, height: 64, name: 'Standard' },
      { width: 128, height: 128, name: 'Large' }
    ];

    for (const size of sizes) {
      const mockImageData = this.createMockImageData(size.width, size.height);
      
      await this.runBenchmark(
        `Pixel Manipulation - ${size.name} (${size.width}x${size.height})`,
        () => {
          const data = mockImageData.data;
          // Simulate pixel manipulation
          for (let i = 0; i < data.length; i += 4) {
            data[i] = (data[i] + 10) % 255;     // R
            data[i + 1] = (data[i + 1] + 10) % 255; // G
            data[i + 2] = (data[i + 2] + 10) % 255; // B
          }
        },
        50
      );
    }
  }

  /**
   * Benchmark full skin generation pipeline
   */
  async benchmarkFullPipeline() {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d')!;
    
    // Create a simple test pattern
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(0, 0, 64, 64);
    ctx.fillStyle = '#FFB6C1';
    ctx.fillRect(8, 8, 16, 16);
    ctx.fillRect(40, 8, 16, 16);

    await this.runBenchmark(
      'Full Pipeline - advancedSkinGenerator',
      () => advancedSkinGenerator('Fantasy', canvas),
      10
    );
  }

  /**
   * Create mock image data for testing
   */
  private createMockImageData(width: number, height: number): ImageData {
    const data = new Uint8ClampedArray(width * height * 4);
    for (let i = 0; i < data.length; i += 4) {
      data[i] = Math.random() * 255;     // R
      data[i + 1] = Math.random() * 255; // G
      data[i + 2] = Math.random() * 255; // B
      data[i + 3] = 255;                 // A
    }
    return new ImageData(data, width, height);
  }

  /**
   * Generate benchmark report
   */
  generateReport(): string {
    let report = '# Skin Generator Performance Benchmark Report\n\n';
    report += `Generated: ${new Date().toISOString()}\n\n`;
    report += '## Results\n\n';
    report += '| Function | Avg (ms) | Min (ms) | Max (ms) | Iterations |\n';
    report += '|----------|----------|----------|----------|------------|\n';

    for (const result of this.results) {
      report += `| ${result.function} | ${result.averageTime.toFixed(2)} | ${result.minTime.toFixed(2)} | ${result.maxTime.toFixed(2)} | ${result.iterations} |\n`;
    }

    report += '\n## Performance Baseline\n\n';
    report += this.analyzeResults();

    return report;
  }

  /**
   * Analyze results and provide insights
   */
  private analyzeResults(): string {
    let analysis = '';
    
    const avgTimes = this.results.map(r => r.averageTime);
    const overallAvg = avgTimes.reduce((a, b) => a + b, 0) / avgTimes.length;
    
    analysis += `- Overall average execution time: ${overallAvg.toFixed(2)}ms\n`;
    
    const slowest = this.results.reduce((prev, curr) => 
      prev.averageTime > curr.averageTime ? prev : curr
    );
    analysis += `- Slowest operation: ${slowest.function} (${slowest.averageTime.toFixed(2)}ms)\n`;
    
    const fastest = this.results.reduce((prev, curr) => 
      prev.averageTime < curr.averageTime ? prev : curr
    );
    analysis += `- Fastest operation: ${fastest.function} (${fastest.averageTime.toFixed(2)}ms)\n`;
    
    // Check for performance issues
    const problematic = this.results.filter(r => r.averageTime > 100);
    if (problematic.length > 0) {
      analysis += '\n### ⚠️ Performance Issues Detected\n';
      problematic.forEach(p => {
        analysis += `- ${p.function}: ${p.averageTime.toFixed(2)}ms exceeds 100ms threshold\n`;
      });
    }

    return analysis;
  }

  /**
   * Save results to localStorage for comparison
   */
  saveBaseline() {
    const baseline = {
      timestamp: new Date().toISOString(),
      results: this.results
    };
    localStorage.setItem('skinGenerator_baseline', JSON.stringify(baseline));
    console.log('Baseline saved to localStorage');
  }

  /**
   * Compare current results with baseline
   */
  compareWithBaseline(): string {
    const baselineStr = localStorage.getItem('skinGenerator_baseline');
    if (!baselineStr) {
      return 'No baseline found for comparison';
    }

    const baseline = JSON.parse(baselineStr);
    let comparison = '## Performance Comparison\n\n';
    comparison += '| Function | Baseline (ms) | Current (ms) | Change (%) |\n';
    comparison += '|----------|---------------|--------------|------------|\n';

    for (const current of this.results) {
      const baselineResult = baseline.results.find((r: BenchmarkResult) => r.function === current.function);
      if (baselineResult) {
        const change = ((current.averageTime - baselineResult.averageTime) / baselineResult.averageTime) * 100;
        const changeStr = change > 0 ? `+${change.toFixed(1)}%` : `${change.toFixed(1)}%`;
        const emoji = change < -10 ? '✅' : change > 10 ? '❌' : '➖';
        comparison += `| ${current.function} | ${baselineResult.averageTime.toFixed(2)} | ${current.averageTime.toFixed(2)} | ${changeStr} ${emoji} |\n`;
      }
    }

    return comparison;
  }
}

// Export for use in tests and benchmarking
export { SkinGeneratorBenchmark, BenchmarkResult };

// Run benchmark if executed directly
if (import.meta.url === `file://${__filename}`) {
  (async () => {
    console.log('🚀 Starting Skin Generator Benchmark...\n');
    
    const benchmark = new SkinGeneratorBenchmark();
    
    console.log('📊 Running theme detection benchmark...');
    await benchmark.benchmarkThemeDetection();
    
    console.log('📊 Running pixel manipulation benchmark...');
    await benchmark.benchmarkPixelManipulation();
    
    console.log('📊 Running full pipeline benchmark...');
    await benchmark.benchmarkFullPipeline();
    
    const report = benchmark.generateReport();
    console.log('\n' + report);
    
    benchmark.saveBaseline();
    
    console.log('\n✅ Benchmark complete!');
  })();
}