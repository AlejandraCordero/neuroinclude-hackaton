/**
 * NEUROINCLUDE - Types & Data Models
 * Hacktoberfest Hack Day La Paz × NeuroTech UMSA 2026
 */

export interface CPTResult {
  totalTrials: number;
  hits: number;
  misses: number;
  falseAlarms: number;
  meanLatencyMs: number;
  dPrime: number; // Signal Detection Theory sensitivity
  latencies: number[];
}

export interface CorsiResult {
  blockSpan: number;
  maxSequence: number;
  accuracyPercent: number;
  reactionTimeMs: number;
  trialsCompleted: number;
}

export interface TrailFlexResult {
  switchesCompleted: number;
  perseverationErrors: number;
  accuracyPercent: number;
  avgSwitchLatencyMs: number;
  trialsCompleted: number;
}

export interface SensoryProfileResult {
  visual: number; // 1 (bajo estímulo deseado) to 5 (alta búsqueda de estímulos)
  auditory: number;
  tactile: number;
  proprioceptive: number;
  comfortPreference: string;
}

export interface MatricesResult {
  solved: number;
  total: number;
  accuracyPercent: number;
  avgLatencyMs: number;
}

export interface EEGSimMetrics {
  dominantBand: 'Delta' | 'Theta' | 'Alpha' | 'Beta' | 'Gamma';
  alphaBetaRatio: number;
  engagementIndex: number;
  signalStabilityPercent: number;
  isSynthetic: boolean;
  channels: {
    delta: number;
    theta: number;
    alpha: number;
    beta: number;
    gamma: number;
  };
}

export interface AllTestResults {
  cpt?: CPTResult;
  corsi?: CorsiResult;
  trailFlex?: TrailFlexResult;
  sensory?: SensoryProfileResult;
  matrices?: MatricesResult;
  eegMetrics?: EEGSimMetrics;
}

export interface WellbeingGoal {
  id: string;
  title: string;
  category: 'Atención' | 'Sensorial' | 'Memoria' | 'Descanso' | 'Funciones Ejecutivas';
  rationale: string;
  tip: string;
  completed: boolean;
  custom?: boolean;
}

export interface CognitiveProfileSynthesis {
  executiveSummary: string;
  cognitiveStrengths: string[];
  supportAreas: string[];
  sensoryErgonomics: {
    visualRecommendation: string;
    acousticRecommendation: string;
    workspaceStrategy: string;
  };
  learningStyle: {
    primaryStyle: string;
    pedagogicalStrategies: string[];
  };
  wellbeingActionPlan: WellbeingGoal[];
  ethicalNotice: string;
  isAiGenerated?: boolean;
  modelUsed?: string;
}

export type ActiveTab = 
  | 'home' 
  | 'consent' 
  | 'battery' 
  | 'eeg' 
  | 'profile' 
  | 'goals' 
  | 'resources' 
  | 'deliverables';

export type BatteryTestType = 'cpt' | 'corsi' | 'trail' | 'sensory' | 'matrices';
