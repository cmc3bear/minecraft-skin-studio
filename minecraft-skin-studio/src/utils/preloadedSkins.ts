/**
 * Preloaded Minecraft Skins for Edit-Ready Experience
 * 
 * Based on official Minecraft skin specifications:
 * - 64x64 pixel template with proper UV mapping
 * - Dual layer system (base + overlay)
 * - Proper coordinate mapping for 3D model wrapping
 * - Support for both Steve (4px arms) and Alex (3px arms) models
 * 
 * Each skin provides immediate edit-ready content rather than blank creation
 */

export interface PreloadedSkin {
  id: string;
  name: string;
  description: string;
  theme: string;
  author: string;
  tags: string[];
  thumbnailColors: string[]; // Representative colors for thumbnail generation
  armModel: 'steve' | 'alex'; // Determines arm width in template
  imageData?: string; // Base64 encoded skin data
}

// Color palettes for different skin themes
const SKIN_PALETTES = {
  STEVE: {
    skin: '#F9DCC4',
    skinShadow: '#E8B59B',
    hair: '#4A3C28',
    eyes: '#2B1911',
    shirt: '#00AAAA',
    pants: '#3D3DC8',
    shoes: '#707070'
  },
  ALEX: {
    skin: '#F7C6A0',
    skinShadow: '#E8A679',
    hair: '#B5651D',
    eyes: '#5C4033',
    shirt: '#7BBE41',
    pants: '#654321',
    shoes: '#2B2B2B'
  },
  BOY: {
    skin: '#FDBCB4',
    skinShadow: '#F5A990',
    hair: '#654321',
    eyes: '#4169E1',
    shirt: '#FF6347',
    pants: '#4682B4',
    shoes: '#2F4F4F'
  },
  GIRL: {
    skin: '#FFE5E5',
    skinShadow: '#FFB6C1',
    hair: '#FFD700',
    hairBow: '#FF69B4',
    eyes: '#9370DB',
    dress: '#FF1493',
    shoes: '#FF69B4'
  },
  PRINCESS: {
    skin: '#FFF0F5',
    skinShadow: '#FFE4E1',
    hair: '#FFD700',
    crown: '#FFD700',
    eyes: '#4169E1',
    dress: '#FF69B4',
    dressTrim: '#FFD700',
    shoes: '#FFC0CB'
  },
  NINJA: {
    skin: '#E8B59B',
    outfit: '#1A1A1A',
    mask: '#2B2B2B',
    belt: '#8B0000',
    eyes: '#FFFFFF',
    accent: '#DC143C'
  },
  PIRATE: {
    skin: '#D2B48C',
    hair: '#8B4513',
    shirt: '#FFFAF0',
    vest: '#8B0000',
    pants: '#2F4F4F',
    bandana: '#FF0000',
    eyepatch: '#000000',
    boots: '#654321'
  },
  KNIGHT: {
    armor: '#C0C0C0',
    armorDark: '#808080',
    chainmail: '#A9A9A9',
    skin: '#F9DCC4',
    skinShadow: '#E8B59B',
    eyes: '#4169E1'
  }
};

/**
 * Generate enhanced Steve skin using official 64x64 UV mapping
 * Follows Minecraft's official skin template coordinate system
 */
