/**
 * Unit tests for ThemeDetector
 */

import { ThemeDetector } from '../themeDetector';

describe('ThemeDetector', () => {
  let detector: ThemeDetector;

  beforeEach(() => {
    detector = ThemeDetector.getInstance();
  });

  describe('analyzePrompt', () => {
    it('should detect knight theme from keywords', () => {
      const prompts = [
        'knight in shining armor',
        'medieval warrior',
        'crusader with sword',
        'armored paladin'
      ];

      prompts.forEach(prompt => {
        const result = detector.analyzePrompt(prompt);
        expect(result.theme).toBe('knight');
        expect(result.colors.primary).toBe('#708090');
        expect(result.features).toContain('helmet');
      });
    });

    it('should detect robot theme from keywords', () => {
      const prompts = [
        'robot with blue lights',
        'android assistant',
        'mechanical cyborg',
        'AI bot'
      ];

      prompts.forEach(prompt => {
        const result = detector.analyzePrompt(prompt);
        expect(result.theme).toBe('robot');
        expect(result.colors.primary).toBe('#C0C0C0');
        expect(result.features).toContain('antenna');
      });
    });

    it('should detect wizard theme from keywords', () => {
      const prompts = [
        'wizard with purple robes',
        'magic mage',
        'sorcerer casting spells',
        'mystic enchanter'
      ];

      prompts.forEach(prompt => {
        const result = detector.analyzePrompt(prompt);
        expect(result.theme).toBe('wizard');
        expect(result.colors.primary).toBe('#4B0082');
        expect(result.features).toContain('hat');
      });
    });

    it('should detect ninja theme from keywords', () => {
      const prompts = [
        'ninja in black',
        'stealthy shinobi',
        'shadow assassin',
        'martial artist'
      ];

      prompts.forEach(prompt => {
        const result = detector.analyzePrompt(prompt);
        expect(result.theme).toBe('ninja');
        expect(result.colors.primary).toBe('#000000');
        expect(result.features).toContain('mask');
      });
    });

    it('should detect space theme and map to robot', () => {
      const prompts = [
        'astronaut in space',
        'cosmic explorer',
        'nasa scientist'
      ];

      prompts.forEach(prompt => {
        const result = detector.analyzePrompt(prompt);
        expect(result.theme).toBe('space');
        expect(result.colors.primary).toBe('#FFFFFF');
      });
    });

    it('should detect fire theme from keywords', () => {
      const prompts = [
        'fire mage',
        'flame warrior',
        'phoenix rising',
        'burning inferno'
      ];

      prompts.forEach(prompt => {
        const result = detector.analyzePrompt(prompt);
        expect(result.theme).toBe('fire');
        expect(result.colors.primary).toBe('#FF4500');
        expect(result.features).toContain('flames');
      });
    });

    it('should detect ice theme from keywords', () => {
      const prompts = [
        'ice queen',
        'frost wizard',
        'frozen warrior',
        'crystal snow mage'
      ];

      prompts.forEach(prompt => {
        const result = detector.analyzePrompt(prompt);
        expect(result.theme).toBe('ice');
        expect(result.colors.primary).toBe('#00BFFF');
        expect(result.features).toContain('frost');
      });
    });

    it('should infer theme from color mentions when no strong keyword match', () => {
      const colorTests = [
        { prompt: 'character in green clothes', expectedTheme: 'nature' },
        { prompt: 'red warrior', expectedTheme: 'fire' },
        { prompt: 'blue mage', expectedTheme: 'ice' },
        { prompt: 'dark shadow', expectedTheme: 'ninja' },
        { prompt: 'golden hero', expectedTheme: 'knight' },
        { prompt: 'purple mystic', expectedTheme: 'wizard' }
      ];

      colorTests.forEach(test => {
        const result = detector.analyzePrompt(test.prompt);
        expect(result.theme).toBe(test.expectedTheme);
      });
    });

    it('should default to character theme for ambiguous prompts', () => {
      const prompts = [
        'cool person',
        'awesome dude',
        'random character'
      ];

      prompts.forEach(prompt => {
        const result = detector.analyzePrompt(prompt);
        expect(result.theme).toBe('character');
        expect(result.colors.primary).toBe('#4CAF50');
      });
    });

    it('should handle mixed case prompts', () => {
      const prompts = [
        'KNIGHT in ARMOR',
        'RoBoT aNdRoId',
        'WiZaRd MaGiC'
      ];

      const expectedThemes = ['knight', 'robot', 'wizard'];

      prompts.forEach((prompt, index) => {
        const result = detector.analyzePrompt(prompt);
        expect(result.theme).toBe(expectedThemes[index]);
      });
    });

    it('should generate appropriate descriptions', () => {
      const tests = [
        { prompt: 'knight', expected: 'A noble warrior in shining armor' },
        { prompt: 'robot', expected: 'A mechanical being with advanced technology' },
        { prompt: 'wizard', expected: 'A master of the arcane arts' }
      ];

      tests.forEach(test => {
        const result = detector.analyzePrompt(test.prompt);
        expect(result.description).toBe(test.expected);
      });
    });
  });

  describe('addCustomTheme', () => {
    it('should allow adding custom themes', () => {
      const customColors = {
        primary: '#FF00FF',
        secondary: '#00FF00',
        accent: '#0000FF',
        skin: '#F9DCC4',
        hair: '#000000'
      };

      detector.addCustomTheme(
        'superhero',
        ['hero', 'super', 'cape', 'mask'],
        customColors,
        ['cape', 'mask', 'emblem']
      );

      const result = detector.analyzePrompt('superhero with cape');
      expect(result.theme).toBe('superhero');
      expect(result.colors).toEqual(customColors);
      expect(result.features).toContain('cape');
    });
  });

  describe('singleton pattern', () => {
    it('should return the same instance', () => {
      const instance1 = ThemeDetector.getInstance();
      const instance2 = ThemeDetector.getInstance();
      expect(instance1).toBe(instance2);
    });
  });
});