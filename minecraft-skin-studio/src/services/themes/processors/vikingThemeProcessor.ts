/**
 * Viking Theme Processor
 * Generates Norse viking warrior-themed Minecraft skins
 */

import { BaseThemeProcessor } from '../ThemeProcessor';
import { SkinDesign } from '../themeDetector';

export class VikingThemeProcessor extends BaseThemeProcessor {
  constructor() {
    super('Viking', 'Fierce Norse warrior');
  }

  process(ctx: CanvasRenderingContext2D, design: SkinDesign): void {
    const { colors } = design;
    ctx.clearRect(0, 0, 64, 64);
    
    this.drawVikingHead(ctx, 8, 0, colors.skin, colors.hair, colors.secondary);
    this.drawVikingBody(ctx, 20, 20, colors.primary, colors.secondary);
    this.drawVikingArm(ctx, 44, 20, colors.skin, colors.primary);
    this.drawVikingArm(ctx, 36, 52, colors.skin, colors.primary);
    this.drawVikingLeg(ctx, 4, 20, colors.primary);
    this.drawVikingLeg(ctx, 20, 52, colors.primary);
  }

  private drawVikingHead(ctx: CanvasRenderingContext2D, x: number, y: number, skinColor: string, hairColor: string, helmetColor: string): void {
    // Horned helmet
    this.fillRegion(ctx, x, y, 8, 4, helmetColor);
    this.drawPixel(ctx, x - 1, y, helmetColor); // Left horn
    this.drawPixel(ctx, x + 8, y, helmetColor); // Right horn
    
    // Face
    this.fillRegion(ctx, x, y + 3, 8, 5, skinColor);
    
    // Eyes
    this.drawPixel(ctx, x + 2, y + 4, '#4169E1');
    this.drawPixel(ctx, x + 5, y + 4, '#4169E1');
    
    // Beard
    this.fillRegion(ctx, x + 1, y + 5, 6, 3, hairColor);
  }

  private drawVikingBody(ctx: CanvasRenderingContext2D, x: number, y: number, armorColor: string, furColor: string): void {
    // Leather armor
    this.fillRegion(ctx, x, y, 8, 12, armorColor);
    
    // Fur trim
    this.fillRegion(ctx, x, y, 8, 2, furColor);
    this.drawTexture(ctx, x, y, 8, 2, 'fur');
    
    // Belt
    this.fillRegion(ctx, x, y + 7, 8, 1, this.darkenColor(armorColor, 30));
  }

  private drawVikingArm(ctx: CanvasRenderingContext2D, x: number, y: number, skinColor: string, armorColor: string): void {
    // Bare arms showing strength
    this.fillRegion(ctx, x, y, 4, 12, skinColor);
    
    // Arm guards
    this.fillRegion(ctx, x, y + 5, 4, 3, armorColor);
  }

  private drawVikingLeg(ctx: CanvasRenderingContext2D, x: number, y: number, pantsColor: string): void {
    // Pants
    this.fillRegion(ctx, x, y, 4, 10, pantsColor);
    
    // Boots with fur
    this.fillRegion(ctx, x, y + 9, 4, 3, this.darkenColor(pantsColor, 25));
    this.fillRegion(ctx, x, y + 9, 4, 1, '#8B7355'); // Fur trim
  }
}