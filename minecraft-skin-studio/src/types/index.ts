export interface SkinProject {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  imageData: string; // Base64 encoded image
  layers: SkinLayer[];
  thumbnail?: string;
}

export interface SkinLayer {
  id: string;
  name: string;
  visible: boolean;
  opacity: number;
  data: ImageData;
}

export interface Tool {
  id: string;
  name: string;
  icon: string;
  cursor?: string;
}

export interface Color {
  hex: string;
  rgb: { r: number; g: number; b: number };
}

export interface Point {
  x: number;
  y: number;
}

export interface AIRequest {
  prompt: string;
  context?: {
    currentSkin?: string;
    selectedColor?: Color;
    selectedTool?: Tool;
  };
}

export interface AIResponse {
  suggestion?: string;
  actions?: AIAction[];
  colorPalette?: Color[];
}

export interface AIAction {
  type: 'draw' | 'fill' | 'suggest' | 'tutorial';
  data: any;
}

export interface Template {
  id: string;
  name: string;
  category: string;
  thumbnail: string;
  data: string;
  tags: string[];
}

export const SKIN_WIDTH = 64;
export const SKIN_HEIGHT = 64;
export const BODY_PARTS = {
  HEAD: { x: 0, y: 0, width: 32, height: 16 },
  BODY: { x: 16, y: 16, width: 24, height: 16 },
  RIGHT_ARM: { x: 40, y: 16, width: 16, height: 16 },
  LEFT_ARM: { x: 32, y: 48, width: 16, height: 16 },
  RIGHT_LEG: { x: 0, y: 16, width: 16, height: 16 },
  LEFT_LEG: { x: 16, y: 48, width: 16, height: 16 },
};