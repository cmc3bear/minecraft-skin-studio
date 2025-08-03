/**
 * Focus Trap Hook
 * Manages keyboard navigation and focus within modal components
 * Accessibility requirement from Professor UX
 */

import { useEffect, useRef } from 'react';

export function useFocusTrap(isActive: boolean) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!isActive || !containerRef.current) return;
    
    const container = containerRef.current;
    const focusableElements = container.querySelectorAll(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    
    const firstFocusable = focusableElements[0] as HTMLElement;
    const lastFocusable = focusableElements[focusableElements.length - 1] as HTMLElement;
    
    // Focus first element when trap activates
    firstFocusable?.focus();
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      
      // If shift+tab on first element, focus last
      if (e.shiftKey && document.activeElement === firstFocusable) {
        e.preventDefault();
        lastFocusable?.focus();
      }
      // If tab on last element, focus first
      else if (!e.shiftKey && document.activeElement === lastFocusable) {
        e.preventDefault();
        firstFocusable?.focus();
      }
    };
    
    // Handle escape key
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        // Trigger close if provided
        const closeButton = container.querySelector('[aria-label*="close" i], [aria-label*="cancel" i]') as HTMLElement;
        closeButton?.click();
      }
    };
    
    container.addEventListener('keydown', handleKeyDown);
    container.addEventListener('keydown', handleEscape);
    
    return () => {
      container.removeEventListener('keydown', handleKeyDown);
      container.removeEventListener('keydown', handleEscape);
    };
  }, [isActive]);
  
  return containerRef;
}