/**
 * DirtyRectangleManager - Optimizes canvas rendering by only redrawing changed regions
 * Achieves 60+ FPS by minimizing unnecessary draw operations
 */

export interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface RenderContext {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  pixelData: Uint8ClampedArray;
}

export class DirtyRectangleManager {
  private dirtyRegions: Set<Rectangle> = new Set();
  private frameScheduled = false;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private frameBudget = 16.67; // ms for 60 FPS
  private lastFrameTime = 0;
  private frameCount = 0;
  private fps = 0;
  private renderCallback: ((regions: Rectangle[]) => void) | null = null;
  
  // Performance metrics
  private metrics = {
    totalFrames: 0,
    droppedFrames: 0,
    averageRenderTime: 0,
    peakRenderTime: 0,
    regionsPerFrame: 0
  };

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    
    // Get context with performance optimizations
    const ctx = canvas.getContext('2d', { 
      alpha: false, // Disable alpha for better performance
      desynchronized: true, // Hint for browser to desynchronize canvas updates
      willReadFrequently: false // We won't be reading pixels frequently
    });
    
    if (!ctx) {
      throw new Error('Failed to get 2D context from canvas');
    }
    
    this.ctx = ctx;
    
    // Set image smoothing for pixel art
    this.ctx.imageSmoothingEnabled = false;
    
