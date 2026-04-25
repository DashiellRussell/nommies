"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";

interface SetupScreenProps {
  onStart: (playerNames: string[]) => void;
}

export function SetupScreen({ onStart }: SetupScreenProps) {
  const [names, setNames] = useState<string[]>(["", ""]);

  const updateName = (index: number, value: string) => {
    setNames((prev) => prev.map((n, i) => (i === index ? value : n)));
  };

  const addPlayer = () => {
    if (names.length < 7) setNames((prev) => [...prev, ""]);
  };

  const removePlayer = (index: number) => {
    if (names.length > 2) setNames((prev) => prev.filter((_, i) => i !== index));
  };

  const trimmedNames = names.map((n) => n.trim());
  const hasEmpty = trimmedNames.some((n) => n === "");
  const hasDuplicates = new Set(trimmedNames).size !== trimmedNames.length;
  const canStart = !hasEmpty && !hasDuplicates;

  const handleStart = () => {
    if (canStart) onStart(trimmedNames);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Nommies</CardTitle>
          <CardDescription>Enter player names to start the game</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {names.map((name, index) => (
              <div key={index} className="flex items-center gap-2">
                <Label className="w-20 shrink-0 text-muted-foreground text-xs">
                  Player {index + 1}
                </Label>
                <Input
                  value={name}
                  onChange={(e) => updateName(index, e.target.value)}
                  placeholder={`Player ${index + 1}`}
                  onKeyDown={(e) => e.key === "Enter" && handleStart()}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removePlayer(index)}
                  disabled={names.length <= 2}
                  className="shrink-0"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          {hasDuplicates && (
            <p className="text-sm text-destructive">Player names must be unique.</p>
          )}

          <div className="flex flex-col gap-2 pt-2">
            <Button
              variant="outline"
              onClick={addPlayer}
              disabled={names.length >= 7}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Player ({names.length}/7)
            </Button>
            <Button onClick={handleStart} disabled={!canStart} className="w-full">
              Start Game
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
