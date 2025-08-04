/**
 * 🟣 SACRED INTERACTION TRACKING HOOKS 🟣
 * 
 * React hooks for integrating the interaction tracking system
 * with existing components following the Five Sacred Edicts
 */

import { useEffect, useCallback, useRef } from 'react';
import { interactionTracker, InteractionEvent, ErrorType } from '../services/interactionTracker';

/**
 * Hook for tracking canvas interactions with appropriate dignity
 */
export function useCanvasTracking(canvasRef: React.RefObject<HTMLCanvasElement>) {
  const lastDrawTime = useRef<number>(0);
  const interactionStartTime = useRef<number>(0);

  const trackCanvasInteraction = useCallback((action: string, details: any) => {
    const responseTime = performance.now() - interactionStartTime.current;
    
    interactionTracker.trackCanvasInteraction(action, {
      ...details,
      duration: responseTime,
      targetElement: 'canvas'
    });
  }, []);

  const trackDrawStart = useCallback((tool: string, coordinates: { x: number; y: number }) => {
    interactionStartTime.current = performance.now();
    trackCanvasInteraction('draw_start', {
      toolUsed: tool,
      coordinates
    });
  }, [trackCanvasInteraction]);

  const trackDrawEnd = useCallback((pixelsModified: number) => {
    const drawDuration = performance.now() - interactionStartTime.current;
    trackCanvasInteraction('draw_end', {
      duration: drawDuration,
      pixelsModified,
      metadata: { fps: 60 } // Would get actual FPS from canvas
    });
  }, [trackCanvasInteraction]);

  const trackPerformanceIssue = useCallback((fps: number) => {
    if (fps < 30) { // Performance threshold
      interactionTracker.trackPerformanceIssue('canvasResponseTime', 1000/fps, 16.67); // 60fps target
    }
  }, []);

  return {
    trackDrawStart,
    trackDrawEnd,
    trackCanvasInteraction,
    trackPerformanceIssue
  };
}

/**
 * Hook for tracking AI Assistant interactions with empathy
 */
export function useAITracking() {
  const requestStartTime = useRef<number>(0);

  const trackAIRequest = useCallback((prompt: string) => {
    requestStartTime.current = performance.now();
    
    interactionTracker.trackInteraction({
      type: 'ai_request',
      component: 'AIAssistant',
      action: 'request_started',
      details: {
        aiPrompt: prompt,
        metadata: { promptLength: prompt.length }
      },
      outcome: { success: true }
    });
  }, []);

  const trackAIResponse = useCallback((success: boolean, errorMessage?: string) => {
    const responseTime = performance.now() - requestStartTime.current;
    
    interactionTracker.trackAIInteraction('', {
      success,
      responseTime,
      errorMessage,
      improvementSuggestion: success ? undefined : 'Implement retry logic and better error handling'
    });

    // Track performance issue if response is too slow
    if (responseTime > 3000) {
      interactionTracker.trackPerformanceIssue('aiResponseTime', responseTime, 3000);
    }
  }, []);

  const trackAISuggestionApplied = useCallback((suggestionId: string, success: boolean) => {
    interactionTracker.trackInteraction({
      type: 'ai_request',
      component: 'AIAssistant',
      action: 'suggestion_applied',
      details: {
        metadata: { suggestionId }
      },
      outcome: {
        success,
        userFeedback: success ? 'positive' : 'negative'
      }
    });
  }, []);

  return {
    trackAIRequest,
    trackAIResponse,
    trackAISuggestionApplied
  };
}

/**
 * Hook for tracking tool selection and usage patterns
 */
export function useToolTracking() {
  const toolStartTime = useRef<number>(0);
  const currentTool = useRef<string>('');

  const trackToolSelection = useCallback((toolId: string, toolName: string) => {
    const previousTool = currentTool.current;
    const toolUsageDuration = previousTool ? performance.now() - toolStartTime.current : 0;
    
    // Track usage of previous tool if any
    if (previousTool && toolUsageDuration > 0) {
      interactionTracker.trackInteraction({
        type: 'tool_selection',
        component: 'ToolBar',
        action: 'tool_used',
        details: {
          toolUsed: previousTool,
          duration: toolUsageDuration
        },
        outcome: { success: true }
      });
    }

    // Track new tool selection
    interactionTracker.trackInteraction({
      type: 'tool_selection',
      component: 'ToolBar',
      action: 'tool_selected',
      details: {
        toolUsed: toolId,
        metadata: { toolName }
      },
      outcome: { success: true }
    });

    currentTool.current = toolId;
    toolStartTime.current = performance.now();
  }, []);

  const trackColorSelection = useCallback((color: string, source: 'palette' | 'picker' | 'ai') => {
    interactionTracker.trackInteraction({
      type: 'color_selection',
      component: 'ColorPalette',
      action: 'color_selected',
      details: {
        colorSelected: color,
        metadata: { source }
      },
      outcome: { success: true }
    });
  }, []);

  return {
    trackToolSelection,
    trackColorSelection
  };
}

/**
 * Hook for tracking navigation and page interactions
 */
export function useNavigationTracking() {
  const pageStartTime = useRef<number>(Date.now());

  const trackPageVisit = useCallback((pageName: string) => {
    interactionTracker.trackInteraction({
      type: 'navigation',
      component: 'Router',
      action: 'page_visited',
      details: {
        targetElement: pageName,
        metadata: { timestamp: Date.now() }
      },
      outcome: { success: true }
    });
    pageStartTime.current = Date.now();
  }, []);

  const trackPageExit = useCallback((pageName: string) => {
    const sessionDuration = Date.now() - pageStartTime.current;
    
    interactionTracker.trackInteraction({
      type: 'navigation',
      component: 'Router',
      action: 'page_exited',
      details: {
        targetElement: pageName,
        duration: sessionDuration
      },
      outcome: { success: true }
    });
  }, []);

  const trackButtonClick = useCallback((buttonName: string, component: string) => {
    interactionTracker.trackInteraction({
      type: 'navigation',
      component,
      action: 'button_clicked',
      details: {
        targetElement: buttonName
      },
      outcome: { success: true }
    });
  }, []);

  return {
    trackPageVisit,
    trackPageExit,
    trackButtonClick
  };
}

