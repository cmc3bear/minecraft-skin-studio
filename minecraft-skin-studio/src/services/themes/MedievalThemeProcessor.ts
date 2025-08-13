/**
 * Medieval Theme Processor
 * Applies medieval and historical elements to Minecraft skins
 */

import { ThemeProcessor, ThemeColors, ProcessingOptions, ThemeMetadata } from './ThemeProcessor';

export class MedievalThemeProcessor extends ThemeProcessor {
  constructor() {
    const metadata: ThemeMetadata = {
      name: 'Medieval',
      description: 'Historical medieval theme with authentic period elements',
      complexity: 'medium',
      processingTime: 120
    };

    const colors: ThemeColors = {
      primary: '#8B4513',     // Saddle brown
      secondary: '#2F4F4F',   // Dark slate gray
      accent: '#B8860B',      // Dark goldenrod
      skin: '#F5DEB3',        // Wheat
      hair: '#8B4513',        // Saddle brown
      eyes: '#654321',        // Dark brown
      clothing: ['#8B4513', '#654321', '#A0522D', '#D2691E'],
      accessories: ['#B8860B', '#CD853F', '#DEB887', '#F4A460']
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

    // Apply medieval transformations
    this.applyPeriodAuthenticity(imageData, opts.intensity);
    this.addMedievalArmor(imageData, analysis.hasArmor);
    this.enhanceHistoricalElements(imageData);
    
    if (opts.applyTextures) {
      this.addLeatherTextures(imageData);
      this.addMetalPatterns(imageData);
    }
    
    if (opts.enhanceDetails) {
      this.addWeathering(imageData);
      this.addEmbroidery(imageData);
    }

    // Apply and cache result
    ctx.putImageData(imageData, 0, 0);
    this.cachedResults.set(cacheKey, imageData);
    
    return canvas;
  }

  private applyPeriodAuthenticity(imageData: ImageData, intensity: number): void {
    const data = imageData.data;
    const earthyColor = this.hexToRgb(this.colors.primary)!;
    
    this.applyColorTransform(data, (r, g, b, a) => {
      if (a === 0) return [r, g, b, a];
      
      // Apply earthy, muted tones typical of medieval period
      const blend = this.blendColor(
        { r, g, b },
        earthyColor,
        intensity * 0.15
      );
      
      // Reduce saturation for authentic historical look
      const gray = (blend.r + blend.g + blend.b) / 3;
      const desaturation = intensity * 0.3;
      blend.r = Math.round(blend.r * (1 - desaturation) + gray * desaturation);
      blend.g = Math.round(blend.g * (1 - desaturation) + gray * desaturation);
      blend.b = Math.round(blend.b * (1 - desaturation) + gray * desaturation);
      
      // Slightly darken for aged appearance
      const darkening = 1 - (intensity * 0.1);
      blend.r = Math.round(blend.r * darkening);
      blend.g = Math.round(blend.g * darkening);
      blend.b = Math.round(blend.b * darkening);
      
      return [blend.r, blend.g, blend.b, a];
    });
  }

  private addMedievalArmor(imageData: ImageData, hasArmor: boolean): void {
    const data = imageData.data;
    const metalColor = this.hexToRgb(this.colors.secondary)!;
    const width = imageData.width;
    const height = imageData.height;
    
    // Add chainmail and plate armor elements
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const index = (y * width + x) * 4;
        
        if (data[index + 3] > 0) {
          // Add chainmail pattern in armor regions
          if (this.isInArmorRegion(x, y, width, height)) {
            if (this.isChainmailPattern(x, y)) {
              const chainmail = this.blendColor(
                { r: data[index], g: data[index + 1], b: data[index + 2] },
                metalColor,
                0.4
              );
              data[index] = chainmail.r;
              data[index + 1] = chainmail.g;
              data[index + 2] = chainmail.b;
            }
          }
          
          // Add plate armor sections
          if (hasArmor && this.isInPlateArmorRegion(x, y, width, height)) {
            if ((x + y * 2) % 8 === 0) {
              const plate = this.blendColor(
                { r: data[index], g: data[index + 1], b: data[index + 2] },
                { r: metalColor.r + 30, g: metalColor.g + 30, b: metalColor.b + 30 },
                0.5
              );
              data[index] = Math.min(255, plate.r);
              data[index + 1] = Math.min(255, plate.g);
              data[index + 2] = Math.min(255, plate.b);
            }
          }
        }
      }
    }
  }

  private enhanceHistoricalElements(imageData: ImageData): void {
    const data = imageData.data;
    const width = imageData.width;
    const height = imageData.height;
    
    // Add period-appropriate details
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const index = (y * width + x) * 4;
        
        if (data[index + 3] > 0) {
          // Add medieval clothing details
          if (this.isInClothingRegion(x, y, width, height)) {
            // Add subtle fabric texture
            const fabricNoise = (Math.sin(x * 0.8) + Math.cos(y * 0.6)) * 5;
            data[index] = Math.max(0, Math.min(255, data[index] + fabricNoise));
            data[index + 1] = Math.max(0, Math.min(255, data[index + 1] + fabricNoise));
            data[index + 2] = Math.max(0, Math.min(255, data[index + 2] + fabricNoise));
          }
          
          // Add belt and buckle details
          if (this.isInBeltRegion(x, y, width, height)) {
            const beltColor = this.hexToRgb('#654321')!;
            const belt = this.blendColor(
              { r: data[index], g: data[index + 1], b: data[index + 2] },
              beltColor,
              0.7
            );
            data[index] = belt.r;
            data[index + 1] = belt.g;
            data[index + 2] = belt.b;
          }
        }
      }
    }
  }

  private addLeatherTextures(imageData: ImageData): void {
    const data = imageData.data;
    const width = imageData.width;
    const height = imageData.height;
    
    // Add leather texture to appropriate areas
    const leatherRegions = [
      { x: 4, y: 20, w: 4, h: 12 },   // Left leg (boots)
      { x: 20, y: 52, w: 4, h: 12 },  // Right leg (boots)
      { x: 20, y: 28, w: 8, h: 4 }    // Belt area
    ];
    
    for (const region of leatherRegions) {
      for (let y = region.y; y < region.y + region.h && y < height; y++) {
        for (let x = region.x; x < region.x + region.w && x < width; x++) {
          const index = (y * width + x) * 4;
          
          if (data[index + 3] > 0) {
            // Create leather-like texture
            const leatherNoise = Math.sin(x * 1.2) * Math.cos(y * 1.1) * 8;
            const grain = ((x * 7 + y * 5) % 4) * 3;
            
            data[index] = Math.max(0, Math.min(255, data[index] + leatherNoise + grain));
            data[index + 1] = Math.max(0, Math.min(255, data[index + 1] + leatherNoise * 0.8 + grain));
            data[index + 2] = Math.max(0, Math.min(255, data[index + 2] + leatherNoise * 0.6 + grain));
          }
        }
      }
    }
  }

  private addMetalPatterns(imageData: ImageData): void {
    const data = imageData.data;
    const width = imageData.width;
    const height = imageData.height;
    
    // Add metal rivets and studs
    const rivetPositions = [
      { x: 22, y: 22 }, { x: 25, y: 22 }, // Chest armor rivets
      { x: 22, y: 28 }, { x: 25, y: 28 }, // Lower chest rivets
      { x: 45, y: 22 }, { x: 37, y: 54 }  // Arm armor rivets
    ];
    
    const rivetColor = this.hexToRgb(this.colors.accent)!;
    
    for (const rivet of rivetPositions) {
      if (rivet.x < width && rivet.y < height) {
        this.drawRivet(data, width, rivet.x, rivet.y, rivetColor);
      }
    }
    
    // Add metal band patterns
    this.addMetalBands(data, width, height);
  }

  private drawRivet(data: Uint8ClampedArray, width: number, x: number, y: number, color: { r: number; g: number; b: number }): void {
    // Draw a 2x2 rivet
    for (let dy = 0; dy < 2; dy++) {
      for (let dx = 0; dx < 2; dx++) {
        const index = ((y + dy) * width + (x + dx)) * 4;
        if (index < data.length && data[index + 3] > 0) {
          // Center is brighter, edges are darker for 3D effect
          const brightness = (dx === 0 && dy === 0) ? 1.2 : 0.8;
          data[index] = Math.min(255, color.r * brightness);
          data[index + 1] = Math.min(255, color.g * brightness);
          data[index + 2] = Math.min(255, color.b * brightness);
        }
      }
    }
  }

  private addMetalBands(data: Uint8ClampedArray, width: number, height: number): void {
    const bandColor = this.hexToRgb(this.colors.secondary)!;
    
    // Horizontal metal bands on armor
    const bandY = [23, 26, 29];
    
    for (const y of bandY) {
      if (y < height) {
        for (let x = 21; x < 27 && x < width; x++) {
          const index = (y * width + x) * 4;
          if (data[index + 3] > 0) {
            const band = this.blendColor(
              { r: data[index], g: data[index + 1], b: data[index + 2] },
              bandColor,
              0.6
            );
            data[index] = band.r;
            data[index + 1] = band.g;
            data[index + 2] = band.b;
          }
        }
      }
    }
  }

  private addWeathering(imageData: ImageData): void {
    const data = imageData.data;
    const width = imageData.width;
    const height = imageData.height;
    
    // Add weathering and wear patterns
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const index = (y * width + x) * 4;
        
        if (data[index + 3] > 0) {
          // Random weathering spots
          if (Math.random() < 0.03) {
            const weathering = 0.8; // Darken by 20%
            data[index] = Math.round(data[index] * weathering);
            data[index + 1] = Math.round(data[index + 1] * weathering);
            data[index + 2] = Math.round(data[index + 2] * weathering);
          }
          
          // Edge wear on armor
          if (this.isArmorEdge(x, y, width, height, data)) {
            const wear = 0.7;
            data[index] = Math.round(data[index] * wear);
            data[index + 1] = Math.round(data[index + 1] * wear);
            data[index + 2] = Math.round(data[index + 2] * wear);
          }
        }
      }
    }
  }

  private addEmbroidery(imageData: ImageData): void {
    const data = imageData.data;
    const width = imageData.width;
    const height = imageData.height;
    
    // Add simple embroidery patterns on clothing
    const embroideryColor = this.hexToRgb(this.colors.accent)!;
    
    // Simple cross pattern on chest
    const embroideryPattern = [
      { x: 23, y: 24 }, { x: 24, y: 24 }, { x: 25, y: 24 }, // Horizontal line
      { x: 24, y: 23 }, { x: 24, y: 25 }  // Vertical line
    ];
    
    for (const point of embroideryPattern) {
      if (point.x < width && point.y < height) {
        const index = (point.y * width + point.x) * 4;
        if (data[index + 3] > 0) {
          const embroidery = this.blendColor(
            { r: data[index], g: data[index + 1], b: data[index + 2] },
            embroideryColor,
            0.4
          );
          data[index] = embroidery.r;
          data[index + 1] = embroidery.g;
          data[index + 2] = embroidery.b;
        }
      }
    }
  }

  private isChainmailPattern(x: number, y: number): boolean {
    // Chainmail link pattern
    return ((x + y) % 3 === 0) && ((x * 2 + y) % 4 === 0);
  }

  private isInArmorRegion(x: number, y: number, width: number, height: number): boolean {
    // Body armor region
    return x >= 20 && x < 28 && y >= 20 && y < 32;
  }

  private isInPlateArmorRegion(x: number, y: number, width: number, height: number): boolean {
    // Specific plate armor sections
    return (x >= 21 && x < 27 && y >= 21 && y < 27) || // Chest plate
           (x >= 44 && x < 48 && y >= 20 && y < 24) || // Left shoulder
           (x >= 36 && x < 40 && y >= 52 && y < 56);   // Right shoulder
  }

  private isInClothingRegion(x: number, y: number, width: number, height: number): boolean {
    // General clothing areas (non-armor)
    return (x >= 20 && x < 28 && y >= 27 && y < 32) || // Lower torso
           (x >= 4 && x < 8 && y >= 20 && y < 29) ||   // Left leg (upper)
           (x >= 20 && x < 24 && y >= 52 && y < 61);   // Right leg (upper)
  }

  private isInBeltRegion(x: number, y: number, width: number, height: number): boolean {
    // Belt area around waist
    return x >= 20 && x < 28 && y >= 27 && y < 29;
  }

  private isArmorEdge(x: number, y: number, width: number, height: number, data: Uint8ClampedArray): boolean {
    // Check if pixel is on the edge of armor (next to transparent or different colored pixel)
    const index = (y * width + x) * 4;
    if (data[index + 3] === 0) return false;
    
    // Check neighboring pixels
    const neighbors = [
      { dx: -1, dy: 0 }, { dx: 1, dy: 0 },
      { dx: 0, dy: -1 }, { dx: 0, dy: 1 }
    ];
    
    for (const neighbor of neighbors) {
      const nx = x + neighbor.dx;
      const ny = y + neighbor.dy;
      
      if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
        const nIndex = (ny * width + nx) * 4;
        if (data[nIndex + 3] === 0) {
          return true; // Edge pixel
        }
      }
    }
    
    return false;
  }
}