/**
 * Advanced AI Skin Generator
 * Creates detailed Minecraft skins based on prompts using algorithmic generation
 */

import { generateSteveSkin, imageDataToDataURL } from '../utils/defaultSkins';

interface SkinDesign {
  theme: string;
  description: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    skin: string;
    hair: string;
  };
  features: string[];
}

export class AdvancedSkinGenerator {
  private static instance: AdvancedSkinGenerator;
  
  static getInstance(): AdvancedSkinGenerator {
    if (!AdvancedSkinGenerator.instance) {
      AdvancedSkinGenerator.instance = new AdvancedSkinGenerator();
    }
    return AdvancedSkinGenerator.instance;
  }

  /**
   * Generate a complete skin design from a text prompt
   */
  async generateSkinFromPrompt(prompt: string): Promise<string> {
    console.log('🎨 Generating advanced skin for prompt:', prompt);
    
    // Analyze prompt to determine design parameters
    const design = this.analyzePrompt(prompt);
    
    // Create base canvas
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      throw new Error('Could not create canvas context');
    }
    
    // Start with transparent background
    ctx.fillStyle = 'rgba(0, 0, 0, 0)';
    ctx.fillRect(0, 0, 64, 64);
    
    // Generate skin based on theme
    this.generateSkinByTheme(ctx, design);
    
