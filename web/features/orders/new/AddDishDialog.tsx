"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { currency } from "@/features/orders/orderPresentation";
import { useWizard } from "./WizardContext";

export function AddDishDialog() {
    const { state, dispatch } = useWizard();
    const [open, setOpen] = useState(false);

    const available = state.availableDishes.filter(
        (dish) => !state.dishes.some((line) => line.dishId === dish.id),
    );

    function addDish(dishId: number) {
        dispatch({ type: "setDishes", dishes: [...state.dishes, { dishId, quantity: 1 }] });
        setOpen(false);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger
                render={
                    <Button variant="outline" size="sm">
                        <Plus /> Gerecht toevoegen
                    </Button>
                }
            />
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Gerecht toevoegen</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col divide-y">
                    {available.length === 0 && (
                        <p className="py-3 text-sm text-muted-foreground">
                            Alle gerechten zijn al toegevoegd.
                        </p>
                    )}
                    {available.map((dish) => (
                        <button
                            key={dish.id}
                            type="button"
                            onClick={() => addDish(dish.id)}
                            className="flex items-center justify-between rounded-md px-2 py-3 text-left hover:bg-muted/50"
                        >
                            <span className="text-sm font-medium">{dish.name}</span>
                            <span className="text-sm tabular-nums text-muted-foreground">
                                {currency.format(dish.price)}
                            </span>
                        </button>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    );
}
