import React, { useState, useRef, useEffect } from 'react';
import { voiceService } from '../services/voiceService';
import '../styles/UVMapOverlay.css';

interface UVSection {
  id: string;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
}

interface UVMapOverlayProps {
  isVisible: boolean;
  pixelSize: number;
  onSectionHover?: (section: string | null) => void;
}

// Define all UV map sections based on the style overlay image
const UV_SECTIONS: UVSection[] = [
  // Head sections
  { id: 'head-right', label: 'Head Right', x: 0, y: 8, width: 8, height: 8, color: 'rgba(139, 69, 19, 0.3)' },
  { id: 'head-face', label: 'Head Face', x: 8, y: 8, width: 8, height: 8, color: 'rgba(139, 69, 19, 0.3)' },
  { id: 'head-left', label: 'Head Left', x: 16, y: 8, width: 8, height: 8, color: 'rgba(139, 69, 19, 0.3)' },
  { id: 'head-back', label: 'Head Back', x: 24, y: 8, width: 8, height: 8, color: 'rgba(139, 69, 19, 0.3)' },
  { id: 'head-top', label: 'Head Top', x: 8, y: 0, width: 8, height: 8, color: 'rgba(139, 69, 19, 0.3)' },
  { id: 'head-bottom', label: 'Head Bottom', x: 16, y: 0, width: 8, height: 8, color: 'rgba(139, 69, 19, 0.3)' },
  
  // Hat/Hair overlay sections
  { id: 'hat-right', label: 'Hat Right', x: 32, y: 8, width: 8, height: 8, color: 'rgba(128, 128, 128, 0.3)' },
  { id: 'hat-face', label: 'Hat Face', x: 40, y: 8, width: 8, height: 8, color: 'rgba(128, 128, 128, 0.3)' },
  { id: 'hat-left', label: 'Hat Left', x: 48, y: 8, width: 8, height: 8, color: 'rgba(128, 128, 128, 0.3)' },
  { id: 'hat-back', label: 'Hat Back', x: 56, y: 8, width: 8, height: 8, color: 'rgba(128, 128, 128, 0.3)' },
  { id: 'hat-top', label: 'Hat Top', x: 40, y: 0, width: 8, height: 8, color: 'rgba(128, 128, 128, 0.3)' },
  { id: 'hat-bottom', label: 'Hat Bottom', x: 48, y: 0, width: 8, height: 8, color: 'rgba(128, 128, 128, 0.3)' },
  
  // Body sections
  { id: 'body-front', label: 'Body Front', x: 20, y: 20, width: 8, height: 12, color: 'rgba(0, 128, 128, 0.3)' },
  { id: 'body-back', label: 'Body Back', x: 32, y: 20, width: 8, height: 12, color: 'rgba(0, 128, 128, 0.3)' },
  { id: 'body-right', label: 'Body Right', x: 16, y: 20, width: 4, height: 12, color: 'rgba(0, 128, 128, 0.3)' },
  { id: 'body-left', label: 'Body Left', x: 28, y: 20, width: 4, height: 12, color: 'rgba(0, 128, 128, 0.3)' },
  { id: 'body-top', label: 'Body Top', x: 20, y: 16, width: 8, height: 4, color: 'rgba(0, 128, 128, 0.3)' },
  { id: 'body-bottom', label: 'Body Bottom', x: 28, y: 16, width: 8, height: 4, color: 'rgba(0, 128, 128, 0.3)' },
  
  // Left Arm sections
  { id: 'left-arm-right', label: 'Left Arm Right', x: 32, y: 52, width: 4, height: 12, color: 'rgba(0, 128, 0, 0.3)' },
  { id: 'left-arm-front', label: 'Left Arm Front', x: 36, y: 52, width: 4, height: 12, color: 'rgba(0, 128, 0, 0.3)' },
  { id: 'left-arm-left', label: 'Left Arm Left', x: 40, y: 52, width: 4, height: 12, color: 'rgba(0, 128, 0, 0.3)' },
  { id: 'left-arm-back', label: 'Left Arm Back', x: 44, y: 52, width: 4, height: 12, color: 'rgba(0, 128, 0, 0.3)' },
  { id: 'left-arm-top', label: 'Left Shoulder', x: 36, y: 48, width: 4, height: 4, color: 'rgba(0, 128, 0, 0.3)' },
  { id: 'left-arm-bottom', label: 'Left Hand', x: 40, y: 48, width: 4, height: 4, color: 'rgba(0, 128, 0, 0.3)' },
  
  // Right Arm sections
  { id: 'right-arm-right', label: 'Right Arm Right', x: 40, y: 20, width: 4, height: 12, color: 'rgba(0, 128, 0, 0.3)' },
  { id: 'right-arm-front', label: 'Right Arm Front', x: 44, y: 20, width: 4, height: 12, color: 'rgba(0, 128, 0, 0.3)' },
  { id: 'right-arm-left', label: 'Right Arm Left', x: 48, y: 20, width: 4, height: 12, color: 'rgba(0, 128, 0, 0.3)' },
  { id: 'right-arm-back', label: 'Right Arm Back', x: 52, y: 20, width: 4, height: 12, color: 'rgba(0, 128, 0, 0.3)' },
  { id: 'right-arm-top', label: 'Right Shoulder', x: 44, y: 16, width: 4, height: 4, color: 'rgba(0, 128, 0, 0.3)' },
  { id: 'right-arm-bottom', label: 'Right Hand', x: 48, y: 16, width: 4, height: 4, color: 'rgba(0, 128, 0, 0.3)' },
  
  // Left Leg sections
  { id: 'left-leg-right', label: 'Left Leg Right', x: 16, y: 52, width: 4, height: 12, color: 'rgba(128, 0, 128, 0.3)' },
  { id: 'left-leg-front', label: 'Left Leg Front', x: 20, y: 52, width: 4, height: 12, color: 'rgba(128, 0, 128, 0.3)' },
  { id: 'left-leg-left', label: 'Left Leg Left', x: 24, y: 52, width: 4, height: 12, color: 'rgba(128, 0, 128, 0.3)' },
  { id: 'left-leg-back', label: 'Left Leg Back', x: 28, y: 52, width: 4, height: 12, color: 'rgba(128, 0, 128, 0.3)' },
  { id: 'left-leg-top', label: 'Left Leg Top', x: 20, y: 48, width: 4, height: 4, color: 'rgba(128, 0, 128, 0.3)' },
  { id: 'left-leg-bottom', label: 'Left Foot', x: 24, y: 48, width: 4, height: 4, color: 'rgba(128, 0, 128, 0.3)' },
  
  // Right Leg sections
  { id: 'right-leg-right', label: 'Right Leg Right', x: 0, y: 20, width: 4, height: 12, color: 'rgba(128, 0, 128, 0.3)' },
  { id: 'right-leg-front', label: 'Right Leg Front', x: 4, y: 20, width: 4, height: 12, color: 'rgba(128, 0, 128, 0.3)' },
  { id: 'right-leg-left', label: 'Right Leg Left', x: 8, y: 20, width: 4, height: 12, color: 'rgba(128, 0, 128, 0.3)' },
  { id: 'right-leg-back', label: 'Right Leg Back', x: 12, y: 20, width: 4, height: 12, color: 'rgba(128, 0, 128, 0.3)' },
  { id: 'right-leg-top', label: 'Right Leg Top', x: 4, y: 16, width: 4, height: 4, color: 'rgba(128, 0, 128, 0.3)' },
  { id: 'right-leg-bottom', label: 'Right Foot', x: 8, y: 16, width: 4, height: 4, color: 'rgba(128, 0, 128, 0.3)' },
];

