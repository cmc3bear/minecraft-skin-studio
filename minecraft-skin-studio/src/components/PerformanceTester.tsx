/**
 * Performance Tester Component
 * UI for running performance benchmarks
 * PixelPerfect agent requirement for S2 objective validation
 */

import React, { useState } from 'react';
import { performanceBenchmark, BenchmarkSuite } from '../utils/performanceBenchmark';
import './PerformanceTester.css';

interface PerformanceTesterProps {
  onClose: () => void;
}

export default function PerformanceTester({ onClose }: PerformanceTesterProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<BenchmarkSuite | null>(null);
  const [progress, setProgress] = useState(0);
  
  const runBenchmarks = async () => {
    setIsRunning(true);
    setProgress(0);
    
    // Simulate progress updates
    const progressInterval = setInterval(() => {
      setProgress(prev => Math.min(prev + 10, 90));
    }, 1000);
    
    try {
      const benchmarkResults = await performanceBenchmark.runBenchmarkSuite();
      setResults(benchmarkResults);
      setProgress(100);
    } catch (error) {
      console.error('Benchmark failed:', error);
    } finally {
      clearInterval(progressInterval);
      setIsRunning(false);
    }
  };
  
  const exportResults = () => {
    if (!results) return;
    
    const report = {
      suite: results.name,
      timestamp: results.timestamp,
      s2Compliant: results.s2Compliant,
      results: results.results.map(r => ({
        test: r.testName,
        avgFPS: r.averageFPS,
        minFPS: r.minFPS,
        maxFPS: r.maxFPS,
        passed: r.passed,
        details: r.details
      }))
    };
    
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `performance-benchmark-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };
  
  return (
    <div className="performance-tester-modal">
      <div className="tester-container">
        <div className="tester-header">
          <h2>🎯 Performance Benchmark</h2>
          <button onClick={onClose} className="close-button" aria-label="Close">✕</button>
        </div>
        
        <div className="tester-content">
          {!isRunning && !results && (
            <div className="start-section">
              <h3>S2 Objective Validation</h3>
              <p>This benchmark will test various drawing operations to ensure the application maintains 60+ FPS.</p>
              
              <div className="test-list">
                <h4>Tests to run:</h4>
                <ul>
                  <li>✏️ Basic Drawing Performance</li>
                  <li>🎨 Pixel Get/Set Operations</li>
                  <li>🪣 Flood Fill Algorithm</li>
                  <li>✍️ Continuous Drawing Simulation</li>
                  <li>📋 Full Canvas Updates</li>
                </ul>
              </div>
              
              <div className="warning-box">
                <p>⚠️ The benchmark will take approximately 10 seconds to complete.</p>
                <p>Please don't interact with the app during testing.</p>
              </div>
              
              <button 
                onClick={runBenchmarks} 
                className="start-button"
                aria-label="Start performance benchmark"
              >
                🚀 Start Benchmark
              </button>
            </div>
          )}
          
          {isRunning && (
            <div className="progress-section">
              <h3>Running Benchmarks...</h3>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${progress}%` }}
                  role="progressbar"
                  aria-valuenow={progress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                />
              </div>
              <p className="progress-text">{progress}% Complete</p>
              <div className="spinner" aria-label="Loading" />
            </div>
          )}
          
          {results && (
            <div className="results-section">
              <div className={`overall-result ${results.s2Compliant ? 'passed' : 'failed'}`}>
                <h3>Overall Result: {results.s2Compliant ? '✅ PASSED' : '❌ FAILED'}</h3>
                <p>S2 Objective (60+ FPS): {results.s2Compliant ? 'Achieved' : 'Not Met'}</p>
              </div>
              
              <div className="detailed-results">
                <h4>Detailed Results:</h4>
                {results.results.map((result, index) => (
                  <div 
                    key={index} 
                    className={`result-item ${result.passed ? 'passed' : 'failed'}`}
                  >
                    <div className="result-header">
                      <span className="result-icon">{result.passed ? '✅' : '❌'}</span>
                      <span className="result-name">{result.testName}</span>
                    </div>
                    <div className="result-stats">
                      <div className="stat">
                        <label>Avg FPS:</label>
                        <span className={result.averageFPS >= 60 ? 'good' : 'bad'}>
                          {result.averageFPS}
                        </span>
                      </div>
                      <div className="stat">
                        <label>Min FPS:</label>
                        <span>{result.minFPS}</span>
                      </div>
                      <div className="stat">
                        <label>Max FPS:</label>
                        <span>{result.maxFPS}</span>
                      </div>
                    </div>
                    <div className="result-details">{result.details}</div>
                  </div>
                ))}
              </div>
              
              <div className="actions">
                <button 
                  onClick={runBenchmarks} 
                  className="rerun-button"
                  aria-label="Run benchmark again"
                >
                  🔄 Run Again
                </button>
                <button 
                  onClick={exportResults} 
                  className="export-button"
                  aria-label="Export results as JSON"
                >
                  📥 Export Results
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}