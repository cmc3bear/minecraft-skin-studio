/**
 * Theme Detection Service
 * Analyzes prompts to determine appropriate skin theme and parameters
 */

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  skin: string;
  hair: string;
}

export interface SkinDesign {
  theme: string;
  description: string;
  colors: ThemeColors;
  features: string[];
}

export class ThemeDetector {
  private static instance: ThemeDetector;
  
  private themeKeywords: Map<string, string[]> = new Map([
    ['fantasy', ['fantasy', 'magical', 'enchanted', 'mystical', 'fairy', 'dragon', 'unicorn', 'elf']],
    ['scifi', ['scifi', 'sci-fi', 'futuristic', 'alien', 'spaceship', 'laser', 'plasma', 'quantum']],
    ['medieval', ['medieval', 'period', 'historical', 'castle', 'kingdom', 'feudal', 'renaissance']],
    ['modern', ['modern', 'contemporary', 'urban', 'city', 'street', 'casual', 'trendy', 'fashion']],
    ['robot', ['robot', 'android', 'cyborg', 'mech', 'mechanical', 'bot', 'ai', 'artificial']],
    ['space', ['space', 'astronaut', 'cosmic', 'galaxy', 'star', 'nasa', 'rocket', 'alien']],
    ['knight', ['knight', 'armor', 'medieval', 'crusader', 'templar', 'warrior', 'paladin']],
    ['wizard', ['wizard', 'magic', 'mage', 'sorcerer', 'witch', 'warlock', 'mystic', 'enchanter']],
    ['ninja', ['ninja', 'shinobi', 'assassin', 'shadow', 'stealth', 'martial', 'samurai']],
    ['pirate', ['pirate', 'captain', 'sailor', 'buccaneer', 'corsair', 'sea', 'ship']],
    ['viking', ['viking', 'norse', 'berserker', 'raider', 'barbarian', 'axe', 'thor']],
    ['cyberpunk', ['cyber', 'punk', 'neon', 'tech', 'hacker', 'digital', 'matrix', 'futuristic']],
    ['nature', ['nature', 'forest', 'druid', 'ranger', 'archer', 'elf', 'tree', 'green']],
    ['fire', ['fire', 'flame', 'burn', 'lava', 'phoenix', 'pyro', 'inferno', 'ember']],
    ['ice', ['ice', 'frost', 'frozen', 'snow', 'crystal', 'arctic', 'winter', 'cold']],
    ['superhero', ['super', 'hero', 'power', 'cape', 'mask', 'vigilante', 'justice']],
    ['zombie', ['zombie', 'undead', 'ghoul', 'corpse', 'decay', 'apocalypse', 'infected']],
    ['angel', ['angel', 'divine', 'holy', 'wings', 'heaven', 'celestial', 'blessed']],
    ['demon', ['demon', 'devil', 'evil', 'dark', 'hell', 'infernal', 'shadow', 'corrupt']]
  ]);

