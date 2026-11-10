"use client";

import { useState, useTransition } from "react";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Address } from "@/lib/api/dtos";
import { AddressInput, createAddress, updateAddress } from "./actions";

function AddressForm({
    initial,
    onSaved,
    onCancel,
}: {
    initial: Address | null;
    onSaved: (addresses: Address[]) => void;
    onCancel: () => void;
}) {
    const [street, setStreet] = useState(() => initial?.street ?? "");
    const [houseNumber, setHouseNumber] = useState(() => (initial ? String(initial.houseNumber) : ""));
    const [addition, setAddition] = useState(() => initial?.addition ?? "");
    const [postalCode, setPostalCode] = useState(() => initial?.postalCode ?? "");
    const [city, setCity] = useState(() => initial?.city ?? "");
    const [pending, startTransition] = useTransition();

    const canSave =
        street.trim().length > 0 &&
        houseNumber.trim().length > 0 &&
        postalCode.trim().length > 0 &&
        city.trim().length > 0;

    function submit() {
        const input: AddressInput = {
            street: street.trim(),
            houseNumber: Number(houseNumber),
            addition: addition.trim() ? addition.trim() : null,
            postalCode: postalCode.trim(),
            city: city.trim(),
        };

        startTransition(async () => {
            const addresses = initial ? await updateAddress(initial.id, input) : await createAddress(input);
            onSaved(addresses);
        });
    }

    return (
        <>
            <DialogHeader>
                <DialogTitle>{initial ? "Adres bewerken" : "Adres toevoegen"}</DialogTitle>
            </DialogHeader>

            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                    <Label htmlFor="address-street">Straat</Label>
                    <Input id="address-street" value={street} onChange={(event) => setStreet(event.target.value)} />
                </div>
                <div className="flex gap-3">
                    <div className="flex flex-1 flex-col gap-1.5">
                        <Label htmlFor="address-number">Huisnummer</Label>
                        <Input
                            id="address-number"
                            inputMode="numeric"
                            value={houseNumber}
                            onChange={(event) => setHouseNumber(event.target.value.replace(/[^0-9]/g, ""))}
                        />
                    </div>
                    <div className="flex flex-1 flex-col gap-1.5">
                        <Label htmlFor="address-addition">Toevoeging</Label>
                        <Input
                            id="address-addition"
                            value={addition}
                            onChange={(event) => setAddition(event.target.value)}
                        />
                    </div>
                </div>
                <div className="flex flex-col gap-1.5">
                    <Label htmlFor="address-postal">Postcode</Label>
                    <Input
                        id="address-postal"
                        value={postalCode}
                        onChange={(event) => setPostalCode(event.target.value)}
                    />
                </div>
                <div className="flex flex-col gap-1.5">
                    <Label htmlFor="address-city">Plaats</Label>
                    <Input id="address-city" value={city} onChange={(event) => setCity(event.target.value)} />
                </div>
            </div>

            <DialogFooter>
                <Button variant="outline" onClick={onCancel}>
                    Annuleren
                </Button>
                <Button onClick={submit} disabled={!canSave || pending}>
                    Opslaan
                </Button>
            </DialogFooter>
        </>
    );
}

export function AddressDialog({
    open,
    onOpenChange,
    initial,
    onSaved,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initial: Address | null;
    onSaved: (addresses: Address[]) => void;
}) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                {open && (
                    <AddressForm
                        initial={initial}
                        onCancel={() => onOpenChange(false)}
                        onSaved={(addresses) => {
                            onSaved(addresses);
                            onOpenChange(false);
                        }}
                    />
                )}
            </DialogContent>
        </Dialog>
    );
}
