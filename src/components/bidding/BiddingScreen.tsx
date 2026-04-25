"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { GameState, cardsInRound, dealerIndex as getDealerIndex } from "@/types/game";
import { getBiddingOrder, forbiddenBidForLastBidder } from "@/lib/gameLogic";
import { cn } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";
import { EndGameDialog } from "@/components/EndGameDialog";
import { RoundAnnouncement } from "@/components/animations/RoundAnnouncement";
import { RoundHeader } from "./RoundHeader";
import { BidInput } from "./BidInput";

interface BiddingScreenProps {
  gameState: GameState;
  onSubmitBids: (bids: number[]) => void;
  onBack: () => void;
  onEndGame: () => void;
}

export function BiddingScreen({
  gameState,
  onSubmitBids,
  onBack,
  onEndGame,
}: BiddingScreenProps) {
  const { players, currentRoundIndex } = gameState;
  const numPlayers = players.length;
  const cards = cardsInRound(currentRoundIndex);
  const dealer = getDealerIndex(currentRoundIndex, numPlayers);
  const biddingOrder = getBiddingOrder(currentRoundIndex, numPlayers);

  const [bidValues, setBidValues] = useState<Record<number, string>>({});
  const [announcing, setAnnouncing] = useState(true);

  const updateBid = (playerIndex: number, value: string) => {
    setBidValues((prev) => ({ ...prev, [playerIndex]: value }));
  };

  const parsedBids: (number | null)[] = players.map((_, i) => {
    const raw = bidValues[i];
    if (raw === "" || raw === undefined) return null;
    const n = parseInt(raw, 10);
    return isNaN(n) || n < 0 ? null : n;
  });

  const lastBidder = biddingOrder[biddingOrder.length - 1];
  const otherBids = biddingOrder
    .slice(0, -1)
    .map((pi) => parsedBids[pi])
    .filter((b): b is number => b !== null);
  const allOthersFilledIn = biddingOrder.slice(0, -1).every((pi) => parsedBids[pi] !== null);
  const forbidden =
    allOthersFilledIn && otherBids.length === numPlayers - 1
      ? forbiddenBidForLastBidder(cards, otherBids)
      : null;

  const isValid = (): boolean => {
    for (const pi of biddingOrder) {
      const bid = parsedBids[pi];
      if (bid === null) return false;
      if (pi === lastBidder && forbidden !== null && bid === forbidden) return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (!isValid()) return;
    onSubmitBids(parsedBids as number[]);
  };

  const enteredBids = parsedBids.filter((b): b is number => b !== null);
  const bidTotal = enteredBids.reduce((sum, b) => sum + b, 0);
  const filledCount = enteredBids.length;
  const allBidsEntered = filledCount === numPlayers;
  const diff = bidTotal - cards;
  const totalState: "under" | "exact" | "over" =
    diff < 0 ? "under" : diff === 0 ? "exact" : "over";

  const totalLabel =
    !allBidsEntered
      ? `${numPlayers - filledCount} bid${numPlayers - filledCount === 1 ? "" : "s"} remaining`
      : totalState === "exact"
        ? "Total equals tricks — invalid"
        : totalState === "under"
          ? `${Math.abs(diff)} under (someone will lose tricks)`
          : `${diff} over (someone will lose tricks)`;

  const canGoBack = currentRoundIndex > 0;

  return (
    <div className="min-h-screen p-3 pb-24">
      {announcing && (
        <RoundAnnouncement
          roundIndex={currentRoundIndex}
          dealerName={players[dealer]}
          onDone={() => setAnnouncing(false)}
        />
      )}
      <div className={cn("max-w-md mx-auto", announcing ? "opacity-0" : "animate-fly-up")}>
        <div className="flex items-center justify-between mb-2 -ml-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            disabled={!canGoBack}
            className="h-9 px-2 text-muted-foreground"
          >
            <ChevronLeft className="h-4 w-4 mr-0.5" />
            Scoreboard
          </Button>
          <EndGameDialog onConfirm={onEndGame} />
        </div>

        <RoundHeader
          roundIndex={currentRoundIndex}
          dealerName={players[dealer]}
          numPlayers={numPlayers}
        />

        <Card
          className={cn(
            "mb-3 border-2 transition-colors backdrop-blur-md",
            allBidsEntered && totalState === "exact" && "border-destructive/60 bg-destructive/10",
            allBidsEntered && totalState !== "exact" && "border-emerald-500/40 bg-emerald-500/10",
            !allBidsEntered && "border-dashed bg-card/70"
          )}
        >
          <CardContent className="p-3 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                Total bids
              </div>
              <div className="text-[11px] text-muted-foreground leading-tight mt-0.5 truncate">
                {totalLabel}
              </div>
            </div>
            <div className="text-right shrink-0 font-mono tabular-nums">
              <span
                className={cn(
                  "text-2xl font-bold",
                  allBidsEntered && totalState === "exact" && "text-destructive",
                  allBidsEntered && totalState !== "exact" && "text-emerald-600 dark:text-emerald-400"
                )}
              >
                {bidTotal}
              </span>
              <span className="text-muted-foreground text-lg"> / {cards}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/80 backdrop-blur-md">
          <CardContent className="px-4 py-1 divide-y">
            {biddingOrder.map((pi, orderIndex) => {
              const isLastBidder = orderIndex === biddingOrder.length - 1;
              const computedForbidden = isLastBidder ? forbidden : null;
              return (
                <BidInput
                  key={pi}
                  playerName={players[pi]}
                  isDealer={pi === dealer}
                  isLastBidder={isLastBidder}
                  forbiddenBid={computedForbidden}
                  value={bidValues[pi] ?? ""}
                  onChange={(v) => updateBid(pi, v)}
                />
              );
            })}
          </CardContent>
        </Card>
      </div>

      <div
        className={cn(
          "fixed bottom-0 left-0 right-0 border-t bg-background/70 backdrop-blur-md p-3 sm:static sm:border-0 sm:bg-transparent sm:backdrop-blur-none sm:p-0 sm:mt-4 transition-opacity duration-300",
          announcing && "opacity-0 pointer-events-none"
        )}
        style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
      >
        <div className="max-w-md mx-auto">
          <Button
            onClick={handleSubmit}
            disabled={!isValid()}
            className="w-full h-12 text-base"
          >
            Lock In Bids
          </Button>
        </div>
      </div>
    </div>
  );
}
