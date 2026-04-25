"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { PlayerRoundData, cardsInRound, TRUMP_SUITS, SUIT_SYMBOLS, SUIT_COLORS } from "@/types/game";
import { getBiddingOrder, forbiddenBidForLastBidder, isResultsValid } from "@/lib/gameLogic";

interface EditRoundDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  roundIndex: number;
  players: string[];
  initialData: PlayerRoundData[];
  onSave: (roundIndex: number, playerData: PlayerRoundData[]) => void;
}

export function EditRoundDialog({
  open,
  onOpenChange,
  roundIndex,
  players,
  initialData,
  onSave,
}: EditRoundDialogProps) {
  const numPlayers = players.length;
  const cards = cardsInRound(roundIndex);
  const suit = TRUMP_SUITS[roundIndex];
  const biddingOrder = getBiddingOrder(roundIndex, numPlayers);
  const lastBidder = biddingOrder[biddingOrder.length - 1];

  const [bidValues, setBidValues] = useState<Record<number, string>>(
    Object.fromEntries(initialData.map((pd, i) => [i, pd.bid !== null ? String(pd.bid) : ""]))
  );
  const [wonValues, setWonValues] = useState<Record<number, string>>(
    Object.fromEntries(
      initialData.map((pd, i) => [i, pd.handsWon !== null ? String(pd.handsWon) : ""])
    )
  );

  const parsedBids: (number | null)[] = players.map((_, i) => {
    const raw = bidValues[i];
    if (!raw && raw !== "0") return null;
    const n = parseInt(raw, 10);
    return isNaN(n) || n < 0 ? null : n;
  });

  const parsedWon: (number | null)[] = players.map((_, i) => {
    const raw = wonValues[i];
    if (!raw && raw !== "0") return null;
    const n = parseInt(raw, 10);
    return isNaN(n) || n < 0 ? null : n;
  });

  const otherBids = biddingOrder
    .slice(0, -1)
    .map((pi) => parsedBids[pi])
    .filter((b): b is number => b !== null);
  const forbidden =
    otherBids.length === numPlayers - 1
      ? forbiddenBidForLastBidder(cards, otherBids)
      : null;

  const bidsValid =
    parsedBids.every((b) => b !== null) &&
    (forbidden === null || parsedBids[lastBidder] !== forbidden);

  const wonTotal = parsedWon.reduce<number>((s, v) => s + (v ?? 0), 0);
  const wonValid = parsedWon.every((v) => v !== null) && isResultsValid(parsedWon as number[], roundIndex);

  const canSave = bidsValid && wonValid;

  const handleSave = () => {
    if (!canSave) return;
    const newData: PlayerRoundData[] = players.map((_, i) => ({
      bid: parsedBids[i],
      handsWon: parsedWon[i],
    }));
    onSave(roundIndex, newData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Edit Round {roundIndex + 1}
            <span className={SUIT_COLORS[suit]}>
              {SUIT_SYMBOLS[suit]} {suit}
            </span>
            <Badge variant="secondary">{cards} cards</Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium mb-2">Bids</p>
            <div className="space-y-2">
              {biddingOrder.map((pi, idx) => {
                const isLast = idx === biddingOrder.length - 1;
                return (
                  <div key={pi} className="flex items-center gap-3">
                    <Label className="flex-1 text-sm truncate">{players[pi]}</Label>
                    {isLast && forbidden !== null && (
                      <span className="text-xs text-destructive shrink-0">≠{forbidden}</span>
                    )}
                    <Input
                      type="number"
                      min={0}
                      value={bidValues[pi] ?? ""}
                      onChange={(e) =>
                        setBidValues((prev) => ({ ...prev, [pi]: e.target.value }))
                      }
                      className="w-16 text-center"
                    />
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <p className="text-sm font-medium mb-2 flex items-center gap-2">
              Hands Won
              <Badge
                variant={wonValid ? "success" : "secondary"}
                className="text-xs"
              >
                {wonTotal}/{cards}
              </Badge>
            </p>
            <div className="space-y-2">
              {players.map((name, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Label className="flex-1 text-sm truncate">{name}</Label>
                  <Input
                    type="number"
                    min={0}
                    value={wonValues[i] ?? ""}
                    onChange={(e) =>
                      setWonValues((prev) => ({ ...prev, [i]: e.target.value }))
                    }
                    className="w-16 text-center"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!canSave}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
