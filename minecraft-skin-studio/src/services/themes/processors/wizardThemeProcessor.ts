/**
 * Wizard Theme Processor
 * Generates magical wizard/mage-themed Minecraft skins
 */

import { BaseThemeProcessor } from '../ThemeProcessor';
import { SkinDesign } from '../themeDetector';

export class WizardThemeProcessor extends BaseThemeProcessor {
  constructor() {
    super('Wizard', 'Master of the arcane arts');
  }

  process(ctx: CanvasRenderingContext2D, design: SkinDesign): void {
    const { colors } = design;
    
    // Clear canvas
    ctx.clearRect(0, 0, 64, 64);
    
    // Head with wizard hat (8x8 at 8,0)
    this.drawWizardHead(ctx, 8, 0, colors.skin, colors.hair, colors.primary);
    
    // Body/Robe (8x12 at 20,20)
    this.drawWizardRobe(ctx, 20, 20, colors.primary, colors.secondary, colors.accent);
    
    // Arms with sleeves (4x12 at 44,20 and 36,52)
    this.drawWizardArm(ctx, 44, 20, colors.skin, colors.primary); // Left arm
    this.drawWizardArm(ctx, 36, 52, colors.skin, colors.primary); // Right arm
    
    // Legs under robe (4x12 at 4,20 and 20,52)
    this.drawWizardLeg(ctx, 4, 20, colors.primary); // Left leg
    this.drawWizardLeg(ctx, 20, 52, colors.primary); // Right leg
  }

  private drawWizardHead(ctx: CanvasRenderingContext2D, x: number, y: number, skinColor: string, hairColor: string, hatColor: string): void {
    // Face
    this.fillRegion(ctx, x, y + 2, 8, 6, skinColor);
    
    // Eyes
    this.drawPixel(ctx, x + 2, y + 3, '#000000');
    this.drawPixel(ctx, x + 5, y + 3, '#000000');
    
    // Beard
    this.fillRegion(ctx, x + 2, y + 5, 4, 3, hairColor);
    this.fillRegion(ctx, x + 3, y + 6, 2, 2, this.lightenColor(hairColor, 20));
    
    // Wizard hat (extends above head area)
    this.fillRegion(ctx, x, y, 8, 3, hatColor);
    this.fillRegion(ctx, x + 2, y - 2, 4, 2, hatColor);
    this.fillRegion(ctx, x + 3, y - 3, 2, 1, hatColor);
    
    // Hat stars/moons decoration
    this.drawPixel(ctx, x + 2, y + 1, hatColor);
    this.drawPixel(ctx, x + 5, y, hatColor);
    
    // Hat brim
    this.fillRegion(ctx, x, y + 2, 8, 1, this.darkenColor(hatColor, 20));
  }

  private drawWizardRobe(ctx: CanvasRenderingContext2D, x: number, y: number, robeColor: string, trimColor: string, accentColor: string): void {
    // Main robe
    this.fillRegion(ctx, x, y, 8, 12, robeColor);
    
    // Robe trim
    this.fillRegion(ctx, x, y, 1, 12, trimColor);
    this.fillRegion(ctx, x + 7, y, 1, 12, trimColor);
    this.fillRegion(ctx, x, y + 11, 8, 1, trimColor);
    
    // Mystical symbols
    this.drawMysticalPattern(ctx, x + 3, y + 3, accentColor);
    
    // Belt
    this.fillRegion(ctx, x, y + 7, 8, 1, this.darkenColor(robeColor, 30));
    this.fillRegion(ctx, x + 3, y + 7, 2, 1, accentColor); // Buckle
    
    // Flowing robe effect
    this.addShading(ctx, x + 1, y + 9, 2, 3, 0.2);
    this.addShading(ctx, x + 5, y + 9, 2, 3, 0.2);
  }

  private drawWizardArm(ctx: CanvasRenderingContext2D, x: number, y: number, skinColor: string, sleeveColor: string): void {
    // Sleeve
    this.fillRegion(ctx, x, y, 4, 9, sleeveColor);
    
    // Wide sleeve opening
    this.fillRegion(ctx, x, y + 7, 4, 2, this.lightenColor(sleeveColor, 10));
    
    // Hand
    this.fillRegion(ctx, x, y + 9, 4, 3, skinColor);
    
    // Magic glow effect on hand
    this.drawPixel(ctx, x + 1, y + 10, '#00FFFF');
    this.drawPixel(ctx, x + 2, y + 10, '#00FFFF');
    
    // Sleeve details
    this.addHighlight(ctx, x, y, 1, 9, 0.1);
  }

  private drawWizardLeg(ctx: CanvasRenderingContext2D, x: number, y: number, robeColor: string): void {
    // Robe covering legs
    this.fillRegion(ctx, x, y, 4, 12, robeColor);
    
    // Robe folds
    this.fillRegion(ctx, x + 1, y + 3, 2, 1, this.darkenColor(robeColor, 15));
    this.fillRegion(ctx, x + 1, y + 7, 2, 1, this.darkenColor(robeColor, 15));
    
    // Bottom hem
    this.fillRegion(ctx, x, y + 11, 4, 1, this.darkenColor(robeColor, 25));
    
    // Shading for depth
    this.addShading(ctx, x + 2, y, 2, 12, 0.15);
  }

  private drawMysticalPattern(ctx: CanvasRenderingContext2D, x: number, y: number, color: string): void {
    // Draw a mystical symbol (simplified pentagram)
    const pattern = [
      [0, 1, 0],
      [1, 0, 1],
      [0, 1, 0]
    ];
    
    for (let py = 0; py < pattern.length; py++) {
      for (let px = 0; px < pattern[py].length; px++) {
        if (pattern[py][px] === 1) {
          this.drawPixel(ctx, x + px - 1, y + py - 1, color);
        }
      }
    }
  }
}