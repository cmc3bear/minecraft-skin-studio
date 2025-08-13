/**
 * Robot Theme Processor
 * Generates futuristic robot/android-themed Minecraft skins
 */

import { BaseThemeProcessor } from '../ThemeProcessor';
import { SkinDesign } from '../themeDetector';

export class RobotThemeProcessor extends BaseThemeProcessor {
  constructor() {
    super('Robot', 'Mechanical android with advanced technology');
  }

  process(ctx: CanvasRenderingContext2D, design: SkinDesign): void {
    const { colors } = design;
    
    // Clear canvas
    ctx.clearRect(0, 0, 64, 64);
    
    // Head/Helmet (8x8 at 8,0)
    this.drawRobotHead(ctx, 8, 0, colors.primary, colors.accent);
    
    // Body/Chassis (8x12 at 20,20)
    this.drawRobotBody(ctx, 20, 20, colors.primary, colors.secondary, colors.accent);
    
    // Arms (4x12 at 44,20 and 36,52)
    this.drawRobotArm(ctx, 44, 20, colors.primary, colors.secondary); // Left arm
    this.drawRobotArm(ctx, 36, 52, colors.primary, colors.secondary); // Right arm
    
    // Legs (4x12 at 4,20 and 20,52)
    this.drawRobotLeg(ctx, 4, 20, colors.primary, colors.secondary); // Left leg
    this.drawRobotLeg(ctx, 20, 52, colors.primary, colors.secondary); // Right leg
  }

  private drawRobotHead(ctx: CanvasRenderingContext2D, x: number, y: number, metalColor: string, accentColor: string): void {
    // Base metal head
    this.fillRegion(ctx, x, y, 8, 8, metalColor);
    
    // Visor/Eyes
    this.fillRegion(ctx, x + 1, y + 2, 2, 2, accentColor);
    this.fillRegion(ctx, x + 5, y + 2, 2, 2, accentColor);
    
    // Antenna
    this.drawPixel(ctx, x + 3, y - 1, metalColor);
    this.drawPixel(ctx, x + 3, y - 2, accentColor);
    
    // Face plate lines
    this.fillRegion(ctx, x + 2, y + 5, 4, 1, this.darkenColor(metalColor, 20));
    
    // Circuit pattern
    this.drawTexture(ctx, x, y + 6, 8, 2, 'circuits');
    
    // Metallic shading
    this.addHighlight(ctx, x, y, 8, 1, 0.3);
    this.addShading(ctx, x, y + 7, 8, 1, 0.3);
  }

  private drawRobotBody(ctx: CanvasRenderingContext2D, x: number, y: number, metalColor: string, panelColor: string, lightColor: string): void {
    // Base chassis
    this.fillRegion(ctx, x, y, 8, 12, metalColor);
    
    // Chest panel
    this.fillRegion(ctx, x + 2, y + 2, 4, 4, panelColor);
    
    // Power core
    this.fillRegion(ctx, x + 3, y + 3, 2, 2, lightColor);
    this.drawPixel(ctx, x + 4, y + 4, '#FFFFFF'); // Core highlight
    
    // Control panels
    this.fillRegion(ctx, x + 1, y + 7, 1, 1, lightColor);
    this.fillRegion(ctx, x + 3, y + 7, 1, 1, '#00FF00');
    this.fillRegion(ctx, x + 5, y + 7, 1, 1, lightColor);
    
    // Panel lines
    this.fillRegion(ctx, x, y + 6, 8, 1, this.darkenColor(metalColor, 25));
    this.fillRegion(ctx, x, y + 9, 8, 1, this.darkenColor(metalColor, 25));
    
    // Metallic effects
    this.addHighlight(ctx, x, y, 2, 12, 0.2);
    this.addShading(ctx, x + 6, y, 2, 12, 0.2);
  }

  private drawRobotArm(ctx: CanvasRenderingContext2D, x: number, y: number, metalColor: string, jointColor: string): void {
    // Base arm
    this.fillRegion(ctx, x, y, 4, 12, metalColor);
    
    // Shoulder joint
    this.fillRegion(ctx, x, y, 4, 2, jointColor);
    
    // Elbow joint
    this.fillRegion(ctx, x, y + 5, 4, 1, jointColor);
    
    // Hand/Gripper
    this.fillRegion(ctx, x, y + 10, 4, 2, this.darkenColor(metalColor, 20));
    this.drawPixel(ctx, x + 1, y + 11, jointColor);
    this.drawPixel(ctx, x + 2, y + 11, jointColor);
    
    // Servo lines
    this.fillRegion(ctx, x + 1, y + 3, 2, 1, this.darkenColor(metalColor, 15));
    this.fillRegion(ctx, x + 1, y + 7, 2, 1, this.darkenColor(metalColor, 15));
    
    // Metallic shading
    this.addHighlight(ctx, x, y, 1, 12, 0.2);
  }

  private drawRobotLeg(ctx: CanvasRenderingContext2D, x: number, y: number, metalColor: string, jointColor: string): void {
    // Base leg
    this.fillRegion(ctx, x, y, 4, 12, metalColor);
    
    // Hip joint
    this.fillRegion(ctx, x, y, 4, 2, jointColor);
    
    // Knee joint
    this.fillRegion(ctx, x, y + 5, 4, 2, jointColor);
    
    // Foot/Boot
    this.fillRegion(ctx, x, y + 10, 4, 2, this.darkenColor(metalColor, 25));
    
    // Hydraulic lines
    this.fillRegion(ctx, x + 1, y + 3, 1, 2, this.darkenColor(metalColor, 30));
    this.fillRegion(ctx, x + 2, y + 8, 1, 2, this.darkenColor(metalColor, 30));
    
    // Metallic shading
    this.addHighlight(ctx, x, y, 1, 12, 0.2);
    this.addShading(ctx, x + 3, y, 1, 12, 0.2);
  }
}