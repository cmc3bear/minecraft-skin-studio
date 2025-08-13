/**
 * Cyberpunk Theme Processor
 * Generates futuristic cyberpunk-themed Minecraft skins
 */

import { BaseThemeProcessor } from '../ThemeProcessor';
import { SkinDesign } from '../themeDetector';

export class CyberpunkThemeProcessor extends BaseThemeProcessor {
  constructor() {
    super('Cyberpunk', 'Tech-enhanced rebel');
  }

  process(ctx: CanvasRenderingContext2D, design: SkinDesign): void {
    const { colors } = design;
    ctx.clearRect(0, 0, 64, 64);
    
    this.drawCyberpunkHead(ctx, 8, 0, colors.skin, colors.hair, colors.accent);
    this.drawCyberpunkBody(ctx, 20, 20, colors.primary, colors.secondary, colors.accent);
    this.drawCyberpunkArm(ctx, 44, 20, colors.skin, colors.primary, colors.accent);
    this.drawCyberpunkArm(ctx, 36, 52, colors.skin, colors.primary, colors.accent);
    this.drawCyberpunkLeg(ctx, 4, 20, colors.primary, colors.accent);
    this.drawCyberpunkLeg(ctx, 20, 52, colors.primary, colors.accent);
  }

  private drawCyberpunkHead(ctx: CanvasRenderingContext2D, x: number, y: number, skinColor: string, hairColor: string, neonColor: string): void {
    // Face with cyber implants
    this.fillRegion(ctx, x, y, 8, 8, skinColor);
    
    // Mohawk/Punk hair
    this.fillRegion(ctx, x + 2, y, 4, 2, hairColor);
    this.fillRegion(ctx, x + 3, y - 1, 2, 1, neonColor);
    
    // Cyber eyes
    this.drawPixel(ctx, x + 2, y + 3, neonColor);
    this.drawPixel(ctx, x + 5, y + 3, neonColor);
    
    // Face implants
    this.fillRegion(ctx, x, y + 4, 1, 2, '#C0C0C0');
    this.fillRegion(ctx, x + 7, y + 4, 1, 2, '#C0C0C0');
  }

  private drawCyberpunkBody(ctx: CanvasRenderingContext2D, x: number, y: number, jacketColor: string, shirtColor: string, neonColor: string): void {
    // Leather jacket
    this.fillRegion(ctx, x, y, 8, 12, jacketColor);
    
    // Neon strips
    this.fillRegion(ctx, x, y + 2, 1, 8, neonColor);
    this.fillRegion(ctx, x + 7, y + 2, 1, 8, neonColor);
    
    // Tech panel
    this.fillRegion(ctx, x + 2, y + 3, 4, 3, shirtColor);
    this.drawPixel(ctx, x + 3, y + 4, neonColor);
    this.drawPixel(ctx, x + 4, y + 4, '#00FF00');
  }

  private drawCyberpunkArm(ctx: CanvasRenderingContext2D, x: number, y: number, skinColor: string, sleeveColor: string, neonColor: string): void {
    // Sleeve with tech
    this.fillRegion(ctx, x, y, 4, 9, sleeveColor);
    
    // Neon stripe
    this.fillRegion(ctx, x + 1, y, 1, 9, neonColor);
    
    // Cyber hand
    this.fillRegion(ctx, x, y + 9, 4, 3, '#C0C0C0');
    this.drawPixel(ctx, x + 1, y + 10, neonColor);
  }

  private drawCyberpunkLeg(ctx: CanvasRenderingContext2D, x: number, y: number, pantsColor: string, neonColor: string): void {
    // Tech pants
    this.fillRegion(ctx, x, y, 4, 12, pantsColor);
    
    // Neon stripe
    this.fillRegion(ctx, x + 1, y, 1, 10, neonColor);
    
    // Cyber boots
    this.fillRegion(ctx, x, y + 10, 4, 2, '#2F2F2F');
    this.drawPixel(ctx, x + 2, y + 10, neonColor);
  }
}