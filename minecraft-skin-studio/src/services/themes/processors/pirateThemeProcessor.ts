/**
 * Pirate Theme Processor
 * Generates swashbuckling pirate-themed Minecraft skins
 */

import { BaseThemeProcessor } from '../ThemeProcessor';
import { SkinDesign } from '../themeDetector';

export class PirateThemeProcessor extends BaseThemeProcessor {
  constructor() {
    super('Pirate', 'Swashbuckler of the high seas');
  }

  process(ctx: CanvasRenderingContext2D, design: SkinDesign): void {
    const { colors } = design;
    
    ctx.clearRect(0, 0, 64, 64);
    
    this.drawPirateHead(ctx, 8, 0, colors.skin, colors.hair, colors.secondary);
    this.drawPirateBody(ctx, 20, 20, colors.primary, colors.secondary, colors.accent);
    this.drawPirateArm(ctx, 44, 20, colors.skin, colors.primary);
    this.drawPirateArm(ctx, 36, 52, colors.skin, colors.primary);
    this.drawPirateLeg(ctx, 4, 20, colors.primary);
    this.drawPirateLeg(ctx, 20, 52, colors.primary);
  }

  private drawPirateHead(ctx: CanvasRenderingContext2D, x: number, y: number, skinColor: string, hairColor: string, bandanaColor: string): void {
    // Face
    this.fillRegion(ctx, x, y + 2, 8, 6, skinColor);
    
    // Bandana
    this.fillRegion(ctx, x, y, 8, 3, bandanaColor);
    this.drawPixel(ctx, x + 1, y + 1, this.lightenColor(bandanaColor, 20));
    
    // Hair sides
    this.fillRegion(ctx, x, y + 3, 1, 3, hairColor);
    this.fillRegion(ctx, x + 7, y + 3, 1, 3, hairColor);
    
    // Eye and eyepatch
    this.drawPixel(ctx, x + 2, y + 3, '#000000'); // Eyepatch
    this.fillRegion(ctx, x + 1, y + 3, 3, 1, '#000000'); // Eyepatch strap
    this.drawPixel(ctx, x + 5, y + 3, '#0000FF'); // Eye
    
    // Beard
    this.fillRegion(ctx, x + 2, y + 5, 4, 2, hairColor);
  }

  private drawPirateBody(ctx: CanvasRenderingContext2D, x: number, y: number, coatColor: string, shirtColor: string, beltColor: string): void {
    // Coat
    this.fillRegion(ctx, x, y, 8, 12, coatColor);
    
    // Open coat showing shirt
    this.fillRegion(ctx, x + 2, y + 1, 4, 5, shirtColor);
    
    // Belt
    this.fillRegion(ctx, x, y + 7, 8, 1, beltColor);
    this.fillRegion(ctx, x + 3, y + 7, 2, 1, '#FFD700'); // Buckle
    
    // Coat buttons
    this.drawPixel(ctx, x + 1, y + 2, '#FFD700');
    this.drawPixel(ctx, x + 6, y + 2, '#FFD700');
  }

  private drawPirateArm(ctx: CanvasRenderingContext2D, x: number, y: number, skinColor: string, sleeveColor: string): void {
    // Sleeve
    this.fillRegion(ctx, x, y, 4, 8, sleeveColor);
    
    // Cuff
    this.fillRegion(ctx, x, y + 7, 4, 2, this.lightenColor(sleeveColor, 15));
    
    // Hand
    this.fillRegion(ctx, x, y + 9, 4, 3, skinColor);
  }

  private drawPirateLeg(ctx: CanvasRenderingContext2D, x: number, y: number, pantsColor: string): void {
    // Pants
    this.fillRegion(ctx, x, y, 4, 10, pantsColor);
    
    // Boot
    this.fillRegion(ctx, x, y + 9, 4, 3, '#4B2F20');
    this.fillRegion(ctx, x, y + 9, 4, 1, '#5C3A29'); // Boot top
  }
}