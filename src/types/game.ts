export type Suit = "Hearts" | "Clubs" | "Diamonds" | "Spades";

export const TRUMP_SUITS: Suit[] = [
  "Hearts",
  "Clubs",
  "Diamonds",
  "Spades",
  "Hearts",
  "Clubs",
  "Diamonds",
];

export const SUIT_SYMBOLS: Record<Suit, string> = {
  Hearts: "♥",
  Clubs: "♣",
  Diamonds: "♦",
  Spades: "♠",
};

export const SUIT_COLORS: Record<Suit, string> = {
  Hearts: "text-red-600",
  Clubs: "text-gray-800",
  Diamonds: "text-red-600",
  Spades: "text-gray-800",
};

export const cardsInRound = (roundIndex: number): number => 7 - roundIndex;

export const dealerIndex = (roundIndex: number, numPlayers: number): number =>
  roundIndex % numPlayers;

export interface PlayerRoundData {
  bid: number | null;
  handsWon: number | null;
}

export interface RoundState {
  roundIndex: number;
  playerData: PlayerRoundData[];
  status: "pending" | "bidding" | "playing" | "complete";
}

export type GamePhase = "setup" | "bidding" | "results" | "scoreboard" | "complete";

export interface GameState {
  phase: GamePhase;
  players: string[];
  rounds: RoundState[];
  currentRoundIndex: number;
  createdAt: number;
}
