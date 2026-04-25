import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface BidInputProps {
  playerName: string;
  isDealer: boolean;
  isLastBidder: boolean;
  forbiddenBid: number | null;
  value: string;
  onChange: (value: string) => void;
}

export function BidInput({
  playerName,
  isDealer,
  isLastBidder,
  forbiddenBid,
  value,
  onChange,
}: BidInputProps) {
  return (
    <div className="flex items-center gap-3 py-2">
      <div className="flex-1 min-w-0">
        <Label className="flex items-center gap-2">
          <span className="font-semibold truncate text-base">{playerName}</span>
          {isDealer && (
            <span className="text-[10px] uppercase tracking-wider bg-muted px-1.5 py-0.5 rounded text-muted-foreground shrink-0">
              dealer
            </span>
          )}
        </Label>
        {isLastBidder && forbiddenBid !== null && (
          <p className="text-[11px] text-destructive leading-tight">Cannot bid {forbiddenBid}</p>
        )}
      </div>
      <Input
        type="number"
        inputMode="numeric"
        pattern="[0-9]*"
        min={0}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-20 h-11 shrink-0 text-center text-xl font-semibold"
        placeholder="0"
      />
    </div>
  );
}
