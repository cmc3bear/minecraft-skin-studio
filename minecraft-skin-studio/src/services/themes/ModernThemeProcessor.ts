/**
 * Modern Theme Processor
 * Applies contemporary and urban style elements to Minecraft skins
 */

import { ThemeProcessor, ThemeColors, ProcessingOptions, ThemeMetadata } from './ThemeProcessor';

export class ModernThemeProcessor extends ThemeProcessor {
  constructor() {
    const metadata: ThemeMetadata = {
      name: 'Modern',
      description: 'Contemporary urban theme with modern fashion and style elements',
      complexity: 'medium',
      processingTime: 110
    };

    const colors: ThemeColors = {
      primary: '#2C3E50',     // Dark blue-gray
      secondary: '#E74C3C',   // Vibrant red
      accent: '#F39C12',      // Orange
      skin: '#FDBCB4',        // Natural skin tone
      hair: '#34495E',        // Dark gray
      eyes: '#3498DB',        // Bright blue
      clothing: ['#2C3E50', '#34495E', '#7F8C8D', '#BDC3C7'],
      accessories: ['#E74C3C', '#F39C12', '#9B59B6', '#1ABC9C']
    };

    super(metadata, colors);
  }

  process(canvas: HTMLCanvasElement, options?: ProcessingOptions): HTMLCanvasElement {
    const defaultOptions: ProcessingOptions = {
      intensity: 0.6,
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

    // Apply modern transformations
    this.applyContemporaryStyle(imageData, opts.intensity);
    this.addModernClothing(imageData);
    this.enhanceUrbanElements(imageData);
    
    if (opts.applyTextures) {
      this.addFabricTextures(imageData);
      this.addBrandingElements(imageData);
    }
    
    if (opts.enhanceDetails) {
      this.addModernAccessories(imageData);
      this.addStylisticDetails(imageData);
    }

    // Apply and cache result
    ctx.putImageData(imageData, 0, 0);
    this.cachedResults.set(cacheKey, imageData);
    
    return canvas;
  }

  private applyContemporaryStyle(imageData: ImageData, intensity: number): void {
    const data = imageData.data;
    const modernColor = this.hexToRgb(this.colors.primary)!;
    
    this.applyColorTransform(data, (r, g, b, a) => {
      if (a === 0) return [r, g, b, a];
      
      // Apply modern color palette with subtle sophistication
      const blend = this.blendColor(
        { r, g, b },
        modernColor,
        intensity * 0.1
      );
      
      // Enhance saturation for modern vibrant look
      const saturationBoost = 1 + (intensity * 0.2);
      const gray = (blend.r + blend.g + blend.b) / 3;
      blend.r = Math.min(255, gray + (blend.r - gray) * saturationBoost);
      blend.g = Math.min(255, gray + (blend.g - gray) * saturationBoost);
      blend.b = Math.min(255, gray + (blend.b - gray) * saturationBoost);
      
      // Apply slight brightness adjustment for contemporary feel
      const brightnessAdjust = 1 + (intensity * 0.05);
      blend.r = Math.min(255, blend.r * brightnessAdjust);
      blend.g = Math.min(255, blend.g * brightnessAdjust);
      blend.b = Math.min(255, blend.b * brightnessAdjust);
      
      return [blend.r, blend.g, blend.b, a];
    });
  }

  private addModernClothing(imageData: ImageData): void {
    const data = imageData.data;
    const width = imageData.width;
    const height = imageData.height;
    
    // Add modern clothing elements
    this.addHoodie(data, width, height);
    this.addJeans(data, width, height);
    this.addSneakers(data, width, height);
    this.addTShirtGraphics(data, width, height);
  }

  private addHoodie(data: Uint8ClampedArray, width: number, height: number): void {
    const hoodieColor = this.hexToRgb(this.colors.primary)!;
    const accentColor = this.hexToRgb(this.colors.accent)!;
    
    // Hoodie body area
    for (let y = 20; y < 32 && y < height; y++) {
      for (let x = 20; x < 28 && x < width; x++) {
        const index = (y * width + x) * 4;
        if (data[index + 3] > 0) {
          // Apply hoodie base color
          const hoodie = this.blendColor(
            { r: data[index], g: data[index + 1], b: data[index + 2] },
            hoodieColor,
            0.6
          );
          data[index] = hoodie.r;
          data[index + 1] = hoodie.g;
          data[index + 2] = hoodie.b;
        }
      }
    }
    
    // Add hoodie strings
    const stringPositions = [
      { x: 22, y: 22 }, { x: 25, y: 22 }
    ];
    
    for (const pos of stringPositions) {
      if (pos.x < width && pos.y < height) {
        const index = (pos.y * width + pos.x) * 4;
        if (data[index + 3] > 0) {
          data[index] = accentColor.r;
          data[index + 1] = accentColor.g;
          data[index + 2] = accentColor.b;
        }
      }
    }
    
    // Add kangaroo pocket
    this.addKangarooPocket(data, width, height, hoodieColor);
  }

  private addKangarooPocket(data: Uint8ClampedArray, width: number, height: number, baseColor: { r: number; g: number; b: number }): void {
    // Pocket outline
    for (let x = 21; x < 27 && x < width; x++) {
      for (let y = 25; y < 29 && y < height; y++) {
        const index = (y * width + x) * 4;
        if (data[index + 3] > 0) {
          // Darken pocket area slightly
          const darkerColor = {
            r: Math.max(0, baseColor.r - 15),
            g: Math.max(0, baseColor.g - 15),
            b: Math.max(0, baseColor.b - 15)
          };
          
          const pocket = this.blendColor(
            { r: data[index], g: data[index + 1], b: data[index + 2] },
            darkerColor,
            0.7
          );
          data[index] = pocket.r;
          data[index + 1] = pocket.g;
          data[index + 2] = pocket.b;
        }
      }
    }
  }

  private addJeans(data: Uint8ClampedArray, width: number, height: number): void {
    const jeansColor = this.hexToRgb('#4682B4')!; // Steel blue for denim
    
    // Jeans on legs
    const legRegions = [
      { x: 4, y: 20, w: 4, h: 12 },   // Left leg
      { x: 20, y: 52, w: 4, h: 12 }   // Right leg
    ];
    
    for (const region of legRegions) {
      for (let y = region.y; y < region.y + region.h && y < height; y++) {
        for (let x = region.x; x < region.x + region.w && x < width; x++) {
          const index = (y * width + x) * 4;
          if (data[index + 3] > 0) {
            const jeans = this.blendColor(
              { r: data[index], g: data[index + 1], b: data[index + 2] },
              jeansColor,
              0.7
            );
            data[index] = jeans.r;
            data[index + 1] = jeans.g;
            data[index + 2] = jeans.b;
          }
        }
      }
    }
    
    // Add denim seams
    this.addDenimSeams(data, width, height);
  }

  private addDenimSeams(data: Uint8ClampedArray, width: number, height: number): void {
    const seamColor = this.hexToRgb('#F39C12')!; // Orange thread
    
    // Vertical seams on legs
    const seamPositions = [
      { x: 6, y: 20, h: 12 },  // Left leg seam
      { x: 22, y: 52, h: 12 }  // Right leg seam
    ];
    
    for (const seam of seamPositions) {
      for (let y = seam.y; y < seam.y + seam.h && y < height; y++) {
        if (seam.x < width && y < height) {
          const index = (y * width + seam.x) * 4;
          if (data[index + 3] > 0) {
            const seamBlend = this.blendColor(
              { r: data[index], g: data[index + 1], b: data[index + 2] },
              seamColor,
              0.3
            );
            data[index] = seamBlend.r;
            data[index + 1] = seamBlend.g;
            data[index + 2] = seamBlend.b;
          }
        }
      }
    }
  }

  private addSneakers(data: Uint8ClampedArray, width: number, height: number): void {
    const sneakerColor = this.hexToRgb('#FFFFFF')!; // White sneakers
    const accentColor = this.hexToRgb(this.colors.secondary)!;
    
    // Sneaker areas (bottom of legs)
    const sneakerRegions = [
      { x: 4, y: 29, w: 4, h: 3 },   // Left sneaker
      { x: 20, y: 61, w: 4, h: 3 }   // Right sneaker
    ];
    
    for (const region of sneakerRegions) {
      for (let y = region.y; y < region.y + region.h && y < height; y++) {
        for (let x = region.x; x < region.x + region.w && x < width; x++) {
          const index = (y * width + x) * 4;
          if (data[index + 3] > 0) {
            const sneaker = this.blendColor(
              { r: data[index], g: data[index + 1], b: data[index + 2] },
              sneakerColor,
              0.8
            );
            data[index] = sneaker.r;
            data[index + 1] = sneaker.g;
            data[index + 2] = sneaker.b;
          }
        }
      }
    }
    
    // Add sneaker accent stripes
    this.addSneakerStripes(data, width, height, accentColor);
  }

  private addSneakerStripes(data: Uint8ClampedArray, width: number, height: number, accentColor: { r: number; g: number; b: number }): void {
    // Add horizontal stripes on sneakers
    const stripePositions = [
      { x: 5, y: 30, w: 2 },  // Left sneaker stripe
      { x: 21, y: 62, w: 2 }  // Right sneaker stripe
    ];
    
    for (const stripe of stripePositions) {
      for (let x = stripe.x; x < stripe.x + stripe.w && x < width; x++) {
        if (stripe.y < height) {
          const index = (stripe.y * width + x) * 4;
          if (data[index + 3] > 0) {
            const stripeBlend = this.blendColor(
              { r: data[index], g: data[index + 1], b: data[index + 2] },
              accentColor,
              0.6
            );
            data[index] = stripeBlend.r;
            data[index + 1] = stripeBlend.g;
            data[index + 2] = stripeBlend.b;
          }
        }
      }
    }
  }

  private addTShirtGraphics(data: Uint8ClampedArray, width: number, height: number): void {
    const graphicColor = this.hexToRgb(this.colors.secondary)!;
    
    // Simple geometric logo on chest
    const logoPattern = [
      { x: 23, y: 23 }, { x: 24, y: 23 },
      { x: 23, y: 24 }, { x: 24, y: 24 }
    ];
    
    for (const pixel of logoPattern) {
      if (pixel.x < width && pixel.y < height) {
        const index = (pixel.y * width + pixel.x) * 4;
        if (data[index + 3] > 0) {
          const logo = this.blendColor(
            { r: data[index], g: data[index + 1], b: data[index + 2] },
            graphicColor,
            0.5
          );
          data[index] = logo.r;
          data[index + 1] = logo.g;
          data[index + 2] = logo.b;
        }
      }
    }
  }

  private enhanceUrbanElements(imageData: ImageData): void {
    const data = imageData.data;
    const width = imageData.width;
    const height = imageData.height;
    
    // Add urban-style details
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const index = (y * width + x) * 4;
        
        if (data[index + 3] > 0) {
          // Add subtle urban grit texture
          if (Math.random() < 0.02) {
            const grit = Math.random() * 10 - 5;
            data[index] = Math.max(0, Math.min(255, data[index] + grit));
            data[index + 1] = Math.max(0, Math.min(255, data[index + 1] + grit));
            data[index + 2] = Math.max(0, Math.min(255, data[index + 2] + grit));
          }
        }
      }
    }
  }

  private addFabricTextures(imageData: ImageData): void {
    const data = imageData.data;
    const width = imageData.width;
    const height = imageData.height;
    
    // Add fabric textures to clothing areas
    for (let y = 20; y < 32 && y < height; y++) {
      for (let x = 20; x < 28 && x < width; x++) {
        const index = (y * width + x) * 4;
        
        if (data[index + 3] > 0) {
          // Cotton/fleece texture
          const fabricNoise = Math.sin(x * 0.5) * Math.cos(y * 0.3) * 3;
          data[index] = Math.max(0, Math.min(255, data[index] + fabricNoise));
          data[index + 1] = Math.max(0, Math.min(255, data[index + 1] + fabricNoise));
          data[index + 2] = Math.max(0, Math.min(255, data[index + 2] + fabricNoise));
        }
      }
    }
  }

  private addBrandingElements(imageData: ImageData): void {
    const data = imageData.data;
    const width = imageData.width;
    const height = imageData.height;
    const brandColor = this.hexToRgb(this.colors.accent)!;
    
    // Add subtle brand tags and labels
    const brandPositions = [
      { x: 26, y: 31 }, // Bottom of shirt
      { x: 7, y: 31 },  // Left leg label
      { x: 23, y: 63 }  // Right leg label
    ];
    
    for (const brand of brandPositions) {
      if (brand.x < width && brand.y < height) {
        const index = (brand.y * width + brand.x) * 4;
        if (data[index + 3] > 0) {
          const brandBlend = this.blendColor(
            { r: data[index], g: data[index + 1], b: data[index + 2] },
            brandColor,
            0.3
          );
          data[index] = brandBlend.r;
          data[index + 1] = brandBlend.g;
          data[index + 2] = brandBlend.b;
        }
      }
    }
  }

  private addModernAccessories(imageData: ImageData): void {
    const data = imageData.data;
    const width = imageData.width;
    const height = imageData.height;
    const accessoryColor = this.hexToRgb(this.colors.accent)!;
    
    // Add modern accessories
    this.addWristwatch(data, width, height, accessoryColor);
    this.addSmartphone(data, width, height);
    this.addHeadphones(data, width, height, accessoryColor);
  }

  private addWristwatch(data: Uint8ClampedArray, width: number, height: number, color: { r: number; g: number; b: number }): void {
    // Simple wristwatch on arm
    const watchPositions = [
      { x: 45, y: 26 }, { x: 46, y: 26 } // Left wrist
    ];
    
    for (const pos of watchPositions) {
      if (pos.x < width && pos.y < height) {
        const index = (pos.y * width + pos.x) * 4;
        if (data[index + 3] > 0) {
          const watch = this.blendColor(
            { r: data[index], g: data[index + 1], b: data[index + 2] },
            color,
            0.6
          );
          data[index] = watch.r;
          data[index + 1] = watch.g;
          data[index + 2] = watch.b;
        }
      }
    }
  }

  private addSmartphone(data: Uint8ClampedArray, width: number, height: number): void {
    const phoneColor = this.hexToRgb('#000000')!; // Black phone
    
    // Phone in pocket area
    const phonePosition = { x: 22, y: 26 };
    
    if (phonePosition.x < width && phonePosition.y < height) {
      const index = (phonePosition.y * width + phonePosition.x) * 4;
      if (data[index + 3] > 0) {
        const phone = this.blendColor(
          { r: data[index], g: data[index + 1], b: data[index + 2] },
          phoneColor,
          0.4
        );
        data[index] = phone.r;
        data[index + 1] = phone.g;
        data[index + 2] = phone.b;
      }
    }
  }

  private addHeadphones(data: Uint8ClampedArray, width: number, height: number, color: { r: number; g: number; b: number }): void {
    // Headphones around neck/ears
    const headphonePositions = [
      { x: 9, y: 9 },   // Left ear
      { x: 14, y: 9 },  // Right ear
      { x: 11, y: 16 }, { x: 12, y: 16 } // Neck band
    ];
    
    for (const pos of headphonePositions) {
      if (pos.x < width && pos.y < height) {
        const index = (pos.y * width + pos.x) * 4;
        if (data[index + 3] > 0) {
          const headphones = this.blendColor(
            { r: data[index], g: data[index + 1], b: data[index + 2] },
            color,
            0.5
          );
          data[index] = headphones.r;
          data[index + 1] = headphones.g;
          data[index + 2] = headphones.b;
        }
      }
    }
  }

  private addStylisticDetails(imageData: ImageData): void {
    const data = imageData.data;
    const width = imageData.width;
    const height = imageData.height;
    
    // Add modern styling effects
    this.addHairStyling(data, width, height);
    this.addModernMakeup(data, width, height);
  }

  private addHairStyling(data: Uint8ClampedArray, width: number, height: number): void {
    const styleColor = this.hexToRgb(this.colors.primary)!;
    
    // Add modern hair styling effects (hair product shine)
    for (let y = 8; y < 16 && y < height; y++) {
      for (let x = 8; x < 16 && x < width; x++) {
        const index = (y * width + x) * 4;
        
        if (data[index + 3] > 0) {
          // Check if this is a hair area (darker colors typically)
          const brightness = (data[index] + data[index + 1] + data[index + 2]) / 3;
          if (brightness < 150) {
            // Add subtle shine effect
            if ((x + y * 2) % 6 === 0) {
              const shine = 0.1;
              data[index] = Math.min(255, data[index] * (1 + shine));
              data[index + 1] = Math.min(255, data[index + 1] * (1 + shine));
              data[index + 2] = Math.min(255, data[index + 2] * (1 + shine));
            }
          }
        }
      }
    }
  }

  private addModernMakeup(data: Uint8ClampedArray, width: number, height: number): void {
    // Subtle modern makeup effects on face area
    const lipColor = this.hexToRgb('#E74C3C')!; // Red lips
    
    // Lip area (approximate)
    const lipPositions = [
      { x: 11, y: 13 }, { x: 12, y: 13 }
    ];
    
    for (const pos of lipPositions) {
      if (pos.x < width && pos.y < height) {
        const index = (pos.y * width + pos.x) * 4;
        if (data[index + 3] > 0) {
          const lips = this.blendColor(
            { r: data[index], g: data[index + 1], b: data[index + 2] },
            lipColor,
            0.3
          );
          data[index] = lips.r;
          data[index + 1] = lips.g;
          data[index + 2] = lips.b;
        }
      }
    }
  }
}