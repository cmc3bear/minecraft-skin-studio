/**
 * Official Minecraft Skin Specification
 * Based on Minecraft Wiki documentation for 1.8+ skin format
 * https://minecraft.wiki/w/Player.notch.net
 */

export interface MinecraftSkinLayout {
  // Base layer coordinates (required)
  head: {
    front: { x: 8, y: 8, width: 8, height: 8 };
    back: { x: 24, y: 8, width: 8, height: 8 };
    right: { x: 0, y: 8, width: 8, height: 8 };
    left: { x: 16, y: 8, width: 8, height: 8 };
    top: { x: 8, y: 0, width: 8, height: 8 };
    bottom: { x: 16, y: 0, width: 8, height: 8 };
  };
  
  body: {
    front: { x: 20, y: 20, width: 8, height: 12 };
    back: { x: 32, y: 20, width: 8, height: 12 };
    right: { x: 16, y: 20, width: 4, height: 12 };
    left: { x: 28, y: 20, width: 4, height: 12 };
    top: { x: 20, y: 16, width: 8, height: 4 };
    bottom: { x: 28, y: 16, width: 8, height: 4 };
  };
  
  rightArm: {
    front: { x: 44, y: 20, width: 4, height: 12 };
    back: { x: 52, y: 20, width: 4, height: 12 };
    right: { x: 40, y: 20, width: 4, height: 12 };
    left: { x: 48, y: 20, width: 4, height: 12 };
    top: { x: 44, y: 16, width: 4, height: 4 };
    bottom: { x: 48, y: 16, width: 4, height: 4 };
  };
  
  leftArm: {
    front: { x: 36, y: 52, width: 4, height: 12 };
    back: { x: 44, y: 52, width: 4, height: 12 };
    right: { x: 32, y: 52, width: 4, height: 12 };
    left: { x: 40, y: 52, width: 4, height: 12 };
    top: { x: 36, y: 48, width: 4, height: 4 };
    bottom: { x: 40, y: 48, width: 4, height: 4 };
  };
  
  rightLeg: {
    front: { x: 4, y: 20, width: 4, height: 12 };
    back: { x: 12, y: 20, width: 4, height: 12 };
    right: { x: 0, y: 20, width: 4, height: 12 };
    left: { x: 8, y: 20, width: 4, height: 12 };
    top: { x: 4, y: 16, width: 4, height: 4 };
    bottom: { x: 8, y: 16, width: 4, height: 4 };
  };
  
  leftLeg: {
    front: { x: 20, y: 52, width: 4, height: 12 };
    back: { x: 28, y: 52, width: 4, height: 12 };
    right: { x: 16, y: 52, width: 4, height: 12 };
    left: { x: 24, y: 52, width: 4, height: 12 };
    top: { x: 20, y: 48, width: 4, height: 4 };
    bottom: { x: 24, y: 48, width: 4, height: 4 };
  };
  
  // Overlay layer coordinates (optional - for hats, jackets, etc.)
  headLayer2: {
    front: { x: 40, y: 8, width: 8, height: 8 };
    back: { x: 56, y: 8, width: 8, height: 8 };
    right: { x: 32, y: 8, width: 8, height: 8 };
    left: { x: 48, y: 8, width: 8, height: 8 };
    top: { x: 40, y: 0, width: 8, height: 8 };
    bottom: { x: 48, y: 0, width: 8, height: 8 };
  };
  
  bodyLayer2: {
    front: { x: 20, y: 36, width: 8, height: 12 };
    back: { x: 32, y: 36, width: 8, height: 12 };
    right: { x: 16, y: 36, width: 4, height: 12 };
    left: { x: 28, y: 36, width: 4, height: 12 };
    top: { x: 20, y: 32, width: 8, height: 4 };
    bottom: { x: 28, y: 32, width: 8, height: 4 };
  };
  
