"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GameState, cardsInRound, dealerIndex as getDealerIndex } from "@/types/game";
import { isResultsValid } from "@/lib/gameLogic";
import { RoundHeader } from "@/components/bidding/RoundHeader";
import { HandsWonInput } from "./HandsWonInput";

interface ResultsScreenProps {
  gameState: GameState;
  onSubmitResults: (handsWon: number[]) => void;
}

export function ResultsScreen({ gameState, onSubmitResults }: ResultsScreenProps) {
  const { players, currentRoundIndex, rounds } = gameState;
  const numPlayers = players.length;
  const cards = cardsInRound(currentRoundIndex);
  const dealer = getDealerIndex(currentRoundIndex, numPlayers);
  const round = rounds[currentRoundIndex];

  const [values, setValues] = useState<Record<number, string>>({});

  const updateValue = (index: number, value: string) => {
    setValues((prev) => ({ ...prev, [index]: value }));
  };

  const parsed: (number | null)[] = players.map((_, i) => {
    const raw = values[i];
    if (raw === "" || raw === undefined) return null;
    const n = parseInt(raw, 10);
    return isNaN(n) || n < 0 ? null : n;
  });

  const allFilled = parsed.every((v) => v !== null);
  const total = parsed.reduce<number>((sum, v) => sum + (v ?? 0), 0);
  const valid = allFilled && isResultsValid(parsed as number[], currentRoundIndex);

  const handleSubmit = () => {
    if (!valid) return;
    onSubmitResults(parsed as number[]);
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-lg mx-auto">
        <RoundHeader
          roundIndex={currentRoundIndex}
          dealerName={players[dealer]}
          numPlayers={numPlayers}
        />

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Enter Results</CardTitle>
            <Badge variant={valid ? "success" : allFilled && total !== cards ? "destructive" : "secondary"}>
              {total} / {cards} tricks
            </Badge>
          </CardHeader>
          <CardContent className="divide-y">
            {players.map((name, i) => (
              <HandsWonInput
                key={i}
                playerName={name}
                bid={round.playerData[i].bid}
                value={values[i] ?? ""}
                onChange={(v) => updateValue(i, v)}
              />
            ))}
          </CardContent>
        </Card>

        {allFilled && !valid && (
          <p className="text-sm text-destructive mt-2 text-center">
            Total tricks must equal {cards} (currently {total})
          </p>
        )}

        <div className="mt-4">
          <Button onClick={handleSubmit} disabled={!valid} className="w-full">
            {currentRoundIndex === 6 ? "Finish Game" : "Submit Results"}
          </Button>
        </div>
      </div>
    </div>
  );
}