const UVMapOverlay: React.FC<UVMapOverlayProps> = ({ isVisible, pixelSize, onSectionHover }) => {
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);
  const [audioCache, setAudioCache] = useState<Map<string, HTMLAudioElement>>(new Map());
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize voice service and preload phrases
  useEffect(() => {
    if (!isVisible) return;

    // Initialize voice service
    voiceService.initialize().then(() => {
      // Preload all section labels for smooth playback
      const labels = UV_SECTIONS.map(section => section.label);
      voiceService.preloadPhrases(labels);
    });

    return () => {
      // Don't clear cache on unmount to keep preloaded audio
    };
  }, [isVisible]);

  const handleSectionHover = async (section: UVSection | null) => {
    if (!section) {
      setHoveredSection(null);
      if (onSectionHover) onSectionHover(null);
      return;
    }

    setHoveredSection(section.id);
    if (onSectionHover) onSectionHover(section.label);

    // Play audio using voice service
    try {
      await voiceService.speak(section.label, {
        rate: 0.9,
        pitch: 1.0,
        volume: 0.8
      });
    } catch (error) {
      console.warn('Failed to play audio for section:', section.label, error);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="uv-map-overlay">
      {UV_SECTIONS.map(section => (
        <div
          key={section.id}
          className={`uv-section ${hoveredSection === section.id ? 'hovered' : ''}`}
          style={{
            left: section.x * pixelSize,
            top: section.y * pixelSize,
            width: section.width * pixelSize,
            height: section.height * pixelSize,
            backgroundColor: section.color,
          }}
          onMouseEnter={() => handleSectionHover(section)}
          onMouseLeave={() => handleSectionHover(null)}
        >
          <span className="uv-label">{section.label}</span>
        </div>
      ))}
    </div>
  );
};

export default UVMapOverlay;