    // Start FPS counter
    this.startFPSCounter();
  }

  /**
   * Marks a region as dirty and schedules a render
   * @param x X coordinate of the dirty region
   * @param y Y coordinate of the dirty region
   * @param width Width of the dirty region
   * @param height Height of the dirty region
   */
  markDirty(x: number, y: number, width: number, height: number): void {
    // Clamp to canvas bounds
    const clampedRegion = this.clampToCanvas({
      x: Math.floor(x),
      y: Math.floor(y),
      width: Math.ceil(width),
      height: Math.ceil(height)
    });
    
    if (clampedRegion.width <= 0 || clampedRegion.height <= 0) {
      return; // Region is outside canvas
    }
    
    // Try to coalesce with existing regions
    const coalesced = this.coalesceRegion(clampedRegion);
    
    if (coalesced) {
      // Remove old regions that were coalesced
      coalesced.merged.forEach(region => this.dirtyRegions.delete(region));
      // Add the new coalesced region
      this.dirtyRegions.add(coalesced.result);
    } else {
      // Add as new region
      this.dirtyRegions.add(clampedRegion);
    }
    
    this.scheduleRender();
  }

  /**
   * Marks the entire canvas as dirty
   */
  markAllDirty(): void {
    this.dirtyRegions.clear();
    this.dirtyRegions.add({
      x: 0,
      y: 0,
      width: this.canvas.width,
      height: this.canvas.height
    });
    this.scheduleRender();
  }

  /**
   * Clears all dirty regions without rendering
   */
  clearDirtyRegions(): void {
    this.dirtyRegions.clear();
    this.frameScheduled = false;
  }

  /**
   * Sets a callback to be called when regions are rendered
   * @param callback Function to call with the rendered regions
   */
  setRenderCallback(callback: (regions: Rectangle[]) => void): void {
    this.renderCallback = callback;
  }

  /**
   * Gets current FPS
   */
  getFPS(): number {
    return this.fps;
  }

  /**
   * Gets performance metrics
   */
  getMetrics(): typeof this.metrics {
    return { ...this.metrics };
  }

  /**
   * Schedules a render using requestAnimationFrame
   */
  private scheduleRender(): void {
    if (!this.frameScheduled && this.dirtyRegions.size > 0) {
      this.frameScheduled = true;
      requestAnimationFrame((timestamp) => {
        this.render(timestamp);
      });
    }
  }

  /**
   * Renders all dirty regions within the frame budget
   */
  private render(timestamp: number): void {
    const startTime = performance.now();
    
    // Calculate time since last frame
    const deltaTime = timestamp - this.lastFrameTime;
    this.lastFrameTime = timestamp;
    
    // Check if we're dropping frames
    if (deltaTime > this.frameBudget * 1.5) {
      this.metrics.droppedFrames++;
    }
    
    // Convert Set to Array for processing
    const regions = Array.from(this.dirtyRegions);
    const renderedRegions: Rectangle[] = [];
    
    // Render regions within frame budget
    for (const region of regions) {
      const elapsed = performance.now() - startTime;
      
      // Check if we're approaching frame budget
      if (elapsed > this.frameBudget * 0.8 && renderedRegions.length > 0) {
        // Defer remaining regions to next frame
        break;
      }
      
      // Render the region
      if (this.renderCallback) {
        this.renderCallback([region]);
      }
      
      renderedRegions.push(region);
      this.dirtyRegions.delete(region);
    }
    
    // Update metrics
    const renderTime = performance.now() - startTime;
    this.metrics.totalFrames++;
    this.metrics.averageRenderTime = 
      (this.metrics.averageRenderTime * (this.metrics.totalFrames - 1) + renderTime) / 
      this.metrics.totalFrames;
    this.metrics.peakRenderTime = Math.max(this.metrics.peakRenderTime, renderTime);
    this.metrics.regionsPerFrame = 
      (this.metrics.regionsPerFrame * (this.metrics.totalFrames - 1) + renderedRegions.length) / 
      this.metrics.totalFrames;
    
    // Reset frame scheduled flag
    this.frameScheduled = false;
    
    // Schedule next frame if there are remaining dirty regions
    if (this.dirtyRegions.size > 0) {
      this.scheduleRender();
    }
  }

  /**
   * Attempts to coalesce a region with existing dirty regions
   * @param region The region to coalesce
   * @returns Coalesced region and merged regions, or null if no coalescing possible
   */
  private coalesceRegion(region: Rectangle): { result: Rectangle; merged: Rectangle[] } | null {
    const threshold = 50; // Pixel threshold for coalescing
    const merged: Rectangle[] = [];
    let result = { ...region };
    
    for (const existing of this.dirtyRegions) {
      if (this.shouldCoalesce(result, existing, threshold)) {
        // Merge the regions
        const minX = Math.min(result.x, existing.x);
        const minY = Math.min(result.y, existing.y);
        const maxX = Math.max(result.x + result.width, existing.x + existing.width);
        const maxY = Math.max(result.y + result.height, existing.y + existing.height);
        
        result = {
          x: minX,
          y: minY,
          width: maxX - minX,
          height: maxY - minY
        };
        
        merged.push(existing);
      }
    }
    
    // Only return if we actually merged something
    return merged.length > 0 ? { result, merged } : null;
  }

  /**
   * Determines if two regions should be coalesced
   * @param a First region
   * @param b Second region
   * @param threshold Distance threshold for coalescing
   */
  private shouldCoalesce(a: Rectangle, b: Rectangle, threshold: number): boolean {
    // Check if regions overlap
    if (this.regionsOverlap(a, b)) {
      return true;
    }
    
    // Check if regions are close enough
    const distance = this.regionDistance(a, b);
    if (distance < threshold) {
      // Check if coalescing would not create too large a region
      const minX = Math.min(a.x, b.x);
      const minY = Math.min(a.y, b.y);
      const maxX = Math.max(a.x + a.width, b.x + b.width);
      const maxY = Math.max(a.y + a.height, b.y + b.height);
      
      const coalescedArea = (maxX - minX) * (maxY - minY);
      const separateArea = (a.width * a.height) + (b.width * b.height);
      
      // Only coalesce if the combined area is not too much larger
      return coalescedArea < separateArea * 1.5;
    }
    
    return false;
  }

  /**
   * Checks if two regions overlap
   */
  private regionsOverlap(a: Rectangle, b: Rectangle): boolean {
    return !(
      a.x + a.width < b.x ||
      b.x + b.width < a.x ||
      a.y + a.height < b.y ||
      b.y + b.height < a.y
    );
  }

  /**
   * Calculates the distance between two regions
   */
  private regionDistance(a: Rectangle, b: Rectangle): number {
    const xDistance = Math.max(0, Math.max(a.x - (b.x + b.width), b.x - (a.x + a.width)));
    const yDistance = Math.max(0, Math.max(a.y - (b.y + b.height), b.y - (a.y + a.height)));
    return Math.sqrt(xDistance * xDistance + yDistance * yDistance);
  }

  /**
   * Clamps a region to canvas bounds
   */
  private clampToCanvas(region: Rectangle): Rectangle {
    const x = Math.max(0, region.x);
    const y = Math.max(0, region.y);
    const width = Math.min(region.width, this.canvas.width - x);
    const height = Math.min(region.height, this.canvas.height - y);
    
    return { x, y, width, height };
  }

  /**
   * Starts the FPS counter
   */
  private startFPSCounter(): void {
    let lastTime = performance.now();
    let frames = 0;
    
    const updateFPS = () => {
      const currentTime = performance.now();
      frames++;
      
      if (currentTime >= lastTime + 1000) {
        this.fps = Math.round((frames * 1000) / (currentTime - lastTime));
        frames = 0;
        lastTime = currentTime;
      }
      
      requestAnimationFrame(updateFPS);
    };
    
    requestAnimationFrame(updateFPS);
  }

  /**
   * Destroys the manager and cleans up resources
   */
  destroy(): void {
    this.dirtyRegions.clear();
    this.frameScheduled = false;
    this.renderCallback = null;
  }
}