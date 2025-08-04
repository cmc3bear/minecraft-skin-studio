/**
 * Minecraft Skin Pipeline
 * Translates user requests to valid Minecraft skin designs
 * Ensures compliance with official Minecraft skin specification
 */

import { MINECRAFT_SKIN_LAYOUT } from '../utils/minecraftSkinSpec';

export interface SkinRequest {
  prompt: string;
  style?: 'realistic' | 'cartoon' | 'pixel' | 'fantasy';
  colors?: string[];
}

export interface SkinDesign {
  theme: string;
  description: string;
  colors: {
    skin: string;
    hair: string;
    shirt: string;
    pants: string;
    shoes: string;
    accent: string;
  };
  features: string[];
  layers: {
    base: boolean;
    overlay: boolean;
  };
}

export class MinecraftSkinPipeline {
  private static instance: MinecraftSkinPipeline;
  
  static getInstance(): MinecraftSkinPipeline {
    if (!this.instance) {
      this.instance = new MinecraftSkinPipeline();
    }
    return this.instance;
  }

  /**
   * Main pipeline: User Request → Skin Design → Canvas Data
   */
  async processSkinRequest(request: SkinRequest): Promise<string> {
    console.log('🎨 Processing skin request:', request.prompt);
    
    // Step 1: Analyze user request
    const design = this.analyzeUserRequest(request);
    console.log('📋 Design analysis:', design);
    
    // Step 2: Generate Minecraft-compliant skin
    const skinDataURL = await this.generateMinecraftSkin(design);
    console.log('✅ Generated Minecraft skin');
    
    return skinDataURL;
  }

  /**
   * Analyzes user request and creates design specification
   */
  private analyzeUserRequest(request: SkinRequest): SkinDesign {
    const prompt = request.prompt.toLowerCase();
    
    // Theme detection with keyword matching
    let theme = 'character';
    let colors = {
      skin: '#F9DCC4',
      hair: '#4A3C28', 
      shirt: '#4CAF50',
      pants: '#2196F3',
      shoes: '#757575',
      accent: '#FF9800'
    };
    let features: string[] = [];

    // Robot/Cyborg theme
    if (this.matchesKeywords(prompt, ['robot', 'cyborg', 'android', 'mechanical', 'tech'])) {
      theme = 'robot';
      colors = {
        skin: '#E0E0E0',    // Metallic gray
        hair: '#616161',     // Dark gray
        shirt: '#2196F3',    // Blue tech
        pants: '#37474F',    // Dark blue-gray
        shoes: '#263238',    // Very dark gray
        accent: '#00BCD4'    // Cyan accent
      };
      features = ['visor', 'antenna', 'chest_panel', 'joints'];
    }
    
    // Knight/Medieval theme
    else if (this.matchesKeywords(prompt, ['knight', 'medieval', 'armor', 'warrior', 'guard'])) {
      theme = 'knight';
      colors = {
        skin: '#F9DCC4',    // Normal skin
        hair: '#4A3C28',     // Brown hair
        shirt: '#9E9E9E',    // Gray armor
        pants: '#795548',    // Brown leather
        shoes: '#5D4037',    // Dark brown boots
        accent: '#FFD700'    // Gold details
      };
      features = ['helmet', 'chainmail', 'sword', 'shield_emblem'];
    }
    
    // Wizard/Mage theme
    else if (this.matchesKeywords(prompt, ['wizard', 'mage', 'magic', 'sorcerer', 'witch'])) {
      theme = 'wizard';
      colors = {
        skin: '#F9DCC4',    // Normal skin
        hair: '#E0E0E0',     // Gray/white hair
        shirt: '#673AB7',    // Purple robe
        pants: '#3F51B5',    // Indigo robe bottom
        shoes: '#4A148C',    // Dark purple boots
        accent: '#FFD700'    // Gold trim
      };
      features = ['wizard_hat', 'beard', 'robe_trim', 'staff_holder'];
    }
    
    // Pirate theme
    else if (this.matchesKeywords(prompt, ['pirate', 'sailor', 'captain', 'buccaneer', 'sea'])) {
      theme = 'pirate';
      colors = {
        skin: '#D7B899',    // Tan skin
        hair: '#3E2723',     // Dark brown hair
        shirt: '#D32F2F',    // Red shirt
        pants: '#424242',    // Dark gray pants
        shoes: '#8D6E63',    // Brown boots
        accent: '#FFD700'    // Gold accessories
      };
      features = ['bandana', 'eyepatch', 'coat', 'belt'];
    }
    
    // Ninja theme
    else if (this.matchesKeywords(prompt, ['ninja', 'assassin', 'stealth', 'shadow', 'shinobi'])) {
      theme = 'ninja';
      colors = {
        skin: '#F9DCC4',    // Normal skin
        hair: '#212121',     // Black hair
        shirt: '#212121',    // Black outfit
        pants: '#424242',    // Dark gray
        shoes: '#000000',    // Black shoes
        accent: '#F44336'    // Red accents
      };
      features = ['mask', 'hood', 'wraps', 'shuriken_pouch'];
    }
    
    // Superhero theme
    else if (this.matchesKeywords(prompt, ['superhero', 'hero', 'super', 'cape', 'powers'])) {
      theme = 'superhero';
      colors = {
        skin: '#F9DCC4',    // Normal skin
        hair: '#4A3C28',     // Brown hair
        shirt: '#1976D2',    // Blue suit
        pants: '#0D47A1',    // Dark blue
        shoes: '#FF5722',    // Red boots
        accent: '#FFD700'    // Gold emblem
      };
      features = ['cape', 'emblem', 'mask', 'utility_belt'];
    }
    
    // Animal themes
    else if (this.matchesKeywords(prompt, ['cat', 'feline', 'kitty'])) {
      theme = 'cat';
      colors = {
        skin: '#FF9800',    // Orange fur
        hair: '#E65100',     // Darker orange
        shirt: '#FFF3E0',    // Light cream chest
        pants: '#FF9800',    // Orange body
        shoes: '#BF360C',    // Dark orange paws
        accent: '#000000'    // Black details
      };
      features = ['ears', 'tail', 'whiskers', 'paws'];
    }
    
    else if (this.matchesKeywords(prompt, ['panda', 'bear'])) {
      theme = 'panda';
      colors = {
        skin: '#FFFFFF',    // White fur
        hair: '#000000',     // Black ears
        shirt: '#FFFFFF',    // White chest
        pants: '#FFFFFF',    // White body
        shoes: '#000000',    // Black paws
        accent: '#FF69B4'    // Pink nose
      };
      features = ['ears', 'eye_patches', 'nose', 'paws'];
    }

    return {
      theme,
      description: request.prompt,
      colors,
      features,
      layers: {
        base: true,
        overlay: features.length > 0
      }
    };
  }

