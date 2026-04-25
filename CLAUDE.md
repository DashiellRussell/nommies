@AGENTS.md

# Nommies

A single-page score tracker for the Nommies card game (a Wizard/Oh Hell variant). Pure client-side — game state lives in `localStorage`, no backend.

## Game rules (non-obvious)

- **7 rounds**, cards-per-round counts down: 7, 6, 5, 4, 3, 2, 1.
- **Trump cycle** by round index: Hearts, Clubs, Diamonds, Spades, Hearts, Clubs, Diamonds.
- **2 to 7 players**. Dealer rotates each round by `roundIndex % numPlayers`.
- **Bidding** starts left of the dealer; dealer bids last.
- **Last-bidder constraint**: the total of all bids cannot equal the cards dealt that round. The UI enforces this on the dealer's input (`forbiddenBidForLastBidder`). The running-bid-total card on the bidding screen exists primarily to make this rule legible.
- **Scoring**: if `bid === handsWon`, the player scores `handsWon + 10`; otherwise they score `handsWon` (so missing your bid still earns the tricks you took, but no bonus).

## State machine

Phases live in `GameState.phase`: `setup → bidding → results → scoreboard → bidding → … → complete`. The `useGameState` hook owns all transitions and persistence; screens are dumb consumers. The "back from bidding" action returns to the prior round's scoreboard by decrementing `currentRoundIndex` (only valid when `> 0`).

## Mobile / iOS gotchas this codebase already handles — do not regress them

- **Inputs are 16px on mobile** (`text-base sm:text-sm` in `ui/input.tsx`). Going below 16px makes iOS Safari auto-zoom on focus and frequently fail to zoom back out.
- **Viewport** sets `viewport-fit=cover` and a `themeColor` so the page paints behind the dynamic island / status bar. The page gradient is on `<html>`, not `<body>`, so it reaches the safe-area zones.
- **Sticky bottom CTAs** use `env(safe-area-inset-bottom)` for notched iPhones.
- **Animations** respect `prefers-reduced-motion: reduce` (see the keyframes block in `globals.css`).

## Conventions worth keeping

- Custom animations are plain CSS keyframes in `globals.css` (`animate-fly-up`, `animate-suit-pop`, etc.) — no animation library. Stagger via inline `animationDelay`.
- Glassmorphism pattern: `bg-card/70 backdrop-blur-md` (or `/80`) with a normal border. Avoid solid card backgrounds on the gameplay screens.
- Confirmation for destructive actions goes through `EndGameDialog` (Radix Dialog wrapper). Don't add bare `confirm()` calls or one-click destructive buttons.