export function generateEnhancedSteve(): ImageData {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  
  if (!ctx) {
    throw new Error('Could not create canvas context');
  }

  // Fill with transparent background (required for proper UV mapping)
  ctx.fillStyle = 'rgba(0, 0, 0, 0)';
  ctx.fillRect(0, 0, 64, 64);

  const colors = SKIN_PALETTES.STEVE;
  const drawRect = (x: number, y: number, width: number, height: number, color: string) => {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
  };

  // === HEAD UV MAPPING (Official Minecraft coordinates) ===
  // Base Layer 1 coordinates from official specification
  
  // Head Front (8,8 to 16,16)
  drawRect(8, 8, 8, 8, colors.skin);
  // Dark brown hair on top
  drawRect(8, 8, 8, 3, colors.hair);
  // Eyes with white and brown pupils
  drawRect(10, 12, 1, 1, '#FFFFFF');
  drawRect(11, 12, 1, 1, colors.eyes);
  drawRect(13, 12, 1, 1, '#FFFFFF'); 
  drawRect(14, 12, 1, 1, colors.eyes);
  // Simple mouth
  drawRect(11, 14, 2, 1, colors.skinShadow);

  // Head Right (0,8 to 8,16)
  drawRect(0, 8, 8, 8, colors.skin);
  drawRect(0, 8, 8, 3, colors.hair);

  // Head Back (24,8 to 32,16) 
  drawRect(24, 8, 8, 8, colors.skin);
  drawRect(24, 8, 8, 3, colors.hair);

  // Head Left (16,8 to 24,16)
  drawRect(16, 8, 8, 8, colors.skin);
  drawRect(16, 8, 8, 3, colors.hair);

  // Head Top (8,0 to 16,8) - Hair
  drawRect(8, 0, 8, 8, colors.hair);

  // Head Bottom (16,0 to 24,8) - Neck
  drawRect(16, 0, 8, 8, colors.skin);

  // === BODY UV MAPPING ===
  // Body Front (20,20 to 28,32)
  drawRect(20, 20, 8, 12, colors.shirt);
  // Add cyan shirt details
  drawRect(20, 20, 8, 1, '#008888'); // Top border
  drawRect(20, 31, 8, 1, '#008888'); // Bottom border

  // Body Back (32,20 to 40,32)
  drawRect(32, 20, 8, 12, colors.shirt);

  // Body Right (16,20 to 20,32)
  drawRect(16, 20, 4, 12, colors.shirt);

  // Body Left (28,20 to 32,32)
  drawRect(28, 20, 4, 12, colors.shirt);

  // Body Top (20,16 to 28,20)
  drawRect(20, 16, 8, 4, colors.shirt);

  // Body Bottom (28,16 to 36,20)
  drawRect(28, 16, 8, 4, colors.shirt);

  // === RIGHT ARM UV MAPPING (Steve - 4px wide) ===
  // Right Arm Front (44,20 to 48,32)
  drawRect(44, 20, 4, 12, colors.skin);

  // Right Arm Back (52,20 to 56,32)
  drawRect(52, 20, 4, 12, colors.skin);

  // Right Arm Right (40,20 to 44,32)
  drawRect(40, 20, 4, 12, colors.skin);

  // Right Arm Left (48,20 to 52,32)
  drawRect(48, 20, 4, 12, colors.skin);

  // Right Arm Top (44,16 to 48,20)
  drawRect(44, 16, 4, 4, colors.skin);

  // Right Arm Bottom (48,16 to 52,20)
  drawRect(48, 16, 4, 4, colors.skin);

  // === LEFT ARM UV MAPPING (New format - separate coords) ===
  // Left Arm Front (36,52 to 40,64)
  drawRect(36, 52, 4, 12, colors.skin);

  // Left Arm Back (44,52 to 48,64)
  drawRect(44, 52, 4, 12, colors.skin);

  // Left Arm Right (32,52 to 36,64) 
  drawRect(32, 52, 4, 12, colors.skin);

  // Left Arm Left (40,52 to 44,64)
  drawRect(40, 52, 4, 12, colors.skin);

  // Left Arm Top (36,48 to 40,52)
  drawRect(36, 48, 4, 4, colors.skin);

  // Left Arm Bottom (40,48 to 44,52)
  drawRect(40, 48, 4, 4, colors.skin);

  // === RIGHT LEG UV MAPPING ===
  // Right Leg Front (4,20 to 8,32)
  drawRect(4, 20, 4, 6, colors.pants); // Pants
  drawRect(4, 26, 4, 6, colors.shoes); // Shoes

  // Right Leg Back (12,20 to 16,32)
  drawRect(12, 20, 4, 6, colors.pants);
  drawRect(12, 26, 4, 6, colors.shoes);

  // Right Leg Right (0,20 to 4,32)
  drawRect(0, 20, 4, 6, colors.pants);
  drawRect(0, 26, 4, 6, colors.shoes);

  // Right Leg Left (8,20 to 12,32)
  drawRect(8, 20, 4, 6, colors.pants);
  drawRect(8, 26, 4, 6, colors.shoes);

  // Right Leg Top (4,16 to 8,20)
  drawRect(4, 16, 4, 4, colors.pants);

  // Right Leg Bottom (8,16 to 12,20)
  drawRect(8, 16, 4, 4, colors.shoes);

  // === LEFT LEG UV MAPPING (New format) ===
  // Left Leg Front (20,52 to 24,64)
  drawRect(20, 52, 4, 6, colors.pants);
  drawRect(20, 58, 4, 6, colors.shoes);

  // Left Leg Back (28,52 to 32,64)
  drawRect(28, 52, 4, 6, colors.pants);
  drawRect(28, 58, 4, 6, colors.shoes);

  // Left Leg Right (16,52 to 20,64)
  drawRect(16, 52, 4, 6, colors.pants);
  drawRect(16, 58, 4, 6, colors.shoes);

  // Left Leg Left (24,52 to 28,64)
  drawRect(24, 52, 4, 6, colors.pants);
  drawRect(24, 58, 4, 6, colors.shoes);

  // Left Leg Top (20,48 to 24,52)
  drawRect(20, 48, 4, 4, colors.pants);

  // Left Leg Bottom (24,48 to 28,52)
  drawRect(24, 48, 4, 4, colors.shoes);

  return ctx.getImageData(0, 0, 64, 64);
}

/**
 * Generate Alex skin using official slim arm UV mapping
 * Alex model uses 3-pixel wide arms instead of Steve's 4-pixel arms
 */
