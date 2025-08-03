/**
 * AI Integration Hook
 * React hook for AI-powered skin creation assistance
 */

import { useState, useCallback } from 'react';
import { aiService, SkinSuggestion, ColorPalette } from '../services/aiService';

interface UseAIState {
  suggestions: SkinSuggestion[];
  colorPalette: ColorPalette | null;
  isLoading: boolean;
  error: string | null;
  responseTime: number | null;
}

export function useAI() {
  const [state, setState] = useState<UseAIState>({
    suggestions: [],
    colorPalette: null,
    isLoading: false,
    error: null,
    responseTime: null
  });

  const generateSuggestions = useCallback(async (prompt: string) => {
    if (!prompt.trim()) {
      setState(prev => ({ ...prev, error: 'Please enter a description' }));
      return;
    }

    setState(prev => ({ 
      ...prev, 
      isLoading: true, 
      error: null,
      responseTime: null 
    }));

    const startTime = performance.now();

    try {
      const suggestions = await aiService.generateSkinSuggestions(prompt, 3);
      const responseTime = performance.now() - startTime;

      setState(prev => ({
        ...prev,
        suggestions,
        isLoading: false,
        responseTime
      }));

      // Log performance for OQE monitoring
      console.log(`🎯 AI Response: ${responseTime.toFixed(0)}ms (Target: <3000ms)`);
      
      if (responseTime > 3000) {
        console.warn('⚠️ S3 Objective violation: AI response time exceeded 3s');
      }

    } catch (error) {
      const responseTime = performance.now() - startTime;
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to generate suggestions',
        responseTime
      }));
    }
  }, []);

  const generateColorPalette = useCallback(async (theme: string, style: string = 'vibrant') => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const palette = await aiService.generateColorPalette(theme, style);
      setState(prev => ({
        ...prev,
        colorPalette: palette,
        isLoading: false
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to generate palette'
      }));
    }
  }, []);

  const clearSuggestions = useCallback(() => {
    setState(prev => ({
      ...prev,
      suggestions: [],
      error: null
    }));
  }, []);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    ...state,
    generateSuggestions,
    generateColorPalette,
    clearSuggestions,
    clearError,
    // Performance monitoring for OQE
    isPerforming: state.responseTime ? state.responseTime < 3000 : null
  };
}