  private themeColors: Map<string, ThemeColors> = new Map([
    ['fantasy', {
      primary: '#4A148C',
      secondary: '#FFD700',
      accent: '#00BCD4',
      skin: '#FDBCB4',
      hair: '#8B4513'
    }],
    ['scifi', {
      primary: '#00BFFF',
      secondary: '#FF4500',
      accent: '#00FF00',
      skin: '#E6E6FA',
      hair: '#C0C0C0'
    }],
    ['medieval', {
      primary: '#8B4513',
      secondary: '#2F4F4F',
      accent: '#B8860B',
      skin: '#F5DEB3',
      hair: '#8B4513'
    }],
    ['modern', {
      primary: '#2C3E50',
      secondary: '#E74C3C',
      accent: '#F39C12',
      skin: '#FDBCB4',
      hair: '#34495E'
    }],
    ['robot', {
      primary: '#C0C0C0',
      secondary: '#4169E1',
      accent: '#FF0000',
      skin: '#E6E6E6',
      hair: '#808080'
    }],
    ['space', {
      primary: '#FFFFFF',
      secondary: '#000080',
      accent: '#FFD700',
      skin: '#F9DCC4',
      hair: '#4A3C28'
    }],
    ['knight', {
      primary: '#708090',
      secondary: '#FFD700',
      accent: '#8B0000',
      skin: '#F9DCC4',
      hair: '#4A3C28'
    }],
    ['wizard', {
      primary: '#4B0082',
      secondary: '#FFD700',
      accent: '#00CED1',
      skin: '#F9DCC4',
      hair: '#FFFFFF'
    }],
    ['ninja', {
      primary: '#000000',
      secondary: '#DC143C',
      accent: '#C0C0C0',
      skin: '#F9DCC4',
      hair: '#000000'
    }],
    ['pirate', {
      primary: '#8B4513',
      secondary: '#FF0000',
      accent: '#FFD700',
      skin: '#F9DCC4',
      hair: '#000000'
    }],
    ['viking', {
      primary: '#8B4513',
      secondary: '#C0C0C0',
      accent: '#FFD700',
      skin: '#F9DCC4',
      hair: '#FFD700'
    }],
    ['cyberpunk', {
      primary: '#FF00FF',
      secondary: '#00FFFF',
      accent: '#FFFF00',
      skin: '#F9DCC4',
      hair: '#FF00FF'
    }],
    ['nature', {
      primary: '#228B22',
      secondary: '#8B4513',
      accent: '#FFD700',
      skin: '#F9DCC4',
      hair: '#228B22'
    }],
    ['fire', {
      primary: '#FF4500',
      secondary: '#FFD700',
      accent: '#FF0000',
      skin: '#F9DCC4',
      hair: '#FF6347'
    }],
    ['ice', {
      primary: '#00BFFF',
      secondary: '#FFFFFF',
      accent: '#E0FFFF',
      skin: '#F0F8FF',
      hair: '#FFFFFF'
    }],
    ['superhero', {
      primary: '#0000FF',
      secondary: '#FF0000',
      accent: '#FFD700',
      skin: '#F9DCC4',
      hair: '#000000'
    }],
    ['zombie', {
      primary: '#556B2F',
      secondary: '#8B0000',
      accent: '#696969',
      skin: '#90EE90',
      hair: '#696969'
    }],
    ['angel', {
      primary: '#FFFFFF',
      secondary: '#FFD700',
      accent: '#87CEEB',
      skin: '#F9DCC4',
      hair: '#FFD700'
    }],
    ['demon', {
      primary: '#8B0000',
      secondary: '#000000',
      accent: '#FF4500',
      skin: '#DC143C',
      hair: '#000000'
    }]
  ]);

  private themeFeatures: Map<string, string[]> = new Map([
    ['fantasy', ['magical_glow', 'enchanted_armor', 'runes', 'sparkles', 'mystical_aura', 'crystal']],
    ['scifi', ['cybernetic_implants', 'energy_glow', 'holographic_elements', 'circuit_patterns', 'data_streams', 'tech_panels']],
    ['medieval', ['chainmail', 'plate_armor', 'leather_textures', 'metal_rivets', 'weathering', 'embroidery']],
    ['modern', ['hoodie', 'jeans', 'sneakers', 'fabric_textures', 'branding', 'accessories']],
    ['robot', ['helmet', 'antenna', 'chest_panel', 'boots', 'visor', 'circuits']],
    ['space', ['helmet', 'oxygen_tank', 'boots', 'gloves', 'badge', 'visor']],
    ['knight', ['helmet', 'chainmail', 'sword', 'shield', 'gauntlets', 'plume']],
    ['wizard', ['hat', 'robe', 'staff', 'beard', 'spellbook', 'crystal']],
    ['ninja', ['mask', 'hood', 'belt', 'sword', 'stars', 'sandals']],
    ['pirate', ['hat', 'eyepatch', 'beard', 'coat', 'boots', 'sword']],
    ['viking', ['helmet', 'horns', 'beard', 'axe', 'shield', 'fur']],
    ['cyberpunk', ['visor', 'implants', 'jacket', 'boots', 'neon', 'tech']],
    ['nature', ['leaves', 'vines', 'flowers', 'bow', 'hood', 'boots']],
    ['fire', ['flames', 'ember_eyes', 'burning_hands', 'heat_aura', 'scorched']],
    ['ice', ['frost', 'crystal_crown', 'frozen_armor', 'ice_shards', 'cold_aura']],
    ['superhero', ['mask', 'cape', 'emblem', 'boots', 'gloves', 'belt']],
    ['zombie', ['wounds', 'torn_clothes', 'decay', 'exposed_bones', 'blood']],
    ['angel', ['wings', 'halo', 'robe', 'light_aura', 'divine_glow']],
    ['demon', ['horns', 'wings', 'tail', 'claws', 'dark_aura', 'red_eyes']]
  ]);