export function generateAlex(): ImageData {
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

  const colors = SKIN_PALETTES.ALEX;
  const drawRect = (x: number, y: number, width: number, height: number, color: string) => {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
  };

  // === HEAD UV MAPPING (Same as Steve) ===
  // Head Front (8,8 to 16,16)
  drawRect(8, 8, 8, 8, colors.skin);
  // Orange hair
  drawRect(8, 8, 8, 4, colors.hair);
  drawRect(9, 9, 6, 2, '#D2691E'); // Hair highlights
  // Green eyes 
  drawRect(10, 12, 1, 1, '#FFFFFF');
  drawRect(11, 12, 1, 1, colors.eyes);
  drawRect(13, 12, 1, 1, '#FFFFFF');
  drawRect(14, 12, 1, 1, colors.eyes);

  // Head Right (0,8 to 8,16)
  drawRect(0, 8, 8, 8, colors.skin);
  drawRect(0, 8, 8, 4, colors.hair);

  // Head Back (24,8 to 32,16)
  drawRect(24, 8, 8, 8, colors.skin);
  drawRect(24, 8, 8, 4, colors.hair);

  // Head Left (16,8 to 24,16)
  drawRect(16, 8, 8, 8, colors.skin);
  drawRect(16, 8, 8, 4, colors.hair);

  // Head Top (8,0 to 16,8) - Orange hair
  drawRect(8, 0, 8, 8, colors.hair);

  // Head Bottom (16,0 to 24,8) - Neck
  drawRect(16, 0, 8, 8, colors.skin);

  // === BODY UV MAPPING ===
  // Body Front (20,20 to 28,32) - Light green tunic
  drawRect(20, 20, 8, 12, colors.shirt);
  drawRect(21, 21, 6, 1, '#6AA121'); // Tunic detail
  drawRect(22, 23, 4, 2, '#5A9631'); // Belt area

  // Body Back (32,20 to 40,32)
  drawRect(32, 20, 8, 12, colors.shirt);

  // Body Right (16,20 to 20,32)
  drawRect(16, 20, 4, 12, colors.shirt);

  // Body Left (28,20 to 32,32)
  drawRect(28, 20, 4, 12, colors.shirt);

  // Body Top (20,16 to 28,20)
  drawRect(20, 16, 8, 4, colors.shirt);

  // Body Bottom (28,16 to 36,20)
  drawRect(28, 16, 8, 4, colors.shirt);

  // === RIGHT ARM UV MAPPING (Alex - 3px wide slim arms) ===
  // Right Arm Front (44,20 to 47,32) - 3px wide
  drawRect(44, 20, 3, 12, colors.skin);

  // Right Arm Back (51,20 to 54,32) - 3px wide
  drawRect(51, 20, 3, 12, colors.skin);

  // Right Arm Right (40,20 to 44,32) - 4px wide (unchanged)
  drawRect(40, 20, 4, 12, colors.skin);

  // Right Arm Left (47,20 to 51,32) - 4px wide (unchanged)
  drawRect(47, 20, 4, 12, colors.skin);

  // Right Arm Top (44,16 to 47,20) - 3px wide
  drawRect(44, 16, 3, 4, colors.skin);

  // Right Arm Bottom (47,16 to 50,20) - 3px wide
  drawRect(47, 16, 3, 4, colors.skin);

  // === LEFT ARM UV MAPPING (Alex slim) ===
  // Left Arm Front (36,52 to 39,64) - 3px wide
  drawRect(36, 52, 3, 12, colors.skin);

  // Left Arm Back (43,52 to 46,64) - 3px wide
  drawRect(43, 52, 3, 12, colors.skin);

  // Left Arm Right (32,52 to 36,64) - 4px wide
  drawRect(32, 52, 4, 12, colors.skin);

  // Left Arm Left (39,52 to 43,64) - 4px wide
  drawRect(39, 52, 4, 12, colors.skin);

  // Left Arm Top (36,48 to 39,52) - 3px wide
  drawRect(36, 48, 3, 4, colors.skin);

  // Left Arm Bottom (39,48 to 42,52) - 3px wide
  drawRect(39, 48, 3, 4, colors.skin);

  // === LEGS UV MAPPING (Same as Steve) ===
  // Right Leg Front (4,20 to 8,32) - Brown pants
  drawRect(4, 20, 4, 6, colors.pants);
  drawRect(4, 26, 4, 6, colors.shoes);

  // Right Leg Back (12,20 to 16,32)
  drawRect(12, 20, 4, 6, colors.pants);
  drawRect(12, 26, 4, 6, colors.shoes);

  // Right Leg Right (0,20 to 4,32)
  drawRect(0, 20, 4, 6, colors.pants);
  drawRect(0, 26, 4, 6, colors.shoes);

  // Right Leg Left (8,20 to 12,32)
  drawRect(8, 20, 4, 6, colors.pants);
  drawRect(8, 26, 4, 6, colors.shoes);

  // Right Leg Top (4,16 to 8,20)
  drawRect(4, 16, 4, 4, colors.pants);

  // Right Leg Bottom (8,16 to 12,20)
  drawRect(8, 16, 4, 4, colors.shoes);

  // Left Leg Front (20,52 to 24,64)
  drawRect(20, 52, 4, 6, colors.pants);
  drawRect(20, 58, 4, 6, colors.shoes);

  // Left Leg Back (28,52 to 32,64)
  drawRect(28, 52, 4, 6, colors.pants);
  drawRect(28, 58, 4, 6, colors.shoes);

  // Left Leg Right (16,52 to 20,64)
  drawRect(16, 52, 4, 6, colors.pants);
  drawRect(16, 58, 4, 6, colors.shoes);

  // Left Leg Left (24,52 to 28,64)
  drawRect(24, 52, 4, 6, colors.pants);
  drawRect(24, 58, 4, 6, colors.shoes);

  // Left Leg Top (20,48 to 24,52)
  drawRect(20, 48, 4, 4, colors.pants);

  // Left Leg Bottom (24,48 to 28,52)
  drawRect(24, 48, 4, 4, colors.shoes);

  return ctx.getImageData(0, 0, 64, 64);
}

/**
 * Generate a Boy skin with casual clothes
 */
