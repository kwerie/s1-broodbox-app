import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = ["Gerechten", "Ontvangers", "Adresgegevens", "Controle", "Bevestiging"];

export function Stepper({ current }: { current: number }) {
    return (
        <ol className="flex flex-wrap items-center gap-y-2">
            {STEPS.map((label, index) => {
                const step = index + 1;
                const isComplete = step < current;
                const isActive = step === current;

                return (
                    <li key={label} className="flex items-center">
                        <div className="flex items-center gap-2">
                            <span
                                className={cn(
                                    "flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium",
                                    isActive && "bg-primary text-primary-foreground",
                                    isComplete && "bg-primary/15 text-primary",
                                    !isActive && !isComplete && "bg-muted text-muted-foreground",
                                )}
                            >
                                {isComplete ? <Check className="h-3.5 w-3.5" /> : step}
                            </span>
                            <span
                                className={cn(
                                    "text-sm",
                                    isActive ? "font-medium text-foreground" : "text-muted-foreground",
                                )}
                            >
                                {label}
                            </span>
                        </div>
                        {step < STEPS.length && <span className="mx-3 h-px w-8 bg-border" aria-hidden />}
                    </li>
                );
            })}
        </ol>
    );
}
