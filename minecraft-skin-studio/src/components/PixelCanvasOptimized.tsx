import { useRef, useEffect, useState, useCallback, forwardRef, useImperativeHandle } from 'react';
import { Point, Tool, Color } from '../types';
import { canvasToBase64, base64ToCanvas } from '../utils/canvasUtils';
import '../styles/PixelCanvas.css';

interface PixelCanvasProps {
  width?: number;
  height?: number;
  pixelSize?: number;
  currentTool: Tool;
  currentColor: Color;
  onPixelChange?: (x: number, y: number, color: Color) => void;
  initialData?: string;
  showFPS?: boolean; // For development monitoring
}

export interface PixelCanvasRef {
  getImageData: () => string;
  setImageData: (data: string) => void;
  clear: () => void;
  getFPS: () => number;
}

const CANVAS_SIZE = 64; // Minecraft skin size
const TARGET_FPS = 60; // S2 objective

const PixelCanvasOptimized = forwardRef<PixelCanvasRef, PixelCanvasProps>(({
  width = CANVAS_SIZE,
  height = CANVAS_SIZE,
  pixelSize = 8,
  currentTool,
  currentColor,
  onPixelChange,
  initialData,
  showFPS = false
}, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const offscreenCanvasRef = useRef<OffscreenCanvas | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentFPS, setCurrentFPS] = useState(0);
  
  // Performance monitoring
  const fpsCounterRef = useRef({
    frames: 0,
    lastTime: performance.now(),
    fps: 0
  });
  
  // Pixel buffer for batched updates
  const pixelBufferRef = useRef<Map<string, Color>>(new Map());
  const lastDrawPositionRef = useRef<Point | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Use willReadFrequently for better performance when reading pixel data
    const ctx = canvas.getContext('2d', { 
      willReadFrequently: true,
      alpha: false // We don't need transparency
    });
    if (!ctx) return;

    // Initialize canvas
    canvas.width = width * pixelSize;
    canvas.height = height * pixelSize;

    // Create offscreen canvas for double buffering
    if ('OffscreenCanvas' in window) {
      offscreenCanvasRef.current = new OffscreenCanvas(canvas.width, canvas.height);
    }

    // Set image smoothing off for crisp pixels
    ctx.imageSmoothingEnabled = false;

    // Initialize with white background
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    drawGrid(ctx, width, height, pixelSize);
    
    // Load initial data if provided
    if (initialData) {
      base64ToCanvas(initialData, canvas, () => {
        drawGrid(ctx, width, height, pixelSize);
      });
    }

    // Start render loop
    startRenderLoop();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [width, height, pixelSize, initialData]);

  const startRenderLoop = useCallback(() => {
    const render = (currentTime: number) => {
      // FPS calculation
      const fpsCounter = fpsCounterRef.current;
      fpsCounter.frames++;
      
      if (currentTime - fpsCounter.lastTime >= 1000) {
        fpsCounter.fps = fpsCounter.frames;
        fpsCounter.frames = 0;
        fpsCounter.lastTime = currentTime;
        setCurrentFPS(fpsCounter.fps);
        
        // Log performance for OQE monitoring
        if (fpsCounter.fps < TARGET_FPS) {
          console.warn(`⚠️ FPS below target: ${fpsCounter.fps} < ${TARGET_FPS}`);
        }
      }

      // Process pixel buffer
      if (pixelBufferRef.current.size > 0) {
        renderPixelBuffer();
      }

      animationFrameRef.current = requestAnimationFrame(render);
    };

    animationFrameRef.current = requestAnimationFrame(render);
  }, []);

  const renderPixelBuffer = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const buffer = pixelBufferRef.current;
    
    // Batch render all pending pixels
    buffer.forEach((color, key) => {
      const [x, y] = key.split(',').map(Number);
      
      ctx.fillStyle = color.hex;
      ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);

      // Redraw grid cell
      ctx.strokeStyle = '#ddd';
      ctx.strokeRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
    });

    // Clear buffer after rendering
    buffer.clear();
  }, [pixelSize]);

  const drawGrid = (ctx: CanvasRenderingContext2D, w: number, h: number, size: number) => {
    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 1;

    // Batch path operations for better performance
    ctx.beginPath();
    
    // Draw vertical lines
    for (let x = 0; x <= w; x++) {
      ctx.moveTo(x * size, 0);
      ctx.lineTo(x * size, h * size);
    }

    // Draw horizontal lines
    for (let y = 0; y <= h; y++) {
      ctx.moveTo(0, y * size);
      ctx.lineTo(w * size, y * size);
    }
    
    ctx.stroke();
  };

  const getPixelCoords = (e: React.MouseEvent<HTMLCanvasElement>): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / pixelSize);
    const y = Math.floor((e.clientY - rect.top) / pixelSize);

    return { x, y };
  };

  const drawPixel = (x: number, y: number, color: Color) => {
    if (x < 0 || x >= width || y < 0 || y >= height) return;

    // Add to pixel buffer for batched rendering
    pixelBufferRef.current.set(`${x},${y}`, color);

    if (onPixelChange) {
      onPixelChange(x, y, color);
    }
  };

  const erasePixel = (x: number, y: number) => {
    if (x < 0 || x >= width || y < 0 || y >= height) return;

    const whiteColor = { hex: '#ffffff', rgb: { r: 255, g: 255, b: 255 } };
    pixelBufferRef.current.set(`${x},${y}`, whiteColor);

    if (onPixelChange) {
      onPixelChange(x, y, whiteColor);
    }
  };

  const interpolatePixels = (from: Point, to: Point, callback: (x: number, y: number) => void) => {
    // Bresenham's line algorithm for smooth drawing
    const dx = Math.abs(to.x - from.x);
    const dy = Math.abs(to.y - from.y);
    const sx = from.x < to.x ? 1 : -1;
    const sy = from.y < to.y ? 1 : -1;
    let err = dx - dy;
    let x = from.x;
    let y = from.y;

    while (true) {
      callback(x, y);

      if (x === to.x && y === to.y) break;

      const e2 = 2 * err;
      if (e2 > -dy) {
        err -= dy;
        x += sx;
      }
      if (e2 < dx) {
        err += dx;
        y += sy;
      }
    }
  };

  const floodFill = (startX: number, startY: number, fillColor: Color) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    // Use ImageData for faster pixel access
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const targetColor = getPixelColor(imageData, startX, startY);
    
    if (colorsMatch(targetColor, fillColor)) return;

    const pixelsToCheck: Point[] = [{ x: startX, y: startY }];
    const checked = new Set<string>();

    while (pixelsToCheck.length > 0) {
      const { x, y } = pixelsToCheck.pop()!;
      const key = `${x},${y}`;

      if (checked.has(key) || x < 0 || x >= width || y < 0 || y >= height) continue;
      checked.add(key);

      const currentColor = getPixelColor(imageData, x, y);
      if (!colorsMatch(currentColor, targetColor)) continue;

      drawPixel(x, y, fillColor);

      // Add adjacent pixels
      pixelsToCheck.push(
        { x: x + 1, y },
        { x: x - 1, y },
        { x, y: y + 1 },
        { x, y: y - 1 }
      );
    }
  };

  const getPixelColor = (imageData: ImageData, x: number, y: number): Color => {
    const canvas = canvasRef.current;
    if (!canvas) return { hex: '#ffffff', rgb: { r: 255, g: 255, b: 255 } };

    const pixelX = x * pixelSize + Math.floor(pixelSize / 2);
    const pixelY = y * pixelSize + Math.floor(pixelSize / 2);
    const index = (pixelY * canvas.width + pixelX) * 4;

    const r = imageData.data[index];
    const g = imageData.data[index + 1];
    const b = imageData.data[index + 2];

    const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;

    return { hex, rgb: { r, g, b } };
  };

  const colorsMatch = (color1: Color, color2: Color): boolean => {
    return color1.rgb.r === color2.rgb.r && 
           color1.rgb.g === color2.rgb.g && 
           color1.rgb.b === color2.rgb.b;
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const coords = getPixelCoords(e);
    lastDrawPositionRef.current = coords;

    switch (currentTool.id) {
      case 'pencil':
        drawPixel(coords.x, coords.y, currentColor);
        break;
      case 'eraser':
        erasePixel(coords.x, coords.y);
        break;
      case 'fill':
        floodFill(coords.x, coords.y, currentColor);
        break;
      case 'picker':
        // Color picker will be implemented
        break;
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const coords = getPixelCoords(e);
    const lastPos = lastDrawPositionRef.current;

    if (lastPos && (currentTool.id === 'pencil' || currentTool.id === 'eraser')) {
      // Interpolate between last position and current for smooth lines
      interpolatePixels(lastPos, coords, (x, y) => {
        if (currentTool.id === 'pencil') {
          drawPixel(x, y, currentColor);
        } else {
          erasePixel(x, y);
        }
      });
    }

    lastDrawPositionRef.current = coords;
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
    lastDrawPositionRef.current = null;
  };

  const handleMouseLeave = () => {
    setIsDrawing(false);
    lastDrawPositionRef.current = null;
  };

  // Keyboard navigation
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [keyboardDrawing, setKeyboardDrawing] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gridWidth = Math.floor(width / pixelSize);
    const gridHeight = Math.floor(height / pixelSize);
    let newX = cursorPosition.x;
    let newY = cursorPosition.y;

    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault();
        newY = Math.max(0, cursorPosition.y - 1);
        break;
      case 'ArrowDown':
        e.preventDefault();
        newY = Math.min(gridHeight - 1, cursorPosition.y + 1);
        break;
      case 'ArrowLeft':
        e.preventDefault();
        newX = Math.max(0, cursorPosition.x - 1);
        break;
      case 'ArrowRight':
        e.preventDefault();
        newX = Math.min(gridWidth - 1, cursorPosition.x + 1);
        break;
      case ' ':
      case 'Enter':
        e.preventDefault();
        // Draw/erase at current position
        switch (currentTool.id) {
          case 'pencil':
            drawPixel(cursorPosition.x, cursorPosition.y, currentColor);
            break;
          case 'eraser':
            erasePixel(cursorPosition.x, cursorPosition.y);
            break;
          case 'fill':
            floodFill(cursorPosition.x, cursorPosition.y, currentColor);
            break;
        }
        break;
      case 'Shift':
        setKeyboardDrawing(true);
        break;
    }

    setCursorPosition({ x: newX, y: newY });
    
    // Draw cursor indicator
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (ctx) {
      // Redraw to clear old cursor
      drawGrid(ctx, width, height, pixelSize);
      // Draw cursor outline
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 2;
      ctx.strokeRect(newX * pixelSize, newY * pixelSize, pixelSize, pixelSize);
    }
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLCanvasElement>) => {
    if (e.key === 'Shift') {
      setKeyboardDrawing(false);
    }
  };
  
  useImperativeHandle(ref, () => ({
    getImageData: () => {
      const canvas = canvasRef.current;
      if (!canvas) return '';
      return canvasToBase64(canvas);
    },
    setImageData: (data: string) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      base64ToCanvas(data, canvas, () => {
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (ctx) drawGrid(ctx, width, height, pixelSize);
      });
    },
    clear: () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return;
      
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      drawGrid(ctx, width, height, pixelSize);
    },
    getFPS: () => fpsCounterRef.current.fps
  }), [width, height, pixelSize]);

  return (
    <div className="pixel-canvas-container">
      {showFPS && (
        <div 
          className={`fps-counter ${currentFPS >= TARGET_FPS ? 'fps-good' : 'fps-warning'}`}
          role="status" 
          aria-live="polite" 
          aria-atomic="true"
        >
          <span aria-label={`${currentFPS} frames per second${currentFPS < TARGET_FPS ? ', performance warning' : ''}`}>
            FPS: {currentFPS} {currentFPS >= TARGET_FPS ? '✅' : '⚠️'}
          </span>
        </div>
      )}
      <canvas
        ref={canvasRef}
        className="pixel-canvas"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        role="img"
        aria-label="Minecraft skin editor canvas. Use arrow keys to navigate, Space/Enter to draw, Shift+arrows to draw continuously."
        tabIndex={0}
        style={{ cursor: currentTool.cursor || 'crosshair' }}
      />
    </div>
  );
});

PixelCanvasOptimized.displayName = 'PixelCanvasOptimized';

export default PixelCanvasOptimized;