export function generateBoy(): ImageData {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  
  if (!ctx) {
    throw new Error('Could not create canvas context');
  }

  ctx.fillStyle = 'rgba(0, 0, 0, 0)';
  ctx.fillRect(0, 0, 64, 64);

  const colors = SKIN_PALETTES.BOY;
  const drawRect = (x: number, y: number, width: number, height: number, color: string) => {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
  };

  // Head Front
  drawRect(8, 8, 8, 8, colors.skin);
  drawRect(8, 8, 8, 4, colors.hair); // Messy hair
  drawRect(9, 9, 2, 3, '#8B4513'); // Hair highlight
  drawRect(10, 12, 1, 1, '#FFFFFF');
  drawRect(11, 12, 1, 1, colors.eyes);
  drawRect(13, 12, 1, 1, '#FFFFFF');
  drawRect(14, 12, 1, 1, colors.eyes);
  drawRect(11, 14, 2, 1, colors.skinShadow); // Smile

  // Head sides
  drawRect(0, 8, 8, 8, colors.skin);
  drawRect(0, 8, 8, 4, colors.hair);
  drawRect(24, 8, 8, 8, colors.skin);
  drawRect(24, 8, 8, 4, colors.hair);
  drawRect(16, 8, 8, 8, colors.skin);
  drawRect(16, 8, 8, 4, colors.hair);
  drawRect(8, 0, 8, 8, colors.hair);
  drawRect(16, 0, 8, 8, colors.skin);

  // Body - Red t-shirt
  drawRect(20, 20, 8, 12, colors.shirt);
  drawRect(22, 21, 4, 2, '#FFFFFF'); // Logo/design
  drawRect(32, 20, 8, 12, colors.shirt);
  drawRect(16, 20, 4, 12, colors.shirt);
  drawRect(28, 20, 4, 12, colors.shirt);
  drawRect(20, 16, 8, 4, colors.shirt);
  drawRect(28, 16, 8, 4, colors.shirt);

  // Arms
  drawRect(44, 20, 4, 12, colors.skin);
  drawRect(52, 20, 4, 12, colors.skin);
  drawRect(40, 20, 4, 12, colors.skin);
  drawRect(48, 20, 4, 12, colors.skin);
  drawRect(44, 16, 4, 4, colors.skin);
  drawRect(48, 16, 4, 4, colors.skin);

  drawRect(36, 52, 4, 12, colors.skin);
  drawRect(44, 52, 4, 12, colors.skin);
  drawRect(32, 52, 4, 12, colors.skin);
  drawRect(40, 52, 4, 12, colors.skin);
  drawRect(36, 48, 4, 4, colors.skin);
  drawRect(40, 48, 4, 4, colors.skin);

  // Legs - Blue jeans
  drawRect(4, 20, 4, 12, colors.pants);
  drawRect(12, 20, 4, 12, colors.pants);
  drawRect(0, 20, 4, 12, colors.pants);
  drawRect(8, 20, 4, 12, colors.pants);
  drawRect(4, 16, 4, 4, colors.pants);
  drawRect(8, 16, 4, 4, colors.shoes);

  drawRect(20, 52, 4, 12, colors.pants);
  drawRect(28, 52, 4, 12, colors.pants);
  drawRect(16, 52, 4, 12, colors.pants);
  drawRect(24, 52, 4, 12, colors.pants);
  drawRect(20, 48, 4, 4, colors.pants);
  drawRect(24, 48, 4, 4, colors.shoes);

  return ctx.getImageData(0, 0, 64, 64);
}

/**
 * Generate a Girl skin with dress
 */
export function generateGirl(): ImageData {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  
  if (!ctx) {
    throw new Error('Could not create canvas context');
  }

  ctx.fillStyle = 'rgba(0, 0, 0, 0)';
  ctx.fillRect(0, 0, 64, 64);

  const colors = SKIN_PALETTES.GIRL;
  const drawRect = (x: number, y: number, width: number, height: number, color: string) => {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
  };

  // Head Front - Blonde hair with bow
  drawRect(8, 8, 8, 8, colors.skin);
  drawRect(8, 8, 8, 4, colors.hair);
  drawRect(11, 7, 2, 2, colors.hairBow); // Hair bow
  drawRect(10, 12, 1, 1, '#FFFFFF');
  drawRect(11, 12, 1, 1, colors.eyes);
  drawRect(13, 12, 1, 1, '#FFFFFF');
  drawRect(14, 12, 1, 1, colors.eyes);
  drawRect(11, 14, 2, 1, colors.skinShadow);
  drawRect(12, 15, 1, 1, '#FFB6C1'); // Blush

  // Head sides with long hair
  drawRect(0, 8, 8, 8, colors.skin);
  drawRect(0, 8, 8, 6, colors.hair);
  drawRect(24, 8, 8, 8, colors.skin);
  drawRect(24, 8, 8, 6, colors.hair);
  drawRect(16, 8, 8, 8, colors.skin);
  drawRect(16, 8, 8, 6, colors.hair);
  drawRect(8, 0, 8, 8, colors.hair);
  drawRect(16, 0, 8, 8, colors.skin);

  // Body - Pink dress
  drawRect(20, 20, 8, 12, colors.dress);
  drawRect(20, 30, 8, 2, '#FF1493'); // Dress trim
  drawRect(32, 20, 8, 12, colors.dress);
  drawRect(16, 20, 4, 12, colors.dress);
  drawRect(28, 20, 4, 12, colors.dress);
  drawRect(20, 16, 8, 4, colors.dress);
  drawRect(28, 16, 8, 4, colors.dress);

  // Arms (3px slim)
  drawRect(44, 20, 3, 12, colors.skin);
  drawRect(51, 20, 3, 12, colors.skin);
  drawRect(40, 20, 4, 12, colors.skin);
  drawRect(47, 20, 4, 12, colors.skin);
  drawRect(44, 16, 3, 4, colors.skin);
  drawRect(47, 16, 3, 4, colors.skin);

  drawRect(36, 52, 3, 12, colors.skin);
  drawRect(43, 52, 3, 12, colors.skin);
  drawRect(32, 52, 4, 12, colors.skin);
  drawRect(39, 52, 4, 12, colors.skin);
  drawRect(36, 48, 3, 4, colors.skin);
  drawRect(39, 48, 3, 4, colors.skin);

  // Legs - Skin tone with pink shoes
  drawRect(4, 20, 4, 8, colors.skin);
  drawRect(4, 28, 4, 4, colors.shoes);
  drawRect(12, 20, 4, 8, colors.skin);
  drawRect(12, 28, 4, 4, colors.shoes);
  drawRect(0, 20, 4, 8, colors.skin);
  drawRect(0, 28, 4, 4, colors.shoes);
  drawRect(8, 20, 4, 8, colors.skin);
  drawRect(8, 28, 4, 4, colors.shoes);
  drawRect(4, 16, 4, 4, colors.skin);
  drawRect(8, 16, 4, 4, colors.shoes);

  drawRect(20, 52, 4, 8, colors.skin);
  drawRect(20, 60, 4, 4, colors.shoes);
  drawRect(28, 52, 4, 8, colors.skin);
  drawRect(28, 60, 4, 4, colors.shoes);
  drawRect(16, 52, 4, 8, colors.skin);
  drawRect(16, 60, 4, 4, colors.shoes);
  drawRect(24, 52, 4, 8, colors.skin);
  drawRect(24, 60, 4, 4, colors.shoes);
  drawRect(20, 48, 4, 4, colors.skin);
  drawRect(24, 48, 4, 4, colors.shoes);

  return ctx.getImageData(0, 0, 64, 64);
}

