/**
 * Knight Theme Processor
 * Generates medieval knight-themed Minecraft skins
 */

import { BaseThemeProcessor } from '../ThemeProcessor';
import { SkinDesign } from '../themeDetector';

export class KnightThemeProcessor extends BaseThemeProcessor {
  constructor() {
    super('Knight', 'Medieval warrior in shining armor');
  }

  process(ctx: CanvasRenderingContext2D, design: SkinDesign): void {
    const { colors } = design;
    
    // Clear canvas
    ctx.clearRect(0, 0, 64, 64);
    
    // Head/Helmet (8x8 at 8,0)
    this.drawHelmet(ctx, 8, 0, colors.primary, colors.secondary);
    
    // Body/Armor (8x12 at 20,20)
    this.drawArmor(ctx, 20, 20, colors.primary, colors.accent);
    
    // Arms (4x12 at 44,20 and 36,52)
    this.drawArmoredArm(ctx, 44, 20, colors.primary); // Left arm
    this.drawArmoredArm(ctx, 36, 52, colors.primary); // Right arm
    
    // Legs (4x12 at 4,20 and 20,52)
    this.drawArmoredLeg(ctx, 4, 20, colors.primary); // Left leg
    this.drawArmoredLeg(ctx, 20, 52, colors.primary); // Right leg
  }

  private drawHelmet(ctx: CanvasRenderingContext2D, x: number, y: number, armorColor: string, accentColor: string): void {
    // Base helmet
    this.fillRegion(ctx, x, y, 8, 8, armorColor);
    
    // Visor slit
    this.fillRegion(ctx, x + 2, y + 3, 4, 1, '#000000');
    
    // Helmet plume
    this.fillRegion(ctx, x + 3, y, 2, 2, accentColor);
    
    // Shading
    this.addShading(ctx, x, y + 6, 8, 2, 0.3);
    this.addHighlight(ctx, x, y, 8, 2, 0.2);
    
    // Chainmail texture on neck
    this.drawTexture(ctx, x, y + 6, 8, 2, 'chainmail');
  }

  private drawArmor(ctx: CanvasRenderingContext2D, x: number, y: number, armorColor: string, accentColor: string): void {
    // Base armor
    this.fillRegion(ctx, x, y, 8, 12, armorColor);
    
    // Chest plate design
    this.fillRegion(ctx, x + 3, y + 2, 2, 1, accentColor); // Emblem
    this.fillRegion(ctx, x + 2, y + 3, 4, 1, accentColor);
    this.fillRegion(ctx, x + 3, y + 4, 2, 1, accentColor);
    
    // Belt
    this.fillRegion(ctx, x, y + 8, 8, 1, this.darkenColor(armorColor, 30));
    this.fillRegion(ctx, x + 3, y + 8, 2, 1, accentColor); // Buckle
    
    // Shading and highlights
    this.addShading(ctx, x + 6, y, 2, 12, 0.2);
    this.addHighlight(ctx, x, y, 2, 12, 0.1);
    
    // Chainmail texture
    this.drawTexture(ctx, x, y + 10, 8, 2, 'chainmail');
  }

  private drawArmoredArm(ctx: CanvasRenderingContext2D, x: number, y: number, armorColor: string): void {
    // Base arm armor
    this.fillRegion(ctx, x, y, 4, 12, armorColor);
    
    // Shoulder pad
    this.fillRegion(ctx, x, y, 4, 3, this.lightenColor(armorColor, 10));
    
    // Gauntlet
    this.fillRegion(ctx, x, y + 9, 4, 3, this.darkenColor(armorColor, 20));
    
    // Details
    this.addShading(ctx, x + 3, y, 1, 12, 0.2);
    this.addHighlight(ctx, x, y, 1, 12, 0.1);
  }

  private drawArmoredLeg(ctx: CanvasRenderingContext2D, x: number, y: number, armorColor: string): void {
    // Base leg armor
    this.fillRegion(ctx, x, y, 4, 12, armorColor);
    
    // Knee guard
    this.fillRegion(ctx, x, y + 4, 4, 2, this.lightenColor(armorColor, 15));
    
    // Boot
    this.fillRegion(ctx, x, y + 10, 4, 2, this.darkenColor(armorColor, 25));
    
    // Details
    this.addShading(ctx, x + 3, y, 1, 12, 0.2);
    this.addHighlight(ctx, x, y, 1, 12, 0.1);
  }
}