/**
 * Unit tests for ThemeProcessorFactory
 */

import { ThemeProcessorFactory } from '../themeProcessorFactory';
import { KnightThemeProcessor } from '../processors/knightThemeProcessor';
import { RobotThemeProcessor } from '../processors/robotThemeProcessor';
import { WizardThemeProcessor } from '../processors/wizardThemeProcessor';
import { DefaultThemeProcessor } from '../processors/defaultThemeProcessor';

describe('ThemeProcessorFactory', () => {
  let factory: ThemeProcessorFactory;

  beforeEach(() => {
    factory = ThemeProcessorFactory.getInstance();
  });

  describe('getProcessor', () => {
    it('should return correct processor for knight theme', () => {
      const processor = factory.getProcessor('knight');
      expect(processor).toBeInstanceOf(KnightThemeProcessor);
      expect(processor.getName()).toBe('Knight');
    });

    it('should return correct processor for robot theme', () => {
      const processor = factory.getProcessor('robot');
      expect(processor).toBeInstanceOf(RobotThemeProcessor);
      expect(processor.getName()).toBe('Robot');
    });

    it('should return correct processor for wizard theme', () => {
      const processor = factory.getProcessor('wizard');
      expect(processor).toBeInstanceOf(WizardThemeProcessor);
      expect(processor.getName()).toBe('Wizard');
    });

    it('should return robot processor for space theme', () => {
      const processor = factory.getProcessor('space');
      expect(processor).toBeInstanceOf(RobotThemeProcessor);
    });

    it('should return default processor for unknown theme', () => {
      const processor = factory.getProcessor('unknown-theme');
      expect(processor).toBeInstanceOf(DefaultThemeProcessor);
    });

    it('should handle case-insensitive theme names', () => {
      const processor1 = factory.getProcessor('KNIGHT');
      const processor2 = factory.getProcessor('Knight');
      const processor3 = factory.getProcessor('knight');
      
      expect(processor1).toBeInstanceOf(KnightThemeProcessor);
      expect(processor2).toBeInstanceOf(KnightThemeProcessor);
      expect(processor3).toBeInstanceOf(KnightThemeProcessor);
    });

    it('should create new processor instances each time', () => {
      const processor1 = factory.getProcessor('knight');
      const processor2 = factory.getProcessor('knight');
      
      expect(processor1).not.toBe(processor2);
      expect(processor1).toBeInstanceOf(KnightThemeProcessor);
      expect(processor2).toBeInstanceOf(KnightThemeProcessor);
    });
  });

  describe('getAvailableThemes', () => {
    it('should return list of available themes', () => {
      const themes = factory.getAvailableThemes();
      
      expect(themes).toContain('knight');
      expect(themes).toContain('robot');
      expect(themes).toContain('wizard');
      expect(themes).toContain('ninja');
      expect(themes).toContain('pirate');
      expect(themes).toContain('viking');
      expect(themes).toContain('cyberpunk');
      expect(themes).toContain('nature');
      expect(themes).toContain('fire');
      expect(themes).toContain('ice');
      expect(themes).toContain('default');
    });
  });

  describe('isThemeSupported', () => {
    it('should return true for supported themes', () => {
      expect(factory.isThemeSupported('knight')).toBe(true);
      expect(factory.isThemeSupported('robot')).toBe(true);
      expect(factory.isThemeSupported('wizard')).toBe(true);
      expect(factory.isThemeSupported('ninja')).toBe(true);
    });

    it('should return false for unsupported themes', () => {
      expect(factory.isThemeSupported('alien')).toBe(false);
      expect(factory.isThemeSupported('monster')).toBe(false);
      expect(factory.isThemeSupported('unknown')).toBe(false);
    });

    it('should handle case-insensitive checks', () => {
      expect(factory.isThemeSupported('KNIGHT')).toBe(true);
      expect(factory.isThemeSupported('Knight')).toBe(true);
      expect(factory.isThemeSupported('kNiGhT')).toBe(true);
    });
  });

  describe('registerProcessor', () => {
    it('should allow registering custom processors', () => {
      class CustomProcessor extends DefaultThemeProcessor {
        constructor() {
          super();
          this.name = 'Custom';
          this.description = 'Custom theme processor';
        }
      }

      factory.registerProcessor('custom', () => new CustomProcessor());
      
      expect(factory.isThemeSupported('custom')).toBe(true);
      
      const processor = factory.getProcessor('custom');
      expect(processor).toBeInstanceOf(CustomProcessor);
      expect(processor.getName()).toBe('Custom');
    });

    it('should override existing processors', () => {
      class CustomKnightProcessor extends DefaultThemeProcessor {
        constructor() {
          super();
          this.name = 'CustomKnight';
        }
      }

      factory.registerProcessor('knight', () => new CustomKnightProcessor());
      
      const processor = factory.getProcessor('knight');
      expect(processor.getName()).toBe('CustomKnight');
    });
  });

  describe('singleton pattern', () => {
    it('should return the same instance', () => {
      const instance1 = ThemeProcessorFactory.getInstance();
      const instance2 = ThemeProcessorFactory.getInstance();
      expect(instance1).toBe(instance2);
    });
  });
});