/**
 * Generate a Princess skin with crown and gown
 */
export function generatePrincess(): ImageData {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  
  if (!ctx) {
    throw new Error('Could not create canvas context');
  }

  ctx.fillStyle = 'rgba(0, 0, 0, 0)';
  ctx.fillRect(0, 0, 64, 64);

  const colors = SKIN_PALETTES.PRINCESS;
  const drawRect = (x: number, y: number, width: number, height: number, color: string) => {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
  };

  // Head Front with crown
  drawRect(8, 8, 8, 8, colors.skin);
  drawRect(8, 8, 8, 3, colors.hair);
  drawRect(9, 7, 6, 1, colors.crown); // Crown base
  drawRect(10, 6, 1, 2, colors.crown); // Crown spikes
  drawRect(12, 6, 1, 2, colors.crown);
  drawRect(14, 6, 1, 2, colors.crown);
  drawRect(10, 12, 1, 1, '#FFFFFF');
  drawRect(11, 12, 1, 1, colors.eyes);
  drawRect(13, 12, 1, 1, '#FFFFFF');
  drawRect(14, 12, 1, 1, colors.eyes);
  drawRect(11, 14, 2, 1, '#FFC0CB'); // Pink lips

  // Head sides
  drawRect(0, 8, 8, 8, colors.skin);
  drawRect(0, 8, 8, 3, colors.hair);
  drawRect(24, 8, 8, 8, colors.skin);
  drawRect(24, 8, 8, 3, colors.hair);
  drawRect(16, 8, 8, 8, colors.skin);
  drawRect(16, 8, 8, 3, colors.hair);
  drawRect(8, 0, 8, 8, colors.crown);
  drawRect(16, 0, 8, 8, colors.skin);

  // Body - Royal gown
  drawRect(20, 20, 8, 12, colors.dress);
  drawRect(20, 20, 8, 1, colors.dressTrim); // Gold trim
  drawRect(20, 31, 8, 1, colors.dressTrim);
  drawRect(32, 20, 8, 12, colors.dress);
  drawRect(16, 20, 4, 12, colors.dress);
  drawRect(28, 20, 4, 12, colors.dress);
  drawRect(20, 16, 8, 4, colors.dress);
  drawRect(28, 16, 8, 4, colors.dress);

  // Arms (slim) with gloves
  drawRect(44, 20, 3, 8, colors.skin);
  drawRect(44, 28, 3, 4, '#FFFFFF'); // Gloves
  drawRect(51, 20, 3, 8, colors.skin);
  drawRect(51, 28, 3, 4, '#FFFFFF');
  drawRect(40, 20, 4, 8, colors.skin);
  drawRect(40, 28, 4, 4, '#FFFFFF');
  drawRect(47, 20, 4, 8, colors.skin);
  drawRect(47, 28, 4, 4, '#FFFFFF');
  drawRect(44, 16, 3, 4, colors.skin);
  drawRect(47, 16, 3, 4, colors.skin);

  drawRect(36, 52, 3, 8, colors.skin);
  drawRect(36, 60, 3, 4, '#FFFFFF');
  drawRect(43, 52, 3, 8, colors.skin);
  drawRect(43, 60, 3, 4, '#FFFFFF');
  drawRect(32, 52, 4, 8, colors.skin);
  drawRect(32, 60, 4, 4, '#FFFFFF');
  drawRect(39, 52, 4, 8, colors.skin);
  drawRect(39, 60, 4, 4, '#FFFFFF');
  drawRect(36, 48, 3, 4, colors.skin);
  drawRect(39, 48, 3, 4, colors.skin);

  // Legs - Dress extends down with shoes peeking
  drawRect(4, 20, 4, 10, colors.dress);
  drawRect(4, 30, 4, 2, colors.shoes);
  drawRect(12, 20, 4, 10, colors.dress);
  drawRect(12, 30, 4, 2, colors.shoes);
  drawRect(0, 20, 4, 10, colors.dress);
  drawRect(0, 30, 4, 2, colors.shoes);
  drawRect(8, 20, 4, 10, colors.dress);
  drawRect(8, 30, 4, 2, colors.shoes);
  drawRect(4, 16, 4, 4, colors.dress);
  drawRect(8, 16, 4, 4, colors.shoes);

  drawRect(20, 52, 4, 10, colors.dress);
  drawRect(20, 62, 4, 2, colors.shoes);
  drawRect(28, 52, 4, 10, colors.dress);
  drawRect(28, 62, 4, 2, colors.shoes);
  drawRect(16, 52, 4, 10, colors.dress);
  drawRect(16, 62, 4, 2, colors.shoes);
  drawRect(24, 52, 4, 10, colors.dress);
  drawRect(24, 62, 4, 2, colors.shoes);
  drawRect(20, 48, 4, 4, colors.dress);
  drawRect(24, 48, 4, 4, colors.shoes);

  return ctx.getImageData(0, 0, 64, 64);
}

