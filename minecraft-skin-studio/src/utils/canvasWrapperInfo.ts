/**
 * Canvas Wrapper Dimension Information
 * 
 * Documents how the PixelCanvas wrapper and container dimensions work
 * in relation to the Minecraft skin template UV mapping.
 */

export interface CanvasWrapperInfo {
  canvasSize: number;      // Base canvas dimensions (64x64)
  pixelSize: number;       // Size of each pixel when rendered
  wrapperWidth: number;    // Total wrapper width with borders/padding
  wrapperHeight: number;   // Total wrapper height with borders/padding
  actualCanvasWidth: number;  // Canvas width in pixels (canvasSize * pixelSize)
  actualCanvasHeight: number; // Canvas height in pixels (canvasSize * pixelSize)
  containerPadding: number;   // Padding around canvas
  borderWidth: number;        // Border thickness
}

/**
 * Get current canvas wrapper dimensions and structure
 */
export function getCanvasWrapperInfo(): CanvasWrapperInfo {
  // From PixelCanvasOptimized.tsx constants
  const CANVAS_SIZE = 64; // Minecraft skin template size
  const DEFAULT_PIXEL_SIZE = 8; // Default pixel rendering size

  // From EditorPage.css - canvas wrapper styling
  const CONTAINER_PADDING = 8; // padding: 8px
  const BORDER_WIDTH = 3; // border: 3px solid #333

  const pixelSize = DEFAULT_PIXEL_SIZE;
  const actualCanvasWidth = CANVAS_SIZE * pixelSize;
  const actualCanvasHeight = CANVAS_SIZE * pixelSize;
  
  // Total wrapper dimensions including padding and borders
  const wrapperWidth = actualCanvasWidth + (CONTAINER_PADDING * 2) + (BORDER_WIDTH * 2);
  const wrapperHeight = actualCanvasHeight + (CONTAINER_PADDING * 2) + (BORDER_WIDTH * 2);

  return {
    canvasSize: CANVAS_SIZE,
    pixelSize: pixelSize,
    wrapperWidth: wrapperWidth,
    wrapperHeight: wrapperHeight,
    actualCanvasWidth: actualCanvasWidth,
    actualCanvasHeight: actualCanvasHeight,
    containerPadding: CONTAINER_PADDING,
    borderWidth: BORDER_WIDTH
  };
}

/**
 * Calculate wrapper dimensions for different pixel sizes
 */
export function calculateWrapperDimensions(pixelSize: number): CanvasWrapperInfo {
  const CANVAS_SIZE = 64;
  const CONTAINER_PADDING = 8;
  const BORDER_WIDTH = 3;

  const actualCanvasWidth = CANVAS_SIZE * pixelSize;
  const actualCanvasHeight = CANVAS_SIZE * pixelSize;
  const wrapperWidth = actualCanvasWidth + (CONTAINER_PADDING * 2) + (BORDER_WIDTH * 2);
  const wrapperHeight = actualCanvasHeight + (CONTAINER_PADDING * 2) + (BORDER_WIDTH * 2);

  return {
    canvasSize: CANVAS_SIZE,
    pixelSize: pixelSize,
    wrapperWidth: wrapperWidth,
    wrapperHeight: wrapperHeight,
    actualCanvasWidth: actualCanvasWidth,
    actualCanvasHeight: actualCanvasHeight,
    containerPadding: CONTAINER_PADDING,
    borderWidth: BORDER_WIDTH
  };
}

/**
 * Get information about the 64x64 Minecraft skin template structure
 */
export interface MinecraftSkinTemplate {
  width: number;
  height: number;
  totalPixels: number;
  editablePixels: number;
  layerCount: number;
  armModel: 'steve' | 'alex';
  bodyParts: {
    head: { x: number; y: number; width: number; height: number; }[];
    body: { x: number; y: number; width: number; height: number; }[];
    arms: { x: number; y: number; width: number; height: number; }[];
    legs: { x: number; y: number; width: number; height: number; }[];
  };
}

/**
 * Get Minecraft skin template information
 */