  rightArmLayer2: {
    front: { x: 44, y: 36, width: 4, height: 12 };
    back: { x: 52, y: 36, width: 4, height: 12 };
    right: { x: 40, y: 36, width: 4, height: 12 };
    left: { x: 48, y: 36, width: 4, height: 12 };
    top: { x: 44, y: 32, width: 4, height: 4 };
    bottom: { x: 48, y: 32, width: 4, height: 4 };
  };
  
  leftArmLayer2: {
    front: { x: 52, y: 52, width: 4, height: 12 };
    back: { x: 60, y: 52, width: 4, height: 12 };
    right: { x: 48, y: 52, width: 4, height: 12 };
    left: { x: 56, y: 52, width: 4, height: 12 };
    top: { x: 52, y: 48, width: 4, height: 4 };
    bottom: { x: 56, y: 48, width: 4, height: 4 };
  };
  
  rightLegLayer2: {
    front: { x: 4, y: 36, width: 4, height: 12 };
    back: { x: 12, y: 36, width: 4, height: 12 };
    right: { x: 0, y: 36, width: 4, height: 12 };
    left: { x: 8, y: 36, width: 4, height: 12 };
    top: { x: 4, y: 32, width: 4, height: 4 };
    bottom: { x: 8, y: 32, width: 4, height: 4 };
  };
  
  leftLegLayer2: {
    front: { x: 4, y: 52, width: 4, height: 12 };
    back: { x: 12, y: 52, width: 4, height: 12 };
    right: { x: 0, y: 52, width: 4, height: 12 };
    left: { x: 8, y: 52, width: 4, height: 12 };
    top: { x: 4, y: 48, width: 4, height: 4 };
    bottom: { x: 8, y: 48, width: 4, height: 4 };
  };
}