/**
 * Generate a Ninja skin with mask and outfit
 */
export function generateNinja(): ImageData {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  
  if (!ctx) {
    throw new Error('Could not create canvas context');
  }

  ctx.fillStyle = 'rgba(0, 0, 0, 0)';
  ctx.fillRect(0, 0, 64, 64);

  const colors = SKIN_PALETTES.NINJA;
  const drawRect = (x: number, y: number, width: number, height: number, color: string) => {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
  };

  // Head with ninja mask
  drawRect(8, 8, 8, 8, colors.mask); // Full mask
  drawRect(10, 12, 4, 1, colors.skin); // Eye opening
  drawRect(10, 12, 1, 1, colors.eyes); // White eyes
  drawRect(13, 12, 1, 1, colors.eyes);

  // Head sides
  drawRect(0, 8, 8, 8, colors.mask);
  drawRect(24, 8, 8, 8, colors.mask);
  drawRect(16, 8, 8, 8, colors.mask);
  drawRect(8, 0, 8, 8, colors.mask);
  drawRect(16, 0, 8, 8, colors.mask);

  // Body - Black ninja outfit
  drawRect(20, 20, 8, 12, colors.outfit);
  drawRect(20, 24, 8, 2, colors.belt); // Red belt
  drawRect(32, 20, 8, 12, colors.outfit);
  drawRect(16, 20, 4, 12, colors.outfit);
  drawRect(28, 20, 4, 12, colors.outfit);
  drawRect(20, 16, 8, 4, colors.outfit);
  drawRect(28, 16, 8, 4, colors.outfit);

  // Arms - Black with red accents
  drawRect(44, 20, 4, 10, colors.outfit);
  drawRect(44, 30, 4, 2, colors.accent); // Red wrist bands
  drawRect(52, 20, 4, 10, colors.outfit);
  drawRect(52, 30, 4, 2, colors.accent);
  drawRect(40, 20, 4, 10, colors.outfit);
  drawRect(40, 30, 4, 2, colors.accent);
  drawRect(48, 20, 4, 10, colors.outfit);
  drawRect(48, 30, 4, 2, colors.accent);
  drawRect(44, 16, 4, 4, colors.outfit);
  drawRect(48, 16, 4, 4, colors.outfit);

  drawRect(36, 52, 4, 10, colors.outfit);
  drawRect(36, 62, 4, 2, colors.accent);
  drawRect(44, 52, 4, 10, colors.outfit);
  drawRect(44, 62, 4, 2, colors.accent);
  drawRect(32, 52, 4, 10, colors.outfit);
  drawRect(32, 62, 4, 2, colors.accent);
  drawRect(40, 52, 4, 10, colors.outfit);
  drawRect(40, 62, 4, 2, colors.accent);
  drawRect(36, 48, 4, 4, colors.outfit);
  drawRect(40, 48, 4, 4, colors.outfit);

  // Legs - Black with tabi boots
  drawRect(4, 20, 4, 12, colors.outfit);
  drawRect(12, 20, 4, 12, colors.outfit);
  drawRect(0, 20, 4, 12, colors.outfit);
  drawRect(8, 20, 4, 12, colors.outfit);
  drawRect(4, 16, 4, 4, colors.outfit);
  drawRect(8, 16, 4, 4, colors.outfit);

  drawRect(20, 52, 4, 12, colors.outfit);
  drawRect(28, 52, 4, 12, colors.outfit);
  drawRect(16, 52, 4, 12, colors.outfit);
  drawRect(24, 52, 4, 12, colors.outfit);
  drawRect(20, 48, 4, 4, colors.outfit);
  drawRect(24, 48, 4, 4, colors.outfit);

  return ctx.getImageData(0, 0, 64, 64);
}

/**
 * Generate a Pirate skin with bandana and coat
 */
