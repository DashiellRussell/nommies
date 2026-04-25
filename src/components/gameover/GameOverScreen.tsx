"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GameState, PlayerRoundData } from "@/types/game";
import { allScores } from "@/lib/gameLogic";
import { ScoreTable } from "@/components/scoreboard/ScoreTable";
import { EditRoundDialog } from "@/components/scoreboard/EditRoundDialog";
import { Pencil } from "lucide-react";
import { TRUMP_SUITS, SUIT_SYMBOLS, SUIT_COLORS } from "@/types/game";

interface GameOverScreenProps {
  gameState: GameState;
  onNewGame: () => void;
  onEditRound: (roundIndex: number, playerData: PlayerRoundData[]) => void;
}

export function GameOverScreen({ gameState, onNewGame, onEditRound }: GameOverScreenProps) {
  const { players, rounds } = gameState;
  const scores = allScores(rounds, players.length);
  const maxScore = Math.max(...scores);
  const winners = players.filter((_, i) => scores[i] === maxScore);
  const [editingRound, setEditingRound] = useState<number | null>(null);

  const podium = players
    .map((name, i) => ({ name, score: scores[i] }))
    .sort((a, b) => b.score - a.score);

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-2xl mx-auto space-y-6 animate-fly-up">
        <div className="text-center pt-4">
          <h1 className="text-3xl font-bold mb-1">Game Over!</h1>
          {winners.length === 1 ? (
            <p className="text-lg text-muted-foreground">
              🏆 <span className="font-semibold text-foreground">{winners[0]}</span> wins with{" "}
              {maxScore} points!
            </p>
          ) : (
            <p className="text-lg text-muted-foreground">
              🏆 Tie! {winners.join(" & ")} win with {maxScore} points!
            </p>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Final Rankings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {podium.map((entry, rank) => (
              <div
                key={entry.name}
                className={`flex items-center justify-between px-3 py-2 rounded-md ${
                  entry.score === maxScore ? "bg-yellow-50 border border-yellow-200" : "bg-muted/30"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-muted-foreground w-6">
                    {rank + 1 === 1 ? "🥇" : rank + 1 === 2 ? "🥈" : rank + 1 === 3 ? "🥉" : `${rank + 1}.`}
                  </span>
                  <span className="font-medium">{entry.name}</span>
                </div>
                <Badge variant={entry.score === maxScore ? "default" : "secondary"}>
                  {entry.score} pts
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Full Scorecard</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ScoreTable gameState={gameState} highlightWinners />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Correct a Round</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {rounds.map((r) => {
              const suit = TRUMP_SUITS[r.roundIndex];
              return (
                <Button
                  key={r.roundIndex}
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingRound(r.roundIndex)}
                  className="flex items-center gap-1"
                >
                  <Pencil className="h-3 w-3" />
                  R{r.roundIndex + 1}
                  <span className={SUIT_COLORS[suit]}>{SUIT_SYMBOLS[suit]}</span>
                </Button>
              );
            })}
          </CardContent>
        </Card>

        <Button onClick={onNewGame} variant="outline" className="w-full" size="lg">
          New Game
        </Button>
      </div>

      {editingRound !== null && (
        <EditRoundDialog
          open={editingRound !== null}
          onOpenChange={(open) => !open && setEditingRound(null)}
          roundIndex={editingRound}
          players={players}
          initialData={rounds[editingRound].playerData}
          onSave={onEditRound}
        />
      )}
    </div>
  );
}
