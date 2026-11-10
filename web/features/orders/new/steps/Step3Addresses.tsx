"use client";

import { ReactNode, useState, useTransition } from "react";
import { ArrowLeft, FileText, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Address } from "@/lib/api/dtos";
import { cn } from "@/lib/utils";
import { saveAddresses } from "../actions";
import { useWizard } from "../WizardContext";
import { AddressLines } from "../AddressLines";
import { AddressBook } from "../AddressBook";
import { OrderSummary } from "../OrderSummary";

type Slot = "invoice" | "shipping";

function AddressSlotCard({
    title,
    icon,
    address,
    companyName,
    onChange,
}: {
    title: string;
    icon: ReactNode;
    address: Address | null;
    companyName: string;
    onChange: () => void;
}) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between border-b">
                <CardTitle className="flex items-center gap-2">
                    {icon}
                    {title}
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={onChange}>
                    Wijzigen
                </Button>
            </CardHeader>
            <CardContent>
                {address ? (
                    <AddressLines address={address} companyName={companyName} />
                ) : (
                    <p className="text-sm text-muted-foreground">Nog geen adres gekozen.</p>
                )}
            </CardContent>
        </Card>
    );
}

function AddressPickerDialog({
    open,
    onOpenChange,
    title,
    addresses,
    companyName,
    selectedId,
    onSelect,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    addresses: Address[];
    companyName: string;
    selectedId: number | null;
    onSelect: (id: number) => void;
}) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-2">
                    {addresses.length === 0 && (
                        <p className="text-sm text-muted-foreground">
                            Voeg eerst een adres toe in het adresboek.
                        </p>
                    )}
                    {addresses.map((address) => (
                        <button
                            key={address.id}
                            type="button"
                            onClick={() => onSelect(address.id)}
                            className={cn(
                                "rounded-lg border p-3 text-left transition-colors hover:bg-muted/50",
                                address.id === selectedId && "border-primary ring-1 ring-primary",
                            )}
                        >
                            <AddressLines address={address} companyName={companyName} />
                        </button>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    );
}

export function Step3Addresses() {
    const { state, dispatch } = useWizard();
    const [pending, startTransition] = useTransition();
    const [picker, setPicker] = useState<Slot | null>(null);

    const invoice = state.addresses.find((address) => address.id === state.invoiceAddressId) ?? null;
    const shipping = state.addresses.find((address) => address.id === state.shippingAddressId) ?? null;

    function pick(id: number) {
        if (picker === "invoice") {
            dispatch({ type: "setInvoiceAddress", id });
        } else if (picker === "shipping") {
            dispatch({ type: "setShippingAddress", id });
        }
        setPicker(null);
    }

    function next() {
        startTransition(async () => {
            await saveAddresses(state.draftId, {
                invoiceAddressId: state.invoiceAddressId,
                deliveryAddressId: state.shippingAddressId,
            });
            dispatch({ type: "setStep", step: 4 });
        });
    }

    const canContinue = state.invoiceAddressId !== null && state.shippingAddressId !== null;

    return (
        <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="flex flex-col gap-6 lg:col-span-2">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <AddressSlotCard
                            title="Factuuradres"
                            icon={<FileText className="h-4 w-4" />}
                            address={invoice}
                            companyName={state.companyName}
                            onChange={() => setPicker("invoice")}
                        />
                        <AddressSlotCard
                            title="Bezorgadres"
                            icon={<Truck className="h-4 w-4" />}
                            address={shipping}
                            companyName={state.companyName}
                            onChange={() => setPicker("shipping")}
                        />
                    </div>
                    <AddressBook />
                </div>

                <OrderSummary
                    showRecipients
                    cta={{ label: "Volgende stap", onClick: next, disabled: !canContinue, pending }}
                />
            </div>

            <div>
                <Button variant="outline" size="sm" onClick={() => dispatch({ type: "setStep", step: 2 })}>
                    <ArrowLeft /> Terug
                </Button>
            </div>

            <AddressPickerDialog
                open={picker !== null}
                onOpenChange={(open) => !open && setPicker(null)}
                title={picker === "invoice" ? "Kies factuuradres" : "Kies bezorgadres"}
                addresses={state.addresses}
                companyName={state.companyName}
                selectedId={picker === "invoice" ? state.invoiceAddressId : state.shippingAddressId}
                onSelect={pick}
            />
        </div>
    );
}
