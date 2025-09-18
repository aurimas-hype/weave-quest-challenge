export interface Puzzle {
  id: string;
  level: number;
  title: string;
  type: 'decode' | 'riddle' | 'statement' | 'multiple-choice' | 'encrypted' | 'multi-step' | 'scramble';
  description: string;
  question?: string;
  encodedText?: string;
  expectedAnswer: string;
  options?: string[];
  steps?: string[];
  hints?: string[];
  points: number;
}

export interface GameState {
  currentLevel: number;
  currentPuzzle: number;
  completedPuzzles: string[];
  score: number;
  wallet?: string;
  playerName?: string;
  startTime: number;
}

export interface LeaderboardEntry {
  playerName: string;
  wallet: string;
  score: number;
  completedLevels: number;
  completionTime: number;
  timestamp: number;
}