  static getInstance(): ThemeDetector {
    if (!ThemeDetector.instance) {
      ThemeDetector.instance = new ThemeDetector();
    }
    return ThemeDetector.instance;
  }

  /**
   * Analyze prompt to determine skin design parameters
   */
  analyzePrompt(prompt: string): SkinDesign {
    const lowerPrompt = prompt.toLowerCase();
    const detectedTheme = this.detectTheme(lowerPrompt);
    
    return {
      theme: detectedTheme,
      description: this.generateDescription(detectedTheme, prompt),
      colors: this.getThemeColors(detectedTheme),
      features: this.getThemeFeatures(detectedTheme)
    };
  }

  /**
   * Detect the primary theme from the prompt
   */
  private detectTheme(lowerPrompt: string): string {
    let bestMatch = 'character';
    let highestScore = 0;

    for (const [theme, keywords] of this.themeKeywords) {
      const score = this.calculateThemeScore(lowerPrompt, keywords);
      if (score > highestScore) {
        highestScore = score;
        bestMatch = theme;
      }
    }

    // If no strong match, try to infer from color mentions
    if (highestScore < 2) {
      bestMatch = this.inferThemeFromColors(lowerPrompt);
    }

    return bestMatch;
  }

  /**
   * Calculate how well a prompt matches theme keywords
   */
  private calculateThemeScore(prompt: string, keywords: string[]): number {
    let score = 0;
    for (const keyword of keywords) {
      if (prompt.includes(keyword)) {
        // Give higher score for exact word matches
        const regex = new RegExp(`\\b${keyword}\\b`, 'i');
        score += regex.test(prompt) ? 2 : 1;
      }
    }
    return score;
  }

  /**
   * Infer theme from color mentions in prompt
   */
  private inferThemeFromColors(prompt: string): string {
    if (prompt.includes('green') || prompt.includes('forest')) return 'nature';
    if (prompt.includes('red') || prompt.includes('crimson')) return 'fire';
    if (prompt.includes('blue') || prompt.includes('ocean')) return 'ice';
    if (prompt.includes('black') || prompt.includes('dark')) return 'ninja';
    if (prompt.includes('gold') || prompt.includes('golden')) return 'knight';
    if (prompt.includes('purple') || prompt.includes('violet')) return 'wizard';
    return 'character';
  }

  /**
   * Get color scheme for a theme
   */
  private getThemeColors(theme: string): ThemeColors {
    return this.themeColors.get(theme) || {
      primary: '#4CAF50',
      secondary: '#2196F3',
      accent: '#FF9800',
      skin: '#F9DCC4',
      hair: '#4A3C28'
    };
  }

  /**
   * Get feature list for a theme
   */
  private getThemeFeatures(theme: string): string[] {
    return this.themeFeatures.get(theme) || ['shirt', 'pants', 'shoes'];
  }

  /**
   * Generate a description for the detected theme
   */
  private generateDescription(theme: string, originalPrompt: string): string {
    const baseDescriptions: Map<string, string> = new Map([
      ['fantasy', 'A magical being with enchanted powers and mystical elements'],
      ['scifi', 'A futuristic character with advanced technology and cybernetic enhancements'],
      ['medieval', 'A historical character from the medieval period with authentic period elements'],
      ['modern', 'A contemporary character with urban style and modern fashion'],
      ['robot', 'A mechanical being with advanced technology'],
      ['space', 'An explorer of the cosmos'],
      ['knight', 'A noble warrior in shining armor'],
      ['wizard', 'A master of the arcane arts'],
      ['ninja', 'A shadow warrior of stealth'],
      ['pirate', 'A swashbuckler of the high seas'],
      ['viking', 'A fierce Norse warrior'],
      ['cyberpunk', 'A tech-enhanced rebel'],
      ['nature', 'A guardian of the forest'],
      ['fire', 'A wielder of flame'],
      ['ice', 'A master of frost'],
      ['superhero', 'A defender of justice'],
      ['zombie', 'An undead creature'],
      ['angel', 'A divine celestial being'],
      ['demon', 'A creature from the infernal realm']
    ]);

    return baseDescriptions.get(theme) || `A custom character based on: ${originalPrompt}`;
  }

  /**
   * Add custom theme configuration
   */
  addCustomTheme(name: string, keywords: string[], colors: ThemeColors, features: string[]): void {
    this.themeKeywords.set(name, keywords);
    this.themeColors.set(name, colors);
    this.themeFeatures.set(name, features);
  }
}