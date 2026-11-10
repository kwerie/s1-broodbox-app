import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function QuantityStepper({
    value,
    onChange,
    onRemove,
}: {
    value: number;
    onChange: (value: number) => void;
    onRemove: () => void;
}) {
    return (
        <div className="flex items-center gap-1">
            <Button
                type="button"
                variant="outline"
                size="icon-sm"
                aria-label={value <= 1 ? "Verwijderen" : "Minder"}
                onClick={() => (value <= 1 ? onRemove() : onChange(value - 1))}
            >
                {value <= 1 ? <Trash2 className="text-destructive" /> : <Minus />}
            </Button>
            <span className="w-8 text-center text-sm tabular-nums">{value}</span>
            <Button
                type="button"
                variant="outline"
                size="icon-sm"
                aria-label="Meer"
                onClick={() => onChange(value + 1)}
            >
                <Plus />
            </Button>
        </div>
    );
}
