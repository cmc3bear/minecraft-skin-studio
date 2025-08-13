/**
 * Ninja Theme Processor
 * Generates stealthy ninja/shinobi-themed Minecraft skins
 */

import { BaseThemeProcessor } from '../ThemeProcessor';
import { SkinDesign } from '../themeDetector';

export class NinjaThemeProcessor extends BaseThemeProcessor {
  constructor() {
    super('Ninja', 'Shadow warrior of stealth');
  }

  process(ctx: CanvasRenderingContext2D, design: SkinDesign): void {
    const { colors } = design;
    
    // Clear canvas
    ctx.clearRect(0, 0, 64, 64);
    
    // Head with mask (8x8 at 8,0)
    this.drawNinjaHead(ctx, 8, 0, colors.skin, colors.primary);
    
    // Body (8x12 at 20,20)
    this.drawNinjaBody(ctx, 20, 20, colors.primary, colors.secondary, colors.accent);
    
    // Arms (4x12 at 44,20 and 36,52)
    this.drawNinjaArm(ctx, 44, 20, colors.skin, colors.primary); // Left arm
    this.drawNinjaArm(ctx, 36, 52, colors.skin, colors.primary); // Right arm
    
    // Legs (4x12 at 4,20 and 20,52)
    this.drawNinjaLeg(ctx, 4, 20, colors.primary); // Left leg
    this.drawNinjaLeg(ctx, 20, 52, colors.primary); // Right leg
  }

  private drawNinjaHead(ctx: CanvasRenderingContext2D, x: number, y: number, skinColor: string, maskColor: string): void {
    // Hood/Mask covering most of head
    this.fillRegion(ctx, x, y, 8, 8, maskColor);
    
    // Eye opening
    this.fillRegion(ctx, x + 1, y + 3, 6, 1, skinColor);
    
    // Eyes
    this.drawPixel(ctx, x + 2, y + 3, '#000000');
    this.drawPixel(ctx, x + 5, y + 3, '#000000');
    
    // Mask details
    this.fillRegion(ctx, x, y + 5, 8, 1, this.darkenColor(maskColor, 20));
    
    // Hood shadow
    this.addShading(ctx, x, y, 8, 2, 0.3);
  }

  private drawNinjaBody(ctx: CanvasRenderingContext2D, x: number, y: number, suitColor: string, beltColor: string, accentColor: string): void {
    // Ninja suit
    this.fillRegion(ctx, x, y, 8, 12, suitColor);
    
    // Chest wrap/armor
    this.fillRegion(ctx, x + 1, y + 1, 6, 4, this.lightenColor(suitColor, 10));
    
    // Belt/Sash
    this.fillRegion(ctx, x, y + 6, 8, 2, beltColor);
    this.fillRegion(ctx, x + 3, y + 6, 2, 2, accentColor); // Belt knot
    
    // Throwing star holder
    this.drawPixel(ctx, x + 1, y + 3, accentColor);
    this.drawPixel(ctx, x + 6, y + 3, accentColor);
    
    // Suit texture
    this.addShading(ctx, x + 2, y + 8, 4, 4, 0.2);
  }

  private drawNinjaArm(ctx: CanvasRenderingContext2D, x: number, y: number, skinColor: string, suitColor: string): void {
    // Sleeve
    this.fillRegion(ctx, x, y, 4, 10, suitColor);
    
    // Arm guards
    this.fillRegion(ctx, x, y + 4, 4, 2, this.darkenColor(suitColor, 20));
    
    // Hand/Glove
    this.fillRegion(ctx, x, y + 10, 4, 2, this.darkenColor(suitColor, 10));
    
    // Weapon strap
    this.fillRegion(ctx, x + 1, y + 7, 2, 1, '#8B4513');
  }

  private drawNinjaLeg(ctx: CanvasRenderingContext2D, x: number, y: number, suitColor: string): void {
    // Pants
    this.fillRegion(ctx, x, y, 4, 12, suitColor);
    
    // Leg wraps
    this.fillRegion(ctx, x, y + 4, 4, 1, this.darkenColor(suitColor, 15));
    this.fillRegion(ctx, x, y + 7, 4, 1, this.darkenColor(suitColor, 15));
    
    // Tabi boots
    this.fillRegion(ctx, x, y + 10, 4, 2, this.darkenColor(suitColor, 25));
    
    // Split toe detail
    this.drawPixel(ctx, x + 2, y + 11, this.darkenColor(suitColor, 40));
  }
}