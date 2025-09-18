import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Wallet, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface WalletFormProps {
  onSubmit: (playerName: string, wallet: string) => void;
  currentScore: number;
}

const WalletForm = ({ onSubmit, currentScore }: WalletFormProps) => {
  const [playerName, setPlayerName] = useState('');
  const [wallet, setWallet] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!playerName.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter your player name.",
        variant: "destructive",
      });
      return;
    }

    if (!wallet.trim()) {
      toast({
        title: "Wallet Required",
        description: "Please enter your wallet address.",
        variant: "destructive",
      });
      return;
    }

    // Basic wallet address validation (simplified)
    if (wallet.length < 26 || wallet.length > 62) {
      toast({
        title: "Invalid Wallet",
        description: "Please enter a valid wallet address.",
        variant: "destructive",
      });
      return;
    }

    onSubmit(playerName, wallet);
    
    toast({
      title: "Success! 🎉",
      description: "Your score has been submitted to the leaderboard!",
      variant: "default",
    });
  };

  return (
    <Card className="border-primary glow-cyan max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mb-4">
          <Wallet className="w-6 h-6 text-white" />
        </div>
        <CardTitle className="text-gradient">Submit Your Score</CardTitle>
        <CardDescription>
          Congratulations! You've earned {currentScore} points. Submit your details to join the leaderboard.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="playerName" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Player Name
            </Label>
            <Input
              id="playerName"
              placeholder="Enter your name..."
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="border-primary/50 focus:border-primary"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="wallet" className="flex items-center gap-2">
              <Wallet className="w-4 h-4" />
              Wallet Address
            </Label>
            <Input
              id="wallet"
              placeholder="0x... or bc1... or similar"
              value={wallet}
              onChange={(e) => setWallet(e.target.value)}
              className="border-primary/50 focus:border-primary font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
              Enter any crypto wallet address (BTC, ETH, etc.)
            </p>
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-gradient-primary hover:opacity-90 glow-cyan"
          >
            Submit to Leaderboard
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default WalletForm;