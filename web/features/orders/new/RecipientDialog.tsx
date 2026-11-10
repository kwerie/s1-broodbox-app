"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Allergy } from "@/lib/api/dtos";
import { allergyLabel } from "@/features/orders/orderPresentation";
import { RecipientDraft } from "./WizardContext";

function RecipientForm({
    initial,
    allergies,
    onSave,
    onCancel,
}: {
    initial: RecipientDraft | null;
    allergies: Allergy[];
    onSave: (recipient: RecipientDraft) => void;
    onCancel: () => void;
}) {
    const [name, setName] = useState(() => initial?.name ?? "");
    const [lockerNumber, setLockerNumber] = useState(() => initial?.lockerNumber ?? "");
    const [allergyIds, setAllergyIds] = useState<number[]>(() => initial?.allergyIds ?? []);
    const [preferences, setPreferences] = useState<string[]>(() => initial?.preferences ?? []);

    function toggleAllergy(id: number, checked: boolean) {
        setAllergyIds((previous) => (checked ? [...previous, id] : previous.filter((value) => value !== id)));
    }

    function save() {
        onSave({
            tempId: initial?.tempId ?? crypto.randomUUID(),
            name: name.trim(),
            lockerNumber: lockerNumber.trim(),
            allergyIds,
            preferences: preferences.map((preference) => preference.trim()).filter(Boolean),
        });
    }

    const canSave = name.trim().length > 0 && lockerNumber.trim().length > 0;

    return (
        <>
            <DialogHeader>
                <DialogTitle>{initial ? "Ontvanger bewerken" : "Ontvanger toevoegen"}</DialogTitle>
            </DialogHeader>

            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                    <Label htmlFor="recipient-name">Naam</Label>
                    <Input id="recipient-name" value={name} onChange={(event) => setName(event.target.value)} />
                </div>
                <div className="flex flex-col gap-1.5">
                    <Label htmlFor="recipient-locker">Lockernummer</Label>
                    <Input
                        id="recipient-locker"
                        value={lockerNumber}
                        onChange={(event) => setLockerNumber(event.target.value)}
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <Label>Allergieën</Label>
                    <div className="grid grid-cols-2 gap-2">
                        {allergies.map((allergy) => (
                            <label key={allergy.id} className="flex items-center gap-2 text-sm">
                                <Checkbox
                                    checked={allergyIds.includes(allergy.id)}
                                    onCheckedChange={(checked) => toggleAllergy(allergy.id, checked === true)}
                                />
                                {allergyLabel(allergy.type)}
                            </label>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <Label>Voorkeuren</Label>
                    {preferences.map((preference, index) => (
                        <div key={index} className="flex gap-2">
                            <Input
                                value={preference}
                                placeholder="Bijv. geen tomaten"
                                onChange={(event) =>
                                    setPreferences((previous) =>
                                        previous.map((value, current) =>
                                            current === index ? event.target.value : value,
                                        ),
                                    )
                                }
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon-sm"
                                aria-label="Voorkeur verwijderen"
                                onClick={() =>
                                    setPreferences((previous) => previous.filter((_, current) => current !== index))
                                }
                            >
                                <X />
                            </Button>
                        </div>
                    ))}
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="w-fit"
                        onClick={() => setPreferences((previous) => [...previous, ""])}
                    >
                        <Plus /> Voorkeur toevoegen
                    </Button>
                </div>
            </div>

            <DialogFooter>
                <Button variant="outline" onClick={onCancel}>
                    Annuleren
                </Button>
                <Button onClick={save} disabled={!canSave}>
                    Opslaan
                </Button>
            </DialogFooter>
        </>
    );
}

export function RecipientDialog({
    open,
    onOpenChange,
    allergies,
    initial,
    onSave,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    allergies: Allergy[];
    initial: RecipientDraft | null;
    onSave: (recipient: RecipientDraft) => void;
}) {
    function handleSave(recipient: RecipientDraft) {
        onSave(recipient);
        onOpenChange(false);
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                {open && (
                    <RecipientForm
                        initial={initial}
                        allergies={allergies}
                        onSave={handleSave}
                        onCancel={() => onOpenChange(false)}
                    />
                )}
            </DialogContent>
        </Dialog>
    );
}
