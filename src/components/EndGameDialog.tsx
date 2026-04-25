"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { X } from "lucide-react";

interface EndGameDialogProps {
  onConfirm: () => void;
}

export function EndGameDialog({ onConfirm }: EndGameDialogProps) {
  const [open, setOpen] = useState(false);

  const handleConfirm = () => {
    setOpen(false);
    onConfirm();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setOpen(true)}
        className="text-muted-foreground hover:text-destructive h-9 px-2"
      >
        <X className="h-4 w-4 mr-1" />
        End game
      </Button>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>End game?</DialogTitle>
          <DialogDescription>
            This will discard all rounds and scores and return you to the setup screen.
            This can&apos;t be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => setOpen(false)} className="sm:flex-1">
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleConfirm} className="sm:flex-1">
            End game
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
