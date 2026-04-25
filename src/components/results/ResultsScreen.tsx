"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { GameState, cardsInRound, dealerIndex as getDealerIndex } from "@/types/game";
import { isResultsValid } from "@/lib/gameLogic";
import { cn } from "@/lib/utils";
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

  const diff = total - cards;
  const totalState: "ok" | "under" | "over" =
    diff === 0 ? "ok" : diff < 0 ? "under" : "over";

  return (
    <div className="min-h-screen p-3 pb-24">
      <div className="max-w-md mx-auto">
        <RoundHeader
          roundIndex={currentRoundIndex}
          dealerName={players[dealer]}
          numPlayers={numPlayers}
        />

        <Card
          className={cn(
            "mb-3 border-2 transition-colors",
            allFilled && valid && "border-emerald-500/40 bg-emerald-500/5",
            allFilled && !valid && "border-destructive/60 bg-destructive/5",
            !allFilled && "border-dashed"
          )}
        >
          <CardContent className="p-3 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                Tricks recorded
              </div>
              <div className="text-[11px] text-muted-foreground leading-tight mt-0.5 truncate">
                {!allFilled
                  ? `${numPlayers - parsed.filter((v) => v !== null).length} player${numPlayers - parsed.filter((v) => v !== null).length === 1 ? "" : "s"} remaining`
                  : totalState === "ok"
                    ? "Looks good"
                    : totalState === "under"
                      ? `${Math.abs(diff)} short of ${cards}`
                      : `${diff} over ${cards}`}
              </div>
            </div>
            <div className="text-right shrink-0 font-mono tabular-nums">
              <span
                className={cn(
                  "text-2xl font-bold",
                  allFilled && valid && "text-emerald-600 dark:text-emerald-400",
                  allFilled && !valid && "text-destructive"
                )}
              >
                {total}
              </span>
              <span className="text-muted-foreground text-lg"> / {cards}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="px-4 py-1 divide-y">
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
      </div>

      <div
        className="fixed bottom-0 left-0 right-0 border-t bg-background/90 backdrop-blur p-3 sm:static sm:border-0 sm:bg-transparent sm:backdrop-blur-none sm:p-0 sm:mt-4"
        style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
      >
        <div className="max-w-lg mx-auto">
          <Button
            onClick={handleSubmit}
            disabled={!valid}
            className="w-full h-12 text-base"
          >
            {currentRoundIndex === 6 ? "Finish Game" : "Submit Results"}
          </Button>
        </div>
      </div>
    </div>
  );
}