/**
 * Hook for tracking export and save operations with dignity
 */
export function useExportTracking() {
  const exportStartTime = useRef<number>(0);

  const trackExportStart = useCallback((exportType: 'save' | 'export' | 'minecraft') => {
    exportStartTime.current = performance.now();
    
    interactionTracker.trackInteraction({
      type: 'export_action',
      component: 'EditorPage',
      action: 'export_started',
      details: {
        metadata: { exportType }
      },
      outcome: { success: true }
    });
  }, []);

  const trackExportComplete = useCallback((exportType: 'save' | 'export' | 'minecraft', success: boolean, errorMessage?: string) => {
    const exportDuration = performance.now() - exportStartTime.current;
    
    interactionTracker.trackInteraction({
      type: 'export_action',
      component: 'EditorPage',
      action: 'export_completed',
      details: {
        duration: exportDuration,
        metadata: { exportType }
      },
      outcome: {
        success,
        responseTime: exportDuration,
        errorMessage,
        userFeedback: success ? 'positive' : 'negative'
      }
    });

    // Track performance issue if export is too slow
    if (exportDuration > 5000) {
      interactionTracker.trackPerformanceIssue('exportTime', exportDuration, 5000);
    }
  }, []);

  return {
    trackExportStart,
    trackExportComplete
  };
}

/**
 * Hook for tracking keyboard shortcuts and accessibility
 */
export function useKeyboardTracking() {
  const trackKeyboardShortcut = useCallback((shortcut: string, action: string, success: boolean) => {
    interactionTracker.trackInteraction({
      type: 'keyboard_shortcut',
      component: 'GlobalKeyboardHandler',
      action: 'shortcut_used',
      details: {
        keyPressed: shortcut,
        metadata: { intendedAction: action }
      },
      outcome: {
        success,
        userFeedback: success ? 'positive' : 'negative'
      }
    });
  }, []);

  const trackFocusManagement = useCallback((element: string, focusMethod: 'mouse' | 'keyboard' | 'programmatic') => {
    interactionTracker.trackInteraction({
      type: 'navigation',
      component: 'AccessibilityManager',
      action: 'focus_changed',
      details: {
        targetElement: element,
        metadata: { focusMethod }
      },
      outcome: { success: true }
    });
  }, []);

  return {
    trackKeyboardShortcut,
    trackFocusManagement
  };
}

/**
 * Hook for tracking errors with empathy (Sacred Edict #2)
 */
export function useErrorTracking() {
  const trackError = useCallback((
    errorType: ErrorType,
    originalError: string,
    component: string,
    userAction?: string
  ) => {
    interactionTracker.trackError(errorType, originalError, component);
    
    // Log for development debugging while maintaining user dignity
    console.group('🟣 Sacred Error Tracking');
    console.log('Component:', component);
    console.log('User Action:', userAction || 'Unknown');
    console.log('Error Type:', errorType);
    console.log('Original Error:', originalError);
    console.log('Dignity maintained: ✅');
    console.groupEnd();
  }, []);

  const trackErrorRecovery = useCallback((errorType: ErrorType, recoveryMethod: string, success: boolean) => {
    interactionTracker.trackInteraction({
      type: 'error_encounter',
      component: 'ErrorRecovery',
      action: 'recovery_attempted',
      details: {
        metadata: { errorType, recoveryMethod }
      },
      outcome: {
        success,
        userFeedback: success ? 'positive' : 'negative',
        improvementSuggestion: success ? 'Recovery successful' : 'Improve error recovery mechanisms'
      }
    });
  }, []);

  return {
    trackError,
    trackErrorRecovery
  };
}

/**
 * Master hook that sets up global tracking
 */
export function useGlobalTracking() {
  useEffect(() => {
    // Track session start
    interactionTracker.trackInteraction({
      type: 'navigation',
      component: 'Application',
      action: 'session_started',
      details: {
        metadata: {
          userAgent: navigator.userAgent,
          screenResolution: `${screen.width}x${screen.height}`,
          windowSize: `${window.innerWidth}x${window.innerHeight}`
        }
      },
      outcome: { success: true }
    });

    // Set up global error handler
    const handleGlobalError = (event: ErrorEvent) => {
      interactionTracker.trackError(
        'system_resource_error',
        event.message,
        'window',
      );
    };

    // Set up unhandled promise rejection handler
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      interactionTracker.trackError(
        'system_resource_error',
        event.reason?.toString() || 'Unhandled promise rejection',
        'promise'
      );
    };

    window.addEventListener('error', handleGlobalError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    // Track session end on beforeunload
    const handleBeforeUnload = () => {
      interactionTracker.trackInteraction({
        type: 'navigation',
        component: 'Application',
        action: 'session_ended',
        details: {
          duration: Date.now() - performance.timing.navigationStart
        },
        outcome: { success: true }
      });
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('error', handleGlobalError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  // Generate weekly report (for Cardinal review)
  const generateWeeklyReport = useCallback(() => {
    return interactionTracker.generateWeeklyReport();
  }, []);

  // Generate GitHub issues from tracked interactions
  const generateGitHubIssues = useCallback(() => {
    return interactionTracker.generateGitHubIssues();
  }, []);

  return {
    generateWeeklyReport,
    generateGitHubIssues
  };
}