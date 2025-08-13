/**
 * Advanced AI Skin Generator
 * REFACTORED: Now uses modular architecture with Strategy pattern
 * Reduced from 385 lines to delegated modular design
 * 
 * This file maintains backward compatibility while using the new refactored implementation
 */

import { AdvancedSkinGeneratorRefactored } from './advancedSkinGeneratorRefactored';

// Re-export the SkinDesign interface for backward compatibility
export interface SkinDesign {
  theme: string;
  description: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    skin: string;
    hair: string;
  };
  features: string[];
}

/**
 * AdvancedSkinGenerator - Wrapper for backward compatibility
 * Delegates to the refactored implementation
 */
export class AdvancedSkinGenerator {
  private static instance: AdvancedSkinGenerator;
  private refactoredGenerator: AdvancedSkinGeneratorRefactored;
  
  private constructor() {
    this.refactoredGenerator = AdvancedSkinGeneratorRefactored.getInstance();
  }
  
  static getInstance(): AdvancedSkinGenerator {
    if (!AdvancedSkinGenerator.instance) {
      AdvancedSkinGenerator.instance = new AdvancedSkinGenerator();
    }
    return AdvancedSkinGenerator.instance;
  }

  /**
   * Generate a complete skin design from a text prompt
   * Now delegates to the refactored modular implementation
   */
  async generateSkinFromPrompt(prompt: string): Promise<string> {
    // Delegate to refactored implementation
    return this.refactoredGenerator.generateSkinFromPrompt(prompt);
  }

  /**
   * Get list of available themes
   */
  getAvailableThemes(): string[] {
    return this.refactoredGenerator.getAvailableThemes();
  }

  /**
   * Check if a theme is supported
   */
  isThemeSupported(theme: string): boolean {
    return this.refactoredGenerator.isThemeSupported(theme);
  }
}

// Export for testing purposes
export { AdvancedSkinGeneratorRefactored } from './advancedSkinGeneratorRefactored';
export { ThemeDetector } from './themes/themeDetector';
export { ThemeProcessorFactory } from './themes/themeProcessorFactory';
export { PixelUtils } from './utils/pixelUtils';