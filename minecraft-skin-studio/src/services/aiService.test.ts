/**
 * AI Service Tests
 * Validates S1 (Safety) and S3 (Response Time) objectives
 */

import { aiService } from './aiService';

describe('AI Service', () => {
  describe('S1 Objective: Zero Safety Incidents', () => {
    test('should block inappropriate content', async () => {
      const unsafePrompts = [
        'violent warrior with blood',
        'scary monster that kills',
        'weapon of death',
        'disturbing adult content'
      ];

      for (const prompt of unsafePrompts) {
        const safety = await aiService.validateContentSafety(prompt);
        expect(safety.safe).toBe(false);
        expect(safety.reason).toBeDefined();
        expect(safety.violations).toBeDefined();
        console.log(`🛡️ Blocked: "${prompt}" - ${safety.reason}`);
      }
    });

    test('should allow safe content', async () => {
      const safePrompts = [
        'friendly dragon with blue scales',
        'superhero with colorful cape',
        'cute animal with sparkles',
        'magical wizard with stars'
      ];

      for (const prompt of safePrompts) {
        const safety = await aiService.validateContentSafety(prompt);
        expect(safety.safe).toBe(true);
        console.log(`✅ Allowed: "${prompt}"`);
      }
    });
  });

  describe('S3 Objective: AI Response Time <3s', () => {
    test('should generate suggestions within 3 seconds', async () => {
      const startTime = performance.now();
      
      const suggestions = await aiService.generateSkinSuggestions('friendly dragon', 2);
      
      const responseTime = performance.now() - startTime;
      
      expect(responseTime).toBeLessThan(3000); // S3 objective
      expect(suggestions).toHaveLength(2);
      expect(suggestions[0]).toHaveProperty('id');
      expect(suggestions[0]).toHaveProperty('description');
      expect(suggestions[0]).toHaveProperty('colorPalette');
      
      console.log(`⚡ Response time: ${responseTime.toFixed(0)}ms (Target: <3000ms)`);
    });

    test('should generate color palette quickly', async () => {
      const startTime = performance.now();
      
      const palette = await aiService.generateColorPalette('minecraft', 'vibrant');
      
      const responseTime = performance.now() - startTime;
      
      expect(responseTime).toBeLessThan(1000); // Fast UI response
      expect(palette.colors).toBeDefined();
      expect(palette.colors.length).toBeGreaterThan(0);
      
      console.log(`🎨 Palette generation: ${responseTime.toFixed(0)}ms`);
    });
  });

  describe('Performance Metrics', () => {
    test('should report metrics for OQE monitoring', () => {
      const metrics = aiService.getPerformanceMetrics();
      
      expect(metrics.averageResponseTime).toBeLessThan(3000);
      expect(metrics.successRate).toBeGreaterThan(90);
      expect(metrics.safetyViolations).toBe(0); // S1 compliance
      expect(metrics.uptimePercent).toBeGreaterThan(99);
      
      console.log('📊 Performance Metrics:', metrics);
    });
  });
});