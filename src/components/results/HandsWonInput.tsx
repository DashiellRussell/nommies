import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface HandsWonInputProps {
  playerName: string;
  bid: number | null;
  value: string;
  onChange: (value: string) => void;
}

export function HandsWonInput({ playerName, bid, value, onChange }: HandsWonInputProps) {
  return (
    <div className="flex items-center gap-3 py-2">
      <div className="flex-1 min-w-0">
        <Label className="flex items-center gap-2">
          <span className="font-semibold truncate text-base">{playerName}</span>
          <Badge variant="secondary" className="shrink-0 text-[10px] uppercase tracking-wider">
            bid {bid ?? "—"}
          </Badge>
        </Label>
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
