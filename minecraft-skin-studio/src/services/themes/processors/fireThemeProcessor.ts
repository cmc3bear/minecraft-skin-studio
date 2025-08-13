/**
 * Fire Theme Processor
 * Generates fire/flame-themed Minecraft skins
 */

import { BaseThemeProcessor } from '../ThemeProcessor';
import { SkinDesign } from '../themeDetector';

export class FireThemeProcessor extends BaseThemeProcessor {
  constructor() {
    super('Fire', 'Wielder of flame');
  }

  process(ctx: CanvasRenderingContext2D, design: SkinDesign): void {
    const { colors } = design;
    ctx.clearRect(0, 0, 64, 64);
    
    this.drawFireHead(ctx, 8, 0, colors.skin, colors.hair, colors.accent);
    this.drawFireBody(ctx, 20, 20, colors.primary, colors.secondary, colors.accent);
    this.drawFireArm(ctx, 44, 20, colors.skin, colors.primary, colors.accent);
    this.drawFireArm(ctx, 36, 52, colors.skin, colors.primary, colors.accent);
    this.drawFireLeg(ctx, 4, 20, colors.primary, colors.accent);
    this.drawFireLeg(ctx, 20, 52, colors.primary, colors.accent);
  }

  private drawFireHead(ctx: CanvasRenderingContext2D, x: number, y: number, skinColor: string, hairColor: string, flameColor: string): void {
    // Face
    this.fillRegion(ctx, x, y + 2, 8, 6, skinColor);
    
    // Flaming hair
    this.fillRegion(ctx, x, y, 8, 3, hairColor);
    this.fillRegion(ctx, x + 1, y, 6, 1, flameColor);
    this.drawPixel(ctx, x + 3, y - 1, flameColor);
    
    // Glowing eyes
    this.drawPixel(ctx, x + 2, y + 3, '#FF4500');
    this.drawPixel(ctx, x + 5, y + 3, '#FF4500');
  }

  private drawFireBody(ctx: CanvasRenderingContext2D, x: number, y: number, armorColor: string, flameColor: string, glowColor: string): void {
    // Fire armor
    this.fillRegion(ctx, x, y, 8, 12, armorColor);
    
    // Flame patterns
    this.fillRegion(ctx, x + 2, y + 2, 4, 2, flameColor);
    this.fillRegion(ctx, x + 3, y + 1, 2, 1, glowColor);
    
    // Ember details
    this.drawPixel(ctx, x + 1, y + 5, glowColor);
    this.drawPixel(ctx, x + 6, y + 6, glowColor);
    
    // Heat glow
    this.addHighlight(ctx, x + 2, y + 4, 4, 4, 0.3);
  }

  private drawFireArm(ctx: CanvasRenderingContext2D, x: number, y: number, skinColor: string, armorColor: string, flameColor: string): void {
    // Arm
    this.fillRegion(ctx, x, y, 4, 9, armorColor);
    
    // Burning hand
    this.fillRegion(ctx, x, y + 9, 4, 3, skinColor);
    this.fillRegion(ctx, x, y + 10, 4, 1, flameColor);
    this.drawPixel(ctx, x + 1, y + 9, flameColor);
  }

  private drawFireLeg(ctx: CanvasRenderingContext2D, x: number, y: number, armorColor: string, flameColor: string): void {
    // Leg armor
    this.fillRegion(ctx, x, y, 4, 12, armorColor);
    
    // Flame trail
    this.fillRegion(ctx, x + 1, y + 8, 2, 4, flameColor);
    
    // Ember boots
    this.fillRegion(ctx, x, y + 10, 4, 2, this.darkenColor(armorColor, 20));
    this.drawPixel(ctx, x + 1, y + 10, flameColor);
  }
}