/**
 * Theme Processor Interface
 * Defines the contract for all theme-specific skin processors
 */

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  skin: string;
  hair: string;
  eyes: string;
  clothing: string[];
  accessories: string[];
}

export interface ProcessingOptions {
  intensity: number; // 0-1 scale for effect intensity
  preserveOriginalColors: boolean;
  applyTextures: boolean;
  enhanceDetails: boolean;
}

export interface ThemeMetadata {
  name: string;
  description: string;
  complexity: 'low' | 'medium' | 'high';
  processingTime: number; // estimated ms
}

export abstract class ThemeProcessor {
  protected metadata: ThemeMetadata;
  protected colors: ThemeColors;
  protected cachedResults: Map<string, ImageData> = new Map();

  constructor(metadata: ThemeMetadata, colors: ThemeColors) {
    this.metadata = metadata;
    this.colors = colors;
  }

  /**
   * Main processing method - must be implemented by each theme
   */
  abstract process(
    canvas: HTMLCanvasElement, 
    options?: ProcessingOptions
  ): HTMLCanvasElement;

  /**
   * Analyze the input image to detect existing features
   */
  protected analyzeImage(imageData: ImageData): {
    dominantColors: string[];
    hasArmor: boolean;
    hasFace: boolean;
    isEmpty: boolean;
  } {
    const data = imageData.data;
    const colorMap = new Map<string, number>();
    let nonTransparentPixels = 0;
    
    // Sample every 4th pixel for performance
    for (let i = 0; i < data.length; i += 16) {
      if (data[i + 3] > 0) {
        nonTransparentPixels++;
        const color = `${data[i]},${data[i + 1]},${data[i + 2]}`;
        colorMap.set(color, (colorMap.get(color) || 0) + 1);
      }
    }

    // Get top 5 dominant colors
    const sortedColors = Array.from(colorMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([color]) => `rgb(${color})`);

    return {
      dominantColors: sortedColors,
      hasArmor: this.detectArmor(imageData),
      hasFace: this.detectFace(imageData),
      isEmpty: nonTransparentPixels < 100
    };
  }

  /**
   * Detect if the skin has armor elements
   */
  protected detectArmor(imageData: ImageData): boolean {
    // Check for metallic colors in typical armor positions
    const data = imageData.data;
    let metallicPixels = 0;
    
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      // Check for gray/silver tones (potential armor)
      if (Math.abs(r - g) < 20 && Math.abs(g - b) < 20 && r > 100 && r < 200) {
        metallicPixels++;
      }
    }
    
    return metallicPixels > (imageData.width * imageData.height * 0.1);
  }

  /**
   * Detect if the skin has a face
   */
  protected detectFace(imageData: ImageData): boolean {
    // Simple face detection based on expected face position
    // Face is typically in the top-left 8x8 area for Minecraft skins
    const faceArea = this.extractRegion(imageData, 8, 8, 8, 8);
    
    // Check for skin-tone colors
    let skinTonePixels = 0;
    for (let i = 0; i < faceArea.data.length; i += 4) {
      const r = faceArea.data[i];
      const g = faceArea.data[i + 1];
      const b = faceArea.data[i + 2];
      
      // Basic skin tone detection
      if (r > 100 && r > g && g > b && (r - b) > 15) {
        skinTonePixels++;
      }
    }
    
    return skinTonePixels > 20;
  }

  /**
   * Extract a region from the image
   */
  protected extractRegion(
    imageData: ImageData,
    x: number,
    y: number,
    width: number,
    height: number
  ): ImageData {
    const regionData = new Uint8ClampedArray(width * height * 4);
    const sourceWidth = imageData.width;
    
    for (let row = 0; row < height; row++) {
      for (let col = 0; col < width; col++) {
        const sourceIndex = ((y + row) * sourceWidth + (x + col)) * 4;
        const targetIndex = (row * width + col) * 4;
        
        regionData[targetIndex] = imageData.data[sourceIndex];
        regionData[targetIndex + 1] = imageData.data[sourceIndex + 1];
        regionData[targetIndex + 2] = imageData.data[sourceIndex + 2];
        regionData[targetIndex + 3] = imageData.data[sourceIndex + 3];
      }
    }
    
    return new ImageData(regionData, width, height);
  }

  /**
   * Apply color transformation
   */
  protected applyColorTransform(
    data: Uint8ClampedArray,
    transform: (r: number, g: number, b: number, a: number) => [number, number, number, number]
  ): void {
    for (let i = 0; i < data.length; i += 4) {
      const [r, g, b, a] = transform(data[i], data[i + 1], data[i + 2], data[i + 3]);
      data[i] = r;
      data[i + 1] = g;
      data[i + 2] = b;
      data[i + 3] = a;
    }
  }

  /**
   * Blend two colors
   */
  protected blendColor(
    color1: { r: number; g: number; b: number },
    color2: { r: number; g: number; b: number },
    ratio: number
  ): { r: number; g: number; b: number } {
    return {
      r: Math.round(color1.r * (1 - ratio) + color2.r * ratio),
      g: Math.round(color1.g * (1 - ratio) + color2.g * ratio),
      b: Math.round(color1.b * (1 - ratio) + color2.b * ratio)
    };
  }

  /**
   * Parse hex color to RGB
   */
  protected hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  /**
   * Get cache key for processed image
   */
  protected getCacheKey(canvas: HTMLCanvasElement, options?: ProcessingOptions): string {
    const ctx = canvas.getContext('2d')!;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const dataHash = this.simpleHash(imageData.data);
    const optionsStr = JSON.stringify(options || {});
    return `${this.metadata.name}_${dataHash}_${optionsStr}`;
  }

  /**
   * Simple hash function for cache keys
   */
  private simpleHash(data: Uint8ClampedArray): string {
    let hash = 0;
    for (let i = 0; i < data.length; i += 100) {
      hash = ((hash << 5) - hash) + data[i];
      hash = hash & hash;
    }
    return hash.toString(36);
  }

  /**
   * Get theme metadata
   */
  getMetadata(): ThemeMetadata {
    return this.metadata;
  }

  /**
   * Get theme colors
   */
  getColors(): ThemeColors {
    return this.colors;
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cachedResults.clear();
  }
}