export function generatePirate(): ImageData {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  
  if (!ctx) {
    throw new Error('Could not create canvas context');
  }

  ctx.fillStyle = 'rgba(0, 0, 0, 0)';
  ctx.fillRect(0, 0, 64, 64);

  const colors = SKIN_PALETTES.PIRATE;
  const drawRect = (x: number, y: number, width: number, height: number, color: string) => {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
  };

  // Head with bandana and beard
  drawRect(8, 8, 8, 8, colors.skin);
  drawRect(8, 8, 8, 3, colors.bandana); // Red bandana
  drawRect(10, 12, 1, 1, '#FFFFFF');
  drawRect(11, 12, 1, 1, '#8B4513'); // Brown eyes
  drawRect(13, 12, 1, 1, colors.eyepatch); // Eyepatch
  drawRect(11, 14, 3, 2, colors.hair); // Beard

  // Head sides
  drawRect(0, 8, 8, 8, colors.skin);
  drawRect(0, 8, 8, 3, colors.bandana);
  drawRect(24, 8, 8, 8, colors.skin);
  drawRect(24, 8, 8, 3, colors.bandana);
  drawRect(16, 8, 8, 8, colors.skin);
  drawRect(16, 8, 8, 3, colors.bandana);
  drawRect(8, 0, 8, 8, colors.bandana);
  drawRect(16, 0, 8, 8, colors.skin);

  // Body - White shirt with red vest
  drawRect(20, 20, 8, 12, colors.shirt);
  drawRect(20, 20, 2, 12, colors.vest); // Vest sides
  drawRect(26, 20, 2, 12, colors.vest);
  drawRect(32, 20, 8, 12, colors.shirt);
  drawRect(16, 20, 4, 12, colors.vest);
  drawRect(28, 20, 4, 12, colors.vest);
  drawRect(20, 16, 8, 4, colors.vest);
  drawRect(28, 16, 8, 4, colors.vest);

  // Arms
  drawRect(44, 20, 4, 12, colors.skin);
  drawRect(52, 20, 4, 12, colors.skin);
  drawRect(40, 20, 4, 12, colors.skin);
  drawRect(48, 20, 4, 12, colors.skin);
  drawRect(44, 16, 4, 4, colors.skin);
  drawRect(48, 16, 4, 4, colors.skin);

  drawRect(36, 52, 4, 12, colors.skin);
  drawRect(44, 52, 4, 12, colors.skin);
  drawRect(32, 52, 4, 12, colors.skin);
  drawRect(40, 52, 4, 12, colors.skin);
  drawRect(36, 48, 4, 4, colors.skin);
  drawRect(40, 48, 4, 4, colors.skin);

  // Legs - Dark pants with boots
  drawRect(4, 20, 4, 8, colors.pants);
  drawRect(4, 28, 4, 4, colors.boots);
  drawRect(12, 20, 4, 8, colors.pants);
  drawRect(12, 28, 4, 4, colors.boots);
  drawRect(0, 20, 4, 8, colors.pants);
  drawRect(0, 28, 4, 4, colors.boots);
  drawRect(8, 20, 4, 8, colors.pants);
  drawRect(8, 28, 4, 4, colors.boots);
  drawRect(4, 16, 4, 4, colors.pants);
  drawRect(8, 16, 4, 4, colors.boots);

  drawRect(20, 52, 4, 8, colors.pants);
  drawRect(20, 60, 4, 4, colors.boots);
  drawRect(28, 52, 4, 8, colors.pants);
  drawRect(28, 60, 4, 4, colors.boots);
  drawRect(16, 52, 4, 8, colors.pants);
  drawRect(16, 60, 4, 4, colors.boots);
  drawRect(24, 52, 4, 8, colors.pants);
  drawRect(24, 60, 4, 4, colors.boots);
  drawRect(20, 48, 4, 4, colors.pants);
  drawRect(24, 48, 4, 4, colors.boots);

  return ctx.getImageData(0, 0, 64, 64);
}

/**
 * Generate a Knight skin
 */
export function generateKnight(): ImageData {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  
  if (!ctx) {
    throw new Error('Could not create canvas context');
  }

  ctx.fillStyle = 'rgba(0, 0, 0, 0)';
  ctx.fillRect(0, 0, 64, 64);

  const colors = SKIN_PALETTES.KNIGHT;
  const drawRect = (x: number, y: number, width: number, height: number, color: string) => {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
  };

  // Helmet (Front) - 8x8 at (8, 8)
  drawRect(8, 8, 8, 8, colors.armor);
  // Visor slit
  drawRect(10, 12, 4, 1, '#000000');
  // Helmet detail
  drawRect(8, 8, 8, 1, colors.armorDark);
  drawRect(8, 15, 8, 1, colors.armorDark);
  drawRect(11, 10, 2, 1, colors.chainmail);

  // Helmet sides
  drawRect(0, 8, 8, 8, colors.armor);
  drawRect(24, 8, 8, 8, colors.armor);
  drawRect(16, 8, 8, 8, colors.armor);
  drawRect(8, 0, 8, 8, colors.armor);
  drawRect(16, 0, 8, 8, colors.armor);

  // Chainmail Body
  drawRect(20, 20, 8, 12, colors.chainmail);
  // Armor plating
  drawRect(20, 20, 8, 3, colors.armor);
  drawRect(20, 28, 8, 4, colors.armor);
  drawRect(21, 24, 6, 1, colors.armorDark);

  // Body sides
  drawRect(32, 20, 8, 12, colors.chainmail);
  drawRect(16, 20, 4, 12, colors.chainmail);
  drawRect(28, 20, 4, 12, colors.chainmail);
  drawRect(20, 16, 8, 4, colors.armor);
  drawRect(28, 16, 8, 4, colors.armor);

  // Armored Arms
  drawRect(44, 20, 4, 12, colors.armor);
  drawRect(52, 20, 4, 12, colors.armor);
  drawRect(40, 20, 4, 12, colors.armor);
  drawRect(48, 20, 4, 12, colors.armor);
  drawRect(44, 16, 4, 4, colors.armor);
  drawRect(48, 16, 4, 4, colors.armor);

  // Left Arm
  drawRect(36, 52, 4, 12, colors.armor);
  drawRect(44, 52, 4, 12, colors.armor);
  drawRect(32, 52, 4, 12, colors.armor);
  drawRect(40, 52, 4, 12, colors.armor);
  drawRect(36, 48, 4, 4, colors.armor);
  drawRect(40, 48, 4, 4, colors.armor);

  // Armored Legs
  drawRect(4, 20, 4, 12, colors.armor);
  drawRect(12, 20, 4, 12, colors.armor);
  drawRect(0, 20, 4, 12, colors.armor);
  drawRect(8, 20, 4, 12, colors.armor);
  drawRect(4, 16, 4, 4, colors.armor);
  drawRect(8, 16, 4, 4, colors.armor);

  // Left Leg
  drawRect(20, 52, 4, 12, colors.armor);
  drawRect(28, 52, 4, 12, colors.armor);
  drawRect(16, 52, 4, 12, colors.armor);
  drawRect(24, 52, 4, 12, colors.armor);
  drawRect(20, 48, 4, 4, colors.armor);
  drawRect(24, 48, 4, 4, colors.armor);

  return ctx.getImageData(0, 0, 64, 64);
}

