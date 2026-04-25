import { RoundState, cardsInRound, dealerIndex } from "@/types/game";

export function scoreForRound(bid: number, handsWon: number): number {
  return bid === handsWon ? handsWon + 10 : handsWon;
}

export function cumulativeScore(rounds: RoundState[], playerIndex: number): number {
  return rounds.reduce((total, round) => {
    const pd = round.playerData[playerIndex];
    if (round.status === "complete" && pd.bid !== null && pd.handsWon !== null) {
      return total + scoreForRound(pd.bid, pd.handsWon);
    }
    return total;
  }, 0);
}

export function allScores(rounds: RoundState[], numPlayers: number): number[] {
  return Array.from({ length: numPlayers }, (_, i) => cumulativeScore(rounds, i));
}

export function getBiddingOrder(roundIndex: number, numPlayers: number): number[] {
  const dealer = dealerIndex(roundIndex, numPlayers);
  const order: number[] = [];
  for (let i = 1; i <= numPlayers; i++) {
    order.push((dealer + i) % numPlayers);
  }
  return order;
}

export function forbiddenBidForLastBidder(
  cardsDealt: number,
  otherBids: number[]
): number | null {
  const sumOthers = otherBids.reduce((a, b) => a + b, 0);
  const forbidden = cardsDealt - sumOthers;
  return forbidden >= 0 ? forbidden : null;
}

export function isResultsValid(handsWon: number[], roundIndex: number): boolean {
  const cards = cardsInRound(roundIndex);
  const total = handsWon.reduce((a, b) => a + b, 0);
  return total === cards;
}

export function roundScores(round: RoundState): (number | null)[] {
  return round.playerData.map((pd) => {
    if (pd.bid === null || pd.handsWon === null) return null;
    return scoreForRound(pd.bid, pd.handsWon);
  });
}
