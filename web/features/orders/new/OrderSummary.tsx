"use client";

import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { currency } from "@/features/orders/orderPresentation";
import { useWizard } from "./WizardContext";

export type SummaryCta = {
    label: string;
    onClick: () => void;
    disabled?: boolean;
    pending?: boolean;
};

export function OrderSummary({ cta, showRecipients = false }: { cta?: SummaryCta; showRecipients?: boolean }) {
    const { state } = useWizard();

    const dishCount = state.dishes.reduce((total, line) => total + line.quantity, 0);
    const total = state.dishes.reduce((sum, line) => {
        const dish = state.availableDishes.find((available) => available.id === line.dishId);
        return sum + (dish ? dish.price * line.quantity : 0);
    }, 0);

    return (
        <Card className="h-fit">
            <CardHeader>
                <CardTitle>Overzicht</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
                <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Aantal gerechten</span>
                    <span className="tabular-nums">{dishCount}</span>
                </div>
                {showRecipients && (
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Aantal ontvangers</span>
                        <span className="tabular-nums">{state.recipients.length}</span>
                    </div>
                )}
                <div className="flex justify-between border-t pt-3 font-medium">
                    <span>Totaal</span>
                    <span className="tabular-nums">{currency.format(total)}</span>
                </div>
                {cta && (
                    <Button
                        size="lg"
                        className="mt-1 w-full"
                        onClick={cta.onClick}
                        disabled={cta.disabled || cta.pending}
                    >
                        {cta.label}
                        <ArrowRight />
                    </Button>
                )}
            </CardContent>
        </Card>
    );
}
