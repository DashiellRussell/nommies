"use client";

import { useEffect, useState } from "react";
import { TRUMP_SUITS, SUIT_SYMBOLS, SUIT_COLORS, cardsInRound } from "@/types/game";

interface RoundAnnouncementProps {
  roundIndex: number;
  dealerName: string;
  onDone: () => void;
}

const HOLD_MS = 1400;
const EXIT_MS = 320;

export function RoundAnnouncement({ roundIndex, dealerName, onDone }: RoundAnnouncementProps) {
  const [exiting, setExiting] = useState(false);
  const suit = TRUMP_SUITS[roundIndex];
  const cards = cardsInRound(roundIndex);

  useEffect(() => {
    const holdTimer = window.setTimeout(() => setExiting(true), HOLD_MS);
    const doneTimer = window.setTimeout(onDone, HOLD_MS + EXIT_MS);
    return () => {
      window.clearTimeout(holdTimer);
      window.clearTimeout(doneTimer);
    };
  }, [onDone]);

  const skip = () => {
    setExiting(true);
    window.setTimeout(onDone, EXIT_MS);
  };

  return (
    <div
      onClick={skip}
      role="button"
      aria-label="Round announcement — tap to skip"
      className={`fixed inset-0 z-50 flex items-center justify-center p-6 cursor-pointer ${
        exiting ? "animate-fade-out" : "animate-fade-in"
      }`}
      style={{
        background:
          "radial-gradient(circle at 50% 40%, oklch(1 0 0 / 0.6), oklch(0.96 0 0 / 0.85))",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
      }}
    >
      <div className="flex flex-col items-center text-center max-w-sm">
        <div
          className={`text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-3 ${
            exiting ? "" : "animate-fly-up"
          }`}
          style={{ animationDelay: "120ms" }}
        >
          Next Round
        </div>

        <div className="relative mb-5">
          <div
            className={`text-[140px] sm:text-[180px] leading-none ${SUIT_COLORS[suit]} ${
              exiting ? "" : "animate-suit-pop"
            }`}
            aria-hidden
          >
            <span className={exiting ? "" : "inline-block animate-suit-float"} style={{ animationDelay: "640ms" }}>
              {SUIT_SYMBOLS[suit]}
            </span>
          </div>
        </div>

        <div
          className={`text-5xl sm:text-6xl font-black tracking-tight leading-none ${
            exiting ? "" : "animate-fly-up"
          }`}
          style={{ animationDelay: "260ms" }}
        >
          Round {roundIndex + 1}
        </div>

        <div
          className={`mt-3 text-base ${exiting ? "" : "animate-fly-up"}`}
          style={{ animationDelay: "400ms" }}
        >
          <span className="font-semibold">{cards}</span>{" "}
          <span className="text-muted-foreground">card{cards === 1 ? "" : "s"} · trump</span>{" "}
          <span className={`font-semibold ${SUIT_COLORS[suit]}`}>{suit}</span>
        </div>

        <div
          className={`mt-4 inline-flex items-center gap-2 rounded-full bg-card/70 backdrop-blur px-3 py-1 border text-sm ${
            exiting ? "" : "animate-fly-up"
          }`}
          style={{ animationDelay: "540ms" }}
        >
          <span className="text-muted-foreground">Dealer</span>
          <span className="font-semibold">{dealerName}</span>
        </div>

        <div
          className={`mt-8 text-[11px] uppercase tracking-wider text-muted-foreground/70 ${
            exiting ? "" : "animate-fade-in"
          }`}
          style={{ animationDelay: "900ms" }}
        >
          tap to skip
        </div>
      </div>
    </div>
  );
}
