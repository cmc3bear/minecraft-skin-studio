/**
 * Pixel Manipulation Utilities
 * Optimized functions for pixel-level operations on canvas
 */

export class PixelUtils {
  /**
   * Draw a single pixel with optimized performance
   */
  static drawPixel(ctx: CanvasRenderingContext2D, x: number, y: number, color: string): void {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, 1, 1);
  }

  /**
   * Draw multiple pixels in batch for better performance
   */
  static drawPixelsBatch(ctx: CanvasRenderingContext2D, pixels: Array<{x: number, y: number, color: string}>): void {
    // Group pixels by color to minimize fillStyle changes
    const pixelsByColor = new Map<string, Array<{x: number, y: number}>>();
    
    for (const pixel of pixels) {
      if (!pixelsByColor.has(pixel.color)) {
        pixelsByColor.set(pixel.color, []);
      }
      pixelsByColor.get(pixel.color)!.push({x: pixel.x, y: pixel.y});
    }
    
    // Draw all pixels of the same color together
    for (const [color, positions] of pixelsByColor) {
      ctx.fillStyle = color;
      for (const pos of positions) {
        ctx.fillRect(pos.x, pos.y, 1, 1);
      }
    }
  }

  /**
   * Fill a rectangular region efficiently
   */
  static fillRegion(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, color: string): void {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
  }

  /**
   * Draw a line between two points
   */
  static drawLine(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, color: string, width: number = 1): void {
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.beginPath();
    ctx.moveTo(x1 + 0.5, y1 + 0.5);
    ctx.lineTo(x2 + 0.5, y2 + 0.5);
    ctx.stroke();
  }

  /**
   * Apply gradient to a region
   */
  static applyGradient(
    ctx: CanvasRenderingContext2D, 
    x: number, 
    y: number, 
    width: number, 
    height: number, 
    startColor: string, 
    endColor: string,
    direction: 'horizontal' | 'vertical' | 'diagonal' = 'vertical'
  ): void {
    let gradient: CanvasGradient;
    
    switch (direction) {
      case 'horizontal':
        gradient = ctx.createLinearGradient(x, y, x + width, y);
        break;
      case 'diagonal':
        gradient = ctx.createLinearGradient(x, y, x + width, y + height);
        break;
      default: // vertical
        gradient = ctx.createLinearGradient(x, y, x, y + height);
    }
    
    gradient.addColorStop(0, startColor);
    gradient.addColorStop(1, endColor);
    
    ctx.fillStyle = gradient;
    ctx.fillRect(x, y, width, height);
  }

  /**
   * Apply pattern to a region
   */
  static applyPattern(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    pattern: number[][],
    colors: string[]
  ): void {
    const patternHeight = pattern.length;
    const patternWidth = pattern[0].length;
    
    for (let py = 0; py < height; py++) {
      for (let px = 0; px < width; px++) {
        const patternY = py % patternHeight;
        const patternX = px % patternWidth;
        const colorIndex = pattern[patternY][patternX];
        
        if (colorIndex >= 0 && colorIndex < colors.length) {
          this.drawPixel(ctx, x + px, y + py, colors[colorIndex]);
        }
      }
    }
  }

  /**
   * Get pixel data from canvas
   */
  static getPixel(ctx: CanvasRenderingContext2D, x: number, y: number): { r: number, g: number, b: number, a: number } {
    const imageData = ctx.getImageData(x, y, 1, 1);
    const data = imageData.data;
    return {
      r: data[0],
      g: data[1],
      b: data[2],
      a: data[3]
    };
  }

  /**
   * Set pixel data using ImageData for better performance with large operations
   */
  static setPixelData(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, pixelData: Uint8ClampedArray): void {
    const imageData = new ImageData(pixelData, width, height);
    ctx.putImageData(imageData, x, y);
  }

  /**
   * Flood fill algorithm for filling connected regions
   */
  static floodFill(ctx: CanvasRenderingContext2D, startX: number, startY: number, fillColor: string, tolerance: number = 0): void {
    const canvas = ctx.canvas;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    const targetColor = this.getPixel(ctx, startX, startY);
    const fillRGB = this.hexToRgb(fillColor);
    
    if (this.colorsMatch(targetColor, fillRGB, 0)) {
      return; // Already the fill color
    }
    
    const stack: Array<{x: number, y: number}> = [{x: startX, y: startY}];
    const visited = new Set<string>();
    
    while (stack.length > 0) {
      const {x, y} = stack.pop()!;
      const key = `${x},${y}`;
      
      if (visited.has(key) || x < 0 || x >= canvas.width || y < 0 || y >= canvas.height) {
        continue;
      }
      
      visited.add(key);
      
      const index = (y * canvas.width + x) * 4;
      const currentColor = {
        r: data[index],
        g: data[index + 1],
        b: data[index + 2],
        a: data[index + 3]
      };
      
      if (this.colorsMatch(currentColor, targetColor, tolerance)) {
        data[index] = fillRGB.r;
        data[index + 1] = fillRGB.g;
        data[index + 2] = fillRGB.b;
        data[index + 3] = 255;
        
        stack.push({x: x + 1, y});
        stack.push({x: x - 1, y});
        stack.push({x, y: y + 1});
        stack.push({x, y: y - 1});
      }
    }
    
    ctx.putImageData(imageData, 0, 0);
  }

  /**
   * Apply blur effect to a region
   */
  static applyBlur(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number = 1): void {
    const imageData = ctx.getImageData(x, y, width, height);
    const data = imageData.data;
    const output = new Uint8ClampedArray(data);
    
    for (let py = 0; py < height; py++) {
      for (let px = 0; px < width; px++) {
        let r = 0, g = 0, b = 0, a = 0;
        let count = 0;
        
        for (let dy = -radius; dy <= radius; dy++) {
          for (let dx = -radius; dx <= radius; dx++) {
            const nx = px + dx;
            const ny = py + dy;
            
            if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
              const index = (ny * width + nx) * 4;
              r += data[index];
              g += data[index + 1];
              b += data[index + 2];
              a += data[index + 3];
              count++;
            }
          }
        }
        
        const index = (py * width + px) * 4;
        output[index] = r / count;
        output[index + 1] = g / count;
        output[index + 2] = b / count;
        output[index + 3] = a / count;
      }
    }
    
    const blurredImageData = new ImageData(output, width, height);
    ctx.putImageData(blurredImageData, x, y);
  }

  /**
   * Convert hex color to RGB
   */
  static hexToRgb(hex: string): { r: number, g: number, b: number } {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  }

  /**
   * Convert RGB to hex color
   */
  static rgbToHex(r: number, g: number, b: number): string {
    return '#' + [r, g, b].map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('');
  }

  /**
   * Check if two colors match within tolerance
   */
  private static colorsMatch(c1: {r: number, g: number, b: number}, c2: {r: number, g: number, b: number}, tolerance: number): boolean {
    return Math.abs(c1.r - c2.r) <= tolerance &&
           Math.abs(c1.g - c2.g) <= tolerance &&
           Math.abs(c1.b - c2.b) <= tolerance;
  }

  /**
   * Apply pixelation effect
   */
  static pixelate(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, pixelSize: number = 4): void {
    const imageData = ctx.getImageData(x, y, width, height);
    const data = imageData.data;
    
    for (let py = 0; py < height; py += pixelSize) {
      for (let px = 0; px < width; px += pixelSize) {
        // Get average color for the pixel block
        let r = 0, g = 0, b = 0, a = 0;
        let count = 0;
        
        for (let dy = 0; dy < pixelSize && py + dy < height; dy++) {
          for (let dx = 0; dx < pixelSize && px + dx < width; dx++) {
            const index = ((py + dy) * width + (px + dx)) * 4;
            r += data[index];
            g += data[index + 1];
            b += data[index + 2];
            a += data[index + 3];
            count++;
          }
        }
        
        r = Math.round(r / count);
        g = Math.round(g / count);
        b = Math.round(b / count);
        a = Math.round(a / count);
        
        // Set all pixels in the block to the average color
        for (let dy = 0; dy < pixelSize && py + dy < height; dy++) {
          for (let dx = 0; dx < pixelSize && px + dx < width; dx++) {
            const index = ((py + dy) * width + (px + dx)) * 4;
            data[index] = r;
            data[index + 1] = g;
            data[index + 2] = b;
            data[index + 3] = a;
          }
        }
      }
    }
    
    ctx.putImageData(imageData, x, y);
  }
}