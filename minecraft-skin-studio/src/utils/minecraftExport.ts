/**
 * Minecraft Export Utilities
 * Handles exporting skins to Minecraft directories
 */

import { saveAs } from 'file-saver';

/**
 * Gets the default Minecraft directory path based on OS
 */
export function getMinecraftDirectory(): string {
  const platform = navigator.platform.toLowerCase();
  
  if (platform.includes('win')) {
    return '%APPDATA%\\.minecraft\\';
  } else if (platform.includes('mac')) {
    return '~/Library/Application Support/minecraft/';
  } else {
    return '~/.minecraft/';
  }
}

/**
 * Exports a skin canvas to Minecraft-compatible PNG file
 */
export async function exportToMinecraft(canvas: HTMLCanvasElement, filename: string = 'skin.png'): Promise<void> {
  try {
    // Ensure filename ends with .png
    if (!filename.toLowerCase().endsWith('.png')) {
      filename += '.png';
    }

    // Create a blob from the canvas
    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, 'image/png');
    });

    if (!blob) {
      throw new Error('Failed to create image blob');
    }

    // Use file-saver to download the file
    saveAs(blob, filename);
    
    // Show success message with instructions
    const minecraftDir = getMinecraftDirectory();
    const message = `
🎉 Skin exported successfully!

To use in Minecraft:
1. Go to your Minecraft directory: ${minecraftDir}
2. Navigate to the 'skins' folder (create if it doesn't exist)
3. Place the downloaded ${filename} file there
4. In Minecraft, go to Options > Skin Customization
5. Upload your custom skin!

Note: For web security reasons, we can't directly save to your Minecraft folder. 
The file has been downloaded to your default download folder.
    `;

    alert(message);
    
  } catch (error) {
    console.error('Failed to export to Minecraft:', error);
    throw new Error('Failed to export skin. Please try again.');
  }
}

/**
 * Validates that a canvas contains a valid Minecraft skin
 */
export function validateMinecraftSkin(canvas: HTMLCanvasElement): { valid: boolean; message: string } {
  // Check dimensions
  if (canvas.width !== 64 || canvas.height !== 64) {
    return {
      valid: false,
      message: 'Invalid skin dimensions. Minecraft skins must be 64x64 pixels.'
    };
  }

  // Check if canvas has any content (not just white/transparent)
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return {
      valid: false,
      message: 'Cannot read canvas data.'
    };
  }

  const imageData = ctx.getImageData(0, 0, 64, 64);
  const data = imageData.data;
  
  // Check if all pixels are the same (likely empty/invalid)
  let hasVariation = false;
  const firstPixel = [data[0], data[1], data[2], data[3]];
  
  for (let i = 4; i < data.length; i += 4) {
    if (data[i] !== firstPixel[0] || 
        data[i + 1] !== firstPixel[1] || 
        data[i + 2] !== firstPixel[2] || 
        data[i + 3] !== firstPixel[3]) {
      hasVariation = true;
      break;
    }
  }

  if (!hasVariation) {
    return {
      valid: false,
      message: 'Skin appears to be empty or invalid. Please create some design first.'
    };
  }

  return {
    valid: true,
    message: 'Skin is valid for Minecraft!'
  };
}

/**
 * Generates a unique filename for the skin
 */
export function generateSkinFilename(projectName?: string): string {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const baseName = projectName ? projectName.replace(/[^a-zA-Z0-9-_]/g, '_') : 'minecraft_skin';
  return `${baseName}_${timestamp}.png`;
}