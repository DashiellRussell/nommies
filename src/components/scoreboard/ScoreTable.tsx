import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { GameState, TRUMP_SUITS, SUIT_SYMBOLS, SUIT_COLORS, cardsInRound } from "@/types/game";
import { allScores, scoreForRound } from "@/lib/gameLogic";
import { cn } from "@/lib/utils";

interface ScoreTableProps {
  gameState: GameState;
  highlightWinners?: boolean;
}

export function ScoreTable({ gameState, highlightWinners = false }: ScoreTableProps) {
  const { players, rounds } = gameState;
  const scores = allScores(rounds, players.length);
  const maxScore = Math.max(...scores);

  const completedRounds = rounds.filter((r) => r.status === "complete");

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[80px]">Round</TableHead>
            {players.map((name, i) => (
              <TableHead
                key={i}
                className={cn(
                  "text-center min-w-[80px]",
                  highlightWinners && scores[i] === maxScore && "text-yellow-600 font-bold"
                )}
              >
                {name}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {completedRounds.map((round) => {
            const ri = round.roundIndex;
            const suit = TRUMP_SUITS[ri];
            const cards = cardsInRound(ri);
            return (
              <TableRow key={ri}>
                <TableCell>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-medium">R{ri + 1}</span>
                    <span className={`text-xs ${SUIT_COLORS[suit]}`}>
                      {SUIT_SYMBOLS[suit]} {suit}
                    </span>
                    <span className="text-xs text-muted-foreground">{cards}c</span>
                  </div>
                </TableCell>
                {players.map((_, pi) => {
                  const pd = round.playerData[pi];
                  const roundScore =
                    pd.bid !== null && pd.handsWon !== null
                      ? scoreForRound(pd.bid, pd.handsWon)
                      : null;
                  const exact = pd.bid !== null && pd.bid === pd.handsWon;
                  return (
                    <TableCell key={pi} className="text-center">
                      <div className="flex flex-col items-center gap-0.5">
                        <span className="text-xs text-muted-foreground">
                          {pd.bid ?? "—"} → {pd.handsWon ?? "—"}
                        </span>
                        {roundScore !== null && (
                          <Badge
                            variant={exact ? "success" : "secondary"}
                            className="text-xs"
                          >
                            +{roundScore}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })}

          <TableRow className="border-t-2 font-bold bg-muted/30">
            <TableCell className="text-sm font-bold">Total</TableCell>
            {scores.map((score, i) => (
              <TableCell
                key={i}
                className={cn(
                  "text-center text-sm font-bold",
                  highlightWinners && score === maxScore && "text-yellow-600"
                )}
              >
                {score}
                {highlightWinners && score === maxScore && " 🏆"}
              </TableCell>
            ))}
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
