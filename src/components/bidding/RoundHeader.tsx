import { TRUMP_SUITS, SUIT_SYMBOLS, SUIT_COLORS, cardsInRound } from "@/types/game";

interface RoundHeaderProps {
  roundIndex: number;
  dealerName: string;
  numPlayers: number;
}

export function RoundHeader({ roundIndex, dealerName }: RoundHeaderProps) {
  const suit = TRUMP_SUITS[roundIndex];
  const cards = cardsInRound(roundIndex);

  return (
    <div className="mb-3 flex items-center gap-3">
      <div
        className={`flex items-center justify-center h-12 w-12 rounded-xl bg-card/70 backdrop-blur-md border shadow-sm text-3xl shrink-0 ${SUIT_COLORS[suit]}`}
        aria-hidden
      >
        {SUIT_SYMBOLS[suit]}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-bold leading-tight text-lg">
          Round {roundIndex + 1}
          <span className="text-muted-foreground font-normal text-sm"> / 7</span>
        </div>
        <div className="text-xs text-muted-foreground truncate">
          {cards} card{cards === 1 ? "" : "s"} · trump{" "}
          <span className={`font-medium ${SUIT_COLORS[suit]}`}>{suit}</span> · dealer{" "}
          <span className="font-medium text-foreground">{dealerName}</span>
        </div>
      </div>
    </div>
  );
}
