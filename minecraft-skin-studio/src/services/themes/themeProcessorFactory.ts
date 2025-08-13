/**
 * Theme Processor Factory
 * Creates appropriate theme processor based on detected theme
 */

import { ThemeProcessor, BaseThemeProcessor } from './ThemeProcessor';
import { FantasyThemeProcessor } from './FantasyThemeProcessor';
import { SciFiThemeProcessor } from './SciFiThemeProcessor';
import { MedievalThemeProcessor } from './MedievalThemeProcessor';
import { ModernThemeProcessor } from './ModernThemeProcessor';
import { KnightThemeProcessor } from './processors/knightThemeProcessor';
import { RobotThemeProcessor } from './processors/robotThemeProcessor';
import { WizardThemeProcessor } from './processors/wizardThemeProcessor';
import { NinjaThemeProcessor } from './processors/ninjaThemeProcessor';
import { PirateThemeProcessor } from './processors/pirateThemeProcessor';
import { VikingThemeProcessor } from './processors/vikingThemeProcessor';
import { CyberpunkThemeProcessor } from './processors/cyberpunkThemeProcessor';
import { NatureThemeProcessor } from './processors/natureThemeProcessor';
import { FireThemeProcessor } from './processors/fireThemeProcessor';
import { IceThemeProcessor } from './processors/iceThemeProcessor';
import { DefaultThemeProcessor } from './processors/defaultThemeProcessor';

export class ThemeProcessorFactory {
  private static instance: ThemeProcessorFactory;
  private processors: Map<string, () => ThemeProcessor> = new Map();

  private constructor() {
    // New ThemeProcessor-based processors (use HTMLCanvasElement)
    this.processors.set('fantasy', () => new FantasyThemeProcessor());
    this.processors.set('scifi', () => new SciFiThemeProcessor());
    this.processors.set('sci-fi', () => new SciFiThemeProcessor());
    this.processors.set('science-fiction', () => new SciFiThemeProcessor());
    this.processors.set('medieval', () => new MedievalThemeProcessor());
    this.processors.set('modern', () => new ModernThemeProcessor());
    this.processors.set('contemporary', () => new ModernThemeProcessor());
    this.processors.set('urban', () => new ModernThemeProcessor());
    
    // Legacy BaseThemeProcessor-based processors (use CanvasRenderingContext2D)
    // Note: These need to be wrapped to work with the new ThemeProcessor interface
    this.processors.set('knight', () => this.wrapLegacyProcessor(new KnightThemeProcessor()));
    this.processors.set('robot', () => this.wrapLegacyProcessor(new RobotThemeProcessor()));
    this.processors.set('space', () => this.wrapLegacyProcessor(new RobotThemeProcessor())); // Reuse robot for space theme
    this.processors.set('wizard', () => this.wrapLegacyProcessor(new WizardThemeProcessor()));
    this.processors.set('ninja', () => this.wrapLegacyProcessor(new NinjaThemeProcessor()));
    this.processors.set('pirate', () => this.wrapLegacyProcessor(new PirateThemeProcessor()));
    this.processors.set('viking', () => this.wrapLegacyProcessor(new VikingThemeProcessor()));
    this.processors.set('cyberpunk', () => this.wrapLegacyProcessor(new CyberpunkThemeProcessor()));
    this.processors.set('nature', () => this.wrapLegacyProcessor(new NatureThemeProcessor()));
    this.processors.set('fire', () => this.wrapLegacyProcessor(new FireThemeProcessor()));
    this.processors.set('ice', () => this.wrapLegacyProcessor(new IceThemeProcessor()));
    this.processors.set('character', () => this.wrapLegacyProcessor(new DefaultThemeProcessor()));
    this.processors.set('default', () => this.wrapLegacyProcessor(new DefaultThemeProcessor()));
  }

  static getInstance(): ThemeProcessorFactory {
    if (!ThemeProcessorFactory.instance) {
      ThemeProcessorFactory.instance = new ThemeProcessorFactory();
    }
    return ThemeProcessorFactory.instance;
  }

  /**
   * Get processor for a specific theme
   */
  getProcessor(theme: string): ThemeProcessor {
    const processorFactory = this.processors.get(theme.toLowerCase());
    
    if (!processorFactory) {
      console.warn(`No processor found for theme: ${theme}, using default`);
      return this.wrapLegacyProcessor(new DefaultThemeProcessor());
    }
    
    return processorFactory();
  }

  /**
   * Register a custom theme processor
   */
  registerProcessor(theme: string, processorFactory: () => ThemeProcessor): void {
    this.processors.set(theme.toLowerCase(), processorFactory);
  }

  /**
   * Get list of available themes
   */
  getAvailableThemes(): string[] {
    return Array.from(this.processors.keys());
  }

  /**
   * Check if a theme is supported
   */
  isThemeSupported(theme: string): boolean {
    return this.processors.has(theme.toLowerCase());
  }

  /**
   * Wrap legacy BaseThemeProcessor to work with new ThemeProcessor interface
   */
  private wrapLegacyProcessor(legacyProcessor: BaseThemeProcessor): ThemeProcessor {
    return new LegacyThemeProcessorWrapper(legacyProcessor);
  }
}

/**
 * Wrapper class to adapt BaseThemeProcessor to ThemeProcessor interface
 */
class LegacyThemeProcessorWrapper extends ThemeProcessor {
  private legacyProcessor: BaseThemeProcessor;

  constructor(legacyProcessor: BaseThemeProcessor) {
    const metadata = {
      name: legacyProcessor.getName(),
      description: legacyProcessor.getDescription(),
      complexity: 'medium' as const,
      processingTime: 100
    };

    const colors = {
      primary: '#4CAF50',
      secondary: '#2196F3',
      accent: '#FF9800',
      skin: '#F9DCC4',
      hair: '#4A3C28',
      eyes: '#4169E1',
      clothing: ['#4CAF50', '#2196F3'],
      accessories: ['#FF9800', '#9C27B0']
    };

    super(metadata, colors);
    this.legacyProcessor = legacyProcessor;
  }

  process(canvas: HTMLCanvasElement, options?: any): HTMLCanvasElement {
    const ctx = canvas.getContext('2d')!;
    
    // Create a simple design object for legacy processors
    const design = {
      theme: this.legacyProcessor.getName(),
      description: this.legacyProcessor.getDescription(),
      colors: {
        primary: this.colors.primary,
        secondary: this.colors.secondary,
        accent: this.colors.accent,
        skin: this.colors.skin,
        hair: this.colors.hair
      },
      features: []
    };
    
    // Call the legacy processor
    this.legacyProcessor.process(ctx, design);
    
    return canvas;
  }
}