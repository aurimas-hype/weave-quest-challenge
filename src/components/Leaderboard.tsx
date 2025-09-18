import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Medal, Award, Clock, Zap } from 'lucide-react';
import { LeaderboardEntry } from '@/types/game';

interface LeaderboardProps {
  entries: LeaderboardEntry[];
}

const Leaderboard = ({ entries }: LeaderboardProps) => {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Trophy className="w-5 h-5 text-yellow-400" />;
      case 2: return <Medal className="w-5 h-5 text-gray-400" />;
      case 3: return <Award className="w-5 h-5 text-amber-600" />;
      default: return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-muted-foreground">#{rank}</span>;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return 'border-yellow-400 glow-yellow bg-yellow-400/5';
      case 2: return 'border-gray-400 glow-gray bg-gray-400/5';
      case 3: return 'border-amber-600 glow-amber bg-amber-600/5';
      default: return 'border-border';
    }
  };

  const formatTime = (milliseconds: number) => {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  };

  const truncateWallet = (wallet: string) => {
    if (wallet.length <= 12) return wallet;
    return `${wallet.slice(0, 6)}...${wallet.slice(-6)}`;
  };

  if (entries.length === 0) {
    return (
      <Card className="border-muted">
        <CardHeader className="text-center">
          <Trophy className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <CardTitle className="text-muted-foreground">Leaderboard</CardTitle>
          <CardDescription>
            No entries yet. Be the first to complete puzzles and submit your score!
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="border-primary/50 glow-cyan">
      <CardHeader className="text-center">
        <div className="mx-auto w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mb-4">
          <Trophy className="w-6 h-6 text-white" />
        </div>
        <CardTitle className="text-gradient">Leaderboard</CardTitle>
        <CardDescription>
          Top performers in the dCipher challenge
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {entries.map((entry, index) => {
          const rank = index + 1;
          return (
            <div
              key={`${entry.wallet}-${entry.timestamp}`}
              className={`p-4 rounded-lg border transition-all ${getRankColor(rank)}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getRankIcon(rank)}
                  <div>
                    <h3 className="font-semibold">{entry.playerName}</h3>
                    <p className="text-xs text-muted-foreground font-mono">
                      {truncateWallet(entry.wallet)}
                    </p>
                  </div>
                </div>
                
                <div className="text-right space-y-1">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-primary" />
                    <span className="font-bold text-lg">{entry.score}</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Award className="w-3 h-3" />
                      <span>L{entry.completedLevels}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{formatTime(entry.completionTime)}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {rank <= 3 && (
                <div className="mt-2 pt-2 border-t border-border/50">
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${
                      rank === 1 ? 'border-yellow-400 text-yellow-400' :
                      rank === 2 ? 'border-gray-400 text-gray-400' :
                      'border-amber-600 text-amber-600'
                    }`}
                  >
                    {rank === 1 ? '🥇 Champion' : rank === 2 ? '🥈 Runner-up' : '🥉 Third Place'}
                  </Badge>
                </div>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default Leaderboard;