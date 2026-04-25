"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GameState, cardsInRound, dealerIndex as getDealerIndex } from "@/types/game";
import { getBiddingOrder, forbiddenBidForLastBidder } from "@/lib/gameLogic";
import { RoundHeader } from "./RoundHeader";
import { BidInput } from "./BidInput";

interface BiddingScreenProps {
  gameState: GameState;
  onSubmitBids: (bids: number[]) => void;
}

export function BiddingScreen({ gameState, onSubmitBids }: BiddingScreenProps) {
  const { players, currentRoundIndex, rounds } = gameState;
  const numPlayers = players.length;
  const cards = cardsInRound(currentRoundIndex);
  const dealer = getDealerIndex(currentRoundIndex, numPlayers);
  const biddingOrder = getBiddingOrder(currentRoundIndex, numPlayers);

  const [bidValues, setBidValues] = useState<Record<number, string>>({});

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

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-lg mx-auto">
        <RoundHeader
          roundIndex={currentRoundIndex}
          dealerName={players[dealer]}
          numPlayers={numPlayers}
        />

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Place Bids</CardTitle>
          </CardHeader>
          <CardContent className="divide-y">
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

        <div className="mt-4">
          <Button onClick={handleSubmit} disabled={!isValid()} className="w-full">
            Lock In Bids
          </Button>
        </div>
      </div>
    </div>
  );
}
