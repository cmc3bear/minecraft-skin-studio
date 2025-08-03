/**
 * Master Plan Objectives Definition
 * The north star metrics that guide all development
 */

import { Objective, ObjectiveLevel } from './types';

export const MASTER_PLAN_OBJECTIVES: Objective[] = [
  // Level 1 - Critical Objectives (Non-negotiable)
  {
    id: 'S1',
    level: ObjectiveLevel.CRITICAL,
    name: 'Zero Safety Incidents',
    description: 'Absolute zero tolerance for child safety incidents',
    target: 0,
    currentValue: 0,
    unit: 'incidents',
    threshold: { max: 0 }
  },
  {
    id: 'S2',
    level: ObjectiveLevel.CRITICAL,
    name: '60+ FPS Performance',
    description: 'Maintain smooth creative experience',
    target: 60,
    currentValue: 61.2,
    unit: 'fps',
    threshold: { min: 60 }
  },
  {
    id: 'S3',
    level: ObjectiveLevel.CRITICAL,
    name: 'AI Response Time',
    description: 'Fast AI responses for engaged experience',
    target: 3,
    currentValue: 2.7,
    unit: 'seconds',
    threshold: { max: 3 }
  },

  // Level 2 - Core Objectives (Essential for operation)
  {
    id: 'C1',
    level: ObjectiveLevel.CORE,
    name: 'COPPA Compliance',
    description: 'Full compliance with child privacy laws',
    target: 100,
    currentValue: 100,
    unit: 'percent',
    threshold: { min: 100 }
  },
  {
    id: 'C2',
    level: ObjectiveLevel.CORE,
    name: 'WCAG AA Accessibility',
    description: 'Accessible to all children',
    target: 100,
    currentValue: 95,
    unit: 'score',
    threshold: { min: 90 }
  },
  {
    id: 'C3',
    level: ObjectiveLevel.CORE,
    name: 'Platform Availability',
    description: 'System uptime and reliability',
    target: 99.9,
    currentValue: 99.95,
    unit: 'percent',
    threshold: { min: 99.9 }
  },
  {
    id: 'C4',
    level: ObjectiveLevel.CORE,
    name: 'Security Breaches',
    description: 'Zero security vulnerabilities exploited',
    target: 0,
    currentValue: 0,
    unit: 'breaches',
    threshold: { max: 0 }
  },

  // Level 3 - Growth Objectives (Business success)
  {
    id: 'G1',
    level: ObjectiveLevel.GROWTH,
    name: 'Active Users',
    description: '1M children using the platform',
    target: 1000000,
    currentValue: 0,
    unit: 'users',
    threshold: { min: 100000 }
  },
  {
    id: 'G2',
    level: ObjectiveLevel.GROWTH,
    name: 'Parent Satisfaction',
    description: 'High parent approval and trust',
    target: 4.5,
    currentValue: 0,
    unit: 'rating',
    threshold: { min: 4.0 }
  },
  {
    id: 'G3',
    level: ObjectiveLevel.GROWTH,
    name: 'Daily Active Usage',
    description: 'Engaged daily creators',
    target: 50,
    currentValue: 0,
    unit: 'percent',
    threshold: { min: 30 }
  },
  {
    id: 'G4',
    level: ObjectiveLevel.GROWTH,
    name: 'Premium Conversion',
    description: 'Sustainable business model',
    target: 10,
    currentValue: 0,
    unit: 'percent',
    threshold: { min: 5 }
  }
];

// Helper functions for objective management
export function getObjectiveById(id: string): Objective | undefined {
  return MASTER_PLAN_OBJECTIVES.find(obj => obj.id === id);
}

export function getCriticalObjectives(): Objective[] {
  return MASTER_PLAN_OBJECTIVES.filter(obj => obj.level === ObjectiveLevel.CRITICAL);
}

export function isObjectiveHealthy(objective: Objective): boolean {
  const value = typeof objective.currentValue === 'number' ? objective.currentValue : parseFloat(objective.currentValue as string);
  
  if (objective.threshold?.min !== undefined && value < objective.threshold.min) {
    return false;
  }
  
  if (objective.threshold?.max !== undefined && value > objective.threshold.max) {
    return false;
  }
  
  return true;
}

export function getObjectiveHealth(objective: Objective): 'healthy' | 'warning' | 'critical' {
  const value = typeof objective.currentValue === 'number' ? objective.currentValue : parseFloat(objective.currentValue as string);
  const target = typeof objective.target === 'number' ? objective.target : parseFloat(objective.target as string);
  
  // For critical objectives, any violation is critical
  if (objective.level === ObjectiveLevel.CRITICAL && !isObjectiveHealthy(objective)) {
    return 'critical';
  }
  
  // Calculate deviation from target
  const deviation = Math.abs((value - target) / target);
  
  if (deviation < 0.05) return 'healthy';  // Within 5% of target
  if (deviation < 0.10) return 'warning';   // Within 10% of target
  return 'critical';                        // More than 10% deviation
}

export function calculateObjectiveImpact(
  objective: Objective,
  projectedValue: number | string
): number {
  const current = typeof objective.currentValue === 'number' 
    ? objective.currentValue 
    : parseFloat(objective.currentValue as string);
    
  const projected = typeof projectedValue === 'number' 
    ? projectedValue 
    : parseFloat(projectedValue as string);
    
  if (current === 0) return projected > 0 ? 100 : 0;
  
  return ((projected - current) / current) * 100;
}