// Official Minecraft skin layout
export const MINECRAFT_SKIN_LAYOUT: MinecraftSkinLayout = {
  head: {
    front: { x: 8, y: 8, width: 8, height: 8 },
    back: { x: 24, y: 8, width: 8, height: 8 },
    right: { x: 0, y: 8, width: 8, height: 8 },
    left: { x: 16, y: 8, width: 8, height: 8 },
    top: { x: 8, y: 0, width: 8, height: 8 },
    bottom: { x: 16, y: 0, width: 8, height: 8 }
  },
  body: {
    front: { x: 20, y: 20, width: 8, height: 12 },
    back: { x: 32, y: 20, width: 8, height: 12 },
    right: { x: 16, y: 20, width: 4, height: 12 },
    left: { x: 28, y: 20, width: 4, height: 12 },
    top: { x: 20, y: 16, width: 8, height: 4 },
    bottom: { x: 28, y: 16, width: 8, height: 4 }
  },
  rightArm: {
    front: { x: 44, y: 20, width: 4, height: 12 },
    back: { x: 52, y: 20, width: 4, height: 12 },
    right: { x: 40, y: 20, width: 4, height: 12 },
    left: { x: 48, y: 20, width: 4, height: 12 },
    top: { x: 44, y: 16, width: 4, height: 4 },
    bottom: { x: 48, y: 16, width: 4, height: 4 }
  },
  leftArm: {
    front: { x: 36, y: 52, width: 4, height: 12 },
    back: { x: 44, y: 52, width: 4, height: 12 },
    right: { x: 32, y: 52, width: 4, height: 12 },
    left: { x: 40, y: 52, width: 4, height: 12 },
    top: { x: 36, y: 48, width: 4, height: 4 },
    bottom: { x: 40, y: 48, width: 4, height: 4 }
  },
  rightLeg: {
    front: { x: 4, y: 20, width: 4, height: 12 },
    back: { x: 12, y: 20, width: 4, height: 12 },
    right: { x: 0, y: 20, width: 4, height: 12 },
    left: { x: 8, y: 20, width: 4, height: 12 },
    top: { x: 4, y: 16, width: 4, height: 4 },
    bottom: { x: 8, y: 16, width: 4, height: 4 }
  },
  leftLeg: {
    front: { x: 20, y: 52, width: 4, height: 12 },
    back: { x: 28, y: 52, width: 4, height: 12 },
    right: { x: 16, y: 52, width: 4, height: 12 },
    left: { x: 24, y: 52, width: 4, height: 12 },
    top: { x: 20, y: 48, width: 4, height: 4 },
    bottom: { x: 24, y: 48, width: 4, height: 4 }
  },
  headLayer2: {
    front: { x: 40, y: 8, width: 8, height: 8 },
    back: { x: 56, y: 8, width: 8, height: 8 },
    right: { x: 32, y: 8, width: 8, height: 8 },
    left: { x: 48, y: 8, width: 8, height: 8 },
    top: { x: 40, y: 0, width: 8, height: 8 },
    bottom: { x: 48, y: 0, width: 8, height: 8 }
  },
  bodyLayer2: {
    front: { x: 20, y: 36, width: 8, height: 12 },
    back: { x: 32, y: 36, width: 8, height: 12 },
    right: { x: 16, y: 36, width: 4, height: 12 },
    left: { x: 28, y: 36, width: 4, height: 12 },
    top: { x: 20, y: 32, width: 8, height: 4 },
    bottom: { x: 28, y: 32, width: 8, height: 4 }
  },
  rightArmLayer2: {
    front: { x: 44, y: 36, width: 4, height: 12 },
    back: { x: 52, y: 36, width: 4, height: 12 },
    right: { x: 40, y: 36, width: 4, height: 12 },
    left: { x: 48, y: 36, width: 4, height: 12 },
    top: { x: 44, y: 32, width: 4, height: 4 },
    bottom: { x: 48, y: 32, width: 4, height: 4 }
  },
  leftArmLayer2: {
    front: { x: 52, y: 52, width: 4, height: 12 },
    back: { x: 60, y: 52, width: 4, height: 12 },
    right: { x: 48, y: 52, width: 4, height: 12 },
    left: { x: 56, y: 52, width: 4, height: 12 },
    top: { x: 52, y: 48, width: 4, height: 4 },
    bottom: { x: 56, y: 48, width: 4, height: 4 }
  },
  rightLegLayer2: {
    front: { x: 4, y: 36, width: 4, height: 12 },
    back: { x: 12, y: 36, width: 4, height: 12 },
    right: { x: 0, y: 36, width: 4, height: 12 },
    left: { x: 8, y: 36, width: 4, height: 12 },
    top: { x: 4, y: 32, width: 4, height: 4 },
    bottom: { x: 8, y: 32, width: 4, height: 4 }
  },
  leftLegLayer2: {
    front: { x: 4, y: 52, width: 4, height: 12 },
    back: { x: 12, y: 52, width: 4, height: 12 },
    right: { x: 0, y: 52, width: 4, height: 12 },
    left: { x: 8, y: 52, width: 4, height: 12 },
    top: { x: 4, y: 48, width: 4, height: 4 },
    bottom: { x: 8, y: 48, width: 4, height: 4 }
  }
};

/**
 * Validates if a canvas contains a valid Minecraft skin format
 */
export function validateMinecraftSkinFormat(canvas: HTMLCanvasElement): boolean {
  return canvas.width === 64 && canvas.height === 64;
}

/**
 * Extracts UV coordinates for Three.js geometry
 */
export function getUVCoordinates(bodyPart: keyof MinecraftSkinLayout, face: string) {
  const layout = MINECRAFT_SKIN_LAYOUT[bodyPart] as any;
  const coords = layout[face];
  
  if (!coords) {
    console.warn(`Invalid face ${face} for body part ${bodyPart}`);
    return [0, 0, 1, 1];
  }
  
  // Convert pixel coordinates to UV coordinates (0-1 range)
  return [
    coords.x / 64,        // u1
    coords.y / 64,        // v1  
    (coords.x + coords.width) / 64,  // u2
    (coords.y + coords.height) / 64  // v2
  ];
}