    return canvas.toDataURL('image/png');
  }

  private analyzePrompt(prompt: string): SkinDesign {
    const lowerPrompt = prompt.toLowerCase();
    
    // Determine theme
    let theme = 'character';
    let colors = {
      primary: '#4CAF50',
      secondary: '#2196F3', 
      accent: '#FF9800',
      skin: '#F9DCC4',
      hair: '#4A3C28'
    };
    let features: string[] = [];

    // Theme detection with color schemes
    if (lowerPrompt.includes('robot') || lowerPrompt.includes('space') || lowerPrompt.includes('astronaut')) {
      theme = 'robot';
      colors = {
        primary: '#C0C0C0',    // Silver
        secondary: '#4169E1',   // Royal Blue
        accent: '#FF0000',      // Red
        skin: '#E6E6E6',        // Light Gray
        hair: '#808080'         // Gray
      };
      features = ['helmet', 'antenna', 'chest_panel', 'boots'];
    }
    else if (lowerPrompt.includes('knight') || lowerPrompt.includes('armor') || lowerPrompt.includes('medieval')) {
      theme = 'knight';
      colors = {
        primary: '#708090',    // Slate Gray
        secondary: '#FFD700',   // Gold
        accent: '#8B0000',      // Dark Red
        skin: '#F9DCC4',        // Normal skin
        hair: '#4A3C28'         // Brown
      };
      features = ['helmet', 'chainmail', 'sword', 'shield'];
    }
    else if (lowerPrompt.includes('wizard') || lowerPrompt.includes('magic') || lowerPrompt.includes('mage')) {
      theme = 'wizard';
      colors = {
        primary: '#4B0082',    // Indigo
        secondary: '#9370DB',   // Medium Purple
        accent: '#FFD700',      // Gold
        skin: '#F9DCC4',        // Normal skin
        hair: '#FFFFFF'         // White/Gray
      };
      features = ['hat', 'beard', 'robe', 'staff'];
    }
    else if (lowerPrompt.includes('ninja') || lowerPrompt.includes('stealth') || lowerPrompt.includes('black')) {
      theme = 'ninja';
      colors = {
        primary: '#000000',    // Black
        secondary: '#2F4F4F',   // Dark Slate Gray
        accent: '#FF0000',      // Red
        skin: '#F9DCC4',        // Normal skin
        hair: '#000000'         // Black
      };
      features = ['mask', 'hood', 'belt', 'boots'];
    }
    else if (lowerPrompt.includes('pirate') || lowerPrompt.includes('captain') || lowerPrompt.includes('sea')) {
      theme = 'pirate';
      colors = {
        primary: '#8B4513',    // Saddle Brown
        secondary: '#000080',   // Navy
        accent: '#FFD700',      // Gold
        skin: '#D2B48C',        // Tan
        hair: '#4A4A4A'         // Dark Gray
      };
      features = ['hat', 'eyepatch', 'coat', 'boots'];
    }
    else if (lowerPrompt.includes('superhero') || lowerPrompt.includes('hero') || lowerPrompt.includes('cape')) {
      theme = 'superhero';
      colors = {
        primary: '#FF0000',    // Red
        secondary: '#0000FF',   // Blue
        accent: '#FFD700',      // Gold
        skin: '#F9DCC4',        // Normal skin
        hair: '#4A3C28'         // Brown
      };
      features = ['cape', 'emblem', 'mask', 'boots'];
    }
    else if (lowerPrompt.includes('animal') || lowerPrompt.includes('cat') || lowerPrompt.includes('dog') || lowerPrompt.includes('panda')) {
      theme = 'animal';
      if (lowerPrompt.includes('panda')) {
        colors = {
          primary: '#FFFFFF',    // White
          secondary: '#000000',   // Black
          accent: '#FFB6C1',      // Light Pink
          skin: '#FFFFFF',        // White
          hair: '#000000'         // Black
        };
        features = ['ears', 'eye_patches', 'paws'];
      }
    }

    return {
      theme,
      description: prompt,
      colors,
      features
    };
  }

  private generateSkinByTheme(ctx: CanvasRenderingContext2D, design: SkinDesign) {
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

    // Base character structure (Steve proportions)
    this.drawBaseCharacter(ctx, design.colors, drawRect, drawPixel);
    
    // Add theme-specific features
    this.addThemeFeatures(ctx, design, drawRect, drawPixel);
  }

  private drawBaseCharacter(
    ctx: CanvasRenderingContext2D, 
    colors: any, 
    drawRect: Function, 
    drawPixel: Function
  ) {
    // Head (Front) - 8x8 at (8, 8)
    drawRect(8, 8, 8, 8, colors.skin);
    
    // Hair/Head top
    drawRect(8, 8, 8, 3, colors.hair);
    
    // Eyes
    drawPixel(10, 12, '#FFFFFF');
    drawPixel(11, 12, '#000000');
    drawPixel(13, 12, '#FFFFFF');
    drawPixel(14, 12, '#000000');
    
    // Nose
    drawPixel(12, 13, '#E8B59B');
    
    // Mouth
    drawRect(11, 14, 2, 1, '#8B4513');
    
    // Head sides, back, top, bottom
    drawRect(0, 8, 8, 8, colors.skin);   // Right
    drawRect(24, 8, 8, 8, colors.skin);  // Back
    drawRect(16, 8, 8, 8, colors.skin);  // Left
    drawRect(8, 0, 8, 8, colors.hair);   // Top
    drawRect(16, 0, 8, 8, colors.skin);  // Bottom
    
    // Body (Front) - 8x12 at (20, 20)
    drawRect(20, 20, 8, 12, colors.primary);
    
    // Body sides, back, top, bottom
    drawRect(16, 20, 4, 12, colors.primary);  // Right
    drawRect(32, 20, 8, 12, colors.primary);  // Back
    drawRect(28, 20, 4, 12, colors.primary);  // Left
    drawRect(20, 16, 8, 4, colors.primary);   // Top
    drawRect(28, 16, 8, 4, colors.primary);   // Bottom
    
    // Right Arm
    drawRect(44, 20, 4, 12, colors.skin);  // Front
    drawRect(52, 20, 4, 12, colors.skin);  // Back
    drawRect(40, 20, 4, 12, colors.skin);  // Right
    drawRect(48, 20, 4, 12, colors.skin);  // Left
    drawRect(44, 16, 4, 4, colors.skin);   // Top
    drawRect(48, 16, 4, 4, colors.skin);   // Bottom
    
    // Left Arm (new format)
    drawRect(36, 52, 4, 12, colors.skin);  // Front
    drawRect(44, 52, 4, 12, colors.skin);  // Back
    drawRect(32, 52, 4, 12, colors.skin);  // Right
    drawRect(40, 52, 4, 12, colors.skin);  // Left
    drawRect(36, 48, 4, 4, colors.skin);   // Top
    drawRect(40, 48, 4, 4, colors.skin);   // Bottom
    
    // Right Leg
    drawRect(4, 20, 4, 12, colors.secondary);  // Front
    drawRect(12, 20, 4, 12, colors.secondary); // Back
    drawRect(0, 20, 4, 12, colors.secondary);  // Right
    drawRect(8, 20, 4, 12, colors.secondary);  // Left
    drawRect(4, 16, 4, 4, colors.secondary);   // Top
    drawRect(8, 16, 4, 4, colors.secondary);   // Bottom
    
    // Left Leg (new format)
    drawRect(20, 52, 4, 12, colors.secondary); // Front
    drawRect(28, 52, 4, 12, colors.secondary); // Back
    drawRect(16, 52, 4, 12, colors.secondary); // Right
    drawRect(24, 52, 4, 12, colors.secondary); // Left
    drawRect(20, 48, 4, 4, colors.secondary);  // Top
    drawRect(24, 48, 4, 4, colors.secondary);  // Bottom
  }

  private addThemeFeatures(
    ctx: CanvasRenderingContext2D, 
    design: SkinDesign, 
    drawRect: Function, 
    drawPixel: Function
  ) {
    const { theme, colors, features } = design;

    switch (theme) {
      case 'robot':
        // Add antenna on head
        drawPixel(12, 7, colors.accent);
        drawPixel(12, 6, colors.accent);
        
        // Add chest panel
        drawRect(22, 22, 4, 4, colors.secondary);
        drawRect(23, 23, 2, 2, colors.accent);
        
        // Add robotic eyes
        drawPixel(10, 12, colors.accent);
        drawPixel(14, 12, colors.accent);
        
        // Add metallic details on arms
        drawRect(44, 22, 4, 2, colors.secondary);
        drawRect(36, 54, 4, 2, colors.secondary);
        break;
        
      case 'knight':
        // Add helmet
        drawRect(8, 8, 8, 4, colors.primary);
        
        // Add visor
        drawRect(10, 11, 4, 2, colors.secondary);
        
        // Add chainmail on body
        for (let x = 20; x < 28; x += 2) {
          for (let y = 20; y < 32; y += 2) {
            drawPixel(x, y, colors.secondary);
          }
        }
        
        // Add belt
        drawRect(20, 26, 8, 2, colors.accent);
        break;
        
      case 'wizard':
        // Add wizard hat
        drawRect(9, 5, 6, 3, colors.primary);
        drawRect(10, 2, 4, 3, colors.primary);
        drawRect(11, 0, 2, 2, colors.primary);
        
        // Add beard
        drawRect(10, 15, 4, 2, colors.hair);
        
        // Add robe details
        drawRect(21, 20, 6, 12, colors.primary);
        drawRect(22, 22, 4, 2, colors.accent);
        
        // Add stars on robe
        drawPixel(23, 25, colors.accent);
        drawPixel(24, 28, colors.accent);
        break;
        
      case 'ninja':
        // Add mask
        drawRect(8, 10, 8, 6, colors.primary);
        
        // Add eye holes
        drawPixel(10, 12, '#FFFFFF');
        drawPixel(14, 12, '#FFFFFF');
        
        // Add ninja outfit
        drawRect(20, 20, 8, 12, colors.primary);
        
        // Add belt
        drawRect(20, 26, 8, 2, colors.accent);
        
        // Add arm wraps
        drawRect(44, 24, 4, 2, colors.secondary);
        drawRect(36, 56, 4, 2, colors.secondary);
        break;
        
      case 'pirate':
        // Add pirate hat
        drawRect(8, 8, 8, 4, colors.secondary);
        drawRect(7, 9, 10, 2, colors.secondary);
        
        // Add skull and crossbones
        drawPixel(12, 9, '#FFFFFF');
        
        // Add eyepatch
        drawRect(13, 12, 2, 2, colors.primary);
        
        // Add coat
        drawRect(19, 20, 10, 12, colors.primary);
        drawRect(20, 22, 8, 2, colors.accent);
        break;
        
      case 'superhero':
        // Add mask
        drawRect(9, 11, 6, 3, colors.secondary);
        
        // Add emblem on chest
        drawRect(22, 22, 4, 4, colors.accent);
        drawPixel(24, 24, colors.secondary);
        
        // Add cape (back view)
        drawRect(30, 20, 12, 12, colors.accent);
        break;
        
      case 'animal':
        // Add panda features if panda
        if (design.description.toLowerCase().includes('panda')) {
          // Add ear patches
          drawRect(8, 8, 2, 2, colors.secondary);
          drawRect(14, 8, 2, 2, colors.secondary);
          
          // Add eye patches
          drawRect(9, 11, 2, 3, colors.secondary);
          drawRect(13, 11, 2, 3, colors.secondary);
          
          // White body
          drawRect(20, 20, 8, 12, colors.primary);
        }
        break;
    }
  }
}

export const advancedSkinGenerator = AdvancedSkinGenerator.getInstance();