/**
 * Ice Theme Processor
 * Generates ice/frost-themed Minecraft skins
 */

import { BaseThemeProcessor } from '../ThemeProcessor';
import { SkinDesign } from '../themeDetector';

export class IceThemeProcessor extends BaseThemeProcessor {
  constructor() {
    super('Ice', 'Master of frost');
  }

  process(ctx: CanvasRenderingContext2D, design: SkinDesign): void {
    const { colors } = design;
    ctx.clearRect(0, 0, 64, 64);
    
    this.drawIceHead(ctx, 8, 0, colors.skin, colors.hair, colors.accent);
    this.drawIceBody(ctx, 20, 20, colors.primary, colors.secondary, colors.accent);
    this.drawIceArm(ctx, 44, 20, colors.skin, colors.primary);
    this.drawIceArm(ctx, 36, 52, colors.skin, colors.primary);
    this.drawIceLeg(ctx, 4, 20, colors.primary);
    this.drawIceLeg(ctx, 20, 52, colors.primary);
  }

  private drawIceHead(ctx: CanvasRenderingContext2D, x: number, y: number, skinColor: string, hairColor: string, crystalColor: string): void {
    // Pale face
    this.fillRegion(ctx, x, y + 2, 8, 6, skinColor);
    
    // Ice crown/hair
    this.fillRegion(ctx, x, y, 8, 3, hairColor);
    this.fillRegion(ctx, x + 2, y, 4, 1, crystalColor);
    this.drawPixel(ctx, x + 3, y - 1, crystalColor);
    this.drawPixel(ctx, x + 4, y - 1, crystalColor);
    
    // Crystal blue eyes
    this.drawPixel(ctx, x + 2, y + 3, '#00BFFF');
    this.drawPixel(ctx, x + 5, y + 3, '#00BFFF');
  }

  private drawIceBody(ctx: CanvasRenderingContext2D, x: number, y: number, armorColor: string, frostColor: string, crystalColor: string): void {
    // Frost armor
    this.fillRegion(ctx, x, y, 8, 12, armorColor);
    
    // Ice crystal patterns
    this.fillRegion(ctx, x + 3, y + 2, 2, 2, crystalColor);
    this.drawPixel(ctx, x + 2, y + 3, frostColor);
    this.drawPixel(ctx, x + 5, y + 3, frostColor);
    
    // Frost patterns
    this.drawPixel(ctx, x + 1, y + 5, crystalColor);
    this.drawPixel(ctx, x + 6, y + 6, crystalColor);
    
    // Ice sheen
    this.addHighlight(ctx, x, y, 8, 2, 0.4);
  }

  private drawIceArm(ctx: CanvasRenderingContext2D, x: number, y: number, skinColor: string, armorColor: string): void {
    // Frozen arm
    this.fillRegion(ctx, x, y, 4, 9, armorColor);
    
    // Ice crystals
    this.drawPixel(ctx, x + 1, y + 3, '#E0FFFF');
    this.drawPixel(ctx, x + 2, y + 6, '#E0FFFF');
    
    // Frozen hand
    this.fillRegion(ctx, x, y + 9, 4, 3, skinColor);
    this.addHighlight(ctx, x, y + 10, 4, 1, 0.5);
  }

  private drawIceLeg(ctx: CanvasRenderingContext2D, x: number, y: number, armorColor: string): void {
    // Frozen leg armor
    this.fillRegion(ctx, x, y, 4, 12, armorColor);
    
    // Ice shards
    this.drawPixel(ctx, x + 1, y + 4, '#E0FFFF');
    this.drawPixel(ctx, x + 2, y + 8, '#E0FFFF');
    
    // Ice boots
    this.fillRegion(ctx, x, y + 10, 4, 2, this.lightenColor(armorColor, 20));
    this.addHighlight(ctx, x, y + 10, 4, 1, 0.6);
  }
}