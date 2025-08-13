/**
 * Fantasy Theme Processor
 * Applies magical and medieval fantasy elements to Minecraft skins
 */

import { ThemeProcessor, ThemeColors, ProcessingOptions, ThemeMetadata } from './ThemeProcessor';

export class FantasyThemeProcessor extends ThemeProcessor {
  constructor() {
    const metadata: ThemeMetadata = {
      name: 'Fantasy',
      description: 'Magical and medieval fantasy theme with enchanted effects',
      complexity: 'high',
      processingTime: 150
    };

    const colors: ThemeColors = {
      primary: '#4A148C',    // Deep purple
      secondary: '#FFD700',  // Gold
      accent: '#00BCD4',     // Cyan (magical glow)
      skin: '#FDBCB4',       // Fantasy skin tone
      hair: '#8B4513',       // Brown
      eyes: '#4169E1',       // Royal blue
      clothing: ['#4A148C', '#6A1B9A', '#7B1FA2', '#8E24AA'],
      accessories: ['#FFD700', '#FFA000', '#FF6F00', '#E65100']
    };

    super(metadata, colors);
  }

  process(canvas: HTMLCanvasElement, options?: ProcessingOptions): HTMLCanvasElement {
    const defaultOptions: ProcessingOptions = {
      intensity: 0.7,
      preserveOriginalColors: false,
      applyTextures: true,
      enhanceDetails: true
    };
    
    const opts = { ...defaultOptions, ...options };
    
    // Check cache
    const cacheKey = this.getCacheKey(canvas, opts);
    const cached = this.cachedResults.get(cacheKey);
    if (cached) {
      const ctx = canvas.getContext('2d')!;
      ctx.putImageData(cached, 0, 0);
      return canvas;
    }

    const ctx = canvas.getContext('2d')!;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const analysis = this.analyzeImage(imageData);

    // Apply fantasy transformations
    this.applyMagicalGlow(imageData, opts.intensity);
    this.addEnchantedArmor(imageData, analysis.hasArmor);
    this.enhanceMagicalElements(imageData);
    
    if (opts.applyTextures) {
      this.addRunicPatterns(imageData);
    }
    
    if (opts.enhanceDetails) {
      this.addSparkles(imageData);
    }

    // Apply and cache result
    ctx.putImageData(imageData, 0, 0);
    this.cachedResults.set(cacheKey, imageData);
    
    return canvas;
  }

  private applyMagicalGlow(imageData: ImageData, intensity: number): void {
    const data = imageData.data;
    const glowColor = this.hexToRgb(this.colors.accent)!;
    
    this.applyColorTransform(data, (r, g, b, a) => {
      if (a === 0) return [r, g, b, a];
      
      // Add magical purple/cyan tint
      const blend = this.blendColor(
        { r, g, b },
        glowColor,
        intensity * 0.2
      );
      
      // Enhance brightness for magical effect
      const brightness = 1 + (intensity * 0.3);
      blend.r = Math.min(255, blend.r * brightness);
      blend.g = Math.min(255, blend.g * brightness);
      blend.b = Math.min(255, blend.b * brightness);
      
      return [blend.r, blend.g, blend.b, a];
    });
  }

  private addEnchantedArmor(imageData: ImageData, hasArmor: boolean): void {
    if (!hasArmor) return;
    
    const data = imageData.data;
    const goldColor = this.hexToRgb(this.colors.secondary)!;
    
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      // Detect gray/metallic areas
      if (Math.abs(r - g) < 30 && Math.abs(g - b) < 30 && r > 80 && r < 200) {
        // Transform to enchanted gold/purple
        const enchanted = this.blendColor(
          { r, g, b },
          goldColor,
          0.5
        );
        
        data[i] = enchanted.r;
        data[i + 1] = enchanted.g;
        data[i + 2] = enchanted.b;
      }
    }
  }

  private enhanceMagicalElements(imageData: ImageData): void {
    const data = imageData.data;
    const width = imageData.width;
    const height = imageData.height;
    
    // Add gradient effects to edges for magical aura
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const index = (y * width + x) * 4;
        
        // Check if near edges
        const edgeDistance = Math.min(x, y, width - x - 1, height - y - 1);
        if (edgeDistance < 3 && data[index + 3] > 0) {
          // Add subtle glow at edges
          const glowIntensity = (3 - edgeDistance) / 3;
          data[index] = Math.min(255, data[index] + (30 * glowIntensity));
          data[index + 1] = Math.min(255, data[index + 1] + (20 * glowIntensity));
          data[index + 2] = Math.min(255, data[index + 2] + (40 * glowIntensity));
        }
      }
    }
  }

  private addRunicPatterns(imageData: ImageData): void {
    const data = imageData.data;
    const width = imageData.width;
    const height = imageData.height;
    
    // Add subtle runic patterns
    const runePositions = [
      { x: 10, y: 20 },
      { x: 50, y: 20 },
      { x: 30, y: 40 }
    ];
    
    for (const pos of runePositions) {
      if (pos.x < width && pos.y < height) {
        this.drawRune(data, width, pos.x, pos.y);
      }
    }
  }

  private drawRune(data: Uint8ClampedArray, width: number, x: number, y: number): void {
    // Simple rune pattern (3x3)
    const runePattern = [
      [1, 0, 1],
      [0, 1, 0],
      [1, 0, 1]
    ];
    
    const runeColor = this.hexToRgb(this.colors.primary)!;
    
    for (let dy = 0; dy < 3; dy++) {
      for (let dx = 0; dx < 3; dx++) {
        if (runePattern[dy][dx] === 1) {
          const index = ((y + dy) * width + (x + dx)) * 4;
          if (index < data.length && data[index + 3] > 0) {
            // Blend rune color with existing
            const blend = this.blendColor(
              { r: data[index], g: data[index + 1], b: data[index + 2] },
              runeColor,
              0.3
            );
            data[index] = blend.r;
            data[index + 1] = blend.g;
            data[index + 2] = blend.b;
          }
        }
      }
    }
  }

  private addSparkles(imageData: ImageData): void {
    const data = imageData.data;
    const width = imageData.width;
    const height = imageData.height;
    
    // Add random sparkles for magical effect
    const sparkleCount = Math.floor((width * height) / 200);
    
    for (let i = 0; i < sparkleCount; i++) {
      const x = Math.floor(Math.random() * width);
      const y = Math.floor(Math.random() * height);
      const index = (y * width + x) * 4;
      
      if (data[index + 3] > 0) {
        // Add bright sparkle
        data[index] = Math.min(255, data[index] + 100);
        data[index + 1] = Math.min(255, data[index + 1] + 100);
        data[index + 2] = Math.min(255, data[index + 2] + 120);
      }
    }
  }
}