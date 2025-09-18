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
  Crown
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
  const { toast } = useToast();

  const currentPuzzle = getCurrentPuzzle();
  const maxLevel = Math.max(...puzzles.map(p => p.level));
  const allLevelsComplete = gameState.currentLevel > maxLevel;

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

    if (!currentPuzzle) {
      return (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No more puzzles in this level. Advancing...</p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <PuzzleCard
          puzzle={currentPuzzle}
          onComplete={handlePuzzleComplete}
          isCompleted={isPuzzleCompleted(currentPuzzle.id)}
        />
        
        {/* Level Progress */}
        <Card className="border-muted">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {getLevelIcon(gameState.currentLevel)}
                <span className="font-medium">
                  Level {gameState.currentLevel}: {getLevelTitle(gameState.currentLevel)}
                </span>
              </div>
              <span className="text-sm text-muted-foreground">
                {getCompletedPuzzlesInLevel(gameState.currentLevel)} / {getTotalPuzzlesInLevel(gameState.currentLevel)}
              </span>
            </div>
            <Progress 
              value={(getCompletedPuzzlesInLevel(gameState.currentLevel) / getTotalPuzzlesInLevel(gameState.currentLevel)) * 100}
              className="h-2"
            />
          </CardContent>
        </Card>
      </div>
    );
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

          <TabsContent value="game" className="max-w-2xl mx-auto">
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