  /**
   * Helper function to match keywords in prompt
   */
  private matchesKeywords(prompt: string, keywords: string[]): boolean {
    return keywords.some(keyword => prompt.includes(keyword));
  }

  /**
   * Generates a complete Minecraft skin following official specification
   */
  private async generateMinecraftSkin(design: SkinDesign): Promise<string> {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      throw new Error('Could not create canvas context');
    }

    // Clear canvas with transparency
    ctx.clearRect(0, 0, 64, 64);
    
    // Fill with transparent background
    ctx.fillStyle = 'rgba(0, 0, 0, 0)';
    ctx.fillRect(0, 0, 64, 64);

    // Generate base layer
    this.renderBaseLayer(ctx, design);
    
    // Generate overlay layer if needed
    if (design.layers.overlay) {
      this.renderOverlayLayer(ctx, design);
    }

    return canvas.toDataURL('image/png');
  }

  /**
   * Renders the base layer (skin, basic clothing)
   */
  private renderBaseLayer(ctx: CanvasRenderingContext2D, design: SkinDesign) {
    const { colors } = design;
    const layout = MINECRAFT_SKIN_LAYOUT;

    // Helper function to fill a body part area
    const fillBodyPart = (partName: keyof typeof layout, color: string) => {
      const part = layout[partName] as any;
      Object.values(part).forEach((face: any) => {
        ctx.fillStyle = color;
        ctx.fillRect(face.x, face.y, face.width, face.height);
      });
    };

    // Head (skin color)
    fillBodyPart('head', colors.skin);
    
    // Add facial features
    this.addFacialFeatures(ctx, design);
    
    // Body (shirt color)
    fillBodyPart('body', colors.shirt);
    
    // Arms (skin color)
    fillBodyPart('rightArm', colors.skin);
    fillBodyPart('leftArm', colors.skin);
    
    // Legs (pants color)
    fillBodyPart('rightLeg', colors.pants);
    fillBodyPart('leftLeg', colors.pants);
    
    // Add theme-specific base details
    this.addThemeDetails(ctx, design);
  }

  /**
   * Renders the overlay layer (hats, jackets, accessories)
   */
  private renderOverlayLayer(ctx: CanvasRenderingContext2D, design: SkinDesign) {
    const { theme, colors, features } = design;
    const layout = MINECRAFT_SKIN_LAYOUT;

    if (features.includes('wizard_hat')) {
      // Wizard hat on head layer 2
      const hat = layout.headLayer2;
      ctx.fillStyle = colors.accent;
      ctx.fillRect(hat.front.x, hat.front.y, hat.front.width, hat.front.height);
      ctx.fillRect(hat.back.x, hat.back.y, hat.back.width, hat.back.height);
      ctx.fillRect(hat.top.x, hat.top.y, hat.top.width, hat.top.height);
    }
    
    if (features.includes('cape')) {
      // Simple cape on body layer 2 back
      const jacket = layout.bodyLayer2;
      ctx.fillStyle = colors.accent;
      ctx.fillRect(jacket.back.x, jacket.back.y, jacket.back.width, jacket.back.height);
    }
    
    if (features.includes('hood') || features.includes('mask')) {
      // Hood/mask on head layer 2
      const headLayer = layout.headLayer2;
      ctx.fillStyle = colors.pants; // Use pants color for mask/hood
      ctx.fillRect(headLayer.front.x, headLayer.front.y, headLayer.front.width, headLayer.front.height);
    }
  }

  /**
   * Adds facial features (eyes, mouth, nose)
   */
  private addFacialFeatures(ctx: CanvasRenderingContext2D, design: SkinDesign) {
    const headFront = MINECRAFT_SKIN_LAYOUT.head.front;
    const baseX = headFront.x;
    const baseY = headFront.y;
    
    // Eyes (2x1 pixels each)
    ctx.fillStyle = '#000000'; // Black eyes
    ctx.fillRect(baseX + 2, baseY + 4, 1, 1); // Left eye
    ctx.fillRect(baseX + 5, baseY + 4, 1, 1); // Right eye
    
    // Eye highlights
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(baseX + 1, baseY + 4, 1, 1); // Left eye white
    ctx.fillRect(baseX + 4, baseY + 4, 1, 1); // Right eye white
    
    // Mouth
    ctx.fillStyle = '#8B4513'; // Brown mouth
    ctx.fillRect(baseX + 3, baseY + 6, 2, 1);
    
    // Theme-specific facial features
    if (design.theme === 'robot') {
      // Robot visor
      ctx.fillStyle = design.colors.accent;
      ctx.fillRect(baseX + 1, baseY + 3, 6, 2);
    }
    
    if (design.features.includes('beard')) {
      // Wizard beard
      ctx.fillStyle = '#E0E0E0'; // Gray beard
      ctx.fillRect(baseX + 2, baseY + 6, 4, 2);
    }
  }

  /**
   * Adds theme-specific details to base layer
   */
  private addThemeDetails(ctx: CanvasRenderingContext2D, design: SkinDesign) {
    const { theme, colors } = design;
    
    if (theme === 'robot') {
      // Chest panel
      const bodyFront = MINECRAFT_SKIN_LAYOUT.body.front;
      ctx.fillStyle = colors.accent;
      ctx.fillRect(bodyFront.x + 2, bodyFront.y + 2, 4, 4);
      
      // Joints on arms
      const rightArm = MINECRAFT_SKIN_LAYOUT.rightArm.front;
      ctx.fillStyle = colors.shoes;
      ctx.fillRect(rightArm.x, rightArm.y + 4, rightArm.width, 1);
    }
    
    if (theme === 'knight') {
      // Chainmail pattern
      const bodyFront = MINECRAFT_SKIN_LAYOUT.body.front;
      ctx.fillStyle = colors.accent;
      for (let x = 0; x < bodyFront.width; x += 2) {
        for (let y = 0; y < bodyFront.height; y += 2) {
          ctx.fillRect(bodyFront.x + x, bodyFront.y + y, 1, 1);
        }
      }
    }
    
    if (theme === 'pirate') {
      // Belt
      const bodyFront = MINECRAFT_SKIN_LAYOUT.body.front;
      ctx.fillStyle = colors.accent;
      ctx.fillRect(bodyFront.x, bodyFront.y + 8, bodyFront.width, 2);
    }
  }
}

// Export singleton instance
export const skinPipeline = MinecraftSkinPipeline.getInstance();