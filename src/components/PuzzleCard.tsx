import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Puzzle } from '@/types/game';
import { checkAnswer, decodeBase64, decodeROT13, unscrambleHint } from '@/utils/cryptoUtils';
import { Brain, Lock, Zap, Shield, Target } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PuzzleCardProps {
  puzzle: Puzzle;
  onComplete: (puzzleId: string, points: number) => void;
  isCompleted: boolean;
}

const PuzzleCard = ({ puzzle, onComplete, isCompleted }: PuzzleCardProps) => {
  const [userAnswer, setUserAnswer] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');
  const { toast } = useToast();

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

  const getLevelColor = (level: number) => {
    switch (level) {
      case 1: return 'bg-success';
      case 2: return 'bg-warning';
      case 3: return 'bg-primary';
      case 4: return 'bg-accent';
      case 5: return 'bg-destructive';
      default: return 'bg-primary';
    }
  };

  const handleSubmit = () => {
    const answer = puzzle.type === 'multiple-choice' ? selectedOption : userAnswer;
    
    if (!answer.trim()) {
      toast({
        title: "Empty Answer",
        description: "Please provide an answer before submitting.",
        variant: "destructive",
      });
      return;
    }

    if (checkAnswer(answer, puzzle.expectedAnswer)) {
      toast({
        title: "Correct! 🎉",
        description: `You earned ${puzzle.points} points!`,
        variant: "default",
      });
      onComplete(puzzle.id, puzzle.points);
    } else {
      toast({
        title: "Incorrect",
        description: "Try again! Use hints if you need help.",
        variant: "destructive",
      });
    }
  };

  const renderPuzzleContent = () => {
    switch (puzzle.type) {
      case 'decode':
        return (
          <div className="space-y-4">
            {puzzle.encodedText && (
              <div className="p-4 bg-secondary rounded-md font-mono text-sm border glow-cyan">
                {puzzle.encodedText}
              </div>
            )}
            {puzzle.question && (
              <p className="text-muted-foreground">{puzzle.question}</p>
            )}
            <Input
              placeholder="Enter your decoded answer..."
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              className="border-primary/50 focus:border-primary"
            />
          </div>
        );

      case 'riddle':
        return (
          <div className="space-y-4">
            <div className="p-4 bg-accent/10 rounded-md border border-accent/30">
              <p className="text-accent-foreground font-medium">{puzzle.question}</p>
            </div>
            <Input
              placeholder="Enter your answer..."
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              className="border-primary/50 focus:border-primary"
            />
          </div>
        );

      case 'statement':
        return (
          <div className="space-y-4">
            <p className="text-muted-foreground">{puzzle.question}</p>
            <Textarea
              placeholder="Enter the exact statement..."
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              className="border-primary/50 focus:border-primary min-h-[100px]"
            />
          </div>
        );

      case 'multiple-choice':
        return (
          <div className="space-y-4">
            <p className="text-muted-foreground">{puzzle.question}</p>
            <div className="grid gap-2">
              {puzzle.options?.map((option, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedOption(option)}
                  className={`p-3 text-left rounded-md border transition-all ${
                    selectedOption === option
                      ? 'border-primary bg-primary/10 glow-cyan'
                      : 'border-border bg-card hover:border-primary/50'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        );

      case 'encrypted':
        return (
          <div className="space-y-4">
            {puzzle.encodedText && (
              <div className="p-4 bg-destructive/10 rounded-md font-mono text-sm border border-destructive/30">
                {puzzle.encodedText}
              </div>
            )}
            <Input
              placeholder="Enter your decrypted answer..."
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              className="border-primary/50 focus:border-primary"
            />
          </div>
        );

      case 'multi-step':
        return (
          <div className="space-y-4">
            {puzzle.encodedText && (
              <div className="p-4 bg-secondary rounded-md font-mono text-sm border glow-purple">
                {puzzle.encodedText}
              </div>
            )}
            {puzzle.steps && (
              <div className="p-4 bg-warning/10 rounded-md border border-warning/30">
                <p className="font-medium text-warning-foreground mb-2">Steps:</p>
                <ol className="list-decimal list-inside text-sm space-y-1">
                  {puzzle.steps.map((step, index) => (
                    <li key={index} className="text-muted-foreground">{step}</li>
                  ))}
                </ol>
              </div>
            )}
            <Input
              placeholder="Enter your final answer..."
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              className="border-primary/50 focus:border-primary"
            />
          </div>
        );

      case 'scramble':
        return (
          <div className="space-y-4">
            {puzzle.encodedText && (
              <div className="p-4 bg-success/10 rounded-md border border-success/30">
                <p className="font-mono text-success-foreground">{puzzle.encodedText}</p>
              </div>
            )}
            {showHint && puzzle.encodedText && (
              <div className="p-3 bg-muted rounded-md text-sm">
                <p className="font-medium mb-1">Hint:</p>
                <p className="font-mono">{unscrambleHint(puzzle.encodedText).join(' ')}</p>
              </div>
            )}
            <Input
              placeholder="Enter the unscrambled phrase..."
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              className="border-primary/50 focus:border-primary"
            />
          </div>
        );

      default:
        return null;
    }
  };

  if (isCompleted) {
    return (
      <Card className="border-success glow-green animate-pulse-glow">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge className={`${getLevelColor(puzzle.level)} text-white`}>
                {getLevelIcon(puzzle.level)}
                Level {puzzle.level}
              </Badge>
              <Badge variant="outline" className="border-success text-success">
                ✓ Completed
              </Badge>
            </div>
            <Badge variant="secondary">+{puzzle.points} pts</Badge>
          </div>
          <CardTitle className="text-gradient">{puzzle.title}</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="border-primary/50 glow-cyan animate-float">
      <CardHeader>
        <div className="flex items-center justify-between">
          <Badge className={`${getLevelColor(puzzle.level)} text-white`}>
            {getLevelIcon(puzzle.level)}
            Level {puzzle.level}
          </Badge>
          <Badge variant="secondary">{puzzle.points} pts</Badge>
        </div>
        <CardTitle className="text-gradient">{puzzle.title}</CardTitle>
        <CardDescription>{puzzle.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {renderPuzzleContent()}
        
        <div className="flex gap-2">
          <Button 
            onClick={handleSubmit}
            className="flex-1 bg-gradient-primary hover:opacity-90"
            disabled={puzzle.type === 'multiple-choice' ? !selectedOption : !userAnswer.trim()}
          >
            Submit Answer
          </Button>
          {puzzle.hints && (
            <Button
              variant="outline"
              onClick={() => setShowHint(!showHint)}
              className="border-accent text-accent hover:bg-accent/10"
            >
              {showHint ? 'Hide' : 'Show'} Hint
            </Button>
          )}
        </div>

        {showHint && puzzle.hints && (
          <div className="p-4 bg-accent/10 rounded-md border border-accent/30">
            <p className="font-medium text-accent-foreground mb-2">Hints:</p>
            <ul className="text-sm space-y-1">
              {puzzle.hints.map((hint, index) => (
                <li key={index} className="text-muted-foreground">• {hint}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PuzzleCard;