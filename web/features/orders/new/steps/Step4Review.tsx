"use client";

import { useState, useTransition } from "react";
import { ArrowLeft, TriangleAlert } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { allergyLabel, currency, getInitials } from "@/features/orders/orderPresentation";
import { confirmOrder } from "../actions";
import { useWizard } from "../WizardContext";
import { AddressLines } from "../AddressLines";
import { OrderSummary } from "../OrderSummary";

function SectionHeader({ title, onEdit }: { title: string; onEdit: () => void }) {
    return (
        <CardHeader className="flex flex-row items-center justify-between border-b">
            <CardTitle>{title}</CardTitle>
            <Button variant="ghost" size="sm" onClick={onEdit}>
                Bewerken
            </Button>
        </CardHeader>
    );
}

export function Step4Review() {
    const { state, dispatch } = useWizard();
    const [pending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);

    const lines = state.dishes
        .map((line) => {
            const dish = state.availableDishes.find((available) => available.id === line.dishId);
            return dish ? { dish, quantity: line.quantity } : null;
        })
        .filter((line): line is { dish: (typeof state.availableDishes)[number]; quantity: number } => line !== null);

    const dishCount = lines.reduce((total, line) => total + line.quantity, 0);
    const total = lines.reduce((sum, line) => sum + line.dish.price * line.quantity, 0);

    const invoice = state.addresses.find((address) => address.id === state.invoiceAddressId) ?? null;
    const shipping = state.addresses.find((address) => address.id === state.shippingAddressId) ?? null;

    function allergyNames(ids: number[]) {
        return ids
            .map((id) => state.allergies.find((allergy) => allergy.id === id))
            .filter((allergy) => allergy !== undefined)
            .map((allergy) => allergyLabel(allergy.type));
    }

    function confirm() {
        setError(null);
        startTransition(async () => {
            try {
                const order = await confirmOrder(state.draftId);
                dispatch({ type: "setConfirmedOrder", order });
                dispatch({ type: "setStep", step: 5 });
            } catch {
                setError("Er ging iets mis bij het bevestigen. Controleer je bestelling en probeer het opnieuw.");
            }
        });
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="flex flex-col gap-6 lg:col-span-2">
                    <Card>
                        <SectionHeader title={`Gerechten (${dishCount})`} onEdit={() => dispatch({ type: "setStep", step: 1 })} />
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="text-gray-600">Gerecht</TableHead>
                                        <TableHead className="text-gray-600">Aantal</TableHead>
                                        <TableHead className="text-gray-600">Prijs</TableHead>
                                        <TableHead className="text-right text-gray-600">Subtotaal</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {lines.map((line) => (
                                        <TableRow key={line.dish.id}>
                                            <TableCell className="font-medium">{line.dish.name}</TableCell>
                                            <TableCell className="text-gray-600">{line.quantity}</TableCell>
                                            <TableCell className="tabular-nums text-gray-600">
                                                {currency.format(line.dish.price)}
                                            </TableCell>
                                            <TableCell className="text-right tabular-nums">
                                                {currency.format(line.dish.price * line.quantity)}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                                <TableFooter>
                                    <TableRow>
                                        <TableCell colSpan={3} className="font-medium">
                                            Totaal
                                        </TableCell>
                                        <TableCell className="text-right font-medium tabular-nums">
                                            {currency.format(total)}
                                        </TableCell>
                                    </TableRow>
                                </TableFooter>
                            </Table>
                        </CardContent>
                    </Card>

                    <Card>
                        <SectionHeader
                            title={`Ontvangers (${state.recipients.length})`}
                            onEdit={() => dispatch({ type: "setStep", step: 2 })}
                        />
                        <CardContent>
                            <ul className="divide-y">
                                {state.recipients.map((recipient) => {
                                    const preferences = recipient.preferences.join(", ");
                                    const allergies = allergyNames(recipient.allergyIds);
                                    const hasDetails = allergies.length > 0 || preferences.length > 0;
                                    return (
                                        <li key={recipient.tempId} className="flex gap-3 py-3.5">
                                            <Avatar>
                                                <AvatarFallback>{getInitials(recipient.name)}</AvatarFallback>
                                            </Avatar>
                                            <div className="flex flex-col gap-1.5">
                                                <p className="text-sm font-medium">{recipient.name}</p>
                                                {allergies.length > 0 && (
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {allergies.map((label) => (
                                                            <Badge
                                                                key={label}
                                                                variant="outline"
                                                                className="gap-1 border-red-200 bg-red-50 text-red-600"
                                                            >
                                                                <TriangleAlert />
                                                                {label}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                )}
                                                {preferences.length > 0 && (
                                                    <p className="text-[13px] text-muted-foreground">{preferences}</p>
                                                )}
                                                {!hasDetails && (
                                                    <p className="text-[13px] text-muted-foreground">
                                                        Geen allergieën of voorkeuren
                                                    </p>
                                                )}
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        </CardContent>
                    </Card>

                    <Card>
                        <SectionHeader title="Adresgegevens" onEdit={() => dispatch({ type: "setStep", step: 3 })} />
                        <CardContent className="grid gap-6 sm:grid-cols-2">
                            <div className="flex flex-col gap-1">
                                <p className="text-sm font-medium">Factuuradres</p>
                                {invoice ? <AddressLines address={invoice} /> : <p className="text-sm text-muted-foreground">—</p>}
                            </div>
                            <div className="flex flex-col gap-1">
                                <p className="text-sm font-medium">Bezorgadres</p>
                                {shipping ? <AddressLines address={shipping} /> : <p className="text-sm text-muted-foreground">—</p>}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="flex flex-col gap-3">
                    <OrderSummary
                        showRecipients
                        cta={{ label: "Bestelling bevestigen", onClick: confirm, pending }}
                    />
                    {error && <p className="text-sm text-destructive">{error}</p>}
                </div>
            </div>

            <div>
                <Button variant="outline" size="sm" onClick={() => dispatch({ type: "setStep", step: 3 })}>
                    <ArrowLeft /> Terug
                </Button>
            </div>
        </div>
    );
}
