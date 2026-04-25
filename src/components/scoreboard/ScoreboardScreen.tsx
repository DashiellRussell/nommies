"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GameState, PlayerRoundData, TRUMP_SUITS, SUIT_SYMBOLS, SUIT_COLORS, cardsInRound } from "@/types/game";
import { ScoreTable } from "./ScoreTable";
import { EditRoundDialog } from "./EditRoundDialog";
import { Pencil } from "lucide-react";

interface ScoreboardScreenProps {
  gameState: GameState;
  onProceed: () => void;
  onEditRound: (roundIndex: number, playerData: PlayerRoundData[]) => void;
}

export function ScoreboardScreen({ gameState, onProceed, onEditRound }: ScoreboardScreenProps) {
  const { rounds, currentRoundIndex, players } = gameState;
  const [editingRound, setEditingRound] = useState<number | null>(null);

  const nextRoundNum = currentRoundIndex + 2;

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Scoreboard</h1>
          <span className="text-sm text-muted-foreground">
            After Round {currentRoundIndex + 1}
          </span>
        </div>

        <Card>
          <CardContent className="pt-4">
            <ScoreTable gameState={gameState} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Edit Past Rounds</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {rounds
              .filter((r) => r.status === "complete")
              .map((r) => {
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

        <Button onClick={onProceed} className="w-full" size="lg">
          Start Round {nextRoundNum} →
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
