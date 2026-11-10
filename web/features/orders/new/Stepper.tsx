import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = ["Gerechten", "Ontvangers", "Adresgegevens", "Controle", "Bevestiging"];

export function Stepper({ current, onStepClick }: { current: number; onStepClick?: (step: number) => void }) {
    return (
        <ol className="flex flex-wrap items-center gap-y-2">
            {STEPS.map((label, index) => {
                const step = index + 1;
                const isComplete = step < current;
                const isActive = step === current;
                const isClickable = isComplete && onStepClick !== undefined;

                const content = (
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
                                isClickable && "transition-colors group-hover/step:text-foreground",
                            )}
                        >
                            {label}
                        </span>
                    </div>
                );

                return (
                    <li key={label} className="flex items-center">
                        {isClickable ? (
                            <button
                                type="button"
                                onClick={() => onStepClick(step)}
                                className="group/step cursor-pointer rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            >
                                {content}
                            </button>
                        ) : (
                            content
                        )}
                        {step < STEPS.length && <span className="mx-3 h-px w-8 bg-border" aria-hidden />}
                    </li>
                );
            })}
        </ol>
    );
}