/**
 * Base Theme Processor for processors that work with CanvasRenderingContext2D
 * This is used by the legacy processor architecture
 */
export abstract class BaseThemeProcessor {
  protected name: string;
  protected description: string;

  constructor(name: string, description: string) {
    this.name = name;
    this.description = description;
  }

  /**
   * Process the skin design - must be implemented by each theme
   */
  abstract process(ctx: CanvasRenderingContext2D, design: any): void;

  /**
   * Fill a rectangular region with color
   */
  protected fillRegion(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, color: string): void {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
  }

  /**
   * Draw a single pixel
   */
  protected drawPixel(ctx: CanvasRenderingContext2D, x: number, y: number, color: string): void {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, 1, 1);
  }

  /**
   * Add shading effect
   */
  protected addShading(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, intensity: number): void {
    const imageData = ctx.getImageData(x, y, width, height);
    const data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
      data[i] = Math.max(0, data[i] * (1 - intensity));     // Red
      data[i + 1] = Math.max(0, data[i + 1] * (1 - intensity)); // Green
      data[i + 2] = Math.max(0, data[i + 2] * (1 - intensity)); // Blue
    }
    
    ctx.putImageData(imageData, x, y);
  }

  /**
   * Add highlight effect
   */
  protected addHighlight(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, intensity: number): void {
    const imageData = ctx.getImageData(x, y, width, height);
    const data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
      const brighten = 255 * intensity;
      data[i] = Math.min(255, data[i] + brighten);     // Red
      data[i + 1] = Math.min(255, data[i + 1] + brighten); // Green
      data[i + 2] = Math.min(255, data[i + 2] + brighten); // Blue
    }
    
    ctx.putImageData(imageData, x, y);
  }

  /**
   * Darken a color by a percentage
   */
  protected darkenColor(color: string, percentage: number): string {
    const rgb = this.hexToRgb(color);
    if (!rgb) return color;
    
    const factor = 1 - (percentage / 100);
    return `rgb(${Math.round(rgb.r * factor)}, ${Math.round(rgb.g * factor)}, ${Math.round(rgb.b * factor)})`;
  }

  /**
   * Lighten a color by a percentage
   */
  protected lightenColor(color: string, percentage: number): string {
    const rgb = this.hexToRgb(color);
    if (!rgb) return color;
    
    const factor = percentage / 100;
    const r = Math.min(255, Math.round(rgb.r + (255 - rgb.r) * factor));
    const g = Math.min(255, Math.round(rgb.g + (255 - rgb.g) * factor));
    const b = Math.min(255, Math.round(rgb.b + (255 - rgb.b) * factor));
    
    return `rgb(${r}, ${g}, ${b})`;
  }

  /**
   * Convert hex to RGB
   */
  private hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    // Remove # if present
    hex = hex.replace('#', '');
    
    // Handle 3-digit hex
    if (hex.length === 3) {
      hex = hex.split('').map(char => char + char).join('');
    }
    
    const result = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  /**
   * Draw texture pattern
   */
  protected drawTexture(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, pattern: string): void {
    switch (pattern) {
      case 'chainmail':
        this.drawChainmailTexture(ctx, x, y, width, height);
        break;
      case 'scales':
        this.drawScalesTexture(ctx, x, y, width, height);
        break;
      case 'fabric':
        this.drawFabricTexture(ctx, x, y, width, height);
        break;
    }
  }

  private drawChainmailTexture(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number): void {
    // Simple chainmail pattern
    for (let py = 0; py < height; py += 2) {
      for (let px = 0; px < width; px += 2) {
        const offset = py % 4 === 0 ? 0 : 1;
        if ((px + offset) % 4 === 0) {
          this.drawPixel(ctx, x + px, y + py, '#A0A0A0');
        }
      }
    }
  }

  private drawScalesTexture(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number): void {
    // Simple scale pattern
    for (let py = 0; py < height; py += 3) {
      for (let px = 0; px < width; px += 3) {
        const offset = py % 6 === 0 ? 0 : 1;
        if ((px + offset) % 6 === 0) {
          this.drawPixel(ctx, x + px, y + py, '#606060');
          this.drawPixel(ctx, x + px + 1, y + py + 1, '#808080');
        }
      }
    }
  }

  private drawFabricTexture(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number): void {
    // Simple fabric weave pattern
    for (let py = 0; py < height; py += 2) {
      for (let px = 0; px < width; px += 2) {
        if ((px + py) % 4 === 0) {
          this.drawPixel(ctx, x + px, y + py, '#F0F0F0');
        }
      }
    }
  }

  /**
   * Get processor name
   */
  getName(): string {
    return this.name;
  }

  /**
   * Get processor description
   */
  getDescription(): string {
    return this.description;
  }
}