/**
 * Convert ImageData to base64 data URL
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

/**
 * Preloaded skin templates for immediate editing
 * Each skin uses proper 64x64 UV mapping and specifies arm model type
 */
export const PRELOADED_SKINS: PreloadedSkin[] = [
  {
    id: 'enhanced-steve',
    name: 'Steve',
    description: 'Classic Steve with cyan shirt and blue pants',
    theme: 'Classic',
    author: 'Minecraft Studio',
    tags: ['classic', 'steve', 'default', 'wide-arms'],
    armModel: 'steve',
    thumbnailColors: ['#F9DCC4', '#4A3C28', '#00AAAA', '#3D3DC8']
  },
  {
    id: 'alex',
    name: 'Alex',
    description: 'Alex with orange hair and green tunic',
    theme: 'Classic',
    author: 'Minecraft Studio',
    tags: ['alex', 'default', 'orange-hair', 'slim-arms'],
    armModel: 'alex',
    thumbnailColors: ['#F7C6A0', '#B5651D', '#7BBE41', '#654321']
  },
  {
    id: 'boy',
    name: 'Boy',
    description: 'Casual boy with messy hair and red t-shirt',
    theme: 'Modern',
    author: 'Minecraft Studio',
    tags: ['boy', 'casual', 'modern', 'wide-arms'],
    armModel: 'steve',
    thumbnailColors: ['#FDBCB4', '#654321', '#FF6347', '#4682B4']
  },
  {
    id: 'girl',
    name: 'Girl',
    description: 'Girl with blonde hair, pink bow, and dress',
    theme: 'Modern',
    author: 'Minecraft Studio',
    tags: ['girl', 'dress', 'blonde', 'slim-arms'],
    armModel: 'alex',
    thumbnailColors: ['#FFE5E5', '#FFD700', '#FF1493', '#FF69B4']
  },
  {
    id: 'princess',
    name: 'Princess',
    description: 'Royal princess with golden crown and pink gown',
    theme: 'Fantasy',
    author: 'Minecraft Studio',
    tags: ['princess', 'royal', 'crown', 'slim-arms'],
    armModel: 'alex',
    thumbnailColors: ['#FFF0F5', '#FFD700', '#FF69B4', '#FFC0CB']
  },
  {
    id: 'ninja',
    name: 'Ninja',
    description: 'Stealthy ninja with black outfit and mask',
    theme: 'Adventure',
    author: 'Minecraft Studio',
    tags: ['ninja', 'stealth', 'mask', 'wide-arms'],
    armModel: 'steve',
    thumbnailColors: ['#1A1A1A', '#2B2B2B', '#8B0000', '#DC143C']
  },
  {
    id: 'pirate',
    name: 'Pirate',
    description: 'Sea pirate with red bandana and eyepatch',
    theme: 'Adventure',
    author: 'Minecraft Studio',
    tags: ['pirate', 'sea', 'bandana', 'wide-arms'],
    armModel: 'steve',
    thumbnailColors: ['#D2B48C', '#8B0000', '#FFFAF0', '#654321']
  },
  {
    id: 'knight',
    name: 'Knight',
    description: 'Medieval knight in shining armor',
    theme: 'Medieval',
    author: 'Minecraft Studio',
    tags: ['knight', 'armor', 'medieval', 'wide-arms'],
    armModel: 'steve',
    thumbnailColors: ['#8B8B8B', '#BEBEBE', '#5A5A5A', '#DAA520']
  }
];

/**
 * Get preloaded skin by ID with generated image data
 */
export function getPreloadedSkin(id: string): PreloadedSkin | null {
  const skin = PRELOADED_SKINS.find(s => s.id === id);
  if (!skin) return null;

  // Generate image data on demand
  let imageData: ImageData;
  switch (id) {
    case 'enhanced-steve':
      imageData = generateEnhancedSteve();
      break;
    case 'alex':
      imageData = generateAlex();
      break;
    case 'boy':
      imageData = generateBoy();
      break;
    case 'girl':
      imageData = generateGirl();
      break;
    case 'princess':
      imageData = generatePrincess();
      break;
    case 'ninja':
      imageData = generateNinja();
      break;
    case 'pirate':
      imageData = generatePirate();
      break;
    case 'knight':
      imageData = generateKnight();
      break;
    default:
      imageData = generateEnhancedSteve(); // Fallback
  }

  return {
    ...skin,
    imageData: imageDataToDataURL(imageData)
  };
}

/**
 * Get random preloaded skin for variety
 */
export function getRandomPreloadedSkin(): PreloadedSkin {
  const randomIndex = Math.floor(Math.random() * PRELOADED_SKINS.length);
  const skinId = PRELOADED_SKINS[randomIndex].id;
  return getPreloadedSkin(skinId)!;
}