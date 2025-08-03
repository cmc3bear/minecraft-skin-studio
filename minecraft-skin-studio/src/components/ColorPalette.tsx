import { Color } from '../types';
import '../styles/ColorPalette.css';

interface ColorPaletteProps {
  currentColor: Color;
  onColorSelect: (color: Color) => void;
}

const DEFAULT_COLORS: Color[] = [
  { hex: '#000000', rgb: { r: 0, g: 0, b: 0 } },
  { hex: '#ffffff', rgb: { r: 255, g: 255, b: 255 } },
  { hex: '#ff0000', rgb: { r: 255, g: 0, b: 0 } },
  { hex: '#00ff00', rgb: { r: 0, g: 255, b: 0 } },
  { hex: '#0000ff', rgb: { r: 0, g: 0, b: 255 } },
  { hex: '#ffff00', rgb: { r: 255, g: 255, b: 0 } },
  { hex: '#ff00ff', rgb: { r: 255, g: 0, b: 255 } },
  { hex: '#00ffff', rgb: { r: 0, g: 255, b: 255 } },
  { hex: '#ff8800', rgb: { r: 255, g: 136, b: 0 } },
  { hex: '#ff0088', rgb: { r: 255, g: 0, b: 136 } },
  { hex: '#88ff00', rgb: { r: 136, g: 255, b: 0 } },
  { hex: '#8800ff', rgb: { r: 136, g: 0, b: 255 } },
  { hex: '#00ff88', rgb: { r: 0, g: 255, b: 136 } },
  { hex: '#0088ff', rgb: { r: 0, g: 136, b: 255 } },
  { hex: '#888888', rgb: { r: 136, g: 136, b: 136 } },
  { hex: '#444444', rgb: { r: 68, g: 68, b: 68 } },
  { hex: '#8B4513', rgb: { r: 139, g: 69, b: 19 } },
  { hex: '#FFE4B5', rgb: { r: 255, g: 228, b: 181 } },
  { hex: '#FFA07A', rgb: { r: 255, g: 160, b: 122 } },
  { hex: '#FF69B4', rgb: { r: 255, g: 105, b: 180 } },
  { hex: '#9370DB', rgb: { r: 147, g: 112, b: 219 } },
  { hex: '#4B0082', rgb: { r: 75, g: 0, b: 130 } },
  { hex: '#32CD32', rgb: { r: 50, g: 205, b: 50 } },
  { hex: '#228B22', rgb: { r: 34, g: 139, b: 34 } }
];

export default function ColorPalette({ currentColor, onColorSelect }: ColorPaletteProps) {
  const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  };

  const handleCustomColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const hex = e.target.value;
    const rgb = hexToRgb(hex);
    onColorSelect({ hex, rgb });
  };

  return (
    <div className="color-palette">
      <div className="current-color-display">
        <div 
          className="current-color-swatch" 
          style={{ backgroundColor: currentColor.hex }}
        />
        <span className="current-color-hex">{currentColor.hex}</span>
      </div>
      
      <div className="color-grid">
        {DEFAULT_COLORS.map((color, index) => (
          <button
            key={index}
            className={`color-swatch ${color.hex === currentColor.hex ? 'active' : ''}`}
            style={{ backgroundColor: color.hex }}
            onClick={() => onColorSelect(color)}
            title={color.hex}
          />
        ))}
      </div>
      
      <div className="custom-color">
        <label htmlFor="custom-color">Custom Color:</label>
        <input
          id="custom-color"
          type="color"
          value={currentColor.hex}
          onChange={handleCustomColorChange}
        />
      </div>
    </div>
  );
}