export function getMinecraftSkinTemplate(armModel: 'steve' | 'alex' = 'steve'): MinecraftSkinTemplate {
  const template: MinecraftSkinTemplate = {
    width: 64,
    height: 64,
    totalPixels: 64 * 64,
    editablePixels: armModel === 'steve' ? 3264 : 3136,
    layerCount: 2,
    armModel: armModel,
    bodyParts: {
      // Head UV coordinates (all 6 faces)
      head: [
        { x: 8, y: 8, width: 8, height: 8 },   // Front
        { x: 0, y: 8, width: 8, height: 8 },   // Right
        { x: 24, y: 8, width: 8, height: 8 },  // Back
        { x: 16, y: 8, width: 8, height: 8 },  // Left
        { x: 8, y: 0, width: 8, height: 8 },   // Top
        { x: 16, y: 0, width: 8, height: 8 }   // Bottom
      ],
      // Body UV coordinates (all 6 faces)
      body: [
        { x: 20, y: 20, width: 8, height: 12 }, // Front
        { x: 16, y: 20, width: 4, height: 12 }, // Right
        { x: 32, y: 20, width: 8, height: 12 }, // Back
        { x: 28, y: 20, width: 4, height: 12 }, // Left
        { x: 20, y: 16, width: 8, height: 4 },  // Top
        { x: 28, y: 16, width: 8, height: 4 }   // Bottom
      ],
      // Arm UV coordinates (Steve vs Alex difference)
      arms: armModel === 'steve' ? [
        // Steve (4px wide arms)
        // Right Arm
        { x: 44, y: 20, width: 4, height: 12 }, // Front
        { x: 40, y: 20, width: 4, height: 12 }, // Right
        { x: 52, y: 20, width: 4, height: 12 }, // Back
        { x: 48, y: 20, width: 4, height: 12 }, // Left
        { x: 44, y: 16, width: 4, height: 4 },  // Top
        { x: 48, y: 16, width: 4, height: 4 },  // Bottom
        // Left Arm
        { x: 36, y: 52, width: 4, height: 12 }, // Front
        { x: 32, y: 52, width: 4, height: 12 }, // Right
        { x: 44, y: 52, width: 4, height: 12 }, // Back
        { x: 40, y: 52, width: 4, height: 12 }, // Left
        { x: 36, y: 48, width: 4, height: 4 },  // Top
        { x: 40, y: 48, width: 4, height: 4 }   // Bottom
      ] : [
        // Alex (3px wide arms for front/back faces)
        // Right Arm
        { x: 44, y: 20, width: 3, height: 12 }, // Front (3px)
        { x: 40, y: 20, width: 4, height: 12 }, // Right (4px)
        { x: 51, y: 20, width: 3, height: 12 }, // Back (3px)
        { x: 47, y: 20, width: 4, height: 12 }, // Left (4px)
        { x: 44, y: 16, width: 3, height: 4 },  // Top (3px)
        { x: 47, y: 16, width: 3, height: 4 },  // Bottom (3px)
        // Left Arm
        { x: 36, y: 52, width: 3, height: 12 }, // Front (3px)
        { x: 32, y: 52, width: 4, height: 12 }, // Right (4px)
        { x: 43, y: 52, width: 3, height: 12 }, // Back (3px)
        { x: 39, y: 52, width: 4, height: 12 }, // Left (4px)
        { x: 36, y: 48, width: 3, height: 4 },  // Top (3px)
        { x: 39, y: 48, width: 3, height: 4 }   // Bottom (3px)
      ],
      // Leg UV coordinates (same for both models)
      legs: [
        // Right Leg
        { x: 4, y: 20, width: 4, height: 12 },  // Front
        { x: 0, y: 20, width: 4, height: 12 },  // Right
        { x: 12, y: 20, width: 4, height: 12 }, // Back
        { x: 8, y: 20, width: 4, height: 12 },  // Left
        { x: 4, y: 16, width: 4, height: 4 },   // Top
        { x: 8, y: 16, width: 4, height: 4 },   // Bottom
        // Left Leg
        { x: 20, y: 52, width: 4, height: 12 }, // Front
        { x: 16, y: 52, width: 4, height: 12 }, // Right
        { x: 28, y: 52, width: 4, height: 12 }, // Back
        { x: 24, y: 52, width: 4, height: 12 }, // Left
        { x: 20, y: 48, width: 4, height: 4 },  // Top
        { x: 24, y: 48, width: 4, height: 4 }   // Bottom
      ]
    }
  };

  return template;
}

/**
 * Helper to display current wrapper configuration
 */
export function logCanvasWrapperInfo(): void {
  const info = getCanvasWrapperInfo();
  
  console.group('🎨 Canvas Wrapper Configuration');
  console.log(`Canvas Base Size: ${info.canvasSize}x${info.canvasSize} pixels (Minecraft skin template)`);
  console.log(`Pixel Render Size: ${info.pixelSize}px per skin pixel`);
  console.log(`Actual Canvas Size: ${info.actualCanvasWidth}x${info.actualCanvasHeight}px`);
  console.log(`Container Padding: ${info.containerPadding}px`);
  console.log(`Border Width: ${info.borderWidth}px`);
  console.log(`Total Wrapper Size: ${info.wrapperWidth}x${info.wrapperHeight}px`);
  console.groupEnd();

  const steveTemplate = getMinecraftSkinTemplate('steve');
  const alexTemplate = getMinecraftSkinTemplate('alex');
  
  console.group('📐 Minecraft Skin Template Structure');
  console.log(`Steve Model: ${steveTemplate.editablePixels} editable pixels (4px arms)`);
  console.log(`Alex Model: ${alexTemplate.editablePixels} editable pixels (3px arms)`);
  console.log(`Template Dimensions: ${steveTemplate.width}x${steveTemplate.height}`);
  console.log(`Dual Layer System: Base + Overlay (${steveTemplate.layerCount} layers)`);
  console.log(`Head UV Areas: ${steveTemplate.bodyParts.head.length} faces`);
  console.log(`Body UV Areas: ${steveTemplate.bodyParts.body.length} faces`);
  console.log(`Steve Arms: ${steveTemplate.bodyParts.arms.length} faces`);
  console.log(`Alex Arms: ${alexTemplate.bodyParts.arms.length} faces`);
  console.log(`Leg UV Areas: ${steveTemplate.bodyParts.legs.length} faces`);
  console.groupEnd();
}