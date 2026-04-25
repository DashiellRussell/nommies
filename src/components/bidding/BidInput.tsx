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
    <div className="flex items-start gap-3 py-2">
      <div className="flex-1 min-w-0">
        <Label className="flex items-center gap-2 mb-1">
          <span className="font-medium truncate">{playerName}</span>
          {isDealer && (
            <span className="text-xs bg-muted px-1.5 py-0.5 rounded text-muted-foreground shrink-0">
              dealer
            </span>
          )}
        </Label>
        {isLastBidder && forbiddenBid !== null && (
          <p className="text-xs text-destructive mb-1">Cannot bid {forbiddenBid}</p>
        )}
      </div>
      <Input
        type="number"
        min={0}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-20 shrink-0 text-center"
        placeholder="0"
      />
    </div>
  );
}
