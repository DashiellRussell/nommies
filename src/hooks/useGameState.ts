"use client";

import { useState, useEffect, useCallback } from "react";
import { GameState, GamePhase, PlayerRoundData, RoundState, TRUMP_SUITS } from "@/types/game";
import { loadGameState, saveGameState, clearGameState } from "@/lib/storage";

function buildInitialRounds(numPlayers: number): RoundState[] {
  return Array.from({ length: 7 }, (_, i) => ({
    roundIndex: i,
    playerData: Array.from({ length: numPlayers }, () => ({ bid: null, handsWon: null })),
    status: "pending" as const,
  }));
}

export interface UseGameStateReturn {
  gameState: GameState | null;
  isLoaded: boolean;
  startGame: (playerNames: string[]) => void;
  submitBids: (bids: number[]) => void;
  submitResults: (handsWon: number[]) => void;
  editRound: (roundIndex: number, playerData: PlayerRoundData[]) => void;
  proceedToNextRound: () => void;
  goBackToScoreboard: () => void;
  resetGame: () => void;
}

export function useGameState(): UseGameStateReturn {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setGameState(loadGameState());
    setIsLoaded(true);
  }, []);

  const persist = useCallback((next: GameState) => {
    saveGameState(next);
    setGameState(next);
  }, []);

  const startGame = useCallback(
    (playerNames: string[]) => {
      const next: GameState = {
        phase: "bidding",
        players: playerNames,
        rounds: buildInitialRounds(playerNames.length),
        currentRoundIndex: 0,
        createdAt: Date.now(),
      };
      persist(next);
    },
    [persist]
  );

  const submitBids = useCallback(
    (bids: number[]) => {
      if (!gameState) return;
      const ri = gameState.currentRoundIndex;
      const updatedRounds = gameState.rounds.map((r, i) => {
        if (i !== ri) return r;
        return {
          ...r,
          status: "playing" as const,
          playerData: r.playerData.map((pd, pi) => ({ ...pd, bid: bids[pi] })),
        };
      });
      persist({ ...gameState, phase: "results", rounds: updatedRounds });
    },
    [gameState, persist]
  );

  const submitResults = useCallback(
    (handsWon: number[]) => {
      if (!gameState) return;
      const ri = gameState.currentRoundIndex;
      const isLastRound = ri === 6;
      const updatedRounds = gameState.rounds.map((r, i) => {
        if (i !== ri) return r;
        return {
          ...r,
          status: "complete" as const,
          playerData: r.playerData.map((pd, pi) => ({ ...pd, handsWon: handsWon[pi] })),
        };
      });
      const nextPhase: GamePhase = isLastRound ? "complete" : "scoreboard";
      persist({ ...gameState, phase: nextPhase, rounds: updatedRounds });
    },
    [gameState, persist]
  );

  const editRound = useCallback(
    (roundIndex: number, playerData: PlayerRoundData[]) => {
      if (!gameState) return;
      const updatedRounds = gameState.rounds.map((r, i) => {
        if (i !== roundIndex) return r;
        return { ...r, status: "complete" as const, playerData };
      });
      persist({ ...gameState, rounds: updatedRounds });
    },
    [gameState, persist]
  );

  const proceedToNextRound = useCallback(() => {
    if (!gameState) return;
    const nextRoundIndex = gameState.currentRoundIndex + 1;
    persist({ ...gameState, phase: "bidding", currentRoundIndex: nextRoundIndex });
  }, [gameState, persist]);

  const goBackToScoreboard = useCallback(() => {
    if (!gameState) return;
    if (gameState.phase !== "bidding") return;
    if (gameState.currentRoundIndex <= 0) return;
    const prevRoundIndex = gameState.currentRoundIndex - 1;
    const updatedRounds = gameState.rounds.map((r, i) => {
      if (i !== gameState.currentRoundIndex) return r;
      return {
        ...r,
        status: "pending" as const,
        playerData: r.playerData.map((pd) => ({ ...pd, bid: null, handsWon: null })),
      };
    });
    persist({
      ...gameState,
      phase: "scoreboard",
      currentRoundIndex: prevRoundIndex,
      rounds: updatedRounds,
    });
  }, [gameState, persist]);

  const resetGame = useCallback(() => {
    clearGameState();
    setGameState(null);
  }, []);

  return {
    gameState,
    isLoaded,
    startGame,
    submitBids,
    submitResults,
    editRound,
    proceedToNextRound,
    goBackToScoreboard,
    resetGame,
  };
}
