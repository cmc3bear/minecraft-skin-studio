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
}

export interface PixelCanvasRef {
  getImageData: () => string;
  setImageData: (data: string) => void;
  clear: () => void;
}

const CANVAS_SIZE = 64; // Minecraft skin size

const PixelCanvas = forwardRef<PixelCanvasRef, PixelCanvasProps>(({
  width = CANVAS_SIZE,
  height = CANVAS_SIZE,
  pixelSize = 8,
  currentTool,
  currentColor,
  onPixelChange,
  initialData
}, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [canvasData, setCanvasData] = useState<ImageData | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    // Initialize canvas
    canvas.width = width * pixelSize;
    canvas.height = height * pixelSize;

    // Set image smoothing off for crisp pixels
    ctx.imageSmoothingEnabled = false;

    // Initialize with white background
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    drawGrid(ctx, width, height, pixelSize);

    // Save initial canvas data
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setCanvasData(imageData);
    
    // Load initial data if provided
    if (initialData) {
      base64ToCanvas(initialData, canvas, () => {
        drawGrid(ctx, width, height, pixelSize);
      });
    }
  }, [width, height, pixelSize, initialData]);

  const drawGrid = (ctx: CanvasRenderingContext2D, w: number, h: number, size: number) => {
    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 1;

    // Draw vertical lines
    for (let x = 0; x <= w; x++) {
      ctx.beginPath();
      ctx.moveTo(x * size, 0);
      ctx.lineTo(x * size, h * size);
      ctx.stroke();
    }

    // Draw horizontal lines
    for (let y = 0; y <= h; y++) {
      ctx.beginPath();
      ctx.moveTo(0, y * size);
      ctx.lineTo(w * size, y * size);
      ctx.stroke();
    }
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
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    if (x < 0 || x >= width || y < 0 || y >= height) return;

    ctx.fillStyle = color.hex;
    ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);

    // Redraw grid cell
    ctx.strokeStyle = '#ddd';
    ctx.strokeRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);

    if (onPixelChange) {
      onPixelChange(x, y, color);
    }
  };

  const erasePixel = (x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    if (x < 0 || x >= width || y < 0 || y >= height) return;

    ctx.fillStyle = 'white';
    ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);

    // Redraw grid cell
    ctx.strokeStyle = '#ddd';
    ctx.strokeRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);

    if (onPixelChange) {
      onPixelChange(x, y, { hex: '#ffffff', rgb: { r: 255, g: 255, b: 255 } });
    }
  };

  const floodFill = (startX: number, startY: number, fillColor: Color) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

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
    const { x, y } = getPixelCoords(e);

    switch (currentTool.id) {
      case 'pencil':
        drawPixel(x, y, currentColor);
        break;
      case 'eraser':
        erasePixel(x, y);
        break;
      case 'fill':
        floodFill(x, y, currentColor);
        break;
      case 'picker':
        // Color picker will be implemented
        break;
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const { x, y } = getPixelCoords(e);

    switch (currentTool.id) {
      case 'pencil':
        drawPixel(x, y, currentColor);
        break;
      case 'eraser':
        erasePixel(x, y);
        break;
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const handleMouseLeave = () => {
    setIsDrawing(false);
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
        const ctx = canvas.getContext('2d');
        if (ctx) drawGrid(ctx, width, height, pixelSize);
      });
    },
    clear: () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      drawGrid(ctx, width, height, pixelSize);
    }
  }), [width, height, pixelSize]);

  return (
    <div className="pixel-canvas-container">
      <canvas
        ref={canvasRef}
        className="pixel-canvas"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        style={{ cursor: currentTool.cursor || 'crosshair' }}
      />
    </div>
  );
});

PixelCanvas.displayName = 'PixelCanvas';

export default PixelCanvas;