import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  Trophy, 
  Zap, 
  Target, 
  Lock, 
  Shield, 
  RotateCcw, 
  Wallet,
  GamepadIcon,
  Crown,
  Play,
  ChevronRight,
  Unlock
} from 'lucide-react';
import { useGameState } from '@/hooks/useGameState';
import { puzzles } from '@/data/puzzles';
import PuzzleCard from './PuzzleCard';
import WalletForm from './WalletForm';
import Leaderboard from './Leaderboard';
import { useToast } from '@/hooks/use-toast';

const GameInterface = () => {
  const {
    gameState,
    leaderboard,
    getCurrentPuzzle,
    completePuzzle,
    submitToLeaderboard,
    resetGame,
    isPuzzleCompleted,
    getTotalPuzzlesInLevel,
    getCompletedPuzzlesInLevel,
  } = useGameState();

  const [showWalletForm, setShowWalletForm] = useState(false);
  const [activeTab, setActiveTab] = useState('game');
  const [selectedPuzzle, setSelectedPuzzle] = useState<string | null>(null);
  const { toast } = useToast();

  const currentPuzzle = getCurrentPuzzle();
  const maxLevel = Math.max(...puzzles.map(p => p.level));
  const allLevelsComplete = gameState.currentLevel > maxLevel;
  
  const totalPuzzles = puzzles.length;
  const completedPuzzles = gameState.completedPuzzles.length;
  const completedLevels = Math.max(0, gameState.currentLevel - 1);

  const handlePuzzleComplete = (puzzleId: string, points: number) => {
    completePuzzle(puzzleId, points);
    
    // Check if player has completed significant progress to show wallet form
    if (gameState.score + points >= 500 && !gameState.wallet) {
      setTimeout(() => {
        setShowWalletForm(true);
        setActiveTab('wallet');
      }, 2000);
    }
  };

  const handleWalletSubmit = (playerName: string, wallet: string) => {
    submitToLeaderboard(playerName, wallet);
    setShowWalletForm(false);
    setActiveTab('leaderboard');
  };

  const getLevelIcon = (level: number) => {
    switch (level) {
      case 1: return <Target className="w-4 h-4" />;
      case 2: return <Brain className="w-4 h-4" />;
      case 3: return <Lock className="w-4 h-4" />;
      case 4: return <Zap className="w-4 h-4" />;
      case 5: return <Shield className="w-4 h-4" />;
      default: return <Target className="w-4 h-4" />;
    }
  };

  const getLevelTitle = (level: number) => {
    switch (level) {
      case 1: return 'Foundations';
      case 2: return 'Conditions';
      case 3: return 'Advanced';
      case 4: return 'Extremely Hard';
      case 5: return 'Legendary';
      default: return `Level ${level}`;
    }
  };

  const getLevelDifficulty = (level: number) => {
    switch (level) {
      case 1: return 'Easy';
      case 2: return 'Medium';
      case 3: return 'Hard';
      case 4: return 'Extreme';
      case 5: return 'Legendary';
      default: return 'Unknown';
    }
  };

  const getPuzzleTypeColor = (type: string) => {
    switch (type) {
      case 'decode': return 'bg-primary';
      case 'riddle': return 'bg-accent';
      case 'statement': return 'bg-success';
      case 'multiple-choice': return 'bg-warning';
      case 'encrypted': return 'bg-destructive';
      case 'multi-step': return 'bg-neon-purple';
      case 'scramble': return 'bg-neon-green';
      default: return 'bg-muted';
    }
  };

  const isLevelUnlocked = (level: number) => {
    return level <= gameState.currentLevel;
  };

  const getPuzzlesForLevel = (level: number) => {
    return puzzles.filter(p => p.level === level);
  };

  const renderMainInterface = () => {
    if (selectedPuzzle) {
      const puzzle = puzzles.find(p => p.id === selectedPuzzle);
      if (!puzzle) return null;
      
      return (
        <div className="max-w-2xl mx-auto">
          <Button 
            variant="ghost" 
            onClick={() => setSelectedPuzzle(null)}
            className="mb-4 text-primary hover:text-primary/80"
          >
            ← Back to Overview
          </Button>
          <PuzzleCard
            puzzle={puzzle}
            onComplete={handlePuzzleComplete}
            isCompleted={isPuzzleCompleted(puzzle.id)}
          />
        </div>
      );
    }

    return (
      <div className="space-y-8">
        {/* Hero Stats */}
        <div className="text-center space-y-6">
          <div className="space-y-2">
            <div className="text-6xl font-bold text-gradient">
              <span className="text-neon-cyan">{'>'}</span> dcipher
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Master the art of cryptographic puzzles and unlock the secrets of decentralized trust
            </p>
          </div>
          
          {/* Progress Badges */}
          <div className="flex items-center justify-center gap-4">
            <Badge variant="outline" className="border-primary text-primary px-4 py-2">
              <Zap className="w-4 h-4 mr-2" />
              {completedPuzzles}/{totalPuzzles} Puzzles Solved
            </Badge>
            <Badge variant="outline" className="border-success text-success px-4 py-2">
              <Trophy className="w-4 h-4 mr-2" />
              {completedLevels}/5 Levels Completed
            </Badge>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
            <Card className="border-primary/30 bg-card/50">
              <CardContent className="pt-6 text-center">
                <div className="text-3xl font-bold text-primary">{gameState.currentLevel}</div>
                <div className="text-sm text-muted-foreground">Levels Unlocked</div>
              </CardContent>
            </Card>
            <Card className="border-success/30 bg-card/50">
              <CardContent className="pt-6 text-center">
                <div className="text-3xl font-bold text-success">{completedPuzzles}</div>
                <div className="text-sm text-muted-foreground">Puzzles Solved</div>
              </CardContent>
            </Card>
            <Card className="border-accent/30 bg-card/50">
              <CardContent className="pt-6 text-center">
                <div className="text-3xl font-bold text-accent">
                  {Math.round((completedPuzzles / totalPuzzles) * 100)}%
                </div>
                <div className="text-sm text-muted-foreground">Progress</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Challenge Levels */}
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gradient mb-2">Challenge Levels</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Progress through increasingly complex cryptographic puzzles. Each level builds upon the previous, testing your understanding of blockchain and cryptographic concepts.
            </p>
          </div>

          {/* Level Cards */}
          <div className="space-y-6">
            {[1, 2, 3, 4, 5].map(level => {
              const levelPuzzles = getPuzzlesForLevel(level);
              const completedInLevel = getCompletedPuzzlesInLevel(level);
              const totalInLevel = getTotalPuzzlesInLevel(level);
              const isUnlocked = isLevelUnlocked(level);
              
              return (
                <Card 
                  key={level} 
                  className={`${
                    isUnlocked ? 'border-primary glow-cyan' : 'border-muted opacity-60'
                  } transition-all`}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {isUnlocked ? (
                          <Unlock className="w-5 h-5 text-primary" />
                        ) : (
                          <Lock className="w-5 h-5 text-muted-foreground" />
                        )}
                        <div>
                          <CardTitle className={`text-xl ${isUnlocked ? 'text-primary' : 'text-muted-foreground'}`}>
                            Level {level}: {getLevelTitle(level)}
                          </CardTitle>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${
                                level === 1 ? 'border-success text-success' :
                                level === 2 ? 'border-warning text-warning' :
                                level === 3 ? 'border-primary text-primary' :
                                level === 4 ? 'border-accent text-accent' :
                                'border-destructive text-destructive'
                              }`}
                            >
                              {getLevelDifficulty(level)}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              {level === 1 ? 'Learn the basics of cryptographic concepts' :
                               level === 2 ? 'Master conditional logic and consensus mechanisms' :
                               level === 3 ? 'Tackle complex cryptographic puzzles' :
                               level === 4 ? 'Face extreme multi-layer challenges' :
                               'Achieve legendary mastery'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">Progress</div>
                        <div className="text-lg font-bold">
                          {completedInLevel}/{totalInLevel} completed
                        </div>
                      </div>
                    </div>
                    {isUnlocked && (
                      <Progress 
                        value={(completedInLevel / totalInLevel) * 100}
                        className="h-2"
                      />
                    )}
                  </CardHeader>
                  
                  {isUnlocked && (
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {levelPuzzles.map(puzzle => {
                          const isCompleted = isPuzzleCompleted(puzzle.id);
                          return (
                            <Card 
                              key={puzzle.id}
                              className={`border transition-all hover:border-primary/50 cursor-pointer ${
                                isCompleted ? 'border-success glow-green' : 'border-border'
                              }`}
                              onClick={() => setSelectedPuzzle(puzzle.id)}
                            >
                              <CardContent className="p-4">
                                <div className="space-y-3">
                                  <div className="flex items-center justify-between">
                                    <Badge 
                                      className={`${getPuzzleTypeColor(puzzle.type)} text-white text-xs`}
                                    >
                                      {puzzle.type}
                                    </Badge>
                                    {isCompleted && (
                                      <Badge variant="outline" className="border-success text-success text-xs">
                                        ✓
                                      </Badge>
                                    )}
                                  </div>
                                  <div>
                                    <h4 className="font-medium text-sm mb-1">{puzzle.title}</h4>
                                    <p className="text-xs text-muted-foreground line-clamp-2">
                                      {puzzle.description}
                                    </p>
                                  </div>
                                  <Button 
                                    size="sm" 
                                    className="w-full bg-gradient-primary hover:opacity-90"
                                  >
                                    <Play className="w-3 h-3 mr-1" />
                                    {isCompleted ? 'Review' : 'Start Puzzle'}
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          );
                        })}
                      </div>
                    </CardContent>
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderGameContent = () => {
    if (allLevelsComplete) {
      return (
        <div className="text-center space-y-6 py-12">
          <div className="mx-auto w-20 h-20 bg-gradient-success rounded-full flex items-center justify-center glow-green">
            <Crown className="w-10 h-10 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gradient mb-2">🎉 Congratulations! 🎉</h2>
            <p className="text-xl text-muted-foreground mb-4">
              You've completed all {maxLevel} levels!
            </p>
            <div className="flex items-center justify-center gap-4 text-lg">
              <Badge variant="outline" className="border-success text-success px-4 py-2">
                <Zap className="w-4 h-4 mr-2" />
                {gameState.score} Points
              </Badge>
              <Badge variant="outline" className="border-primary text-primary px-4 py-2">
                <Trophy className="w-4 h-4 mr-2" />
                dCipher Master
              </Badge>
            </div>
          </div>
          
          {!gameState.wallet && (
            <Button 
              onClick={() => {
                setShowWalletForm(true);
                setActiveTab('wallet');
              }}
              className="bg-gradient-primary hover:opacity-90 glow-cyan"
            >
              <Wallet className="w-4 h-4 mr-2" />
              Submit to Leaderboard
            </Button>
          )}
          
          <Button 
            variant="outline" 
            onClick={resetGame}
            className="border-accent text-accent hover:bg-accent/10"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Play Again
          </Button>
        </div>
      );
    }

    return renderMainInterface();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center glow-cyan">
                <GamepadIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gradient">dCipher Challenge</h1>
                <p className="text-sm text-muted-foreground">Decode • Solve • Conquer</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="border-primary text-primary">
                <Zap className="w-3 h-3 mr-1" />
                {gameState.score} pts
              </Badge>
              <Badge variant="outline" className="border-accent text-accent">
                <Trophy className="w-3 h-3 mr-1" />
                Level {gameState.currentLevel}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto">
            <TabsTrigger value="game" className="flex items-center gap-2">
              <GamepadIcon className="w-4 h-4" />
              Game
            </TabsTrigger>
            <TabsTrigger value="wallet" className="flex items-center gap-2">
              <Wallet className="w-4 h-4" />
              Submit
            </TabsTrigger>
            <TabsTrigger value="leaderboard" className="flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              Leaderboard
            </TabsTrigger>
          </TabsList>

          <TabsContent value="game" className="max-w-6xl mx-auto">
            {renderGameContent()}
          </TabsContent>

          <TabsContent value="wallet" className="max-w-2xl mx-auto">
            {showWalletForm || gameState.score > 0 ? (
              <WalletForm 
                onSubmit={handleWalletSubmit}
                currentScore={gameState.score}
              />
            ) : (
              <Card className="border-muted">
                <CardHeader className="text-center">
                  <Wallet className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <CardTitle className="text-muted-foreground">Start Playing</CardTitle>
                  <p className="text-muted-foreground">
                    Complete puzzles to earn points, then submit your score to the leaderboard!
                  </p>
                </CardHeader>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="leaderboard" className="max-w-2xl mx-auto">
            <Leaderboard entries={leaderboard} />
          </TabsContent>
        </Tabs>
      </div>

      {/* Background decoration */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-success/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      </div>
    </div>
  );
};

export default GameInterface;