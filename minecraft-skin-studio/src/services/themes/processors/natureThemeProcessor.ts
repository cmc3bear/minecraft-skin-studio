/**
 * Nature Theme Processor
 * Generates nature/forest ranger-themed Minecraft skins
 */

import { BaseThemeProcessor } from '../ThemeProcessor';
import { SkinDesign } from '../themeDetector';

export class NatureThemeProcessor extends BaseThemeProcessor {
  constructor() {
    super('Nature', 'Guardian of the forest');
  }

  process(ctx: CanvasRenderingContext2D, design: SkinDesign): void {
    const { colors } = design;
    ctx.clearRect(0, 0, 64, 64);
    
    this.drawNatureHead(ctx, 8, 0, colors.skin, colors.hair, colors.primary);
    this.drawNatureBody(ctx, 20, 20, colors.primary, colors.secondary);
    this.drawNatureArm(ctx, 44, 20, colors.skin, colors.primary);
    this.drawNatureArm(ctx, 36, 52, colors.skin, colors.primary);
    this.drawNatureLeg(ctx, 4, 20, colors.primary);
    this.drawNatureLeg(ctx, 20, 52, colors.primary);
  }

  private drawNatureHead(ctx: CanvasRenderingContext2D, x: number, y: number, skinColor: string, hairColor: string, leafColor: string): void {
    // Face
    this.fillRegion(ctx, x, y + 1, 8, 7, skinColor);
    
    // Hair with leaves
    this.fillRegion(ctx, x, y, 8, 3, hairColor);
    this.drawPixel(ctx, x + 1, y, leafColor);
    this.drawPixel(ctx, x + 5, y + 1, leafColor);
    
    // Eyes
    this.drawPixel(ctx, x + 2, y + 3, '#228B22');
    this.drawPixel(ctx, x + 5, y + 3, '#228B22');
  }

  private drawNatureBody(ctx: CanvasRenderingContext2D, x: number, y: number, clothColor: string, leafColor: string): void {
    // Tunic
    this.fillRegion(ctx, x, y, 8, 12, clothColor);
    
    // Leaf patterns
    this.drawPixel(ctx, x + 2, y + 2, leafColor);
    this.drawPixel(ctx, x + 5, y + 3, leafColor);
    this.drawPixel(ctx, x + 3, y + 5, leafColor);
    
    // Belt
    this.fillRegion(ctx, x, y + 7, 8, 1, '#8B4513');
  }

  private drawNatureArm(ctx: CanvasRenderingContext2D, x: number, y: number, skinColor: string, clothColor: string): void {
    // Sleeve
    this.fillRegion(ctx, x, y, 4, 8, clothColor);
    
    // Bare forearm
    this.fillRegion(ctx, x, y + 8, 4, 4, skinColor);
  }

  private drawNatureLeg(ctx: CanvasRenderingContext2D, x: number, y: number, clothColor: string): void {
    // Pants
    this.fillRegion(ctx, x, y, 4, 10, clothColor);
    
    // Boots
    this.fillRegion(ctx, x, y + 10, 4, 2, '#8B4513');
  }
}