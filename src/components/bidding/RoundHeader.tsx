import { Badge } from "@/components/ui/badge";
import { TRUMP_SUITS, SUIT_SYMBOLS, SUIT_COLORS, cardsInRound } from "@/types/game";

interface RoundHeaderProps {
  roundIndex: number;
  dealerName: string;
  numPlayers: number;
}

export function RoundHeader({ roundIndex, dealerName, numPlayers }: RoundHeaderProps) {
  const suit = TRUMP_SUITS[roundIndex];
  const cards = cardsInRound(roundIndex);

  return (
    <div className="flex flex-wrap items-center gap-3 mb-6">
      <span className="text-lg font-bold">Round {roundIndex + 1} / 7</span>
      <Badge variant="outline" className="text-base px-3 py-1">
        <span className={`mr-1 ${SUIT_COLORS[suit]}`}>{SUIT_SYMBOLS[suit]}</span>
        {suit}
      </Badge>
      <Badge variant="secondary">{cards} cards</Badge>
      <Badge variant="outline" className="text-muted-foreground">
        Dealer: {dealerName}
      </Badge>
    </div>
  );
}
