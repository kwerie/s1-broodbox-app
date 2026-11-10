"use client";

import Link from "next/link";
import { useTransition } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { currency } from "@/features/orders/orderPresentation";
import { saveDishes } from "../actions";
import { useWizard } from "../WizardContext";
import { QuantityStepper } from "../QuantityStepper";
import { OrderSummary } from "../OrderSummary";
import { AddDishDialog } from "../AddDishDialog";

export function Step1Dishes() {
    const { state, dispatch } = useWizard();
    const [pending, startTransition] = useTransition();

    function setQuantity(dishId: number, quantity: number) {
        dispatch({
            type: "setDishes",
            dishes: state.dishes.map((line) => (line.dishId === dishId ? { ...line, quantity } : line)),
        });
    }

    function removeDish(dishId: number) {
        dispatch({ type: "setDishes", dishes: state.dishes.filter((line) => line.dishId !== dishId) });
    }

    function next() {
        startTransition(async () => {
            await saveDishes(state.draftId, state.dishes);
            dispatch({ type: "setStep", step: 2 });
        });
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <Card className="lg:col-span-2">
                    <CardHeader className="flex flex-row items-start justify-between border-b">
                        <div className="flex flex-col gap-1">
                            <CardTitle>Gerechten</CardTitle>
                            <p className="text-muted-foreground">
                                Kies de gerechten en aantallen voor deze bestelling.
                            </p>
                        </div>
                        <AddDishDialog />
                    </CardHeader>
                    <CardContent className="flex flex-col divide-y">
                        {state.dishes.length === 0 && (
                            <p className="py-4 text-sm text-muted-foreground">Nog geen gerechten toegevoegd.</p>
                        )}
                        {state.dishes.map((line) => {
                            const dish = state.availableDishes.find((available) => available.id === line.dishId);
                            if (!dish) {
                                return null;
                            }
                            return (
                                <div key={line.dishId} className="flex items-center justify-between gap-4 py-3">
                                    <div>
                                        <p className="text-sm font-medium">{dish.name}</p>
                                        <p className="text-[13px] text-muted-foreground">
                                            {currency.format(dish.price)} per stuk
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <QuantityStepper
                                            value={line.quantity}
                                            onChange={(quantity) => setQuantity(line.dishId, quantity)}
                                            onRemove={() => removeDish(line.dishId)}
                                        />
                                        <div className="w-24 text-right">
                                            <p className="text-sm font-medium tabular-nums">
                                                {currency.format(dish.price * line.quantity)}
                                            </p>
                                            <p className="text-[13px] tabular-nums text-muted-foreground">
                                                {line.quantity} × {currency.format(dish.price)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </CardContent>
                </Card>

                <OrderSummary
                    cta={{
                        label: "Volgende stap",
                        onClick: next,
                        disabled: state.dishes.length === 0,
                        pending,
                    }}
                />
            </div>

            <div>
                <Link href="/">
                    <Button variant="outline" size="sm">
                        <ArrowLeft /> Terug
                    </Button>
                </Link>
            </div>
        </div>
    );
}
