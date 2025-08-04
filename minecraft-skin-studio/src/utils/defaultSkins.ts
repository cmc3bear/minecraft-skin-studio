/**
 * Default Minecraft Skins
 * Provides default skin templates for the editor
 */

// Steve skin color palette
const STEVE_COLORS = {
  skin: '#F9DCC4',      // Light skin tone
  skinShadow: '#E8B59B', // Darker skin for shading
  hair: '#4A3C28',       // Dark brown hair
  eyes: '#2B1911',       // Dark brown eyes
  eyeWhite: '#FFFFFF',   // White of eyes
  shirt: '#00AAAA',      // Cyan shirt
  shirtDark: '#008888',  // Darker cyan for shading
  pants: '#3D3DC8',      // Blue pants
  pantsDark: '#2929A3',  // Darker blue for shading
  shoes: '#707070',      // Gray shoes
  shoesDark: '#4C4C4C'   // Darker gray for shading
};

/**
 * Generates a default Steve skin
 * Returns a 64x64 pixel array with RGBA values
 */
export function generateSteveSkin(): ImageData {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  
  if (!ctx) {
    throw new Error('Could not create canvas context');
  }

  // Fill with transparent background
  ctx.fillStyle = 'rgba(0, 0, 0, 0)';
  ctx.fillRect(0, 0, 64, 64);

  // Helper function to draw a pixel
  const drawPixel = (x: number, y: number, color: string) => {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, 1, 1);
  };

  // Helper function to draw a rectangle
  const drawRect = (x: number, y: number, width: number, height: number, color: string) => {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
  };

  // Head (Front) - 8x8 at (8, 8)
  drawRect(8, 8, 8, 8, STEVE_COLORS.skin);
  // Hair
  drawRect(8, 8, 8, 3, STEVE_COLORS.hair);
  // Eyes
  drawPixel(10, 12, STEVE_COLORS.eyeWhite);
  drawPixel(11, 12, STEVE_COLORS.eyes);
  drawPixel(13, 12, STEVE_COLORS.eyeWhite);
  drawPixel(14, 12, STEVE_COLORS.eyes);
  // Mouth
  drawRect(11, 14, 2, 1, STEVE_COLORS.skinShadow);

  // Head (Right) - 8x8 at (0, 8)
  drawRect(0, 8, 8, 8, STEVE_COLORS.skin);
  drawRect(0, 8, 8, 3, STEVE_COLORS.hair);
  
  // Head (Back) - 8x8 at (24, 8)
  drawRect(24, 8, 8, 8, STEVE_COLORS.skin);
  drawRect(24, 8, 8, 4, STEVE_COLORS.hair);
  
  // Head (Left) - 8x8 at (16, 8)
  drawRect(16, 8, 8, 8, STEVE_COLORS.skin);
  drawRect(16, 8, 8, 3, STEVE_COLORS.hair);
  
  // Head (Top) - 8x8 at (8, 0)
  drawRect(8, 0, 8, 8, STEVE_COLORS.hair);
  
  // Head (Bottom) - 8x8 at (16, 0)
  drawRect(16, 0, 8, 8, STEVE_COLORS.skin);

  // Body (Front) - 8x12 at (20, 20)
  drawRect(20, 20, 8, 12, STEVE_COLORS.shirt);
  // Add some shading
  drawRect(20, 20, 1, 12, STEVE_COLORS.shirtDark);
  drawRect(27, 20, 1, 12, STEVE_COLORS.shirtDark);
  
  // Body (Back) - 8x12 at (32, 20)
  drawRect(32, 20, 8, 12, STEVE_COLORS.shirt);
  
  // Body (Right) - 4x12 at (16, 20)
  drawRect(16, 20, 4, 12, STEVE_COLORS.shirt);
  
  // Body (Left) - 4x12 at (28, 20)
  drawRect(28, 20, 4, 12, STEVE_COLORS.shirt);
  
  // Body (Top) - 8x4 at (20, 16)
  drawRect(20, 16, 8, 4, STEVE_COLORS.shirt);
  
  // Body (Bottom) - 8x4 at (28, 16)
  drawRect(28, 16, 8, 4, STEVE_COLORS.shirt);

  // Right Arm (Front) - 4x12 at (44, 20)
  drawRect(44, 20, 4, 12, STEVE_COLORS.skin);
  
  // Right Arm (Back) - 4x12 at (52, 20)
  drawRect(52, 20, 4, 12, STEVE_COLORS.skin);
  
  // Right Arm (Right) - 4x12 at (40, 20)
  drawRect(40, 20, 4, 12, STEVE_COLORS.skin);
  
  // Right Arm (Left) - 4x12 at (48, 20)
  drawRect(48, 20, 4, 12, STEVE_COLORS.skin);
  
  // Right Arm (Top) - 4x4 at (44, 16)
  drawRect(44, 16, 4, 4, STEVE_COLORS.skin);
  
  // Right Arm (Bottom) - 4x4 at (48, 16)
  drawRect(48, 16, 4, 4, STEVE_COLORS.skin);

  // Left Arm (Front) - 4x12 at (36, 52)
  drawRect(36, 52, 4, 12, STEVE_COLORS.skin);
  
  // Left Arm (Back) - 4x12 at (44, 52)
  drawRect(44, 52, 4, 12, STEVE_COLORS.skin);
  
  // Left Arm (Right) - 4x12 at (32, 52)
  drawRect(32, 52, 4, 12, STEVE_COLORS.skin);
  
  // Left Arm (Left) - 4x12 at (40, 52)
  drawRect(40, 52, 4, 12, STEVE_COLORS.skin);
  
  // Left Arm (Top) - 4x4 at (36, 48)
  drawRect(36, 48, 4, 4, STEVE_COLORS.skin);
  
  // Left Arm (Bottom) - 4x4 at (40, 48)
  drawRect(40, 48, 4, 4, STEVE_COLORS.skin);

  // Right Leg (Front) - 4x12 at (4, 20)
  drawRect(4, 20, 4, 6, STEVE_COLORS.pants);
  drawRect(4, 26, 4, 6, STEVE_COLORS.shoes);
  
  // Right Leg (Back) - 4x12 at (12, 20)
  drawRect(12, 20, 4, 6, STEVE_COLORS.pants);
  drawRect(12, 26, 4, 6, STEVE_COLORS.shoes);
  
  // Right Leg (Right) - 4x12 at (0, 20)
  drawRect(0, 20, 4, 6, STEVE_COLORS.pants);
  drawRect(0, 26, 4, 6, STEVE_COLORS.shoes);
  
  // Right Leg (Left) - 4x12 at (8, 20)
  drawRect(8, 20, 4, 6, STEVE_COLORS.pants);
  drawRect(8, 26, 4, 6, STEVE_COLORS.shoes);
  
  // Right Leg (Top) - 4x4 at (4, 16)
  drawRect(4, 16, 4, 4, STEVE_COLORS.pants);
  
  // Right Leg (Bottom) - 4x4 at (8, 16)
  drawRect(8, 16, 4, 4, STEVE_COLORS.shoes);

  // Left Leg (Front) - 4x12 at (20, 52)
  drawRect(20, 52, 4, 6, STEVE_COLORS.pants);
  drawRect(20, 58, 4, 6, STEVE_COLORS.shoes);
  
  // Left Leg (Back) - 4x12 at (28, 52)
  drawRect(28, 52, 4, 6, STEVE_COLORS.pants);
  drawRect(28, 58, 4, 6, STEVE_COLORS.shoes);
  
  // Left Leg (Right) - 4x12 at (16, 52)
  drawRect(16, 52, 4, 6, STEVE_COLORS.pants);
  drawRect(16, 58, 4, 6, STEVE_COLORS.shoes);
  
  // Left Leg (Left) - 4x12 at (24, 52)
  drawRect(24, 52, 4, 6, STEVE_COLORS.pants);
  drawRect(24, 58, 4, 6, STEVE_COLORS.shoes);
  
  // Left Leg (Top) - 4x4 at (20, 48)
  drawRect(20, 48, 4, 4, STEVE_COLORS.pants);
  
  // Left Leg (Bottom) - 4x4 at (24, 48)
  drawRect(24, 48, 4, 4, STEVE_COLORS.shoes);

  return ctx.getImageData(0, 0, 64, 64);
}

/**
 * Converts ImageData to base64 data URL
 */
export function imageDataToDataURL(imageData: ImageData): string {
  const canvas = document.createElement('canvas');
  canvas.width = imageData.width;
  canvas.height = imageData.height;
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    throw new Error('Could not create canvas context');
  }
  
  ctx.putImageData(imageData, 0, 0);
  return canvas.toDataURL('image/png');
}