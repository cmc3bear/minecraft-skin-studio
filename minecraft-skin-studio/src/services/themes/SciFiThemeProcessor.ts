/**
 * SciFi Theme Processor
 * Applies futuristic and science fiction elements to Minecraft skins
 */

import { ThemeProcessor, ThemeColors, ProcessingOptions, ThemeMetadata } from './ThemeProcessor';

export class SciFiThemeProcessor extends ThemeProcessor {
  constructor() {
    const metadata: ThemeMetadata = {
      name: 'SciFi',
      description: 'Futuristic science fiction theme with technological enhancements',
      complexity: 'high',
      processingTime: 140
    };

    const colors: ThemeColors = {
      primary: '#00BFFF',     // Deep sky blue
      secondary: '#FF4500',   // Orange red
      accent: '#00FF00',      // Bright green (digital/matrix-style)
      skin: '#E6E6FA',        // Lavender (alien-like)
      hair: '#C0C0C0',        // Silver
      eyes: '#00FFFF',        // Cyan
      clothing: ['#2F4F4F', '#708090', '#4682B4', '#5F9EA0'],
      accessories: ['#00FF00', '#00BFFF', '#FF1493', '#FFD700']
    };

    super(metadata, colors);
  }

  process(canvas: HTMLCanvasElement, options?: ProcessingOptions): HTMLCanvasElement {
    const defaultOptions: ProcessingOptions = {
      intensity: 0.8,
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

    // Apply sci-fi transformations
    this.applyTechnologicalEnhancement(imageData, opts.intensity);
    this.addCyberneticAugmentations(imageData, analysis.hasArmor);
    this.enhanceDigitalElements(imageData);
    
    if (opts.applyTextures) {
      this.addCircuitPatterns(imageData);
      this.addHolographicElements(imageData);
    }
    
    if (opts.enhanceDetails) {
      this.addEnergyGlow(imageData);
      this.addDataStreams(imageData);
    }

    // Apply and cache result
    ctx.putImageData(imageData, 0, 0);
    this.cachedResults.set(cacheKey, imageData);
    
    return canvas;
  }

  private applyTechnologicalEnhancement(imageData: ImageData, intensity: number): void {
    const data = imageData.data;
    const techColor = this.hexToRgb(this.colors.primary)!;
    
    this.applyColorTransform(data, (r, g, b, a) => {
      if (a === 0) return [r, g, b, a];
      
      // Add technological blue/cyan tint
      const blend = this.blendColor(
        { r, g, b },
        techColor,
        intensity * 0.25
      );
      
      // Enhance contrast for a digital look
      const contrast = 1 + (intensity * 0.4);
      blend.r = Math.min(255, Math.max(0, (blend.r - 128) * contrast + 128));
      blend.g = Math.min(255, Math.max(0, (blend.g - 128) * contrast + 128));
      blend.b = Math.min(255, Math.max(0, (blend.b - 128) * contrast + 128));
      
      return [blend.r, blend.g, blend.b, a];
    });
  }

  private addCyberneticAugmentations(imageData: ImageData, hasArmor: boolean): void {
    const data = imageData.data;
    const cyberColor = this.hexToRgb(this.colors.accent)!;
    const width = imageData.width;
    const height = imageData.height;
    
    // Add cybernetic implants and augmentations
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const index = (y * width + x) * 4;
        
        // Add cybernetic eye enhancement
        if (this.isInFaceRegion(x, y, width, height)) {
          if ((x + y) % 8 === 0 && data[index + 3] > 0) {
            // Add digital enhancement dots
            data[index] = cyberColor.r;
            data[index + 1] = cyberColor.g;
            data[index + 2] = cyberColor.b;
          }
        }
        
        // Add cybernetic armor plating
        if (hasArmor && this.isInArmorRegion(x, y, width, height)) {
          if ((x * 3 + y * 2) % 16 === 0 && data[index + 3] > 0) {
            // Add tech panel accents
            const enhancement = this.blendColor(
              { r: data[index], g: data[index + 1], b: data[index + 2] },
              cyberColor,
              0.6
            );
            data[index] = enhancement.r;
            data[index + 1] = enhancement.g;
            data[index + 2] = enhancement.b;
          }
        }
      }
    }
  }

  private enhanceDigitalElements(imageData: ImageData): void {
    const data = imageData.data;
    const width = imageData.width;
    const height = imageData.height;
    
    // Add digital grid overlay
    for (let y = 0; y < height; y += 4) {
      for (let x = 0; x < width; x += 4) {
        const index = (y * width + x) * 4;
        if (data[index + 3] > 0) {
          // Add subtle grid lines
          const gridIntensity = 0.1;
          data[index] = Math.min(255, data[index] + (50 * gridIntensity));
          data[index + 1] = Math.min(255, data[index + 1] + (255 * gridIntensity));
          data[index + 2] = Math.min(255, data[index + 2] + (100 * gridIntensity));
        }
      }
    }
  }

  private addCircuitPatterns(imageData: ImageData): void {
    const data = imageData.data;
    const width = imageData.width;
    const height = imageData.height;
    
    // Add circuit-like patterns
    const circuitPositions = [
      { x: 12, y: 25, direction: 'horizontal' },
      { x: 45, y: 30, direction: 'vertical' },
      { x: 25, y: 45, direction: 'diagonal' }
    ];
    
    for (const circuit of circuitPositions) {
      if (circuit.x < width && circuit.y < height) {
        this.drawCircuitLine(data, width, circuit.x, circuit.y, circuit.direction);
      }
    }
  }

  private drawCircuitLine(data: Uint8ClampedArray, width: number, startX: number, startY: number, direction: string): void {
    const circuitColor = this.hexToRgb(this.colors.accent)!;
    const length = 8;
    
    for (let i = 0; i < length; i++) {
      let x = startX;
      let y = startY;
      
      switch (direction) {
        case 'horizontal':
          x += i;
          break;
        case 'vertical':
          y += i;
          break;
        case 'diagonal':
          x += i;
          y += i;
          break;
      }
      
      if (x >= 0 && x < 64 && y >= 0 && y < 64) {
        const index = (y * width + x) * 4;
        if (data[index + 3] > 0) {
          // Blend circuit color
          const blend = this.blendColor(
            { r: data[index], g: data[index + 1], b: data[index + 2] },
            circuitColor,
            0.4
          );
          data[index] = blend.r;
          data[index + 1] = blend.g;
          data[index + 2] = blend.b;
        }
      }
    }
  }

  private addHolographicElements(imageData: ImageData): void {
    const data = imageData.data;
    const width = imageData.width;
    const height = imageData.height;
    
    // Add holographic shimmer effect
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const index = (y * width + x) * 4;
        
        if (data[index + 3] > 0) {
          // Create holographic shimmer based on position
          const shimmer = Math.sin((x + y) * 0.5) * 0.1;
          const holoShift = Math.sin(x * 0.3) * 10;
          
          // Apply color shift for holographic effect
          data[index] = Math.min(255, Math.max(0, data[index] + holoShift));
          data[index + 1] = Math.min(255, Math.max(0, data[index + 1] + (shimmer * 255)));
          data[index + 2] = Math.min(255, Math.max(0, data[index + 2] + (shimmer * 200)));
        }
      }
    }
  }

  private addEnergyGlow(imageData: ImageData): void {
    const data = imageData.data;
    const width = imageData.width;
    const height = imageData.height;
    
    // Add energy glow effect around edges
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const index = (y * width + x) * 4;
        
        if (data[index + 3] > 0) {
          // Check for edges (pixels next to transparent areas)
          const neighbors = [
            data[((y - 1) * width + x) * 4 + 3],
            data[((y + 1) * width + x) * 4 + 3],
            data[(y * width + (x - 1)) * 4 + 3],
            data[(y * width + (x + 1)) * 4 + 3]
          ];
          
          const hasTransparentNeighbor = neighbors.some(alpha => alpha === 0);
          
          if (hasTransparentNeighbor) {
            // Add energy glow at edges
            const glowIntensity = 0.3;
            data[index] = Math.min(255, data[index] + (100 * glowIntensity));
            data[index + 1] = Math.min(255, data[index + 1] + (255 * glowIntensity));
            data[index + 2] = Math.min(255, data[index + 2] + (150 * glowIntensity));
          }
        }
      }
    }
  }

  private addDataStreams(imageData: ImageData): void {
    const data = imageData.data;
    const width = imageData.width;
    const height = imageData.height;
    
    // Add flowing data stream effects
    const streamCount = Math.floor((width * height) / 300);
    const streamColor = this.hexToRgb(this.colors.accent)!;
    
    for (let i = 0; i < streamCount; i++) {
      const x = Math.floor(Math.random() * width);
      const y = Math.floor(Math.random() * height);
      const streamLength = 3;
      
      for (let j = 0; j < streamLength; j++) {
        const streamY = (y + j) % height;
        const index = (streamY * width + x) * 4;
        
        if (data[index + 3] > 0) {
          // Add data stream particle
          const intensity = (streamLength - j) / streamLength;
          const blend = this.blendColor(
            { r: data[index], g: data[index + 1], b: data[index + 2] },
            streamColor,
            intensity * 0.5
          );
          data[index] = blend.r;
          data[index + 1] = blend.g;
          data[index + 2] = blend.b;
        }
      }
    }
  }

  private isInFaceRegion(x: number, y: number, width: number, height: number): boolean {
    // Face region for Minecraft skin (typically top-left 8x8 area)
    return x >= 8 && x < 16 && y >= 8 && y < 16;
  }

  private isInArmorRegion(x: number, y: number, width: number, height: number): boolean {
    // Armor/body regions
    return (x >= 20 && x < 28 && y >= 20 && y < 32) || // Body
           (x >= 44 && x < 48 && y >= 20 && y < 32) || // Left arm
           (x >= 36 && x < 40 && y >= 52 && y < 64);   // Right arm
  }
}