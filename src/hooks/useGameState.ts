import { useState, useEffect } from 'react';
import { GameState, LeaderboardEntry } from '@/types/game';
import { puzzles } from '@/data/puzzles';

const STORAGE_KEY = 'dcipher-game-state';
const LEADERBOARD_KEY = 'dcipher-leaderboard';

export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
    return {
      currentLevel: 1,
      currentPuzzle: 0,
      completedPuzzles: [],
      score: 0,
      startTime: Date.now(),
    };
  });

  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(() => {
    const saved = localStorage.getItem(LEADERBOARD_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
  }, [gameState]);

  useEffect(() => {
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(leaderboard));
  }, [leaderboard]);

  const getCurrentPuzzle = () => {
    return puzzles.find(p => p.level === gameState.currentLevel && 
      puzzles.findIndex(puzzle => puzzle.id === p.id) === gameState.currentPuzzle);
  };

  const completePuzzle = (puzzleId: string, points: number) => {
    if (gameState.completedPuzzles.includes(puzzleId)) return;

    setGameState(prev => ({
      ...prev,
      completedPuzzles: [...prev.completedPuzzles, puzzleId],
      score: prev.score + points,
      currentPuzzle: prev.currentPuzzle + 1,
    }));

    // Check if level is complete
    const currentLevelPuzzles = puzzles.filter(p => p.level === gameState.currentLevel);
    const completedInLevel = gameState.completedPuzzles.filter(id => 
      currentLevelPuzzles.some(p => p.id === id)
    ).length + 1; // +1 for the puzzle we just completed

    if (completedInLevel >= currentLevelPuzzles.length) {
      // Level complete, advance to next level
      setTimeout(() => {
        setGameState(prev => ({
          ...prev,
          currentLevel: prev.currentLevel + 1,
          currentPuzzle: 0,
        }));
      }, 1000);
    }
  };

  const submitToLeaderboard = (playerName: string, wallet: string) => {
    const entry: LeaderboardEntry = {
      playerName,
      wallet,
      score: gameState.score,
      completedLevels: gameState.currentLevel - 1,
      completionTime: Date.now() - gameState.startTime,
      timestamp: Date.now(),
    };

    setLeaderboard(prev => {
      const updated = [...prev, entry].sort((a, b) => b.score - a.score);
      return updated.slice(0, 10); // Keep top 10
    });

    setGameState(prev => ({
      ...prev,
      playerName,
      wallet,
    }));
  };

  const resetGame = () => {
    setGameState({
      currentLevel: 1,
      currentPuzzle: 0,
      completedPuzzles: [],
      score: 0,
      startTime: Date.now(),
    });
  };

  const isPuzzleCompleted = (puzzleId: string) => {
    return gameState.completedPuzzles.includes(puzzleId);
  };

  const getTotalPuzzlesInLevel = (level: number) => {
    return puzzles.filter(p => p.level === level).length;
  };

  const getCompletedPuzzlesInLevel = (level: number) => {
    const levelPuzzles = puzzles.filter(p => p.level === level);
    return gameState.completedPuzzles.filter(id => 
      levelPuzzles.some(p => p.id === id)
    ).length;
  };

  return {
    gameState,
    leaderboard,
    getCurrentPuzzle,
    completePuzzle,
    submitToLeaderboard,
    resetGame,
    isPuzzleCompleted,
    getTotalPuzzlesInLevel,
    getCompletedPuzzlesInLevel,
  };
};