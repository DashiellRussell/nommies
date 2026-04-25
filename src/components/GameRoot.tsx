"use client";

import { useGameState } from "@/hooks/useGameState";
import { SetupScreen } from "@/components/setup/SetupScreen";
import { BiddingScreen } from "@/components/bidding/BiddingScreen";
import { ResultsScreen } from "@/components/results/ResultsScreen";
import { ScoreboardScreen } from "@/components/scoreboard/ScoreboardScreen";
import { GameOverScreen } from "@/components/gameover/GameOverScreen";

export function GameRoot() {
  const {
    gameState,
    isLoaded,
    startGame,
    submitBids,
    submitResults,
    editRound,
    proceedToNextRound,
    resetGame,
  } = useGameState();

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground text-sm">Loading…</div>
      </div>
    );
  }

  if (!gameState || gameState.phase === "setup") {
    return <SetupScreen onStart={startGame} />;
  }

  const { phase } = gameState;

  if (phase === "bidding") {
    return <BiddingScreen gameState={gameState} onSubmitBids={submitBids} />;
  }

  if (phase === "results") {
    return <ResultsScreen gameState={gameState} onSubmitResults={submitResults} />;
  }

  if (phase === "scoreboard") {
    return (
      <ScoreboardScreen
        gameState={gameState}
        onProceed={proceedToNextRound}
        onEditRound={editRound}
      />
    );
  }

  if (phase === "complete") {
    return (
      <GameOverScreen
        gameState={gameState}
        onNewGame={resetGame}
        onEditRound={editRound}
      />
    );
  }

  return <SetupScreen onStart={startGame} />;
}
