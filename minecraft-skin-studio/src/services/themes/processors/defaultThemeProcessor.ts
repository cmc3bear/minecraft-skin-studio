/**
 * Default Theme Processor
 * Generates standard character-themed Minecraft skins
 */

import { BaseThemeProcessor } from '../ThemeProcessor';
import { SkinDesign } from '../themeDetector';

export class DefaultThemeProcessor extends BaseThemeProcessor {
  constructor() {
    super('Default', 'Standard character skin');
  }

  process(ctx: CanvasRenderingContext2D, design: SkinDesign): void {
    const { colors } = design;
    
    // Clear canvas
    ctx.clearRect(0, 0, 64, 64);
    
    // Head (8x8 at 8,0)
    this.drawDefaultHead(ctx, 8, 0, colors.skin, colors.hair);
    
    // Body (8x12 at 20,20)
    this.drawDefaultBody(ctx, 20, 20, colors.primary, colors.secondary);
    
    // Arms (4x12 at 44,20 and 36,52)
    this.drawDefaultArm(ctx, 44, 20, colors.skin, colors.primary); // Left arm
    this.drawDefaultArm(ctx, 36, 52, colors.skin, colors.primary); // Right arm
    
    // Legs (4x12 at 4,20 and 20,52)
    this.drawDefaultLeg(ctx, 4, 20, colors.secondary); // Left leg
    this.drawDefaultLeg(ctx, 20, 52, colors.secondary); // Right leg
  }

  private drawDefaultHead(ctx: CanvasRenderingContext2D, x: number, y: number, skinColor: string, hairColor: string): void {
    // Face
    this.fillRegion(ctx, x, y, 8, 8, skinColor);
    
    // Hair
    this.fillRegion(ctx, x, y, 8, 3, hairColor);
    this.fillRegion(ctx, x, y + 3, 1, 2, hairColor);
    this.fillRegion(ctx, x + 7, y + 3, 1, 2, hairColor);
    
    // Eyes
    this.drawPixel(ctx, x + 2, y + 4, '#4169E1');
    this.drawPixel(ctx, x + 5, y + 4, '#4169E1');
    
    // Eyebrows
    this.fillRegion(ctx, x + 2, y + 3, 1, 1, this.darkenColor(hairColor, 20));
    this.fillRegion(ctx, x + 5, y + 3, 1, 1, this.darkenColor(hairColor, 20));
    
    // Mouth
    this.fillRegion(ctx, x + 3, y + 6, 2, 1, '#CC6666');
  }

  private drawDefaultBody(ctx: CanvasRenderingContext2D, x: number, y: number, shirtColor: string, pantsColor: string): void {
    // Shirt (top part)
    this.fillRegion(ctx, x, y, 8, 7, shirtColor);
    
    // Collar
    this.fillRegion(ctx, x + 3, y, 2, 1, this.lightenColor(shirtColor, 20));
    
    // Shirt details
    this.fillRegion(ctx, x + 3, y + 3, 2, 1, this.darkenColor(shirtColor, 10));
    
    // Belt area
    this.fillRegion(ctx, x, y + 7, 8, 1, '#4B3621');
    
    // Pants (bottom part)
    this.fillRegion(ctx, x, y + 8, 8, 4, pantsColor);
    
    // Pockets
    this.fillRegion(ctx, x + 1, y + 9, 2, 2, this.darkenColor(pantsColor, 15));
    this.fillRegion(ctx, x + 5, y + 9, 2, 2, this.darkenColor(pantsColor, 15));
  }

  private drawDefaultArm(ctx: CanvasRenderingContext2D, x: number, y: number, skinColor: string, sleeveColor: string): void {
    // Sleeve
    this.fillRegion(ctx, x, y, 4, 7, sleeveColor);
    
    // Sleeve hem
    this.fillRegion(ctx, x, y + 6, 4, 1, this.darkenColor(sleeveColor, 15));
    
    // Arm/Hand
    this.fillRegion(ctx, x, y + 7, 4, 5, skinColor);
    
    // Hand details
    this.fillRegion(ctx, x + 1, y + 11, 2, 1, this.darkenColor(skinColor, 10));
  }

  private drawDefaultLeg(ctx: CanvasRenderingContext2D, x: number, y: number, pantsColor: string): void {
    // Pants leg
    this.fillRegion(ctx, x, y, 4, 9, pantsColor);
    
    // Seam
    this.fillRegion(ctx, x + 2, y, 1, 9, this.darkenColor(pantsColor, 10));
    
    // Shoes
    this.fillRegion(ctx, x, y + 9, 4, 3, '#2F2F2F');
    
    // Shoe details
    this.fillRegion(ctx, x, y + 9, 4, 1, '#1A1A1A');
    this.drawPixel(ctx, x + 1, y + 10, '#FFFFFF'); // Lace
    this.drawPixel(ctx, x + 2, y + 10, '#FFFFFF'); // Lace
  }
}